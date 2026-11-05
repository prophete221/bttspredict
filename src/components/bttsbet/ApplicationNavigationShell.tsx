'use client'

import type { ReactNode } from 'react'
import Navbar from './Navbar'
import { GlobalNavigationContext } from './NavigationContext'

export default function ApplicationNavigationShell({ children }: { children: ReactNode }) {
  return (
    <GlobalNavigationContext.Provider value>
      <Navbar global />
      {children}
    </GlobalNavigationContext.Provider>
  )
}
