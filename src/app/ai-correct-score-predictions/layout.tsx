import type { Metadata } from 'next'

// (2026-09-28) La page est un client component sans export metadata → elle
// héritait du canonical racine (deindexation) alors qu'elle figure au sitemap.
// Ce layout fournit les metadata complètes ; canonical self-contenu.
export const metadata: Metadata = {
  title: 'Pronostics de score exact par IA | BTTSPredict',
  description: 'Les scores exacts ne sont publiés que si une sélection passe les contrôles de validation. Aucun calcul local ou modèle de Poisson n’est utilisé pour inventer des pronostics. 18+.',
  alternates: {
    canonical: 'https://bttspredict.com/ai-correct-score-predictions',
    languages: {
      fr: 'https://bttspredict.com/ai-correct-score-predictions',
      en: 'https://bttspredict.com/en/ai-correct-score-predictions',
      'x-default': 'https://bttspredict.com/en/ai-correct-score-predictions',
    },
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Pronostics de score exact par IA | BTTSPredict',
    description: 'Les scores exacts ne sont publiés que si une sélection passe les contrôles de validation. Aucun calcul local ou modèle de Poisson n’est utilisé pour inventer des pronostics. 18+.',
    url: 'https://bttspredict.com/ai-correct-score-predictions',
    type: 'article',
  },
}

export default function AiCorrectScoreLayout({ children }: { children: React.ReactNode }) {
  return children
}
