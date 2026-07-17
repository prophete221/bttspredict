import { lazy, Suspense, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FreePredictions from './components/predictions/FreePredictions'
import PromoVip from './components/PromoVip'
import WinHistory from './components/WinHistory'
import Testimonials from './components/Testimonials'
import HowItWorks from './components/HowItWorks'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import CursorEffect from './components/CursorEffect'
import FloatingElements from './components/FloatingElements'
import ErrorBoundary from './components/ErrorBoundary'
import CookieConsent from './components/CookieConsent'
import AgeVerification from './components/AgeVerification'

// Lazy-loaded 3D Scene (desktop only, with fallback)
const Scene3D = lazy(() => import('./components/Scene3D'))

// Lazy-loaded pages (code splitting)
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogArticlePage = lazy(() => import('./pages/BlogArticlePage'))
const LegalPages = lazy(() => import('./pages/LegalPages'))
const MentionsLegales = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.MentionsLegales })))
const PolitiqueConfidentialite = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.PolitiqueConfidentialite })))
const JouerResponsable = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.JouerResponsable })))
const CGU = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.CGU })))

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="inline-block w-10 h-10 border-[3px] border-emerald/30 border-t-emerald rounded-full animate-spin" />
    </div>
  )
}

// Three.js loading fallback (invisible)
function Scene3DFallback() {
  return null
}

// Responsive 3D scene — updates on resize
function Scene3DWrapper() {
  const [showScene, setShowScene] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 1024
  )

  useEffect(() => {
    const handleResize = () => setShowScene(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!showScene) return null
  return (
    <Suspense fallback={<Scene3DFallback />}>
      <Scene3D />
    </Suspense>
  )
}

function HomePage() {
  return (
    <>
      <Helmet>
        <title>BttsBet – Pronostics BTTS & Over 2,5 | Précision IA ~87%</title>
      </Helmet>
      {/* Zone 1 : Hero — compact, bold, sportif */}
      <Hero />
      {/* Zone 2 : How It Works — 3 étapes */}
      <HowItWorks />
      {/* Zone 3 : Predictions Dashboard — LA star du site */}
      <FreePredictions />
      {/* Zone 4 : VIP + Promo combiné */}
      <PromoVip />
      {/* Zone 5 : Historique des gains */}
      <WinHistory />
      {/* Zone 6 : Témoignages — Social Proof */}
      <Testimonials />
    </>
  )
}

function NotFoundPage() {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>404 – Page non trouvée | BttsBet</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-black text-white mb-4">404</h1>
          <p className="text-xl text-gray-400 mb-2">Page non trouvée</p>
          <p className="text-gray-500 mb-8">La page que vous recherchez n'existe pas ou a été déplacée.</p>
          <a
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-full hover:shadow-lg hover:shadow-emerald/30 transition-all"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-dark-900 relative">
        {/* Skip to content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald focus:text-dark-900 focus:font-bold focus:rounded-lg"
        >
          Aller au contenu principal
        </a>

        {/* 3D Background Layer — desktop only, responsive */}
        <Scene3DWrapper />

        {/* Floating Elements Layer */}
        <FloatingElements />

        {/* Cursor Glow Effect */}
        <CursorEffect />

        {/* Main Content */}
        <main id="main-content" className="relative z-10">
          <Navbar />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogArticlePage />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="/jouer-responsable" element={<JouerResponsable />} />
              <Route path="/cgu" element={<CGU />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Footer />
        </main>

        {/* Scroll to Top Button */}
        <ScrollToTop />

        {/* Age Verification Modal (18+) */}
        <AgeVerification />

        {/* Cookie Consent Banner (RGPD) */}
        <CookieConsent />
      </div>
    </ErrorBoundary>
  )
}
