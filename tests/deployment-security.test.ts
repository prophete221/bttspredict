import fs from 'node:fs'
import { describe, expect, it } from 'vitest'

const workflow = fs.readFileSync('.github/workflows/deploy.yml', 'utf8')
const deploy = workflow.split('\n  deploy:')[1] ?? ''

describe('deployment safety gates', () => {
  it('runs hard-failing tests, Python, lint, typecheck and build before any FTP operation', () => {
    const firstTransfer = deploy.indexOf('lftp -u')
    expect(firstTransfer).toBeGreaterThan(0)
    for (const command of ['run: npm test', 'python3 -m unittest discover', 'run: npm run lint', 'run: npx tsc --noEmit', 'run: npm run build']) {
      expect(deploy.indexOf(command)).toBeGreaterThan(0)
      expect(deploy.indexOf(command)).toBeLessThan(firstTransfer)
      const step = deploy.split(/(?=^      - name: )/m).find((part) => part.includes(command))
      expect(step).not.toContain('continue-on-error: true')
    }
    expect(deploy).toContain("github.ref == 'refs/heads/main'")
    expect(deploy).toContain("github.event_name != 'pull_request'")
  })

  it('requires encrypted FTPS with the legacy certificate bypass, resilient live inventory, schema-validated diff, and forbids purge/full-mirror/htaccess-rm', () => {
    expect(deploy).not.toContain('mirror --delete')
    expect(deploy).not.toContain('--exclude')
    expect(deploy).not.toContain('repli sur miroir complet')
    expect(deploy).not.toContain('Deploy .htaccess')
    expect(deploy).not.toContain('rm -f ./.htaccess')
    expect(deploy).toContain('ssl:verify no')
    expect(deploy).not.toContain('ssl:verify-certificate true')
    expect(deploy).toContain('ftp:ssl-force true')
    expect(deploy).toContain('ftp:ssl-protect-data true')
    expect(deploy).not.toContain('check-ftp-tls.py --require-verified')
    expect(deploy).toContain('ftp-diff.mjs prepare --require-prev --allow-legacy-v1 --live-inventory=out/remote-inventory.tsv --force-path=.htaccess --force-path=robots.txt --force-path=sitemap.xml')
    expect(deploy).toContain('ftps://')
    for (const file of ['.htaccess', 'robots.txt', 'sitemap.xml']) {
      expect(deploy).toContain(`--force-path=${file}`)
    }
    // sauvegardes racine en UNE seule session lftp (anti-flood), restauration idem
    expect(deploy).toContain('get ./.htaccess -o out/predeploy-backups/.htaccess; get ./robots.txt -o out/predeploy-backups/robots.txt; get ./sitemap.xml -o out/predeploy-backups/sitemap.xml')
    expect(deploy).toContain('put out/predeploy-backups/.htaccess -o ./.htaccess; put out/predeploy-backups/robots.txt -o ./robots.txt; put out/predeploy-backups/sitemap.xml -o ./sitemap.xml')
    expect(deploy.match(/put out\/predeploy-backups\/\.htaccess -o \.\/\.htaccess/g)?.length ?? 0).toBeGreaterThanOrEqual(2)
    expect(deploy).toContain('FTP_FILE_QUOTA')
    expect(deploy).toContain('deploy-diff-stats.json')
    expect(deploy).toContain('NEW_PATHS')
    expect(deploy).toContain('BYTES_TO_ADD')
    expect(deploy).toContain('report_quota_candidates')
    const inventoryFailure = deploy.indexOf('Inventaire distant non fiable')
    const manifestRead = deploy.indexOf('get ./deploy-manifest.json')
    const rootBackup = deploy.indexOf('get ./.htaccess -o out/predeploy-backups/.htaccess')
    const mirror = deploy.indexOf('mirror --reverse')
    expect(inventoryFailure).toBeGreaterThan(0)
    expect(inventoryFailure).toBeLessThan(manifestRead)
    expect(manifestRead).toBeLessThan(rootBackup)
    expect(rootBackup).toBeLessThan(mirror)
    expect(workflow).toContain("paths-ignore:\n      - 'public/**'")
  })

  it('uses the resilient read-only Python inventory (replaces lftp find) and blocks transfer on partial inventory', () => {
    expect(deploy).toContain('python3 scripts/ftp-inventory.py --mode=deploy')
    expect(deploy).toContain('--live-inventory=out/remote-inventory.tsv')
    expect(deploy).toContain('missingOnRemote')
    // anti-flood LWS inter-sessions: manifeste téléchargé pendant l'inventaire
    expect(deploy).toContain('--save-manifest=out/deploy-manifest.prev.json')
    expect(deploy).toContain('cooldown 300')
    expect(deploy).toContain('ftp_run_retry')
    // lftp find . n'est plus utilisé pour l'inventaire (max-retries exceeded côté LWS)
    expect(deploy).not.toContain('find .')
    // un inventaire partiel (code 2) ou fatal (code 1) bloque avant tout transfert
    expect(deploy).toContain('if [ "$INV_RC" -ne 0 ]')
    // quotas mesurés sur l'inventaire live, pas sur un manifeste historique
    expect(deploy).toContain('remote-inventory-summary.json')
    expect(deploy).toContain('REMOTE_NOW')
    expect(deploy).toContain('REMOTE_BYTES')
    expect(deploy).toContain('PROJECTED_BYTES')
    expect(deploy).toContain('DUPLICATE_PATHS')
    // ordre strict : inventaire -> refroidissement 300s -> manifeste -> sauvegarde racine -> transfert
    const inventory = deploy.indexOf('python3 scripts/ftp-inventory.py')
    const cooldown = deploy.indexOf('cooldown 300')
    const diffPrepare = deploy.indexOf('ftp-diff.mjs prepare')
    const backup = deploy.indexOf('get ./.htaccess -o out/predeploy-backups/.htaccess')
    const mirror = deploy.indexOf('mirror --reverse')
    expect(inventory).toBeGreaterThan(0)
    expect(cooldown).toBeGreaterThan(inventory)
    expect(diffPrepare).toBeGreaterThan(cooldown)
    expect(diffPrepare).toBeLessThan(backup)
    expect(backup).toBeLessThan(mirror)
    // le transfert d'un premier déploiement post-refonte ne doit pas être tué
    expect(deploy).toMatch(/timeout-minutes: 300/)
    expect(workflow).toContain('cancel-in-progress: false')
  })

  it('keeps the html lang fix between build and manifest (SEO-safe post-export)', () => {
    expect(deploy).toContain('node scripts/fix-html-lang.mjs out')
    const build = deploy.indexOf('run: npm run build')
    const copy = deploy.indexOf('Copy routing files')
    const langFix = deploy.indexOf('node scripts/fix-html-lang.mjs out')
    const prepare = deploy.indexOf('ftp-diff.mjs prepare')
    expect(build).toBeGreaterThan(0)
    expect(langFix).toBeGreaterThan(copy)
    expect(langFix).toBeLessThan(prepare)
  })

  it('keeps the ftp-diagnostic workflow read-only (no lftp, no git push, upload-only artifacts)', () => {
    const diagnostic = fs.readFileSync('.github/workflows/ftp-diagnostic.yml', 'utf8')
    expect(diagnostic).toContain('contents: read')
    expect(diagnostic).not.toMatch(/lftp|mirror --|git push|secrets\.GEMINI/)
    expect(diagnostic).toContain('python3 scripts/ftp-inventory.py')
    expect(diagnostic).toContain('if: always()')
  })

  it('keeps the inventory tool strictly read-only (no FTP write commands in code)', () => {
    const source = fs.readFileSync('scripts/ftp-inventory.py', 'utf8')
    // aucune méthode d'écriture ftplib utilisée (les noms apparaissent
    // uniquement dans la liste de refus FORBIDDEN_COMMANDS)
    for (const forbidden of ['storbinary(', 'storlines(', '.mkd(', '.delete(', '.rmd(', '.rename(', '.sendcmd(', '.voidcmd("']) {
      expect(source).not.toContain(forbidden)
    }
    expect(source).toContain('FORBIDDEN_COMMANDS')
    expect(source).toContain('prot_p')
    // le script utilise TLS explicite (AUTH TLS avant USER/PASS)
    expect(source).toContain('ftp.auth()')
  })
})
