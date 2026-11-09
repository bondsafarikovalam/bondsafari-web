import { track as vercelTrack } from '@vercel/analytics'

// Booking funnel events (step viewed, payment opened, confirmed…) so drop-off per step can be measured.
// Sends to Vercel Analytics when present and to a Google Tag Manager dataLayer if one is installed;
// it never sends personal details.
type Props = Record<string, string | number | boolean | null>

export function track(event: string, props: Props = {}) {
  try {
    vercelTrack(event, props)
    const w = window as Window & { dataLayer?: unknown[] }
    w.dataLayer?.push({ event, ...props })
  } catch {}
}
