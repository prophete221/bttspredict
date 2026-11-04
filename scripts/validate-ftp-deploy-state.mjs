#!/usr/bin/env node
import { chooseBaseState } from './prepare-ftp-deploy-plan.mjs'

function readArgs(argv) {
  return Object.fromEntries(argv.map((arg) => {
    const index = arg.indexOf('=')
    return index < 0 ? [arg.replace(/^--/, ''), 'true'] : [arg.slice(2, index), arg.slice(index + 1)]
  }))
}

const args = readArgs(process.argv.slice(2))
if (!args['state-safe'] || !args['state-legacy']) {
  console.error('[ftp-preflight] Refus : --state-safe et --state-legacy sont requis; aucun accès distant modifié.')
  process.exit(2)
}

try {
  const { state, source } = chooseBaseState(args['state-safe'], args['state-legacy'])
  console.log(`[ftp-preflight] État FTP ${source} validé (${state.data.length} entrées).`)
} catch (error) {
  console.error(`[ftp-preflight] Refus avant listing/suppression : ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
