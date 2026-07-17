import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

// ─── Service Worker: clean old caches + register passthrough SW ───
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Clean all old caches first
      if ('caches' in window) {
        const names = await caches.keys()
        await Promise.all(names.map((n) => caches.delete(n)))
      }

      // Unregister any old service workers
      const regs = await navigator.serviceWorker.getRegistrations()
      await Promise.all(regs.map((r) => r.unregister()))

      // Register the new passthrough SW (only needed for PWA install)
      const reg = await navigator.serviceWorker.register('/sw.js')
      // Force update check on load
      reg.update()
      // Periodic update check
      setInterval(() => reg.update(), 30 * 60 * 1000)
    } catch (err) {
      console.warn('SW setup failed:', err)
    }
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
