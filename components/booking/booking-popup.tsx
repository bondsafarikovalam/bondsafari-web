'use client'

import Image from '@/components/ui/photo'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ArrowRight, Expand, Phone, X } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { experiences } from '@/data/experiences'
import { courses } from '@/data/courses'
import { contact } from '@/data/site'
import { Picker } from '@/components/booking/picker'

const KEY = 'bs-booking-popup-seen'
const ease = [0.19, 1, 0.22, 1] as const
const activityGroups = [{ label: 'Activities', options: experiences.map(e => ({ value: e.title })) }, { label: 'Courses', options: courses.map(c => ({ value: c.title })) }]
// Everything the popup can book, by title, so its photo and details follow the chosen activity
const items = [...experiences.map(e => ({ title: e.title, kind: e.category, image: e.image, position: e.imagePosition, tagline: e.tagline, facts: [e.duration, e.price] })), ...courses.map(c => ({ title: c.title, kind: c.level, image: c.image, position: c.imagePosition, tagline: c.tagline, facts: [c.duration, c.price] }))]
const itemOf = (title: string) => items.find(i => i.title === title) ?? items[0]
const guestGroups = [{ options: [1, 2, 3, 4].map(n => ({ value: String(n), label: `${n} ${n === 1 ? 'guest' : 'guests'}` })) }]

// Detail pages map to the item they show, so the popup can open with it preselected
const detailTitle = (path: string) => {
  const [, section, slug] = path.split('/')
  if (section === 'activities') return experiences.find(e => e.slug === slug)?.title
  if (section === 'courses') return courses.find(c => c.slug === slug)?.title
}

// Nothing pops up on arrival. On a detail page the popup follows once the visitor has engaged
// (scrolled a little or stayed a while), preselected, once per page per session.
const DETAIL_DELAY = 8000
// How long scrolling must pause before it may open
const STILL_MS = 700
const shownKey = (path: string) => `bs-booking-popup:${path}`
const wasShown = (key: string) => { try { return sessionStorage.getItem(key) === '1' } catch { return true } }
const markShown = (key: string) => { try { sessionStorage.setItem(key, '1') } catch {} }

