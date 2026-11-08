// @vitest-environment node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { describe, expect, it } from 'vitest'

const migrationDir = resolve('workers/vip-api/migrations')
const timestamp = '2026-11-08T14:00:00.000Z'
const policy = 'verified-auto-v1'

describe('VIP publication batch migration', () => {
  it('preserves legacy rows and foreign keys while allowing batches up to five', () => {
    const db = new DatabaseSync(':memory:')
    try {
      db.exec('PRAGMA foreign_keys = ON')
      db.exec(readFileSync(resolve(migrationDir, '0005_vip_candidates.sql'), 'utf8'))
      db.exec(readFileSync(resolve(migrationDir, '0006_vip_publications.sql'), 'utf8'))
      expect(db.prepare('PRAGMA foreign_keys').get()).toMatchObject({ foreign_keys: 1 })

      const addCandidate = (
        key: string,
        status: 'published' | 'ineligible' | 'approved',
        messageId: string | null = null,
      ) => db.prepare(`
        INSERT INTO vip_candidates (
          candidate_key, material_hash, candidate_json, match_id, kickoff_at,
          analyzed_at, match_state, status, first_seen_at, last_seen_at,
          last_seen_sync_id, approved_at, ineligible_at, ineligible_reason,
          published_at, publication_window, telegram_message_id
        ) VALUES (?, ?, ?, ?, ?, ?, 'SCHEDULED', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        key.repeat(64),
        key.repeat(64),
        JSON.stringify({ key }),
        `match-${key}`,
        timestamp,
        timestamp,
        status,
        timestamp,
        timestamp,
        `sync-${key}`,
        status === 'approved' || status === 'published' ? timestamp : null,
        status === 'ineligible' ? timestamp : null,
        status === 'ineligible' ? 'legacy reason' : null,
        status === 'published' ? timestamp : null,
        status === 'published' ? 'legacy-window' : null,
        messageId,
      )

      addCandidate('a', 'published', 'legacy-message')
      addCandidate('b', 'ineligible')
      addCandidate('c', 'approved')
      addCandidate('d', 'approved')
      addCandidate('e', 'approved')

      const addRun = (window: string, state: string, claimed: number, sent: number) =>
        db.prepare(`
          INSERT INTO vip_publication_runs
            (window_key, policy_version, scheduled_at, started_at, state, claimed_count, sent_count)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(window, policy, timestamp, timestamp, state, claimed, sent)
      addRun('legacy-window', 'sent', 1, 1)
      addRun('unknown-window', 'unknown', 1, 0)

      const addPublication = (
        candidate: string,
        window: string,
        token: string,
        state: 'sent' | 'unknown',
        messageId: string | null,
      ) => db.prepare(`
        INSERT INTO vip_publications (
          candidate_key, window_key, claim_token, policy_version, material_hash,
          source_sync_id, snapshot_json, message_text, state, claimed_at,
          resolved_at, telegram_message_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        candidate.repeat(64), window, token, policy, candidate.repeat(64),
        `sync-${candidate}`, JSON.stringify({ candidate }), `legacy ${state}`,
        state, timestamp, timestamp, messageId,
      )
      addPublication('a', 'legacy-window', 'legacy-sent', 'sent', 'legacy-message')
      addPublication('c', 'unknown-window', 'legacy-unknown', 'unknown', null)

      const legacyRows = {
        candidates: db.prepare('SELECT * FROM vip_candidates ORDER BY candidate_key').all(),
        runs: db.prepare('SELECT * FROM vip_publication_runs ORDER BY window_key').all(),
        publications: db.prepare('SELECT * FROM vip_publications ORDER BY candidate_key').all(),
      }

      db.exec('BEGIN')
      try {
        db.exec(readFileSync(resolve(migrationDir, '0007_vip_publication_batches.sql'), 'utf8'))
        db.exec('COMMIT')
      } catch (error) {
        db.exec('ROLLBACK')
        throw error
      }

      expect(db.prepare('PRAGMA foreign_keys').get()).toMatchObject({ foreign_keys: 1 })
      expect(db.prepare('PRAGMA foreign_key_check').all()).toEqual([])
      expect(db.prepare('SELECT * FROM vip_candidates ORDER BY candidate_key').all()).toEqual(legacyRows.candidates)
      expect(db.prepare('SELECT * FROM vip_publication_runs ORDER BY window_key').all()).toEqual(legacyRows.runs)
      expect(db.prepare('SELECT * FROM vip_publications ORDER BY candidate_key').all()).toEqual(legacyRows.publications)
      expect(db.prepare('SELECT status, ineligible_at, ineligible_reason FROM vip_candidates WHERE candidate_key = ?')
        .get('b'.repeat(64))).toMatchObject({
        status: 'ineligible', ineligible_at: timestamp, ineligible_reason: 'legacy reason',
      })
      expect(db.prepare('SELECT status, published_at, publication_window, telegram_message_id FROM vip_candidates WHERE candidate_key = ?')
        .get('a'.repeat(64))).toMatchObject({
        status: 'published', published_at: timestamp, publication_window: 'legacy-window',
        telegram_message_id: 'legacy-message',
      })
      expect(db.prepare('SELECT state, telegram_message_id, resolved_at FROM vip_publications WHERE candidate_key = ?')
        .get('c'.repeat(64))).toMatchObject({ state: 'unknown', telegram_message_id: null, resolved_at: timestamp })
      expect(db.prepare('SELECT candidate_key FROM vip_publications WHERE claim_token = ?')
        .get('legacy-unknown')).toMatchObject({ candidate_key: 'c'.repeat(64) })

      addRun('batch-window', 'running', 5, 5)
      db.prepare(`UPDATE vip_candidates SET status = 'published', published_at = ?,
        publication_window = 'batch-window', telegram_message_id = 'shared-message'
        WHERE candidate_key IN (?, ?)`)
        .run(timestamp, 'd'.repeat(64), 'e'.repeat(64))
      addPublication('d', 'batch-window', 'batch-claim-d', 'sent', 'shared-message')
      addPublication('e', 'batch-window', 'batch-claim-e', 'sent', 'shared-message')

      expect(db.prepare(`SELECT COUNT(*) AS count FROM vip_candidates
        WHERE telegram_message_id = 'shared-message'`).get()).toMatchObject({ count: 2 })
      expect(db.prepare(`SELECT COUNT(*) AS count FROM vip_publications
        WHERE window_key = 'batch-window' AND telegram_message_id = 'shared-message'`)
        .get()).toMatchObject({ count: 2 })
      expect(db.prepare('SELECT claimed_count, sent_count FROM vip_publication_runs WHERE window_key = ?')
        .get('batch-window')).toMatchObject({ claimed_count: 5, sent_count: 5 })
      expect(() => db.prepare('UPDATE vip_publication_runs SET claimed_count = 6 WHERE window_key = ?')
        .run('batch-window')).toThrow()
      expect(() => db.prepare('UPDATE vip_publication_runs SET sent_count = 6 WHERE window_key = ?')
        .run('batch-window')).toThrow()
      expect(db.prepare('PRAGMA foreign_key_check').all()).toEqual([])

      const indexNames = (table: string) => db.prepare(`PRAGMA index_list(${table})`).all()
        .map((row) => (row as { name: string }).name)
      expect(indexNames('vip_candidates')).toEqual(expect.arrayContaining([
        'idx_vip_candidates_status_kickoff', 'idx_vip_candidates_last_sync',
      ]))
      expect(indexNames('vip_publications')).toEqual(expect.arrayContaining([
        'idx_vip_publications_state_claimed', 'idx_vip_publications_window',
      ]))
      expect(db.prepare(`SELECT name FROM sqlite_master WHERE name LIKE '%_0007_backup'`).all()).toEqual([])
    } finally {
      db.close()
    }
  })
})
