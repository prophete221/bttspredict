export const VIP_PUBLICATION_POLICY = 'verified-auto-v1'
export const VIP_PUBLICATION_TIMES = Object.freeze(['00:00', '07:00', '16:00'])

export function publicationConfigured(env) {
  return env.VIP_PUBLICATION_POLICY === VIP_PUBLICATION_POLICY
    && env.UI_ORIGIN === 'https://bttspredict.com'
    && typeof env.TELEGRAM_BOT_TOKEN === 'string' && env.TELEGRAM_BOT_TOKEN.length >= 20
    && /^-100[0-9]{6,14}$/.test(String(env.TELEGRAM_CHANNEL_ID || ''))
}
