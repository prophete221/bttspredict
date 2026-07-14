import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { SITE, AFFILIATE } from '../data/constants'

// ─── Login Page ───
export function LoginPage() {
  const { login, loginWithGoogle, isFirebaseReady } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message === 'Email ou mot de passe incorrect'
        ? err.message
        : 'Erreur de connexion. Vérifiez vos identifiants.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    try {
      await loginWithGoogle()
    } catch (err) {
      setError('Erreur de connexion Google.')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-emerald/10 border border-emerald/20 rounded-2xl flex items-center justify-center text-emerald mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
            CONNEXION
          </h1>
          <p className="text-gray-400 text-sm mt-1">Accédez à vos pronostics VIP</p>
        </div>

        {/* Card */}
        <div className="bg-panel border border-edge/50 rounded-2xl p-6 sm:p-8">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="w-full bg-midnight/60 border border-edge/60 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald/50 focus:ring-1 focus:ring-emerald/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-midnight/60 border border-edge/60 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald/50 focus:ring-1 focus:ring-emerald/30 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-emerald/30 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Connexion...
                </span>
              ) : 'Se connecter'}
            </button>
          </form>

          {/* Google Login (Firebase only) */}
          {isFirebaseReady && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-edge/30" />
                <span className="text-xs text-gray-600">ou</span>
                <div className="flex-1 h-px bg-edge/30" />
              </div>
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-medium hover:bg-white/10 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuer avec Google
              </button>
            </>
          )}

          {/* Links */}
          <div className="mt-5 text-center space-y-2">
            <p className="text-sm text-gray-500">
              Pas encore de compte ?{' '}
              <a href="/register" className="text-emerald hover:text-emerald-light font-medium transition-colors">
                Créer un compte
              </a>
            </p>
            {isFirebaseReady && (
              <a href="/reset-password" className="block text-xs text-gray-600 hover:text-gray-400 transition-colors">
                Mot de passe oublié ?
              </a>
            )}
          </div>
        </div>

        {/* Info */}
        <p className="text-[10px] text-gray-600 text-center mt-4">
          En vous connectant, vous acceptez nos{' '}
          <a href="/cgu" className="underline hover:text-gray-400">CGU</a> et notre{' '}
          <a href="/politique-confidentialite" className="underline hover:text-gray-400">politique de confidentialité</a>.
        </p>
      </motion.div>
    </div>
  )
}

