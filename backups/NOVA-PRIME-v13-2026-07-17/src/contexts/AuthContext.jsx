import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'

// ─── Firebase Config ───
// Replace with your own Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeyReplaceMeWithYourOwn',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'bttsbet-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'bttsbet-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'bttsbet-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000',
}

// Initialize Firebase
let app
let auth
let db
let googleProvider

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  googleProvider = new GoogleAuthProvider()
} catch (err) {
  console.warn('Firebase init failed:', err.message)
}

// ─── Context ───
const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)

  // Check if Firebase is properly configured
  useEffect(() => {
    if (auth && firebaseConfig.apiKey !== 'AIzaSyDemoKeyReplaceMeWithYourOwn') {
      setIsFirebaseReady(true)
    } else {
      // Fallback: use localStorage for demo/offline mode
      setIsFirebaseReady(false)
      // Load from localStorage
      const saved = localStorage.getItem('bttsbet_user')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setUser(parsed)
          setUserProfile(parsed.profile || null)
        } catch (e) { /* ignore */ }
      }
      setLoading(false)
    }
  }, [])

  // Firebase auth state listener
  useEffect(() => {
    if (!isFirebaseReady || !auth) return

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const u = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        }
        setUser(u)

        // Listen to user profile in Firestore
        if (db) {
          const userRef = doc(db, 'users', firebaseUser.uid)
          const unsubProfile = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
              setUserProfile(snap.data())
            }
          })
          return () => unsubProfile()
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [isFirebaseReady])

  // ─── Auth methods ───

  const login = useCallback(async (email, password) => {
    if (isFirebaseReady && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      return cred.user
    }
    // Fallback: localStorage
    const saved = localStorage.getItem('bttsbet_users')
    const users = saved ? JSON.parse(saved) : {}
    const u = users[email]
    if (!u || u.password !== password) {
      throw new Error('Email ou mot de passe incorrect')
    }
    const userData = { uid: u.uid, email, displayName: u.displayName, profile: u.profile }
    setUser(userData)
    setUserProfile(u.profile || null)
    localStorage.setItem('bttsbet_user', JSON.stringify(userData))
    return userData
  }, [isFirebaseReady])

  const register = useCallback(async (email, password, displayName) => {
    if (isFirebaseReady && auth && db) {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName })
      // Create Firestore profile
      const profile = {
        displayName,
        email,
        createdAt: new Date().toISOString(),
        country: '',
        phone: '',
        linebetId: '',
        isVip: false,
        vipExpiry: null,
        favoriteLeagues: [],
        points: 0,
        predictionsViewed: 0,
        streak: 0,
      }
      await setDoc(doc(db, 'users', cred.user.uid), profile)
      return cred.user
    }
    // Fallback: localStorage
    const saved = localStorage.getItem('bttsbet_users')
    const users = saved ? JSON.parse(saved) : {}
    if (users[email]) {
      throw new Error('Cet email est déjà utilisé')
    }
    const uid = 'local_' + Date.now()
    const profile = {
      displayName,
      email,
      createdAt: new Date().toISOString(),
      country: '',
      phone: '',
      linebetId: '',
      isVip: false,
      vipExpiry: null,
      favoriteLeagues: [],
      points: 0,
      predictionsViewed: 0,
      streak: 0,
    }
    users[email] = { uid, password, displayName, profile }
    localStorage.setItem('bttsbet_users', JSON.stringify(users))
    const userData = { uid, email, displayName, profile }
    setUser(userData)
    setUserProfile(profile)
    localStorage.setItem('bttsbet_user', JSON.stringify(userData))
    return userData
  }, [isFirebaseReady])

  const logout = useCallback(async () => {
    if (isFirebaseReady && auth) {
      await signOut(auth)
    }
    setUser(null)
    setUserProfile(null)
    localStorage.removeItem('bttsbet_user')
  }, [isFirebaseReady])

  const resetPassword = useCallback(async (email) => {
    if (isFirebaseReady && auth) {
      await sendPasswordResetEmail(auth, email)
    } else {
      throw new Error('Réinitialisation disponible uniquement avec Firebase')
    }
  }, [isFirebaseReady])

  const loginWithGoogle = useCallback(async () => {
    if (isFirebaseReady && auth && db) {
      const cred = await signInWithPopup(auth, googleProvider)
      // Check if user profile exists, if not create it
      const userRef = doc(db, 'users', cred.user.uid)
      const snap = await getDoc(userRef)
      if (!snap.exists()) {
        const profile = {
          displayName: cred.user.displayName || '',
          email: cred.user.email,
          createdAt: new Date().toISOString(),
          country: '',
          phone: '',
          linebetId: '',
          isVip: false,
          vipExpiry: null,
          favoriteLeagues: [],
          points: 0,
          predictionsViewed: 0,
          streak: 0,
        }
        await setDoc(userRef, profile)
      }
      return cred.user
    }
    throw new Error('Connexion Google disponible uniquement avec Firebase')
  }, [isFirebaseReady])

  const updateUserData = useCallback(async (data) => {
    if (isFirebaseReady && db && user) {
      await setDoc(doc(db, 'users', user.uid), data, { merge: true })
    } else if (user) {
      const updated = { ...userProfile, ...data }
      setUserProfile(updated)
      const userData = { ...user, profile: updated }
      setUser(userData)
      localStorage.setItem('bttsbet_user', JSON.stringify(userData))
    }
  }, [isFirebaseReady, user, userProfile])

  const value = {
    user,
    userProfile,
    loading,
    isFirebaseReady,
    login,
    register,
    logout,
    resetPassword,
    loginWithGoogle,
    updateUserData,
    // Computed
    isLoggedIn: !!user,
    isVip: userProfile?.isVip === true,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
