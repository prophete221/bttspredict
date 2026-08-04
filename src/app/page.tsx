'use client'

import { Navbar, Hero, FreePredictions, VipSection, Footer } from '@/components'

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-void)' }}>
      <Navbar />
      <main>
        <Hero />
        <FreePredictions />
        <VipSection />
      </main>
      <Footer />
    </div>
  )
}