// ─── Register Page ───
export function RegisterPage() {
  const { register, loginWithGoogle, isFirebaseReady } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (!displayName.trim()) {
      setError('Veuillez entrer votre nom.')
      return
    }

    setLoading(true)
    try {
      await register(email, password, displayName.trim())
      setSuccess(true)
    } catch (err) {
      if (err.message.includes('already')) {
        setError('Cet email est déjà utilisé.')
      } else {
        setError(err.message || 'Erreur lors de l\'inscription.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setError('')
    try {
      await loginWithGoogle()
    } catch (err) {
      setError('Erreur de connexion Google.')
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto bg-emerald/10 border border-emerald/20 rounded-full flex items-center justify-center text-emerald mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
            COMPTE CRÉÉ !
          </h2>
          <p className="text-gray-400 mb-6">Bienvenue sur BttsBet, {displayName} ! Votre compte a été créé avec succès.</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-emerald/30 transition-all"
          >
            Commencer
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-emerald/10 border border-emerald/20 rounded-2xl flex items-center justify-center text-emerald mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
            CRÉER UN COMPTE
          </h1>
          <p className="text-gray-400 text-sm mt-1">Rejoignez la communauté BttsBet</p>
        </div>

        {/* Card */}
        <div className="bg-panel border border-edge/50 rounded-2xl p-6 sm:p-8">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Nom complet</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="Votre nom"
                className="w-full bg-midnight/60 border border-edge/60 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald/50 focus:ring-1 focus:ring-emerald/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="w-full bg-midnight/60 border border-edge/60 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald/50 focus:ring-1 focus:ring-emerald/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 6 caractères"
                className="w-full bg-midnight/60 border border-edge/60 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald/50 focus:ring-1 focus:ring-emerald/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-midnight/60 border border-edge/60 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald/50 focus:ring-1 focus:ring-emerald/30 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-emerald/30 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Création...
                </span>
              ) : 'Créer mon compte'}
            </button>
          </form>

          {/* Google */}
          {isFirebaseReady && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-edge/30" />
                <span className="text-xs text-gray-600">ou</span>
                <div className="flex-1 h-px bg-edge/30" />
              </div>
              <button
                onClick={handleGoogleRegister}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-medium hover:bg-white/10 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                S'inscrire avec Google
              </button>
            </>
          )}

          {/* Benefits */}
          <div className="mt-5 bg-midnight/40 rounded-lg p-3 border border-edge/20">
            <p className="text-xs text-gray-500 font-medium mb-2">En créant un compte, vous bénéficierez de :</p>
            <div className="space-y-1.5">
              {[
                'Pronostics personnalisés selon vos ligues',
                'Suivi de vos paris et performances',
                'Accès VIP avec contenu exclusif',
                'Notifications pour les matchs importants',
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span className="text-xs text-gray-400">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500">
              Déjà un compte ?{' '}
              <a href="/login" className="text-emerald hover:text-emerald-light font-medium transition-colors">
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Profile Page ───
export function ProfilePage() {
  const { user, userProfile, logout, updateUserData, isVip } = useAuth()
  const [editing, setEditing] = useState(false)
  const [phone, setPhone] = useState(userProfile?.phone || '')
  const [country, setCountry] = useState(userProfile?.country || '')
  const [linebetId, setLinebetId] = useState(userProfile?.linebetId || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Vous devez être connecté pour accéder à votre profil.</p>
          <a href="/login" className="px-6 py-3 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-xl text-sm">
            Se connecter
          </a>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateUserData({ phone, country, linebetId })
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const stats = [
    { label: 'Pronostics consultés', value: userProfile?.predictionsViewed || 0, icon: 'eye' },
    { label: 'Jours consécutifs', value: userProfile?.streak || 0, icon: 'fire' },
    { label: 'Points', value: userProfile?.points || 0, icon: 'star' },
  ]

  return (
    <div className="min-h-[80vh] px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Profile header */}
          <div className="bg-panel border border-edge/50 rounded-2xl p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-emerald to-emerald-dark rounded-2xl flex items-center justify-center text-midnight font-bold text-xl flex-shrink-0">
                {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-white truncate">{user.displayName || 'Utilisateur'}</h1>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  {isVip ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-gold/10 text-gold border border-gold/20 rounded-full px-2 py-0.5 font-semibold">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l4-8 4 4 2-9 4 7 2-3 4 9H2z"/></svg>
                      VIP
                    </span>
                  ) : (
                    <span className="text-xs text-gray-600">Membre gratuit</span>
                  )}
                  <span className="text-xs text-gray-600">Membre depuis {new Date(userProfile?.createdAt || Date.now()).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-400 transition-colors p-2"
                title="Déconnexion"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s, i) => (
                <div key={i} className="bg-midnight/50 rounded-xl p-3 text-center border border-edge/20">
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-[10px] text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile details */}
          <div className="bg-panel border border-edge/50 rounded-2xl p-6 sm:p-8 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Informations personnelles</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="text-sm text-emerald hover:text-emerald-light transition-colors font-medium"
              >
                {editing ? 'Annuler' : 'Modifier'}
              </button>
            </div>

            {saved && (
              <div className="mb-4 bg-emerald/10 border border-emerald/20 rounded-lg px-4 py-3 text-emerald text-sm flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Profil mis à jour avec succès !
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Téléphone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!editing}
                  placeholder="+237 6XX XXX XXX"
                  className="w-full bg-midnight/60 border border-edge/60 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald/50 focus:ring-1 focus:ring-emerald/30 transition-all disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Pays</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={!editing}
                  className="w-full bg-midnight/60 border border-edge/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald/50 focus:ring-1 focus:ring-emerald/30 transition-all disabled:opacity-50"
                >
                  <option value="">Sélectionner votre pays</option>
                  <option value="CM">Cameroun</option>
                  <option value="SN">Sénégal</option>
                  <option value="CI">Côte d'Ivoire</option>
                  <option value="ML">Mali</option>
                  <option value="BF">Burkina Faso</option>
                  <option value="GN">Guinée</option>
                  <option value="BJ">Bénin</option>
                  <option value="TG">Togo</option>
                  <option value="NE">Niger</option>
                  <option value="TD">Tchad</option>
                  <option value="GA">Gabon</option>
                  <option value="CG">Congo</option>
                  <option value="CD">RDC</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">ID LINEBET</label>
                <input
                  type="text"
                  value={linebetId}
                  onChange={(e) => setLinebetId(e.target.value)}
                  disabled={!editing}
                  placeholder="Votre identifiant Linebet"
                  className="w-full bg-midnight/60 border border-edge/60 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald/50 focus:ring-1 focus:ring-emerald/30 transition-all disabled:opacity-50"
                />
              </div>

              {editing && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-emerald/30 transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              )}
            </div>
          </div>

          {/* VIP Status */}
          {!isVip && (
            <div className="bg-panel border border-gold/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-gold-light to-gold" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center text-gold">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l4-8 4 4 2-9 4 7 2-3 4 9H2z"/></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Devenir VIP</h3>
                  <p className="text-xs text-gold/50">Accédez aux pronostics exclusifs</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Inscrivez-vous sur LINEBET avec le code promo <span className="text-gold font-bold">VISION221</span> et déposez un minimum de 10 000 Fr pour débloquer l'accès VIP complet.
              </p>
              <div className="flex gap-3">
                <a
                  href="/#vip"
                  className="flex-1 text-center px-4 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-midnight font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-gold/30 transition-all"
                >
                  Rejoindre le VIP
                </a>
                <a
                  href={AFFILIATE.linebet}
                  rel={AFFILIATE.rel}
                  target="_blank"
                  className="flex-1 text-center px-4 py-2.5 border border-gold/20 text-gold font-semibold rounded-xl text-sm hover:bg-gold/5 transition-all"
                >
                  S'inscrire LINEBET
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
