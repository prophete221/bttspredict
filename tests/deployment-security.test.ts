import fs from 'node:fs'
import { describe, expect, it } from 'vitest'

const workflow = fs.readFileSync('.github/workflows/deploy.yml', 'utf8')
const deploy = workflow.split('\n  deploy:')[1] ?? ''
const preflight = fs.readFileSync('scripts/ftp-safe-preflight.lftp', 'utf8')
const planner = fs.readFileSync('scripts/prepare-stale-match-deletions.mjs', 'utf8')
const sitemapFilter = fs.readFileSync('scripts/filter-sitemap-match-urls.mjs', 'utf8')
const statePlanner = fs.readFileSync('scripts/prepare-ftp-deploy-plan.mjs', 'utf8')
const ftpDiff = fs.readFileSync('scripts/ftp-diff.mjs', 'utf8')

describe('deployment safety gates', () => {
  it('runs hard-failing tests, Python, lint, typecheck and build before any FTP operation', () => {
    const firstTransfer = deploy.indexOf('lftp -u')
    const action = deploy.indexOf('uses: SamKirkland/FTP-Deploy-Action@v4.3.5')
    const cooldown = deploy.indexOf('sleep 300')
    expect(firstTransfer).toBeGreaterThan(0)
    expect(cooldown).toBeGreaterThan(firstTransfer)
    expect(cooldown).toBeLessThan(action)
    expect(action).toBeGreaterThan(firstTransfer)
    expect(deploy).toContain('Refroidissement 300 s pour la protection anti-flood LWS')
    for (const command of ['run: npm test', 'python3 -m unittest discover', 'run: npm run lint', 'run: npx tsc --noEmit', 'run: npm run build']) {
      expect(deploy.indexOf(command)).toBeGreaterThan(0)
      expect(deploy.indexOf(command)).toBeLessThan(firstTransfer)
      const step = deploy.split(/(?=^      - name: )/m).find((part) => part.includes(command))
      expect(step).not.toContain('continue-on-error: true')
    }
    expect(deploy).toContain("github.ref == 'refs/heads/main'")
    expect(deploy).toContain("github.event_name != 'pull_request'")
    expect(workflow).toContain("paths-ignore:\n      - 'public/**'")
    expect(workflow).toContain('cancel-in-progress: false')
  })

  it('uses LFTP script options before the FTPS host for preflight and restore', () => {
    expect(deploy).toContain('lftp -u "$FTP_USERNAME,$FTP_PASSWORD" -e "source scripts/ftp-safe-preflight.lftp" "ftps://${FTP_SERVER}"')
    expect(deploy).toContain('lftp -u "$FTP_USERNAME,$FTP_PASSWORD" -e "set ftp:ssl-force true; set ftp:ssl-protect-data true; set ssl:verify no; set net:timeout 60; set net:max-retries 2; set cmd:fail-exit yes; put out/predeploy-backups/robots.txt -o robots.txt; put out/predeploy-backups/sitemap.xml -o sitemap.xml; bye" "ftps://${FTP_SERVER}"')
    expect(deploy).not.toContain('"ftps://${FTP_SERVER}" -f scripts/ftp-safe-preflight.lftp')
    expect(deploy).not.toContain('"ftps://${FTP_SERVER}" -e')
  })

  it('uses encrypted FTPS with the explicit safe state and disables clean-slate behavior', () => {
    expect(deploy).toContain('uses: SamKirkland/FTP-Deploy-Action@v4.3.5')
    expect(deploy).toContain('protocol: ftps')
    expect(deploy).toContain('security: loose')
    expect(deploy).toContain('state-name: .ftp-deploy-sync-state-safe.json')
    expect(deploy).toContain('dangerous-clean-slate: false')
    expect(deploy).toContain('local-dir: out/')
    expect(deploy).toContain('server-dir: ./')
    expect(deploy).not.toContain('dangerous-clean-slate: true')
    expect(deploy).not.toContain('remove-existing-files')
    expect(deploy).not.toContain('mirror --delete')
    expect(deploy).not.toContain('mirror --reverse')
    expect(deploy).not.toContain('rm -rf')
    expect(deploy).not.toContain('rm -r ')
  })

  it('limits remote listing and deletes to verified EN/AR Match pages, never root /match or unrelated files', () => {
    expect(deploy).toContain('scripts/ftp-safe-preflight.lftp')
    const liveFindCommands = preflight.split('\n').map(line => line.trim()).filter(line => line.startsWith('find '))
    expect(liveFindCommands).toEqual([
      'find en/match > /tmp/ftp-en-match-list.txt',
      'find ar/match > /tmp/ftp-ar-match-list.txt',
    ])
    expect(preflight).toContain('source out/stale-match-delete.lftp')
    expect(planner).toContain("matchPath.locale === 'fr'")
    expect(planner).toContain("category: 'match-root-out-of-scope'")
    expect(planner).toContain("if (status === 'finished')")
    expect(planner).toContain('assertNoFinishedMatchFiles(currentFiles, known, now)')
    expect(planner).toContain('page Match terminée')
    expect(planner).toContain("category: 'non-match-unverified'")
    expect(planner).not.toContain('ftp.delete(')
    expect(sitemapFilter).toContain('/^(?:en|ar)\\/match\\/')
    expect(sitemapFilter).not.toContain('(?:(?:en|ar)\\/)?match')
    expect(preflight).not.toContain('get .htaccess')
    expect(preflight).toContain('get robots.txt -o out/predeploy-backups/robots.txt')
    expect(preflight).toContain('get sitemap.xml -o out/predeploy-backups/sitemap.xml')
  })

  it('seeds FTP-Deploy only with paths present in the export and forces sitemap/robots uploads', () => {
    expect(deploy).toContain('node scripts/ftp-diff.mjs manifest')
    expect(deploy).toContain('ftp-action-state-report.json')
    expect(statePlanner).toContain('buildSafeStateSeed')
    expect(statePlanner).toContain("new Set(['robots.txt', 'sitemap.xml'])")
    expect(statePlanner).toContain('droppedRemoteOnlyRecordCount')
    expect(statePlanner).toContain('aucun fichier distant absent du build ne peut être supprimé')
    expect(statePlanner).toContain("entry.type === 'file' && forced.has(name)")
    expect(ftpDiff).toContain("'ftp-action-state-report.json'")
    expect(deploy).toContain('deploy-manifest.json')
    expect(deploy).toContain('deploy-diff-stats.json')
  })

  it('filters sitemap entries only for exact EN/AR deletions and preserves root files around the upload', () => {
    expect(preflight).toContain('node scripts/prepare-ftp-deploy-plan.mjs')
    expect(statePlanner).toContain('scripts/prepare-stale-match-deletions.mjs')
    expect(statePlanner).toContain('scripts/filter-sitemap-match-urls.mjs')
    expect(statePlanner).toContain("/^(?:en|ar)\\/match\\//.test(item.path)")
    expect(statePlanner).toContain('`--previous=${previousSitemapPath}`')
    expect(statePlanner).toContain('`--output=${path.join(outDir, \'sitemap.xml\')}`')
    expect(statePlanner).toContain('`--report=${path.join(outDir, \'sitemap-match-filter.json\')}`')
    expect(deploy).toContain('Restore protected root files if FTP-Deploy did not complete')
    expect(deploy).toContain('steps.ftp-upload.outcome != \'success\'')
    expect(deploy).toContain('put out/predeploy-backups/robots.txt -o robots.txt')
    expect(deploy).toContain('put out/predeploy-backups/sitemap.xml -o sitemap.xml')
    expect(deploy).toContain('Deploy .htaccess with historical temporary rename')
    expect(deploy).toContain('TEMP=".htaccess.deploy-${GITHUB_RUN_ID}"')
    expect(deploy).toContain('BACKUP=".htaccess.rollback-${GITHUB_RUN_ID}"')
    expect(deploy).toContain('put out/.htaccess -o ./$TEMP')
    expect(deploy).toContain('mv ./.htaccess ./$BACKUP; mv ./$TEMP ./.htaccess')
    expect(deploy).toContain('mv ./$BACKUP ./.htaccess; rm -f ./$TEMP')
    expect(deploy).toContain('**/.htaccess')
    expect(deploy).toContain('out/stale-match-pages.json')
    expect(deploy).toContain('out/orphan-review.json')
    expect(deploy).toContain('out/sitemap-match-filter.json')
  })

  it('keeps the html lang fix after build and before the local manifest', () => {
    expect(deploy).toContain('node scripts/fix-html-lang.mjs out')
    const build = deploy.indexOf('run: npm run build')
    const copy = deploy.indexOf('Copy routing files')
    const langFix = deploy.indexOf('node scripts/fix-html-lang.mjs out')
    const manifest = deploy.indexOf('node scripts/ftp-diff.mjs manifest')
    expect(build).toBeGreaterThan(0)
    expect(langFix).toBeGreaterThan(copy)
    expect(langFix).toBeLessThan(manifest)
  })

  it('keeps the FTP diagnostic workflow read-only and the inventory utility write-free', () => {
    const diagnostic = fs.readFileSync('.github/workflows/ftp-diagnostic.yml', 'utf8')
    expect(diagnostic).toContain('contents: read')
    expect(diagnostic).not.toMatch(/lftp|mirror --|git push|secrets\.GEMINI/)
    expect(diagnostic).toContain('python3 scripts/ftp-inventory.py')
    expect(diagnostic).toContain('if: always()')

    const source = fs.readFileSync('scripts/ftp-inventory.py', 'utf8')
    for (const forbidden of ['storbinary(', 'storlines(', '.mkd(', '.delete(', '.rmd(', '.rename(', '.sendcmd(', '.voidcmd("']) {
      expect(source).not.toContain(forbidden)
    }
    expect(source).toContain('FORBIDDEN_COMMANDS')
    expect(source).toContain('READABLE_ROOT_FILES')
    expect(source).toContain('ROOT_BACKUP_FILES')
    expect(source).toContain('prot_p')
    expect(source).toContain('ftp.auth()')
  })
})
