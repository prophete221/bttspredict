#!/usr/bin/env python3
"""Inventaire FTPS distant en LECTURE SEULE (bttspredict.com — hébergement LWS).

But : remplacer `lftp find .` (qui abandonne tout le walk à la première erreur
de canal de données — « max-retries exceeded ») par un parcours résilient qui :
  - teste PWD, CWD, LIST (-a et sans -a), NLST et MLSD séparément à la racine ;
  - parcourt chaque répertoire avec un timeout par commande, des tentatives
    avec backoff, et une reconnexion du canal de contrôle si nécessaire ;
  - note le chemin précis de chaque répertoire qui bloque au lieu de tout
    abandonner ;
  - écrit un inventaire lisible par machine (chemin, type, taille).

Sécurité :
  - AUCUNE commande d'écriture (STOR/APPE/DELE/RMD/MKD/RNFR/RNTO/SITE/CHMOD).
    Seuls : connect, auth TLS, login, prot_p, PWD, CWD, LIST, NLST, MLSD,
    RETR (limité au manifeste deploy-manifest.json).
  - Les identifiants ne sont jamais affichés.

Sorties (dans --out-dir) :
  remote-inventory.tsv           chemin <TAB> type(F|D|L) <TAB> taille
  remote-inventory-failures.json chemins bloquants avec l'erreur exacte
  remote-inventory-summary.json  capacités serveur, compteurs, durée
  remote-inventory.err           stderr textuel (vide si tout va bien)

Codes de sortie : 0 = inventaire complet ; 2 = partiel (échecs listés) ;
1 = fatal (connexion/login/racine impossibles).
"""

import argparse
import ftplib
import json
import os
import socket
import ssl
import sys
import time
from urllib.parse import urlsplit

FORBIDDEN_COMMANDS = (
    'STOR', 'APPE', 'DELE', 'RMD', 'MKD', 'RNFR', 'RNTO', 'SITE ', 'CHMOD', 'SMNT'
)

# Timeout par commande FTP (canal de contrôle ET canaux de données).
DEFAULT_TIMEOUT = 30
# Tentatives par répertoire (opération principale + repli MLSD<->LIST).
DEFAULT_RETRIES = 2


def log(msg: str) -> None:
    print(msg, flush=True)


def parse_endpoint(raw: str):
    """Accepte 'host', 'host:port', 'ftps://host[:port]' (jamais affiché)."""
    value = (raw or '').strip()
    if '://' in value:
        parsed = urlsplit(value)
        host, port = parsed.hostname, parsed.port
    elif ':' in value:
        host, port_raw = value.rsplit(':', 1)
        host, port = host.strip(), int(port_raw) if port_raw.isdigit() else None
    else:
        host, port = value, None
    if not host:
        raise SystemExit('::error::FTP_SERVER vide ou invalide (non affiché).')
    return host, port or 21


