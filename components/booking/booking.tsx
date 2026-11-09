'use client'

import Image from '@/components/ui/photo'
import { useRouter } from 'next/navigation'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Clock, Minus, Phone, Plus, Users, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { contact, whatsappLink } from '@/data/site'
import { MAX_GROUP, addItem, clashes, inr, longDate, optionOf, options, peopleRange, priceLabel, problems, requestMessage, timePhrase, timesFor, totals, unitPrice, type Cart, type Option } from '@/lib/booking/cart'
import { Header } from '@/components/layout/header'
import { useEventsStore } from '@/lib/stores/events'
import { NotBookable, openCheckout, prepareCheckout } from '@/lib/booking/checkout'

const ease = [0.19, 1, 0.22, 1] as const
const steps = ['When & who', 'Activities', 'Times & price', 'Your details']
const STORE = 'bs-booking-cart'
const LEFT = 'bs-booking-left'

// Deep links name the product by title (?activity=Scuba+Diving) or slug (?activity=scuba-diving)
const norm = (s: string) => s.trim().toLowerCase().replace(/[+_]/g, ' ').replace(/\s+/g, ' ')
const findOption = (key: string | null) => key ? options.find(o => o.slug === key.trim().toLowerCase() || norm(o.title) === norm(key) || (o.altTitle && norm(o.altTitle) === norm(key))) : undefined

// Dates are handled as local yyyy-mm-dd so a guest in India never gets the previous day
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const fromIso = (s: string) => { const [y, mo, d] = s.split('-').map(Number); return new Date(y, mo - 1, d) }
const people = (n: number) => `${n} ${n === 1 ? 'person' : 'people'}`

function Stepper({ value, min, max, onChange, label }: { value: number; min: number; max: number; onChange: (n: number) => void; label: string }) {
  return <div className="bk-stepper">
    <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Remove a person from ${label}`}><Minus /></button>
    <output aria-live="polite">{value}</output>
    <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Add a person to ${label}`}><Plus /></button>
  </div>
}

