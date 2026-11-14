'use client'

import { ArrowRight, FileDown, X } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import type { DetailItem } from '@/components/pages/detail'
import { brochurePdf } from '@/lib/brochure-pdf'
import { track } from '@/lib/analytics'
import { DOWNLOAD_BTN_ID, itineraryReady, mountItinerary } from '@/lib/booking/itinerary'

const save = (href: string, name: string) => {
  const link = document.createElement('a')
  link.href = href
  link.download = name
  link.click()
}

// The event behind a logout.world brochure link
const eventOf = (brochure?: string) => {
  const slug = brochure?.match(/^https:\/\/logout\.world\/tours\/([^/?#]+)\/pdf\//)?.[1]
  return slug && decodeURIComponent(slug)
}

// For an event on logout.world, the button opens logout.world's itinerary form (its booking widget, kept hidden),
// which takes the guest's details and downloads the event's PDF. The widget loads when the visitor points at or
// focuses the button; until it is ready, or if it can't load, the button opens our own form below.
// Our form asks for a name and number, then the PDF downloads: the event's logout.world brochure when there is one
// (it arrives as an attachment, so the page stays put), otherwise a PDF made from the page
export function Brochure({ item }: { item: DetailItem }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const opening = useRef(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const event = eventOf(item.brochure)

  const warm = () => { if (event && button.current) mountItinerary(event, button.current).catch(() => {}) }

  async function open() {
    const el = button.current
    if (!event || !el) return dialog.current?.showModal()
    // Once the widget is listening to this button, its own click handler opens its form
    if (itineraryReady(event, el)) return track('brochure_open', { product: item.title, via: 'logout' })
    if (opening.current) return
    opening.current = true
    try {
      await Promise.race([mountItinerary(event, el), new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000))])
      if (el.isConnected) el.click()
    } catch {
      dialog.current?.showModal()
    } finally {
      opening.current = false
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/brochure', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ product: item.title, name: form.get('name'), phone: form.get('phone') }) })
      const data = await res.json().catch(() => ({})) as { message?: string }
      if (!res.ok) { setError(data.message ?? 'Please check your details and try again.'); return }
      const file = `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-brochure.pdf`
      if (item.brochure) save(item.brochure, file)
      else {
        const url = URL.createObjectURL(new Blob([await brochurePdf(item) as BlobPart], { type: 'application/pdf' }))
        save(url, file)
        setTimeout(() => URL.revokeObjectURL(url), 10000)
      }
      track('brochure_download', { product: item.title })
      dialog.current?.close()
    } catch {
      setError('The brochure could not be prepared. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <>
    <button ref={button} id={event ? DOWNLOAD_BTN_ID : undefined} type="button" className="dt-card-brochure" onPointerEnter={warm} onFocus={warm} onTouchStart={warm} onClick={open}><FileDown /> Download brochure <small>PDF</small></button>
    <dialog ref={dialog} className="bc" aria-labelledby="bc-title" onClick={e => { if (e.target === dialog.current) dialog.current.close() }}>
      <button type="button" className="bp-close" onClick={() => dialog.current?.close()} aria-label="Close"><X /></button>
      <form className="bp-form" onSubmit={submit}>
        <p className="eyebrow">Brochure · PDF</p>
        <h2 id="bc-title">{item.title}</h2>
        <p className="bp-sub">Tell us who it’s for and your brochure will download straight away.</p>
        <div className="bp-fields">
          <label>Your name<input name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} /></label>
          <label>Phone number<input name="phone" type="tel" autoComplete="tel" required placeholder="+91 98765 43210" /></label>
        </div>
        {error && <p className="bc-error" role="alert">{error}</p>}
        <button type="submit" className="book-cta" disabled={busy}><span className="book-cta-label"><strong>{busy ? 'Preparing…' : 'Download brochure'}</strong></span><span className="book-cta-icon"><ArrowRight /></span></button>
      </form>
    </dialog>
  </>
}
