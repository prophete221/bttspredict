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

  it('requires encrypted FTPS with the legacy certificate bypass, live inventory, schema-validated diff, and forbids purge/full-mirror/htaccess-rm', () => {
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
    expect(deploy).toContain('ftp-diff.mjs prepare --require-prev --force-path=.htaccess --force-path=robots.txt --force-path=sitemap.xml')
    expect(deploy).toContain('ftps://')
    for (const file of ['.htaccess', 'robots.txt', 'sitemap.xml']) {
      expect(deploy).toContain(`--force-path=${file}`)
    }
    expect(deploy).toContain('get ./$FILE -o out/predeploy-backups/$FILE')
    expect(deploy).toContain('put out/predeploy-backups/$FILE -o ./$FILE')
    expect(deploy.match(/put out\/predeploy-backups\/\$FILE -o \.\/\$FILE/g)?.length ?? 0).toBeGreaterThanOrEqual(2)
    expect(deploy).toContain('FTP_FILE_QUOTA')
    expect(deploy).toContain('remote-inventory')
    expect(deploy).toContain('find .')
    expect(deploy).toContain('set ftp:use-mlsd false; set ftp:list-options -a')
    expect(deploy).toContain('[ -s out/remote-inventory.err ]')
    expect(deploy).toContain('DUPLICATE_PATHS')
    expect(deploy).toContain('deploy-diff-stats.json')
    expect(deploy).toContain('NEW_PATHS')
    expect(deploy).toContain('BYTES_TO_ADD')
    expect(deploy).toContain('report_quota_candidates')
    const inventoryFailure = deploy.indexOf('Inventaire LIST récursif absent')
    const manifestRead = deploy.indexOf('get ./deploy-manifest.json')
    const rootBackup = deploy.indexOf('get ./$FILE -o out/predeploy-backups/$FILE')
    const mirror = deploy.indexOf('mirror --reverse')
    expect(inventoryFailure).toBeGreaterThan(0)
    expect(inventoryFailure).toBeLessThan(manifestRead)
    expect(manifestRead).toBeLessThan(rootBackup)
    expect(rootBackup).toBeLessThan(mirror)
    expect(workflow).toContain("paths-ignore:\n      - 'public/**'")
  })

  it('keeps the diagnostic workflow read-only without deployment credentials', () => {
    const diagnostic = fs.readFileSync('.github/workflows/ftp-tls-diagnostic.yml', 'utf8')
    expect(diagnostic).toContain('contents: read')
    expect(diagnostic).toContain('secrets.FTP_SERVER')
    expect(diagnostic).not.toMatch(/secrets\.FTP_(?:USERNAME|PASSWORD)/)
    expect(diagnostic).not.toMatch(/lftp|mirror --|git push|secrets\.GEMINI/)
  })
})