class Inventory:
    def __init__(self, host: str, port: int, user: str, password: str, *,
                 timeout: int, retries: int, delay: float,
                 out_dir: str, dual_first_level: bool):
        os.makedirs(out_dir, exist_ok=True)
        self.host, self.port = host, port
        self.user, self.password = user, password
        self.timeout = timeout
        self.retries = retries
        self.delay = delay
        self.out_dir = out_dir
        self.dual_first_level = dual_first_level

        # Bypass historique du certificat, aligné sur `set ssl:verify no` du
        # workflow lftp (certificat LWS non vérifiable depuis les runners).
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        self.ssl_ctx = ctx

        self.ftp = None
        self.reconnects = 0
        self.failures = []
        self.files = 0
        self.dirs = 0
        self.links = 0
        self.visited_count = 0
        self.bytes_total = 0
        self.capabilities = {}
        self.root_entries = {}

        self.tsv_path = os.path.join(out_dir, 'remote-inventory.tsv')
        self.fail_path = os.path.join(out_dir, 'remote-inventory-failures.json')
        self.sum_path = os.path.join(out_dir, 'remote-inventory-summary.json')
        self.err_path = os.path.join(out_dir, 'remote-inventory.err')
        self.root_raw_sample = None
        self._last_mlsd_raw = []
        self._err = open(self.err_path, 'w', encoding='utf-8')

    # --- infra ------------------------------------------------------------

    def note_err(self, msg: str) -> None:
        self._err.write(msg.rstrip() + '\n')
        self._err.flush()

    def connect(self):
        ftp = ftplib.FTP_TLS(context=self.ssl_ctx, timeout=self.timeout)
        ftp.connect(self.host, self.port)
        ftp.auth()  # AUTH TLS avant USER/PASS (FTPS explicite)
        ftp.login(self.user, self.password)
        ftp.prot_p()  # canal de données chiffré
        try:
            ftp.sock.settimeout(self.timeout)
        except Exception:
            pass
        self.ftp = ftp
        return ftp

    def ensure_control(self):
        if self.ftp is None:
            self.connect()
            self.reconnects += 1

    def drop_control(self):
        try:
            if self.ftp is not None:
                self.ftp.quit()
        except Exception:
            try:
                if self.ftp is not None:
                    self.ftp.close()
            except Exception:
                pass
        self.ftp = None

    def guard(self, cmd: str) -> None:
        upper = cmd.upper()
        for bad in FORBIDDEN_COMMANDS:
            if upper.startswith(bad) or (' ' + bad) in upper:
                raise AssertionError(f'commande interdite demandée: {cmd}')

    def run_cmd(self, cmd: str, cb=None, path=None):
        """Exécute une commande de listing en lecture seule avec timeout.

        Retourne la liste des lignes si cb est None, sinon ce que cb renvoie.
        Le socket de contrôle peut mourir pendant une commande ; l'appelant
        décide de la stratégie de reprise.
        """
        self.guard(cmd)
        self.ensure_control()
        try:
            if cb is None:
                lines = []
                self.ftp.retrlines(cmd, lines.append)
                return lines
            return cb()
        except (OSError, socket.timeout, ftplib.Error, EOFError, ssl.SSLError) as exc:
            raise exc

    # --- parsing ----------------------------------------------------------

    @staticmethod
    def parse_list_line(line: str):
        """Parse une ligne LIST de style Unix. Retourne (type, name, size)."""
        stripped = line.rstrip()
        if not stripped or stripped.lower().startswith('total '):
            return None
        parts = stripped.split(None, 8)
        if len(parts) < 9:
            # Formats exotiques : on garde le nom si plausible, sans taille.
            name = stripped.split()[-1] if stripped.split() else ''
            if not name or name in ('.', '..'):
                return None
            return ('F', name, 0)
        perms, _links, _u, _g, size, _rest, name = (
            parts[0], parts[1], parts[2], parts[3], parts[4], parts[5:8], parts[8],
        )
        if name in ('.', '..'):
            return None
        if ' -> ' in name:
            name = name.split(' -> ', 1)[0]
        if perms.startswith('d'):
            kind = 'D'
        elif perms.startswith('l'):
            kind = 'L'
        else:
            kind = 'F'
        try:
            size_val = int(size)
        except ValueError:
            size_val = 0
        return (kind, name, size_val)

    @staticmethod
    def parse_mlsd_entry(name: str, facts: dict):
        ftype = (facts.get('type') or '').lower()
        if ftype in ('cdir', 'pdir') or name in ('.', '..'):
            return None
        if 'dir' in ftype and 'unix-symlink' not in ftype:
            kind = 'D'
        elif 'symlink' in ftype:
            kind = 'L'
        elif 'file' in ftype:
            kind = 'F'
        else:
            kind = 'F'
        try:
            size_val = int(facts.get('size') or 0)
        except (TypeError, ValueError):
            size_val = 0
        return (kind, name, size_val)

    # --- listings par répertoire ------------------------------------------

    def list_dir(self, rel: str):
        """Liste un répertoire. Essaie l'opération principale puis le repli.

        rel: chemin relatif depuis la racine de connexion ('' = racine).
        Retourne (entries, op_used). Lève la dernière exception si tout échoue.
        """
        target = '.' if not rel else rel
        last_exc = None
        attempts_log = []
        for op in self._ops_for(rel):
            for attempt in range(1, self.retries + 1):
                try:
                    if op == 'MLSD':
                        entries = []
                        self._last_mlsd_raw = []
                        for name, facts in self.ftp.mlsd(target):
                            self._last_mlsd_raw.append((name, facts))
                            parsed = self.parse_mlsd_entry(name, facts)
                            if parsed:
                                entries.append(parsed)
                        if rel == '' and self.root_raw_sample is None:
                            self.root_raw_sample = [
                                {'name': n, 'facts': {k: str(v) for k, v in list(facts.items())[:6]}}
                                for n, facts in list(self._last_mlsd_raw or [])[:5]
                            ]
                        return entries, op
                    elif op == 'LIST-a':
                        lines = self.run_cmd('LIST -a ' + self._arg(target))
                        if rel == '' and self.root_raw_sample is None:
                            self.root_raw_sample = lines[:8]
                        entries = [p for p in (self.parse_list_line(l) for l in lines) if p]
                        return entries, op
                    elif op == 'LIST':
                        lines = self.run_cmd('LIST ' + self._arg(target))
                        if rel == '' and self.root_raw_sample is None:
                            self.root_raw_sample = lines[:8]
                        entries = [p for p in (self.parse_list_line(l) for l in lines) if p]
                        return entries, op
                except Exception as exc:  # noqa: BLE001 — on veut l'erreur exacte
                    last_exc = exc
                    attempts_log.append({'op': op, 'attempt': attempt,
                                         'error': f'{type(exc).__name__}: {exc}'})
                    self.note_err(f'[{rel}] {op} essai {attempt}: {type(exc).__name__}: {exc}')
                    time.sleep(min(2 * attempt, 4))
                    # Contrôle peut être mort après un timeout data : rebranche.
                    try:
                        self.ftp.voidcmd('NOOP')
                    except Exception:
                        self.drop_control()
                        try:
                            self.connect()
                            self.reconnects += 1
                            self.note_err(f'[{rel}] reconnexion contrôle #{self.reconnects}')
                        except Exception as conn_exc:
                            self.note_err(f'[{rel}] reconnexion impossible: {conn_exc}')
                            raise conn_exc
            # fin essais pour cette op → passe au repli suivant
        # L'appelant (walk) enregistre l'échec avec le chemin exact ; on ne
        # stocke ici que la trace des tentatives pour le résumé.
        self._last_attempts = attempts_log
        raise last_exc if last_exc else RuntimeError('listing inconnu')

    @staticmethod
    def _q(target: str) -> str:
        return '"' + target.replace('"', '""') + '"'

    @staticmethod
    def _arg(target: str) -> str:
        """Argument LIST sans quotes sauf si le chemin contient un espace.

        Certains serveurs (observé côté LWS) renvoient une liste vide pour
        LIST -a "." quoté alors que LIST -a . non quoté marche — on aligne
        donc le walk sur la forme qui a fait ses preuves.
        """
        if ' ' in target or '"' in target:
            return '"' + target.replace('"', '""') + '"'
        return target

    def _ops_for(self, rel: str):
        depth = 0 if not rel else rel.count('/')
        ops = []
        if rel == '' or (self.dual_first_level and depth <= 1):
            # Test comparatif demandé : LIST et MLSD tous deux, ordre logique.
            ops = ['LIST-a', 'MLSD'] if self.capabilities.get('list_a_ok') else ['MLSD', 'LIST-a']
        else:
            if self.capabilities.get('mlsd_ok') and not self.capabilities.get('prefer_list'):
                ops = ['MLSD', 'LIST-a']
            else:
                ops = ['LIST-a', 'MLSD']
        if not self.capabilities.get('mlsd_ok'):
            ops = [o for o in ops if o != 'MLSD'] or ['LIST']
        if not self.capabilities.get('list_a_ok'):
            ops = [o for o in ops if o != 'LIST-a'] or ['LIST']
        seen, ordered = set(), []
        for o in ops:
            if o not in seen:
                ordered.append(o)
                seen.add(o)
        return ordered

    # --- écriture inventaire ----------------------------------------------

    def emit(self, rel: str, kind: str, size: int) -> None:
        self.tsv.write(f'{rel}\t{kind}\t{size}\n')
        if kind == 'F':
            self.files += 1
            self.bytes_total += size
        elif kind == 'D':
            self.dirs += 1
        else:
            self.links += 1

    # --- phases -----------------------------------------------------------

    def probe_capabilities(self):
        """Phase A — PWD / CWD / LIST / NLST / MLSD testés séparément à la racine."""
        ftp = self.connect()
        self.reconnects = 0
        try:
            pwd = ftp.pwd()
        except Exception as exc:
            raise SystemExit(f'::error::PWD impossible après login: {type(exc).__name__}: {exc}')
        self.capabilities['pwd'] = pwd
        log(f'PWD(login) = {pwd} — OK')

        try:
            ftp.cwd('/')
            self.capabilities['cwd_root_ok'] = True
            log('CWD / — OK')
        except Exception as exc:
            self.capabilities['cwd_root_ok'] = False
            self.note_err(f'CWD / échec: {type(exc).__name__}: {exc}')
            log(f'CWD / — ÉCHEC ({type(exc).__name__}) — on reste sur {pwd}')

        try:
            ftp.cwd(pwd)
        except Exception as exc:
            raise SystemExit(f'::error::CWD retour répertoire login impossible: {exc}')

        t0 = time.time()
        try:
            lines = self.run_cmd('LIST -a .')
            self.capabilities['list_a_ok'] = True
            self.capabilities['list_a_entries'] = len(lines)
            self.capabilities['list_a_seconds'] = round(time.time() - t0, 2)
            log(f'LIST -a (racine) — OK, {len(lines)} lignes en {self.capabilities["list_a_seconds"]}s')
        except Exception as exc:
            self.capabilities['list_a_ok'] = False
            self.note_err(f'LIST -a racine: {type(exc).__name__}: {exc}')
            log('LIST -a (racine) — ÉCHEC')

        try:
            lines = self.run_cmd('LIST .')
            self.capabilities['list_ok'] = True
            self.capabilities['list_entries'] = len(lines)
            log(f'LIST (racine, sans -a) — OK, {len(lines)} lignes')
        except Exception as exc:
            self.capabilities['list_ok'] = False
            self.note_err(f'LIST racine: {type(exc).__name__}: {exc}')
            log('LIST (racine, sans -a) — ÉCHEC')

        try:
            names = []
            ftp.retrlines('NLST .', names.append)
            self.capabilities['nlst_ok'] = True
            self.capabilities['nlst_entries'] = len(names)
            log(f'NLST (racine) — OK, {len(names)} noms')
        except Exception as exc:
            self.capabilities['nlst_ok'] = False
            self.note_err(f'NLST racine: {type(exc).__name__}: {exc}')
            log('NLST (racine) — ÉCHEC')

        t0 = time.time()
        try:
            count = 0
            for _name, _facts in ftp.mlsd('.'):
                count += 1
            self.capabilities['mlsd_ok'] = True
            self.capabilities['mlsd_entries'] = count
            self.capabilities['mlsd_seconds'] = round(time.time() - t0, 2)
            log(f'MLSD (racine) — OK, {count} entrées en {self.capabilities["mlsd_seconds"]}s')
        except Exception as exc:
            self.capabilities['mlsd_ok'] = False
            self.note_err(f'MLSD racine: {type(exc).__name__}: {exc}')
            log('MLSD (racine) — ÉCHEC')

        # LWS avait échoué en MLSD lors d'une tentative antérieure : si MLSD
        # marche mais que LIST -a aussi, on privilégie LIST (comportement
        # validé côté LWS) et MLSD sert de repli par répertoire.
        if self.capabilities.get('mlsd_ok') and self.capabilities.get('list_a_ok'):
            self.capabilities['prefer_list'] = True

        # Fichiers racine critiques (contrôle de disponibilité avant deploy).
        for name in ('.htaccess', 'robots.txt', 'sitemap.xml', 'deploy-manifest.json'):
            try:
                size = ftp.size(name)
                self.root_entries[name] = {'present': True, 'size': size}
            except Exception:
                self.root_entries[name] = {'present': False}
        log('Racine: ' + ', '.join(
            f"{k}={'présent' if v['present'] else 'ABSENT'}"
            + (f" ({v['size']} o)" if v.get('present') and v.get('size') is not None else '')
            for k, v in self.root_entries.items()))

        # Manifeste v2 : presence + version/fichier (diff contenu requis).
        if self.root_entries.get('deploy-manifest.json', {}).get('present'):
            try:
                import io
                buf = io.BytesIO()
                ftp.retrbinary('RETR deploy-manifest.json', buf.write)
                man = json.loads(buf.getvalue().decode('utf-8'))
                self.capabilities['remoteManifest'] = {
                    'version': man.get('version'),
                    'fileCount': man.get('fileCount'),
                    'totalBytes': man.get('totalBytes'),
                    'topLevelKeys': sorted(list(man.keys()))[:12],
                }
                log(f"deploy-manifest.json distant: version={man.get('version')!r} "
                    f"fileCount={man.get('fileCount')!r} clés={self.capabilities['remoteManifest']['topLevelKeys']}")
            except Exception as exc:
                self.capabilities['remoteManifest'] = {'error': f'{type(exc).__name__}: {exc}'}
                self.note_err(f'lecture deploy-manifest.json: {type(exc).__name__}: {exc}')

    def walk(self):
        """Phase B — BFS résilient depuis la racine de connexion."""
        self.tsv = open(self.tsv_path, 'w', encoding='utf-8')
        queue = ['']
        visited = set()
        started = time.time()
        next_report = 25
        while queue:
            rel = queue.pop(0)
            if rel in visited or len(visited) >= self.max_dirs:
                if len(visited) >= self.max_dirs:
                    self.note_err(f'--max-dirs={self.max_dirs} atteint, arrêt du walk.')
                    break
                continue
            visited.add(rel)
            self.visited_count += 1
            try:
                entries, _op = self.list_dir(rel)
            except Exception as exc:  # répertoire bloquant : on note et on continue
                self.note_err(f'BLOQUANT [{rel or "/"}]: {type(exc).__name__}: {exc}')
                self.failures.append({'path': rel or '/', 'op': 'WALK',
                                      'attempts': getattr(self, '_last_attempts', []),
                                      'error': f'{type(exc).__name__}: {exc}'})
                continue
            for kind, name, size in entries:
                child = f'{rel}/{name}' if rel else name
                self.emit(child, kind, size)
                if kind == 'D':
                    queue.append(child)
            if rel == '':
                counts = {}
                for kind, _n, _s in entries:
                    counts[kind] = counts.get(kind, 0) + 1
                log(f"WALK racine: {len(entries)} entrées analysées {counts}")
            if len(visited) >= next_report:
                elapsed = round(time.time() - started, 1)
                log(f'… {len(visited)} répertoires visités, {self.files} fichiers, {elapsed}s')
                next_report += 25
            if self.delay:
                time.sleep(self.delay)
        self.tsv.flush()
        self.duration = round(time.time() - started, 1)

    def finalize(self, complete: bool) -> int:
        self.tsv.close() if hasattr(self, 'tsv') and not self.tsv.closed else None
        self._err.close()
        # normalise les caractères interdits sur Windows pour le fichier .err
        summary = {
            'complete': complete,
            'capabilities': self.capabilities,
            'rootEntries': self.root_entries,
            'dirsVisited': self.visited_count,
            'filesCount': self.files,
            'symlinks': self.links,
            'bytesTotal': self.bytes_total,
            'reconnects': self.reconnects,
            'durationSeconds': getattr(self, 'duration', None),
            'failureCount': len(self.failures),
            'failures': self.failures,
            'rootRawSample': getattr(self, 'root_raw_sample', None),
        }
        with open(self.sum_path, 'w', encoding='utf-8') as fh:
            json.dump(summary, fh, ensure_ascii=False, indent=2)
        with open(self.fail_path, 'w', encoding='utf-8') as fh:
            json.dump(self.failures, fh, ensure_ascii=False, indent=2)
        code = 0 if complete else (2 if self.files or self.dirs else 1)
        if not complete:
            print(f'::error::Inventaire PARTIEL: {len(self.failures)} répertoires bloquants — '
                  + '; '.join(f['path'] for f in self.failures[:10]), flush=True)
        log(f'INVENTAIRE {"COMPLET" if complete else "PARTIEL"}: '
            f'{self.files} fichiers, {self.dirs} répertoires, '
            f'{self.bytes_total} octets, {self.reconnects} reconnexions, '
            f'{getattr(self, "duration", "?")}s, {len(self.failures)} échecs.')
        return code

    def run(self) -> int:
        os.makedirs(self.out_dir, exist_ok=True)
        try:
            self.probe_capabilities()
        except SystemExit as exc:
            self.note_err(str(exc))
            self._err.close()
            print(exc, flush=True)
            return 1
        self.walk()
        complete = not self.failures
        return self.finalize(complete)


