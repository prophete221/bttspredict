import type { Metadata } from 'next'
import BTTSPredictionsTodayPage, {
  metadata as canonicalMetadata,
} from '../btts/predictions/today/page'

export const metadata: Metadata = {
  ...canonicalMetadata,
  alternates: { canonical: 'https://bttspredict.com/btts/predictions/today' },
  openGraph: {
    ...canonicalMetadata.openGraph,
    url: 'https://bttspredict.com/btts/predictions/today',
  },
}

export default function PronosticsAliasPage() {
  return <BTTSPredictionsTodayPage />
}