export function BookingPopup() {
  const pathname = usePathname()
  const router = useRouter()
  const reduce = useReducedMotion()
  const preset = detailTitle(pathname)
  const [open, setOpen] = useState(false)
  const [activity, setActivity] = useState(preset ?? experiences[0].title)
  const [full, setFull] = useState(false)
  const fullRef = useRef(false)
  fullRef.current = full
  const item = itemOf(activity)
  const dialog = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const today = new Date().toISOString().slice(0, 10)
  const close = () => setOpen(false)

  // Navigating away closes it, so it never carries over onto the next page
  useEffect(() => { setOpen(false) }, [pathname])
  // Each opening starts from the page's own activity, with the photo in its frame
  useEffect(() => { if (open) { setActivity(preset ?? experiences[0].title); setFull(false) } }, [open, preset])

  useEffect(() => {
    if (pathname.startsWith('/booking')) { markShown(KEY); return }
    const key = preset ? shownKey(pathname) : KEY
    if (wasShown(key)) return
    let fired = false
    const show = () => {
      if (fired) return
      fired = true
      lastFocus.current = document.activeElement as HTMLElement
      setOpen(true); markShown(key); if (!preset) markShown(KEY)
    }
    // No popup on arrival: only a detail page offers it, once the visitor has engaged
    if (!preset) return
    // It never opens in the middle of a swipe: once it's due, it waits until scrolling has paused
    let due = false
    let lastScroll = 0
    let still: ReturnType<typeof setTimeout> | undefined
    const showWhenStill = () => { due = true; clearTimeout(still); still = setTimeout(show, Math.max(0, lastScroll + STILL_MS - Date.now())) }
    const t = setTimeout(showWhenStill, DETAIL_DELAY)
    // On detail pages, scrolling past the first screen means they're interested: offer to book
    const onScroll = () => {
      lastScroll = Date.now()
      if (due || window.scrollY > window.innerHeight * 0.6) showWhenStill()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(t); clearTimeout(still); window.removeEventListener('scroll', onScroll) }
  }, [pathname, preset])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      // Escape first leaves the full-size photo, then closes the popup
      if (e.key === 'Escape') { if (fullRef.current) setFull(false); else close() }
      if (e.key === 'Tab' && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>('button, select, input, a[href]')
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    requestAnimationFrame(() => dialog.current?.querySelector<HTMLElement>('.ct-select button')?.focus())
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); lastFocus.current?.focus?.() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pathname])

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const q = new URLSearchParams()
    for (const k of ['activity', 'date', 'guests']) { const v = data.get(k); if (v) q.set(k, String(v)) }
    close()
    router.push(`/booking?${q}`)
  }

  return <AnimatePresence>
    {open && <m.div key={pathname} className="bp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={() => close()}>
      <m.div ref={dialog} className="bp-dialog" role="dialog" aria-modal="true" aria-labelledby="bp-title" onClick={e => e.stopPropagation()}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }} transition={{ duration: 0.9, ease }}>
        <button className="bp-close" onClick={() => close()} aria-label="Close"><X /></button>
        <div className="bp-media" onClick={() => setFull(true)}>
          <AnimatePresence initial={false}>
            <m.div key={item.image} className="bp-media-inner" initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 0.5 }, scale: { duration: 2.2, ease } }}><span className="bp-media-bg"><Image src={item.image} alt="" fill sizes="120px" /></span><span className="bp-media-fit"><Image src={item.image} alt="" fill sizes="(max-width: 800px) 100vw, 420px" /></span></m.div>
          </AnimatePresence>
          <button type="button" className="bp-expand" onClick={() => setFull(true)} aria-label={`View the ${item.title} photo full size`}><Expand /></button>
          <AnimatePresence mode="wait" initial={false}>
            <m.div key={item.title} className="bp-media-text" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }}>
              <span>{item.kind} · Kovalam</span>
              <p>{item.title}</p>
              <small>{item.tagline}</small>
              <ul>{item.facts.filter(Boolean).map(f => <li key={f}>{f}</li>)}</ul>
            </m.div>
          </AnimatePresence>
        </div>
        <form className="bp-form" onSubmit={submit}>
          <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.25 }}>
            <p className="eyebrow">Plan your adventure</p>
            <h2 id="bp-title">Book your<br /><i>underwater day.</i></h2>
            <p className="bp-sub">No diving experience needed. Choose an adventure and we’ll take care of the rest.</p>
          </m.div>
          <m.div className="bp-fields" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.4 }}>
            <Picker className="bp-wide" label="Activity" name="activity" groups={activityGroups} defaultValue={preset ?? experiences[0].title} onChange={setActivity} />
            <label>Date<input name="date" type="date" min={today} defaultValue={today} /></label>
            <Picker label="Guests" name="guests" groups={guestGroups} defaultValue="1" />
          </m.div>
          <m.div className="bp-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.55 }}>
            <button type="submit" className="book-cta"><span className="book-cta-label"><strong>Continue</strong><small>Reserve your spot</small></span><span className="book-cta-icon"><ArrowRight /></span></button>
            <button type="button" className="bp-later" onClick={() => close()}>Maybe later</button>
          </m.div>
          <a className="bp-call" href={`tel:${contact.phones[0].replace(/\s/g, '')}`}><Phone /> Or call us · {contact.phones[0]}</a>
        </form>
      </m.div>
      <AnimatePresence>
        {full && <m.div className="bp-full" role="dialog" aria-label={`${item.title} photo`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} onClick={e => { e.stopPropagation(); setFull(false) }}>
          <m.div className="bp-full-img" initial={reduce ? false : { scale: 0.92 }} animate={{ scale: 1 }} exit={reduce ? undefined : { scale: 0.96 }} transition={{ duration: 0.6, ease }}><Image src={item.image} alt={item.title} fill sizes="960px" /></m.div>
          <button type="button" className="bp-full-close" onClick={e => { e.stopPropagation(); setFull(false) }} aria-label="Close the full-size photo"><X /></button>
        </m.div>}
      </AnimatePresence>
    </m.div>}
  </AnimatePresence>
}