def main() -> int:
    parser = argparse.ArgumentParser(description='Inventaire FTPS lecture seule')
    parser.add_argument('--out-dir', default='out')
    parser.add_argument('--timeout', type=int, default=DEFAULT_TIMEOUT)
    parser.add_argument('--retries', type=int, default=DEFAULT_RETRIES)
    parser.add_argument('--delay', type=float, default=0.05)
    parser.add_argument('--max-dirs', type=int, default=20000)
    parser.add_argument('--mode', choices=['diagnostic', 'deploy'], default='deploy')
    args = parser.parse_args()

    server = os.environ.get('FTP_SERVER', '')
    user = os.environ.get('FTP_USERNAME', '')
    password = os.environ.get('FTP_PASSWORD', '')
    if not server or not user or not password:
        print('::error::Secrets FTP manquants (FTP_SERVER/FTP_USERNAME/FTP_PASSWORD) — rien à faire.', flush=True)
        return 1
    host, port = parse_endpoint(server)

    inv = Inventory(
        host, port, user, password,
        timeout=args.timeout,
        retries=args.retries,
        delay=args.delay,
        out_dir=args.out_dir,
        # diagnostic : LIST et MLSD comparés sur la racine et le 1er niveau
        dual_first_level=(args.mode == 'diagnostic'),
    )
    # attribut utilisé par walk()
    inv.max_dirs = args.max_dirs
    inv.tsv = None  # créé par walk()
    code = inv.run()
    # En mode deploy : un inventaire partiel doit bloquer (code 2 => étape SSH en échec).
    if args.mode == 'deploy' and code == 1:
        return 1
    return code


if __name__ == '__main__':
    sys.exit(main())
