'use client'

import { useState } from 'react'
import { openCheckout, prepareCheckout } from '@/lib/booking/checkout'
import type { CtaInfo } from '@/lib/booking/cta'

// A Book button opens the logout.world checkout. Its script starts loading when the visitor points at or focuses the
// button. If it can't open, the visitor goes to WhatsApp instead, which is also where the link leads without JavaScript.
export function Cta({ cta, className, label, tabIndex, children }: { cta: CtaInfo; className: string; label?: string; tabIndex?: number; children: React.ReactNode }) {
  const [busy, setBusy] = useState(false)
  if (!cta.book) return <a className={className} href={cta.href} target="_blank" rel="noopener noreferrer" aria-label={label} tabIndex={tabIndex}>{children}</a>
  const warm = () => { prepareCheckout().catch(() => {}) }
  const open = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    try { await openCheckout() } catch { location.assign(cta.href) } finally { setBusy(false) }
  }
  return <a className={className} href={cta.href} target="_blank" rel="noopener noreferrer" aria-label={label} tabIndex={tabIndex} aria-busy={busy || undefined}
    onPointerEnter={warm} onFocus={warm} onClick={open}>{children}</a>
}

// A general Book button (header, heroes, sticky bars): opens the same logout.world checkout as the product buttons.
// Without JavaScript, with a modifier key held, or if the checkout can't load, it goes to `href` as a normal link
export function BookLink({ href, className, label, onClick, children }: { href: string; className: string; label?: string; onClick?: () => void; children: React.ReactNode }) {
  const [busy, setBusy] = useState(false)
  const warm = () => { prepareCheckout().catch(() => {}) }
  const open = async (e: React.MouseEvent) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    onClick?.()
    if (busy) return
    setBusy(true)
    try { await openCheckout() } catch { location.assign(href) } finally { setBusy(false) }
  }
  return <a className={className} href={href} aria-label={label} aria-busy={busy || undefined} onPointerEnter={warm} onFocus={warm} onClick={open}>{children}</a>
}
