(() => {
  const API = 'https://bttspredict-vip-production-api.luxxdii.workers.dev'
  const SESSION_KEY = 'bttspredict-vip-production-admin-token-v1'
  const loginPanel = document.querySelector('#login-panel')
  const loginForm = document.querySelector('#admin-login-form')
  const passwordInput = document.querySelector('#admin-password')
  const requestsPanel = document.querySelector('#requests-panel')
  const recordsContainer = document.querySelector('#admin-records')
  const candidatesPanel = document.querySelector('#candidates-panel')
  const candidateRecordsContainer = document.querySelector('#admin-candidate-records')
  const candidateOutcome = document.querySelector('#admin-candidate-outcome')
  const candidateRefreshButton = document.querySelector('#admin-candidates-refresh')
  const statusPanel = document.querySelector('#admin-status')
  const logoutButton = document.querySelector('#admin-logout')
  let token = ''

  function showMessage(message, isError = false) {
    statusPanel.hidden = false
    statusPanel.dataset.error = String(isError)
    statusPanel.textContent = message
  }

  async function parseJson(response) {
    return response.json().catch(() => ({}))
  }

  async function request(path, { method = 'GET', data, authenticated = true } = {}) {
    const headers = {}
    if (data !== undefined) headers['Content-Type'] = 'application/json'
    if (authenticated && token) headers.Authorization = `Bearer ${token}`
    const response = await fetch(`${API}${path}`, {
      method,
      headers,
      body: data === undefined ? undefined : JSON.stringify(data),
      credentials: 'omit',
      cache: 'no-store',
    })
    return { response, result: await parseJson(response) }
  }

  function setLoggedIn(value) {
    loginPanel.hidden = value
    requestsPanel.hidden = !value
    candidatesPanel.hidden = !value
    if (!value) {
      recordsContainer.replaceChildren()
      candidateRecordsContainer.replaceChildren()
      candidateOutcome.hidden = true
      candidateOutcome.textContent = ''
    }
  }

  function saveToken(value) {
    token = value
    try { sessionStorage.setItem(SESSION_KEY, value) } catch { /* Keep the token in memory until this page closes. */ }
  }

  function clearToken() {
    token = ''
    try { sessionStorage.removeItem(SESSION_KEY) } catch { /* Session ends when this page closes. */ }
    recordsContainer.replaceChildren()
    candidateRecordsContainer.replaceChildren()
  }

  function addField(definitionList, label, value) {
    const wrapper = document.createElement('div')
    const term = document.createElement('dt')
    const description = document.createElement('dd')
    term.textContent = label
    description.textContent = value === null || value === undefined || value === '' ? '—' : String(value)
    wrapper.append(term, description)
    definitionList.append(wrapper)
  }

  function makeButton(label, className, action) {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = className
    button.textContent = label
    button.addEventListener('click', action)
    return button
  }

  function blobAsDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = () => reject(new Error('proof_read_failed'))
      reader.readAsDataURL(blob)
    })
  }

  async function loadProof(id, image) {
    try {
      const response = await fetch(`${API}/admin/requests/${encodeURIComponent(id)}/proof`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'omit',
        cache: 'no-store',
      })
      if (!response.ok) throw new Error('proof_unavailable')
      const blob = await response.blob()
      image.src = await blobAsDataUrl(blob)
    } catch {
      image.alt = 'Preuve privée indisponible dans cette session administrateur.'
      image.replaceWith(Object.assign(document.createElement('p'), {
        className: 'admin-copy',
        textContent: 'Preuve privée indisponible; reconnecte-toi et recharge la page.',
      }))
    }
  }

  function renderRecords(requests) {
    recordsContainer.replaceChildren()
    if (!Array.isArray(requests) || requests.length === 0) {
      const empty = document.createElement('p')
      empty.className = 'admin-empty'
      empty.textContent = 'Aucune demande enregistrée.'
      recordsContainer.append(empty)
      return
    }

    requests.forEach(record => {
      const card = document.createElement('article')
      card.className = 'admin-record'
      const heading = document.createElement('h3')
      heading.textContent = `Demande ${String(record.id ?? '')}`
      card.append(heading)

      const details = document.createElement('dl')
      addField(details, 'Partenaire', record.partner)
      addField(details, 'Code promo', record.promoCode)
      addField(details, 'Identifiant du compte', record.accountIdentifier)
      addField(details, 'Dépôt déclaré (USD)', record.depositUsd)
      addField(details, 'Canal', record.contactChannel)
      addField(details, 'Consentement à la demande', record.consentVersion ? `${record.consentVersion} · ${record.consentedAt || '—'}` : null)
      addField(details, 'Consentement au suivi', record.contactConsentedAt)
      addField(details, 'Nom Telegram', record.telegramUsername ? `@${record.telegramUsername}` : null)
      addField(details, 'Téléphone WhatsApp', record.whatsappPhone)
      addField(details, 'Statut', record.status)
      addField(details, 'Créée le', record.createdAt)
      addField(details, 'Examinée le', record.reviewedAt)
      addField(details, 'Type et taille de la preuve', `${record.proofMime || '—'} · ${record.proofSize ? `${(record.proofSize / 1_000_000).toFixed(2)} Mo` : '—'}`)
      card.append(details)

      if (record.proofMime === 'image/png' || record.proofMime === 'image/jpeg') {
        const proof = document.createElement('img')
        proof.alt = `Preuve privée pour la demande ${String(record.id ?? '')}`
        proof.className = 'admin-proof'
        proof.loading = 'lazy'
        card.append(proof)
        loadProof(record.id, proof)
      }

      const actions = document.createElement('div')
      actions.className = 'admin-actions'
      if (record.status === 'pending_review') {
        actions.append(
          makeButton('Valider la demande', 'admin-approve', () => decide(record.id, 'approve')),
          makeButton('Refuser', 'admin-reject', () => decide(record.id, 'reject')),
        )
      }
      actions.append(makeButton('Supprimer la demande et sa preuve', 'admin-delete', () => removeRequest(record.id)))
      card.append(actions)
      recordsContainer.append(card)
    })
  }

  function percent(value) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) return 'Non documenté'
    const percentage = value * 100
    if (percentage > 0 && percentage < 0.01) return '<0,01 %'
    if (percentage > 99.99 && percentage < 100) return '>99,99 %'
    return `${String(Number(percentage.toFixed(2))).replace('.', ',')} %`
  }

  function selectionLabel(candidate) {
    const market = candidate.market === 'BTTS' ? 'BTTS' : candidate.market === 'OVER_25' ? 'Over 2,5' : 'Marché non documenté'
    const side = candidate.selection === 'NO' ? 'Non' : candidate.selection === 'YES' ? 'Oui' : 'sélection non documentée'
    return `${market} ${side}`
  }

  function observedRate(rate, sample) {
    const formatted = percent(rate)
    if (formatted === 'Non documenté' || !Number.isSafeInteger(sample) || sample <= 0) return formatted
    const hits = rate * sample
    return Math.abs(hits - Math.round(hits)) < 0.000001
      ? `${formatted} (${Math.round(hits)}/${sample} matchs)` : `${formatted} (échantillon : ${sample} matchs)`
  }

  function renderCandidates(candidates, latestSync = null, publicationEnabled = null) {
    candidateRecordsContainer.replaceChildren()
    const rows = Array.isArray(candidates) ? candidates : []
    const current = rows.filter(candidate => candidate.isCurrent === true)
    const historical = rows.filter(candidate => candidate.isCurrent !== true)
    const parts = []
    if (latestSync) {
      parts.push(Number.isSafeInteger(latestSync.acceptedCount)
        ? `Dernière analyse : ${latestSync.acceptedCount} candidat(s) retenu(s) après exclusions.`
        : 'Le nombre de candidats retenus par la dernière analyse n’est pas documenté.')
      for (const [key, label] of [
        ['inputRows', 'Matchs analysés'], ['eligibleBeforeFreeExclusion', 'Choix admissibles avant exclusions'],
        ['excludedAlreadyFree', 'Déjà proposés gratuitement, donc exclus'], ['excludedDuplicateKey', 'Doublons internes exclus'],
      ]) {
        if (Number.isSafeInteger(latestSync[key]) && latestSync[key] >= 0) parts.push(`${label} : ${latestSync[key]}.`)
      }
      if (Number.isSafeInteger(latestSync.minimumTargetFixtures) && Number.isSafeInteger(latestSync.maximumSelectedFixtures)) {
        parts.push(`Objectif par analyse : ${latestSync.minimumTargetFixtures} à ${latestSync.maximumSelectedFixtures} matchs distincts.`)
      }
      if (Number.isSafeInteger(latestSync.shortfall) && latestSync.shortfall > 0) {
        parts.push(`Objectif minimal non atteint dans cet instantané : il manque ${latestSync.shortfall} match(s) étayé(s). Aucun match n’est ajouté artificiellement.`)
      }
      if (latestSync.generatedAt) parts.push(`Analyse terminée le ${latestSync.generatedAt}.`)
    }
    parts.push(`Cartes affichées : ${current.length} de la dernière analyse, ${historical.length} historique(s).`)
    if (publicationEnabled === false) parts.push('Publication automatique inactive; aucune décision manuelle n’envoie de message.')
    if (publicationEnabled === true) parts.push('Le sender automatique est distinct des décisions manuelles; toute publication est revérifiée.')
    if (rows.length >= 200) parts.push('Liste limitée aux 200 premières cartes; les compteurs de la dernière analyse sont indépendants de cette limite.')
    candidateOutcome.hidden = false
    candidateOutcome.textContent = parts.join(' ')

    const currentHeading = document.createElement('h3')
    currentHeading.className = 'admin-group-title'
    currentHeading.textContent = 'Candidats de la dernière analyse'
    candidateRecordsContainer.append(currentHeading)
    if (!current.length) {
      const empty = document.createElement('p')
      empty.className = 'admin-empty'
      empty.textContent = 'Aucun candidat courant à examiner. Les anciennes cartes ci-dessous ne sont pas des choix actuellement publiables.'
      candidateRecordsContainer.append(empty)
    }

    function renderCard(candidate, container, isHistorical) {
      const card = document.createElement('article')
      card.className = 'admin-record admin-candidate'
      card.dataset.historical = String(isHistorical)
      const heading = document.createElement('h3')
      heading.textContent = `${candidate.home || 'Équipe inconnue'} — ${candidate.away || 'Équipe inconnue'}`
      card.append(heading)
      const selected = selectionLabel(candidate)
      const details = document.createElement('dl')
      if (isHistorical) addField(details, 'Ancien instantané — non publiable depuis cette liste', 'Cette carte ne fait pas partie de la dernière analyse. Ses chiffres décrivent uniquement son ancien instantané.')
      addField(details, 'Compétition', candidate.league)
      addField(details, 'Coup d’envoi', `${candidate.date || '—'} · ${candidate.time || '—'} Dakar`)
      addField(details, 'Marché et sélection exacts', selected)
      addField(details, 'Pick gratuit associé dans cet instantané', candidate.freeMarket && candidate.freeSelection
        ? selectionLabel({ market: candidate.freeMarket, selection: candidate.freeSelection })
        : 'Non renseigné dans cet instantané; ce champ ne vérifie pas le flux gratuit actuel.')
      const confidence = ({ high: 'élevée', medium: 'moyenne', low: 'faible' })[candidate.aiConfidence] || 'non documentée'
      addField(details, `Estimation du modèle pour ${selected} — non garantie`, `${percent(candidate.probability)} · confiance déclarée : ${confidence}`)
      if (typeof candidate.probability === 'number' && candidate.probability > 0 && candidate.probability < 0.7) {
        addField(details, 'Avertissement pour cette estimation', 'Estimation inférieure à 70 % : risque ÉLEVÉ. Le label de confiance déclaré par le modèle ne transforme pas ce choix en sélection forte ni garantie.')
      }
      addField(details, 'Source de l’estimation', [candidate.sourceModel, candidate.probabilitySource].filter(Boolean).join(' · ') || 'Non documentée')
      addField(details, `Fréquence récente de ${selected} — ${candidate.home || 'équipe à domicile'}`, observedRate(candidate.homeSelectionRate, candidate.formCountHome))
      addField(details, `Fréquence récente de ${selected} — ${candidate.away || 'équipe à l’extérieur'}`, observedRate(candidate.awaySelectionRate, candidate.formCountAway))
      addField(details, `Moyenne des deux fréquences pour ${selected}`, `${percent(candidate.empiricalSelectionRate)} — fréquence observée, pas une probabilité future garantie`)
      if (candidate.market === 'BTTS' && candidate.selection === 'NO') {
        addField(details, 'Lecture des taux BTTS Oui / Non', `Le taux source BTTS désigne Oui (les deux équipes ont marqué). Non = 1 − ce taux. BTTS Oui : ${typeof candidate.homeSelectionRate === 'number' ? percent(1 - candidate.homeSelectionRate) : 'Non documenté'} / ${typeof candidate.awaySelectionRate === 'number' ? percent(1 - candidate.awaySelectionRate) : 'Non documenté'}. Une raison citant ce taux Oui ne remplace pas l’estimation du modèle pour Non.`)
      }
      addField(details, 'Périmètre des données récentes', candidate.dataSource === 'ESPN_TEAM_SCHEDULE'
        ? 'Calendriers ESPN de la compétition analysée, tous lieux confondus (domicile et extérieur). Les fréquences récentes utilisent les échantillons de forme ci-dessus, pas toutes compétitions confondues.'
        : 'Périmètre non documenté dans cet instantané.')
      addField(details, `Historique disponible (${candidate.home || 'équipe A'} / ${candidate.away || 'équipe B'})`, `${candidate.matchCountHome ?? 'Non documenté'} / ${candidate.matchCountAway ?? 'Non documenté'} matchs`)
      addField(details, 'État du match lors de cet instantané — pas un statut live', candidate.matchState)
      addField(details, 'Analyse effectuée le', candidate.analyzedAt)
      const displayedRisk = candidate.displayRisk && typeof candidate.displayRisk === 'object'
        ? candidate.displayRisk : candidate.riskPolicy === 'risk-v2-model-specific'
          ? { level: candidate.riskLevel, reasons: candidate.riskReasons, policy: candidate.riskPolicy } : null
      const riskReconciled = displayedRisk?.policy === 'risk-v2-model-specific'
      addField(details, 'Risque recalculé sur cet instantané', riskReconciled && displayedRisk.level
        ? `${displayedRisk.level} — ne valide pas la publication`
        : 'Non documenté ou non revalidé — ne pas publier sur cette base')
      addField(details, 'Justification du niveau de risque', riskReconciled && Array.isArray(displayedRisk.reasons)
        ? displayedRisk.reasons.join(' · ') : 'Ancien calcul non revalidé; ses explications ne sont pas reprises.')
      addField(details, 'Raisons du modèle — texte d’origine', Array.isArray(candidate.reasons) ? candidate.reasons.join(' · ') : null)
      addField(details, 'Risques signalés', Array.isArray(candidate.risks) ? candidate.risks.join(' · ') : null)
      const statuses = { pending_owner_approval: 'En attente de décision', approved: 'Approuvé, pas nécessairement publié', rejected: 'Refusé', ineligible: 'Inéligible', published: 'Publié' }
      addField(details, 'Statut enregistré', statuses[candidate.status] || candidate.status)
      const blocked = {
        not_in_current_eligible_source: 'Absent de la dernière source admissible; ne pas réutiliser cet ancien choix.',
        candidate_stale_or_started: 'Analyse périmée ou coup d’envoi dépassé.',
        historical_snapshot: 'Ancien instantané, sans droit de publication.',
        candidate_failed_validation: 'Les contrôles actuels ne permettent pas une nouvelle décision.',
      }
      const reason = candidate.ineligibleReason || candidate.reviewBlockedReason
      if (reason) addField(details, 'Pourquoi cette carte ne peut pas être approuvée maintenant', blocked[reason] || reason)
      card.append(details)
      const actions = document.createElement('div')
      actions.className = 'admin-actions'
      if (!isHistorical && candidate.canReview === true && candidate.status === 'pending_owner_approval') {
        actions.append(
          makeButton('Approuver le candidat', 'admin-approve', () => decideCandidate(candidate, 'approve')),
          makeButton('Refuser', 'admin-reject', () => decideCandidate(candidate, 'reject')),
        )
      }
      card.append(actions)
      container.append(card)
    }
    current.forEach(candidate => renderCard(candidate, candidateRecordsContainer, false))
    if (historical.length) {
      const history = document.createElement('details')
      history.className = 'admin-candidate-history'
      const summary = document.createElement('summary')
      summary.textContent = `Historique — ${historical.length} ancienne(s) carte(s), non publiable(s) depuis cette liste`
      const list = document.createElement('div')
      list.className = 'admin-records'
      historical.forEach(candidate => renderCard(candidate, list, true))
      history.append(summary, list)
      candidateRecordsContainer.append(history)
    }
  }

  async function loadRequests() {
    try {
      const { response, result } = await request('/admin/requests')
      if (response.status === 401) {
        clearToken()
        setLoggedIn(false)
        showMessage('La session administrateur a expiré. Reconnecte-toi.', true)
        return
      }
      if (!response.ok || result.ok !== true || !Array.isArray(result.requests)) throw new Error('list_failed')
      renderRecords(result.requests)
      showMessage('Liste et preuves chargées depuis le service sécurisé après authentification.')
    } catch {
      showMessage('Impossible de charger les demandes depuis le Worker.', true)
    }
  }

  async function loadCandidates() {
    try {
      const { response, result } = await request('/admin/candidates')
      if (response.status === 401) {
        clearToken()
        setLoggedIn(false)
        showMessage('La session administrateur a expiré. Reconnecte-toi.', true)
        return
      }
      if (!response.ok || result.ok !== true || !Array.isArray(result.candidates)) throw new Error('candidate_list_failed')
      renderCandidates(result.candidates, result.latestSync || null, result.publicationEnabled)
      showMessage('Candidats chargés dans l’espace privé. Une décision n’envoie aucun message et ne publie rien.')
    } catch {
      showMessage('Impossible de charger les candidats VIP depuis le Worker.', true)
    }
  }

  async function establishSession() {
    try { token = sessionStorage.getItem(SESSION_KEY) || '' } catch { token = '' }
    if (!/^[a-f0-9]{64}$/.test(token)) {
      clearToken()
      setLoggedIn(false)
      return
    }
    setLoggedIn(true)
    await Promise.all([loadRequests(), loadCandidates()])
  }

  loginForm.addEventListener('submit', async event => {
    event.preventDefault()
    if (!loginForm.reportValidity()) return
    const submitButton = loginForm.querySelector('button[type="submit"]')
    submitButton.disabled = true
    try {
      const { response, result } = await request('/admin/session', {
        method: 'POST',
        data: { password: passwordInput.value },
        authenticated: false,
      })
      passwordInput.value = ''
      if (!response.ok || result.ok !== true || typeof result.token !== 'string' || !/^[a-f0-9]{64}$/.test(result.token)) {
        showMessage(response.status === 429 ? 'Trop de tentatives. Réessaie dans 15 minutes.' : 'Connexion refusée. Vérifie le mot de passe ou la disponibilité du Worker.', true)
        return
      }
      saveToken(result.token)
      setLoggedIn(true)
      await Promise.all([loadRequests(), loadCandidates()])
    } catch {
      passwordInput.value = ''
      showMessage('Connexion impossible : Worker administrateur indisponible.', true)
    } finally {
      submitButton.disabled = false
    }
  })

  async function decide(id, decision) {
    if (!token || !id) return
    try {
      const { response, result } = await request(`/admin/requests/${encodeURIComponent(id)}/decision`, {
        method: 'POST', data: { decision },
      })
      if (!response.ok || result.ok !== true) {
        if (result.error === 'telegram_invite_unavailable') {
          showMessage('Le lien Telegram n’a pas pu être créé. La demande reste en attente; vérifie la configuration du bot puis réessaie.', true)
          return
        }
        throw new Error('decision_failed')
      }
      const expected = decision === 'approve' ? 'approved_pending_telegram' : 'rejected'
      if (result.status !== expected || result.inviteSent !== false
        || result.inviteReady !== (decision === 'approve')
        || result.telegramInviteMode !== 'manual-approval-private-status') throw new Error('unexpected_status')
      showMessage(decision === 'approve'
        ? 'La demande est validée. Le lien individuel, limité à une place, apparaîtra dans son suivi après actualisation; aucun message ne lui est envoyé.'
        : 'La demande a été refusée. Aucun accès n’est accordé.')
      await loadRequests()
    } catch {
      showMessage('La décision n’a pas été confirmée par le Worker. Recharge la liste avant de réessayer.', true)
    }
  }

  async function decideCandidate(candidate, decision) {
    if (!token || !candidate?.candidateKey || !candidate?.materialHash) return
    try {
      const { response, result } = await request(`/admin/candidates/${encodeURIComponent(candidate.candidateKey)}/decision`, {
        method: 'POST', data: { decision, materialHash: candidate.materialHash },
      })
      if (!response.ok || result.ok !== true || result.published !== false || result.telegramSent !== false) {
        if (result.error === 'candidate_no_longer_eligible') {
          showMessage('Ce match est commencé ou l’analyse n’est plus assez fraîche; le candidat a été retiré de la revue.', true)
          await loadCandidates()
          return
        }
        if (result.error === 'candidate_changed') {
          showMessage('Les données du candidat ont changé. Recharge la liste et réexamine le dossier.', true)
          await loadCandidates()
          return
        }
        throw new Error('candidate_decision_failed')
      }
      showMessage(decision === 'approve'
        ? 'Approbation enregistrée. Aucun message Telegram n’a été envoyé et rien n’a été publié.'
        : 'Refus enregistré. Aucun message Telegram n’a été envoyé et rien n’a été publié.')
      await loadCandidates()
    } catch {
      showMessage('La décision du candidat n’a pas été confirmée. Recharge la liste avant de réessayer.', true)
    }
  }

  async function removeRequest(id) {
    if (!token || !id) return
    if (!window.confirm('Supprimer définitivement cette demande et sa preuve privée ?')) return
    try {
      const { response, result } = await request(`/admin/requests/${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!response.ok || result.ok !== true || result.deleted !== true) throw new Error('delete_failed')
      showMessage('La demande et sa preuve ont été supprimées.')
      await loadRequests()
    } catch {
      showMessage('La suppression n’a pas été confirmée par le Worker.', true)
    }
  }

  logoutButton.addEventListener('click', async () => {
    if (!token) return
    logoutButton.disabled = true
    try {
      const { response, result } = await request('/admin/logout', { method: 'POST', data: {} })
      if (!response.ok || result.ok !== true || result.loggedOut !== true) throw new Error('logout_failed')
      clearToken()
      setLoggedIn(false)
      showMessage('Session administrateur révoquée par le Worker.')
    } catch {
      showMessage('La déconnexion n’a pas été confirmée; réessaie pour révoquer la session serveur.', true)
    } finally {
      logoutButton.disabled = false
    }
  })

  candidateRefreshButton.addEventListener('click', loadCandidates)

  establishSession()
})()
