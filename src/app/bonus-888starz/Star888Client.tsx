'use client'

import Star888PromoClient from '@/components/bttsbet/Star888PromoClient'
import styles from '@/components/bttsbet/PromoBookmakerGlass.module.css'

export default function Star888Client(_props: { reviewDate?: string } = {}) {
  return (
    <div className={`${styles.glassPage} ${styles.star888}`}>
      <Star888PromoClient lang="fr" showDownload variant="main" />
    </div>
  )
}
