import type { Metadata } from 'next'
import AviatorPageContent, { aviatorMeta } from '@/components/bttsbet/AviatorPageContent'

export const metadata: Metadata = aviatorMeta('fr')

export default function AviatorPage() {
  return <AviatorPageContent locale="fr" />
}