export function BookingFlow() {
  const fetchEvents = useEventsStore(s => s.fetchEvents)
  const eventsLoaded = useEventsStore(s => s.loaded)
  useEffect(() => { void fetchEvents() }, [fetchEvents])
  // Activities that exist only in the events API can't be matched until they load, so the deep link is read again then
  useEffect(() => {
    const o = eventsLoaded ? findOption(new URLSearchParams(window.location.search).get('activity')) : undefined
    if (!o) return
    setCart(c => c.items.length ? c : { ...c, items: addItem([], o.slug, c.group) })
    setTab(o.kind)
  }, [eventsLoaded])
  const reduce = useReducedMotion()
  const top = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [step, setStep] = useState(1)
  const [tab, setTab] = useState<'activity' | 'course'>('activity')
  const [cart, setCart] = useState<Cart>({ date: '', group: 1, items: [] })
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' })
  const [tried, setTried] = useState(false)
  const [note, setNote] = useState('')
  const [paying, setPaying] = useState('')
  const [payFailed, setPayFailed] = useState(false)
  const [enquiryOnly, setEnquiryOnly] = useState<string[]>([])

  const today = useMemo(() => new Date(), [])
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i); return iso(d) }), [today])
  const t = totals(cart)
  const isCourse = cart.items.length > 0 && cart.items.every(i => optionOf(i.slug)?.kind === 'course')

  // Every new arrival (a Book button, a campaign or WhatsApp link) starts a fresh booking on the first step with just
  // that product. Only a refresh, or coming back with the browser's back button, restores the unfinished booking.
  const started = useRef(false)
  useEffect(() => {
    // Runs once (React re-runs effects in development): the refresh flag is read and cleared exactly here
    if (started.current) return
    started.current = true
    let saved: { step?: number; cart?: Cart; customer?: { name: string; phone: string; email: string } } = {}
    let returning = false
    try {
      // A refresh or Back to this same booking page, not a new visit that happens to follow one
      const nav = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type
      returning = sessionStorage.getItem(LEFT) === window.location.href && (nav === 'reload' || nav === 'back_forward')
      sessionStorage.removeItem(LEFT)
      if (returning) saved = JSON.parse(sessionStorage.getItem(STORE) ?? '{}')
    } catch {}
    const q = new URLSearchParams(window.location.search)
    const o = findOption(q.get('activity'))
    const d = q.get('date'); const g = Number(q.get('guests'))
    const min = iso(new Date())
    let next: Cart = returning && saved.cart && Array.isArray(saved.cart.items) ? saved.cart : { date: '', group: 1, items: [] }
    if (!(next.group >= 1 && next.group <= MAX_GROUP)) next = { ...next, group: 1 }
    if (next.date && next.date < min) next = { ...next, date: '' }
    const group = next.group
    next = { ...next, items: next.items.filter(i => optionOf(i.slug)).map(i => ({ ...i, people: Math.min(Math.max(1, i.people), group) })) }
    let s = returning && saved.step && saved.step <= 3 ? saved.step : 1
    if (!returning) {
      if (d && /^\d{4}-\d{2}-\d{2}$/.test(d) && d >= min) next = { ...next, date: d }
      if (g >= 1 && g <= MAX_GROUP) next = { ...next, group: g }
      if (o) { next = { ...next, items: addItem([], o.slug, next.group) }; setTab(o.kind) }
      s = 1
    }
    setCart(next); setStep(s)
    if (returning && saved.customer) setCustomer(saved.customer)
    setReady(true)
  }, [])
  // The page is being unloaded (refresh, or leaving for another site): remember to restore on the way back
  useEffect(() => {
    const left = () => { try { sessionStorage.setItem(LEFT, window.location.href) } catch {} }
    window.addEventListener('pagehide', left)
    return () => window.removeEventListener('pagehide', left)
  }, [])
  useEffect(() => { if (ready) try { sessionStorage.setItem(STORE, JSON.stringify({ step, cart, customer })) } catch {} }, [ready, step, cart, customer])

  const router = useRouter()
  // Top Back button: previous step, or (on the first step) the page the guest came from, else the home page
  const back = () => { if (step > 1) return go(step - 1); if (window.history.length > 1) router.back(); else router.push('/') }
  const go = (n: number) => { setStep(n); setTried(false); top.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }) }
  const setGroup = (group: number) => setCart(c => ({ ...c, group, items: c.items.map(i => ({ ...i, people: Math.min(i.people, peopleRange(optionOf(i.slug), group).max) })) }))
  const toggle = (o: Option) => {
    if (cart.items.some(i => i.slug === o.slug)) { setNote(''); setCart(c => ({ ...c, items: c.items.filter(i => i.slug !== o.slug) })); return }
    const items = addItem(cart.items, o.slug, cart.group)
    const dropped = cart.items.some(i => !items.some(x => x.slug === i.slug))
    setNote(dropped ? (o.kind === 'course' ? 'Courses are booked separately from activities, so your activities were removed.' : `Courses are booked separately from activities, so your ${cart.items.length > 1 ? 'courses were' : 'course was'} removed.`) : '')
    setCart(c => ({ ...c, items }))
  }
  const update = (slug: string, patch: Partial<{ people: number; time: string }>) => setCart(c => ({ ...c, items: c.items.map(i => i.slug === slug ? { ...i, ...patch } : i) }))

  const phoneOk = customer.phone.replace(/\D/g, '').length >= 10
  const nameOk = customer.name.trim().length >= 2
  const stepProblems = problems(cart, Math.min(step, 3))
  const canNext = !stepProblems.length && (step < 4 || (nameOk && phoneOk))

  // The checkout sells one event at a time: a single activity uses the main button, several get a Pay button each
  const payable = t.lines.flatMap(l => l.option?.eventSlug && !enquiryOnly.includes(l.option.eventSlug) ? [{ title: l.option.title, eventSlug: l.option.eventSlug }] : [])
  const payKey = payable.map(p => p.eventSlug).join()
  const payDirect = t.lines.length === 1 && payable.length === 1
  // The widget is a large download, so it starts loading as soon as the guest reaches this step
  const isEnquiryOnly = useCallback((eventSlug: string, error: unknown) => {
    if (!(error instanceof NotBookable)) return false
    setEnquiryOnly(list => list.includes(eventSlug) ? list : [...list, eventSlug])
    return true
  }, [])
  useEffect(() => { if (step === 4 && payKey) payKey.split(',').forEach(s => { prepareCheckout(s).catch(e => { isEnquiryOnly(s, e) }) }) }, [step, payKey, isEnquiryOnly])
  const sendRequest = () => { window.open(whatsappLink(requestMessage(cart, customer)), '_blank', 'noopener,noreferrer') }
  const pay = async (eventSlug: string) => {
    if (!canNext) { setTried(true); return }
    if (paying) return
    setPaying(eventSlug); setPayFailed(false)
    try { await openCheckout(eventSlug) } catch (e) { if (!isEnquiryOnly(eventSlug, e)) setPayFailed(true) } finally { setPaying('') }
  }

  const next = () => {
    if (!canNext) { setTried(true); return }
    if (step < 4) return go(step + 1)
    if (payDirect && !payFailed) return void pay(payable[0].eventSlug)
    // Anything the checkout can't take goes to the team on WhatsApp, who confirm the slots and share how to pay
    sendRequest()
  }

  // A preselected date may sit off-screen in the chip row: bring it into view
  const dayRow = useCallback((el: HTMLDivElement | null) => { const on = el?.querySelector<HTMLElement>('.is-on'); if (el && on) el.scrollLeft = on.offsetLeft - (el.clientWidth - on.offsetWidth) / 2 }, [])
  const fade = { initial: { opacity: 0, y: reduce ? 0 : 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.45, ease } }

  const summary = <div className="bk-sum">
    {t.lines.map(l => <div key={l.item.slug} className="bk-sum-row">
      <div><b>{l.option?.title}</b><small>{cart.date && longDate(cart.date)}{l.item.time ? ` · ${l.item.time}` : ''} · {people(l.item.people)}{l.unit ? ` × ${inr(l.unit)}` : ''}</small></div>
      <strong>{l.unit ? inr(l.subtotal) : 'On request'}</strong>
    </div>)}
    <div className="bk-sum-total">
      <div><b>Total</b><small><Users /> {people(cart.group)} · {t.places} {isCourse ? 'course' : 'activity'} {t.places === 1 ? 'place' : 'places'}</small></div>
      <strong>{t.total ? inr(t.total) : 'On request'}</strong>
    </div>
    {t.unpriced.length > 0 && t.total > 0 && <p className="bk-note">{t.unpriced.join(', ')}: price confirmed on WhatsApp, not included in the total.</p>}
  </div>

  return <main className="booking-page bk">
    <Header />
    <div className="bk-shell" ref={top}>
      <div className="bk-head">
        <button type="button" className="bk-top-back" onClick={back}><ArrowLeft /> {step > 1 ? `Back to ${steps[step - 2].toLowerCase()}` : 'Back'}</button>
        <h1>Book your <i>adventure</i></h1>
        <ol className="bk-progress" aria-label="Booking steps">
          {steps.map((s, i) => <li key={s} className={step === i + 1 ? 'is-now' : step > i + 1 ? 'is-done' : ''} aria-current={step === i + 1 ? 'step' : undefined}>
            <span>{step > i + 1 ? <Check /> : i + 1}</span><em>{s}</em>
          </li>)}
        </ol>
      </div>

      {step > 1 && <div className="bk-chosen bk-context">
        <div><b>{cart.date ? longDate(cart.date) : 'No date yet'}</b><small><Users /> Group of {cart.group}</small></div>
        <button type="button" onClick={() => go(1)}>Change</button>
      </div>}

      <AnimatePresence mode="wait">
        {step === 1 && <m.section key="s1" className="bk-step" {...fade}>
          <h2>{isCourse ? 'When would you like to start?' : 'When are you coming?'}</h2>
          {cart.items.length > 0 && <p className="bk-pre"><Check /> {cart.items.map(i => optionOf(i.slug)?.title).join(', ')} added</p>}
          <div className="bk-days" ref={dayRow}>
            {days.map((d, i) => { const dt = fromIso(d); return <button key={d} type="button" className={cart.date === d ? 'bk-day is-on' : 'bk-day'} onClick={() => setCart(c => ({ ...c, date: d }))} aria-pressed={cart.date === d}>
              <small>{i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dt.toLocaleDateString('en-IN', { weekday: 'short' })}</small>
              <b>{dt.getDate()}</b>
              <small>{dt.toLocaleDateString('en-IN', { month: 'short' })}</small>
            </button> })}
          </div>
          <label className="bk-other">Need a later date? <input type="date" min={days[0]} value={cart.date && !days.includes(cart.date) ? cart.date : ''} onChange={e => setCart(c => ({ ...c, date: e.target.value }))} /></label>
          {tried && !cart.date && <p className="bk-error">Please choose a date.</p>}

          <div className="bk-guests">
            <div><b>How many people in your group?</b><small>Everyone coming, even if they don’t join every activity</small></div>
            <Stepper value={cart.group} min={1} max={MAX_GROUP} onChange={setGroup} label="your group" />
          </div>
          <p className="bk-note">More than {MAX_GROUP} people? <a href={whatsappLink(`Hello Bond Safari! We’re a group of more than ${MAX_GROUP} and would like to plan a visit.`)} target="_blank" rel="noreferrer">Message us on WhatsApp</a>.</p>
        </m.section>}

        {step === 2 && <m.section key="s2" className="bk-step" {...fade}>
          <h2>What would you like to do?</h2>
          <p className="bk-sub">{tab === 'course' ? 'Add as many courses as you like, and choose how many of your group join each one.' : 'Add as many activities as you like, and choose how many of your group join each one.'}</p>
          <div className="bk-tabs" role="tablist">
            {(['activity', 'course'] as const).map(k => <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>
              {k === 'activity' ? 'Activities' : 'Courses'}<em>{options.filter(o => o.kind === k).length}</em>
            </button>)}
          </div>
          {note && <p className="bk-info">{note}</p>}
          <div className="bk-list">
            {options.filter(o => o.kind === tab).map(o => {
              const item = cart.items.find(i => i.slug === o.slug)
              const r = peopleRange(o, cart.group)
              return <div key={o.slug} className={item ? 'bk-act is-on' : 'bk-act'}>
                <button type="button" className="bk-act-head" onClick={() => toggle(o)} aria-pressed={!!item}>
                  <span className="bk-thumb"><Image src={o.image} alt="" fill sizes="64px" style={{ objectPosition: o.imagePosition }} /></span>
                  <span className="bk-option-body"><b>{o.title}</b><small><Clock /> {o.duration} · {priceLabel(o)}{o.price ? ' / person' : ''}</small></span>
                  <span className="bk-act-toggle">{item ? <><Check /> Added</> : <><Plus /> Add</>}</span>
                </button>
                {item && <div className="bk-act-people">
                  <div><b>People</b><small>{o.minAge ? `Min. age ${o.minAge} · ` : ''}up to {r.max}</small></div>
                  <Stepper value={item.people} min={r.min} max={r.max} onChange={n => update(o.slug, { people: n })} label={o.title} />
                  <strong>{unitPrice(o) ? inr(unitPrice(o) * item.people) : 'On request'}</strong>
                </div>}
              </div>
            })}
          </div>
        </m.section>}

        {step === 3 && <m.section key="s3" className="bk-step" {...fade}>
          <h2>{isCourse ? `Check your ${cart.items.length > 1 ? 'courses' : 'course'}` : 'Pick a time for each'}</h2>
          {!isCourse && <p className="bk-sub">Preferred times are optional. We confirm the exact slot on WhatsApp.</p>}
          {!isCourse && <div className="bk-items">
            {t.lines.map(l => <div key={l.item.slug} className="bk-item">
              <div className="bk-item-head">
                <div><b>{l.option?.title}</b><small>{people(l.item.people)}</small></div>
                <button type="button" onClick={() => setCart(c => ({ ...c, items: c.items.filter(i => i.slug !== l.item.slug) }))} aria-label={`Remove ${l.option?.title}`}><X /></button>
              </div>
              <div className="bk-times">
                {timesFor(l.item.slug).map(tm => <button key={tm.id} type="button" className={l.item.time === tm.id ? 'is-on' : ''} aria-pressed={l.item.time === tm.id} onClick={() => update(l.item.slug, { time: l.item.time === tm.id ? '' : tm.id })}><b>{tm.id}</b>{tm.hint && <small>{tm.hint}</small>}</button>)}
              </div>
            </div>)}
          </div>}
          {clashes(cart).map(c => <p key={c.time} className="bk-warn" role="alert"><AlertTriangle /> {c.titles.join(' and ')} are both {timePhrase(c.time)}, but your group has {people(cart.group)}. Choose different times, or fewer people.</p>)}
          {!cart.items.length && <p className="bk-error">Add at least one activity. <button type="button" className="bk-link" onClick={() => go(2)}>Choose activities</button></p>}
          {cart.items.length > 0 && <><h3 className="bk-h3">Your booking</h3>{summary}</>}
        </m.section>}

        {step === 4 && <m.section key="s4" className="bk-step" {...fade}>
          <h2>Who should we confirm with?</h2>
          <div className="bk-fields">
            <label className={tried && !nameOk ? 'is-bad' : ''}>Your name<input value={customer.name} onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))} autoComplete="name" placeholder="Full name" />{tried && !nameOk && <em>Please enter your name.</em>}</label>
            <label className={tried && !phoneOk ? 'is-bad' : ''}>WhatsApp number<input value={customer.phone} onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))} type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" />{tried && !phoneOk && <em>Please enter a valid number.</em>}</label>
            <label><span className="bk-field-name">Email <i>(optional)</i></span><input value={customer.email} onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))} type="email" autoComplete="email" placeholder="you@example.com" /></label>
          </div>
          <h3 className="bk-h3">Your booking</h3>
          {summary}
          {payable.length > 0 && !payDirect && <div className="bk-pay">
            <h3 className="bk-h3">Pay online</h3>
            {payable.map(p => <div key={p.eventSlug} className="bk-pay-row"><b>{p.title}</b><button type="button" onClick={() => void pay(p.eventSlug)} disabled={!!paying}>{paying === p.eventSlug ? 'Opening…' : 'Pay'}</button></div>)}
          </div>}
          {payFailed && <p className="bk-error" role="alert">Online payment couldn’t open. Please try again, or send your request on WhatsApp.</p>}
          {payable.length > 0
            ? <p className="bk-note">{payDirect ? 'Secure checkout opens next, where you choose your date and enter your details for payment.' : 'Each activity is paid separately in a secure checkout, where you choose its date and enter your details.'}{payDirect && !payFailed && <> Prefer to talk first? <button type="button" className="bk-link" onClick={() => canNext ? sendRequest() : setTried(true)}>Send your request on WhatsApp</button>.</>}{!payDirect && ' Or use Book now to send everything to our team on WhatsApp.'}</p>
            : <p className="bk-note">No payment now. We confirm your slots on WhatsApp first, then share how to pay.</p>}
        </m.section>}
      </AnimatePresence>

      {/* On the times step a clash already has its own warning above */}
      {tried && stepProblems.length > 0 && step > 1 && !(step === 3 && clashes(cart).length) && <p className="bk-error" role="alert">{stepProblems[0]}</p>}

      <div className="bk-actions">
        {step > 1 ? <button type="button" className="bk-back" onClick={() => go(step - 1)} aria-label="Back"><ArrowLeft /></button> : <a className="bk-back" href={`tel:${contact.phones[0].replace(/\s/g, '')}`} aria-label="Call us"><Phone /></a>}
        <div className="bk-total">{cart.items.length ? <><b>{t.total ? inr(t.total) : 'On request'}</b><small>{people(cart.group)} · {t.places} {t.places === 1 ? 'place' : 'places'}</small></> : <><b>Group of {cart.group}</b><small>{cart.date ? longDate(cart.date) : 'Pick a date'}</small></>}</div>
        <button type="button" className={`book-cta book-cta-sm${canNext ? '' : ' is-off'}`} onClick={next}>
          <span className="book-cta-label"><strong>{step < 4 ? 'Continue' : !payDirect || payFailed ? 'Book now' : paying ? 'Opening…' : 'Pay now'}</strong></span>
          <span className="book-cta-icon"><ArrowRight /></span>
        </button>
      </div>
    </div>
  </main>
}
