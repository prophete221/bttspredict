import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const storePath = path.resolve(process.argv[2] || path.join(__dirname, '..', '.private', 'vip-candidates.json'))
const audience = 'https://bttspredict.com/vip-candidates'

function skip(reason) {
  console.log(`[vip-sync] skipped: ${reason}`)
  process.exit(0)
}

function validIso(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
}

function safeApiOrigin(value) {
  let url
  try { url = new URL(value) } catch { throw new Error('invalid_endpoint') }
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('invalid_endpoint')
  }
  return url.origin
}

async function main() {
  const configuredEndpoint = process.env.VIP_CANDIDATE_API_URL
  if (!configuredEndpoint) skip('VIP_CANDIDATE_API_URL is not configured')
  const apiOrigin = safeApiOrigin(configuredEndpoint)
  if (!fs.existsSync(storePath)) throw new Error('private_candidate_store_missing')

  let store
  try { store = JSON.parse(fs.readFileSync(storePath, 'utf8')) } catch { throw new Error('private_candidate_store_invalid') }
  const audit = store?.lastAudit
  if (audit?.payloadFresh !== true || audit?.evaluationComplete !== true) skip('source is stale or analysis coverage is incomplete')
  if (!validIso(store.updatedAt) || !validIso(audit.analyzedAt) || !validIso(audit.sourceUpdatedAt)) {
    skip('freshness timestamps are unavailable')
  }

  const candidates = Array.isArray(store.candidates)
    ? store.candidates.filter(candidate => candidate
      && candidate.analyzedAt === audit.analyzedAt
      && ['pending_owner_approval', 'approved', 'rejected'].includes(candidate.status))
    : []
  const payload = {
    version: 1,
    generatedAt: store.updatedAt,
    sourceUpdatedAt: audit.sourceUpdatedAt,
    lastAudit: audit,
    candidates,
  }

  const oidcUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL
  const oidcRequestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
  if (!oidcUrl || !oidcRequestToken) throw new Error('github_oidc_unavailable')
  const tokenUrl = new URL(oidcUrl)
  tokenUrl.searchParams.set('audience', audience)
  const tokenResponse = await fetch(tokenUrl, {
    method: 'GET',
    headers: { Authorization: `Bearer ${oidcRequestToken}`, Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!tokenResponse.ok) throw new Error(`github_oidc_failed_${tokenResponse.status}`)
  let tokenBody
  try { tokenBody = await tokenResponse.json() } catch { throw new Error('github_oidc_invalid_response') }
  if (typeof tokenBody?.value !== 'string' || tokenBody.value.length < 40) throw new Error('github_oidc_invalid_response')

  const response = await fetch(`${apiOrigin}/internal/vip-candidates/sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenBody.value}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })
  let result
  try { result = await response.json() } catch { throw new Error(`vip_api_invalid_response_${response.status}`) }
  if (!response.ok || result?.ok !== true) {
    const safeCodes = new Set([
      'unauthorized', 'invalid_machine_token', 'machine_identity_not_allowed',
      'oidc_verification_unavailable', 'invalid_sync_payload', 'invalid_sync_timestamps',
      'candidate_failed_validation', 'candidate_key_mismatch', 'duplicate_candidate_key',
      'payload_too_large', 'storage_unavailable',
    ])
    const suffix = safeCodes.has(result?.error) ? `_${result.error}` : ''
    throw new Error(`vip_api_sync_failed_${response.status}${suffix}`)
  }

  if (result.synced !== true) {
    console.log(`[vip-sync] no database changes: ${String(result.reason || 'not_synced')}`)
    return
  }
  console.log(`[vip-sync] complete; accepted=${Number(result.acceptedCount || 0)}; duplicate=${result.duplicate === true}`)
}

main().catch(error => {
  const message = error instanceof Error ? error.message : 'unknown_error'
  console.error(`[vip-sync] failed: ${message}`)
  process.exitCode = 1
})
