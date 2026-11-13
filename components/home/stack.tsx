'use client'

import Image from '@/components/ui/photo'
import Link from 'next/link'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { activityGroups, groupOf, type Experience } from '@/data/experiences'
import { listingOf, statusOf } from '@/data/programmes'
import { timesFor } from '@/lib/booking/cart'
import { Cta } from '@/components/booking/book'
import { ctaOf } from '@/lib/booking/cta'
import { LayoutMotion } from '@/components/layout/motion-provider'
import { useEventsStore } from '@/lib/stores/events'

const ease = [0.19, 1, 0.22, 1] as const
const rise = { hidden: { opacity: 0, y: 40 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: i * 0.08 } }) }

// The most-booked activities lead and carry a badge; Bond Safari (underwater scooter) is paused, so it goes last
const bestsellers = ['scuba-diving', 'snorkeling']
const rank = (e: Experience) => bestsellers.includes(e.slug) ? bestsellers.indexOf(e.slug) - 10 : statusOf(e.slug) === 'paused' ? 10 : 0
const tabs = ['All', ...activityGroups] as const
type Tab = typeof tabs[number]

const amount = (e: Experience) => Number(e.price?.replace(/[^\d]/g, '') || 0)

// The next fixed departure for dive activities, from the same schedule the booking flow offers, in Kovalam time.
// Only a schedule, not a seat count: there is no live availability to claim scarcity from
const istMinutes = () => { const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()); return +p.find(x => x.type === 'hour')!.value * 60 + +p.find(x => x.type === 'minute')!.value }
const minutesOf = (t: string) => { const [, h, mm, ap] = t.match(/(\d+):(\d+) (AM|PM)/)!; return (+h % 12 + (ap === 'PM' ? 12 : 0)) * 60 + +mm }
// Half an hour's notice before a departure counts as still bookable today
const everyMinute = (tick: () => void) => { const t = setInterval(tick, 60_000); return () => clearInterval(t) }
const nextDeparture = (slug: string, now: number) => {
  const times = timesFor(slug).map(t => t.id).filter(t => /^\d+:\d\d [AP]M$/.test(t))
  if (!times.length) return undefined
  const next = times.find(t => minutesOf(t) > now + 30)
  return next ? `Next: today ${next}` : `Next: tomorrow ${times[0]}`
}

// One card per activity: the whole card opens its page, the Book button goes straight to booking
function Card({ e, i, now }: { e: Experience; i: number; now?: number }) {
  const reduce = useReducedMotion()
  const status = statusOf(e.slug)
  const cta = ctaOf(e.title, status)
  const soon = now !== undefined && status === 'bookable' ? nextDeparture(e.slug, now) : undefined
  return <m.article layout={!reduce} className={`tg-card${status === 'paused' ? ' is-paused' : ''}`}
    initial={{ opacity: 0, y: reduce ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
    transition={{ duration: reduce ? 0 : 0.5, ease, delay: reduce ? 0 : Math.min(i, 7) * 0.04 }}>
    <div className="tg-media">
      <Image src={e.image} alt="" fill sizes="(max-width: 800px) 80vw, (max-width: 1100px) 33vw, 25vw" style={{ objectPosition: e.imagePosition }} />
      {bestsellers.includes(e.slug) && <span className="tg-badge tg-badge-best"><Sparkles /> Bestseller</span>}
      {status === 'paused' && <span className="tg-badge tg-badge-paused">Paused for now</span>}
      {soon && <span className="tg-soon"><i aria-hidden="true" />{soon}</span>}
    </div>
    <div className="tg-body">
      <h3><Link href={`/activities/${e.slug}`}>{e.title}</Link></h3>
      <p className="tg-facts"><span><MapPin /> {e.location ?? listingOf(e.slug)?.location ?? 'Kovalam'}</span><span><Clock /> {e.duration}</span></p>
      <p className="tg-tag">{e.tagline}</p>
      <div className="tg-foot">
        <p className="tg-price">{e.price ? <><b>{e.price.replace(' per person', '')}</b><small>per person</small></> : <small className="tg-ask">Contact for price</small>}</p>
        <Cta cta={cta} className="tg-book" label={`${cta.label}: ${e.title}`}>{cta.external ? 'Enquire' : 'Book now'}<ArrowRight /></Cta>
      </div>
    </div>
  </m.article>
}

export function ExperienceStack({ initial = [] }: { initial?: Experience[] }) {
  const stored = useEventsStore(s => s.activities)
  const loaded = useEventsStore(s => s.loaded)
  const activities = loaded || !initial.length ? stored : initial
  const fetchEvents = useEventsStore(s => s.fetchEvents)
  useEffect(() => { if (!initial.length) void fetchEvents() }, [fetchEvents, initial.length])
  const [tab, setTab] = useState<Tab>('All')
  const list = [...activities].sort((a, b) => rank(a) - rank(b))
  const homeList = list.slice(0, 10)
  const countOf = (t: Tab) => t === 'All' ? list.length : list.filter(e => groupOf(e) === t).length
  const shown = tab === 'All' ? homeList : list.filter(e => groupOf(e) === tab).slice(0, 10)
  const fromPrice = Math.min(...activities.map(amount).filter(Boolean)).toLocaleString('en-IN')
  // Kovalam time, read in the browser (so the server render never disagrees) and refreshed every minute
  const now = useSyncExternalStore(everyMinute, istMinutes, () => undefined)

  return <section className="hs tg" aria-labelledby="hs-title">
    <m.div className="hs-head" initial="hidden" whileInView="show" viewport={{ once: true }}>
      <div><m.p className="eyebrow" variants={rise}>Choose your horizon</m.p><m.h2 id="hs-title" variants={rise} custom={1}>Activities<br /><i>worth booking.</i></m.h2></div>
      <m.div className="hs-head-side" variants={rise} custom={2}>
        <p>{list.length} activities in and around Kovalam, all gear included. From <b>₹{fromPrice}</b> per person.</p>
        <Link className="text-link" href="/activities">View all activities <ArrowRight /></Link>
      </m.div>
    </m.div>

    <LayoutMotion>
      <div className="xp-filter tg-tabs" role="toolbar" aria-label="Filter activities">
        <div className="xp-filter-chips">
          {tabs.filter(countOf).map(t => <button key={t} type="button" aria-pressed={tab === t} className={tab === t ? 'is-on' : ''} onClick={() => setTab(t)}>
            {tab === t && <m.span layoutId="tg-chip" className="xp-chip-bg" transition={{ duration: 0.5, ease }} />}
            <span>{t}</span><em>{countOf(t)}</em>
          </button>)}
        </div>
        <p className="xp-filter-count" aria-live="polite">Showing <b>{shown.length}</b> of {list.length}</p>
      </div>
      <m.div layout className="tg-grid">
        <AnimatePresence mode="popLayout">{shown.map((e, i) => <Card key={e.slug} e={e} i={i} now={now} />)}</AnimatePresence>
      </m.div>
    </LayoutMotion>
  </section>
}
