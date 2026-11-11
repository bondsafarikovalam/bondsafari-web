'use client'

import { useState } from 'react'
import { openCheckout, prepareCheckout } from '@/lib/booking/checkout'
import type { CtaInfo } from '@/lib/booking/cta'

// A Book button opens the logout.world booking widget for its event. The widget (about 3 MB) starts loading when the
// visitor points at or focuses the button. If it can't open, or the event takes enquiries only, the visitor goes to
// WhatsApp instead, which is also where the link leads without JavaScript.
export function Cta({ cta, className, label, tabIndex, children }: { cta: CtaInfo; className: string; label?: string; tabIndex?: number; children: React.ReactNode }) {
  const [busy, setBusy] = useState(false)
  const event = cta.book
  if (!event) return <a className={className} href={cta.href} target="_blank" rel="noopener noreferrer" aria-label={label} tabIndex={tabIndex}>{children}</a>
  const warm = () => { prepareCheckout(event).catch(() => {}) }
  const open = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    try { await openCheckout(event) } catch { location.assign(cta.href) } finally { setBusy(false) }
  }
  return <a className={className} href={cta.href} target="_blank" rel="noopener noreferrer" aria-label={label} tabIndex={tabIndex} aria-busy={busy || undefined}
    onPointerEnter={warm} onFocus={warm} onClick={open}>{children}</a>
}
