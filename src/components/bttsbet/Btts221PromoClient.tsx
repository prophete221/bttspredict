'use client'

import Star888PromoClient from '@/components/bttsbet/Star888PromoClient'

type Lang = 'fr' | 'en' | 'ar'

export default function Btts221PromoClient({ lang }: { lang: Lang; reviewDate?: string }) {
  return <Star888PromoClient lang={lang} variant="code" />
}
