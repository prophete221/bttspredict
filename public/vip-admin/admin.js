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

  function renderCandidates(candidates, latestSync = null) {
    candidateRecordsContainer.replaceChildren()
    const hasOutcome = typeof latestSync?.ownerMessage === 'string' && latestSync.ownerMessage.trim()
    candidateOutcome.hidden = !hasOutcome
    candidateOutcome.textContent = hasOutcome
      ? `${latestSync.ownerMessage}${latestSync.generatedAt ? ` Dernière analyse : ${latestSync.generatedAt}.` : ''}`
      : ''
    if (!Array.isArray(candidates) || candidates.length === 0) {
      const empty = document.createElement('p')
      empty.className = 'admin-empty'
      empty.textContent = latestSync?.ownerOutcome === 'no_eligible_picks_today'
        ? 'Aucun pick à examiner pour cette analyse.'
        : 'Aucun candidat VIP enregistré.'
      candidateRecordsContainer.append(empty)
      return
    }

    candidates.forEach(candidate => {
      const card = document.createElement('article')
      card.className = 'admin-record admin-candidate'
      const heading = document.createElement('h3')
      heading.textContent = `${candidate.home || 'Équipe inconnue'} — ${candidate.away || 'Équipe inconnue'}`
      card.append(heading)

      const details = document.createElement('dl')
      addField(details, 'Compétition', candidate.league)
      addField(details, 'Coup d’envoi', `${candidate.date || '—'} · ${candidate.time || '—'} Dakar`)
      addField(details, 'Marché et sélection', `${candidate.market || '—'} · ${candidate.selection || '—'}`)
      addField(details, 'Pick gratuit associé', candidate.freeMarket && candidate.freeSelection
        ? `${candidate.freeMarket} · ${candidate.freeSelection}`
        : 'Aucun pick gratuit')
      addField(details, 'Estimation du modèle (non garantie)', `${Math.round(Number(candidate.probability) * 100)}% · confiance ${candidate.aiConfidence || '—'}`)
      addField(details, 'Taux empiriques (global / équipe A / équipe B)', [candidate.empiricalSelectionRate, candidate.homeSelectionRate, candidate.awaySelectionRate]
        .map(value => Number.isFinite(Number(value)) ? `${Math.round(Number(value) * 100)}%` : '—').join(' / '))
      addField(details, 'Échantillons récents (équipe A / équipe B)', `${candidate.formCountHome ?? '—'} / ${candidate.formCountAway ?? '—'}`)
      addField(details, 'État du match', candidate.matchState)
      addField(details, 'Analyse effectuée le', candidate.analyzedAt)
      addField(details, 'Raisons fournies', Array.isArray(candidate.reasons) ? candidate.reasons.join(' · ') : null)
      addField(details, 'Risques signalés', Array.isArray(candidate.risks) ? candidate.risks.join(' · ') : null)
      addField(details, 'Statut admin', candidate.status)
      card.append(details)

      const actions = document.createElement('div')
      actions.className = 'admin-actions'
      if (candidate.status === 'pending_owner_approval') {
        actions.append(
          makeButton('Approuver le candidat', 'admin-approve', () => decideCandidate(candidate, 'approve')),
          makeButton('Refuser', 'admin-reject', () => decideCandidate(candidate, 'reject')),
        )
      }
      card.append(actions)
      candidateRecordsContainer.append(card)
    })
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
      renderCandidates(result.candidates, result.latestSync || null)
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
