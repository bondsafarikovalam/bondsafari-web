'use client'

import Image from '@/components/ui/photo'
import Link from 'next/link'
import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, CalendarCheck, Clock, Compass, Phone, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { activityGroups, groupOf, type Experience } from '@/data/experiences'
import { contact } from '@/data/site'
import { Header } from '@/components/layout/header'
import { LayoutMotion } from '@/components/layout/motion-provider'
import { TypeKey } from '@/components/pages/programmes'
import { BookLink, Cta } from '@/components/booking/book'
import { ctaOf } from '@/lib/booking/cta'
import { statusOf } from '@/data/programmes'
import { Mask as CssMask, enter } from '@/components/layout/intro'
import { useEventsStore } from '@/lib/stores/events'

const ease = [0.19, 1, 0.22, 1] as const
const rise = { hidden: { opacity: 0, y: 40 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: i * 0.1 } }) }
const tel = contact.phones[0].replace(/\s/g, '')

// Activities sort into three moods; the filter chips are built from these
const groups = ['All', ...activityGroups] as const
const amount = (e: Experience) => Number(e.price?.replace(/[^\d]/g, '') || 0)

// The All view leads with these, in this order; everything else follows in catalogue order
const leaders = ['scuba-diving', 'dive-safari', 'parasailing', 'kayaking', 'snorkeling', 'monsoon-combo', 'freshwater-scuba']
const rank = (e: Experience) => leaders.includes(e.slug) ? leaders.indexOf(e.slug) : leaders.length

// Title lines slide up from behind their masks, in CSS so they show without waiting for JavaScript
const Mask = (props: { children: React.ReactNode; delay?: number }) => <CssMask from="105%" duration={1.6} {...props} />

function Card({ e, index }: { e: Experience; index: number }) {
  const cta = ctaOf(e.title, statusOf(e.slug))
  // Only the activity's cover from the events API (logout.world); without one the card keeps a plain background
  const cover = /^https?:\/\//i.test(e.image) ? e.image : undefined
  return <m.article layout className="xp-card" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} whileHover={{ y: -4, transition: { duration: 0.5, ease } }} transition={{ duration: 0.8, ease, delay: Math.min(index, 6) * 0.06 }}>
    <Link className="xp-card-media" href={`/activities/${e.slug}`} aria-label={`${e.title} — view details`}>
      {cover && <Image src={cover} alt="" fill sizes="(max-width: 800px) 100vw, (max-width: 1100px) 50vw, 33vw" />}
      <span className="xp-card-num">{String(index + 1).padStart(2, '0')}</span>
      <span className="xp-card-price">{e.price ? e.price.replace(' per person', '') : 'Contact for price'}{e.price && <small>/ person</small>}</span>
    </Link>
    <div className="xp-card-body">
      <p className="xp-card-meta"><span>{e.category}</span><span><Clock /> {e.duration}</span></p>
      <h3><Link href={`/activities/${e.slug}`}>{e.title}</Link></h3>
      <p className="xp-card-tag">{e.tagline}</p>
      <div className="xp-card-actions">
        <Cta cta={cta} className="book-cta book-cta-sm"><span className="book-cta-label"><strong>{cta.label}</strong></span><span className="book-cta-icon"><ArrowRight /></span></Cta>
        <Link className="xp-card-more" href={`/activities/${e.slug}`}>Details <ArrowUpRight /></Link>
      </div>
    </div>
  </m.article>
}

export function Experiences({ initial = [] }: { initial?: Experience[] }) {
  const stored = useEventsStore(s => s.activities)
  const loaded = useEventsStore(s => s.loaded)
  const activities = loaded || !initial.length ? stored : initial
  const fetchEvents = useEventsStore(s => s.fetchEvents)
  const loading = useEventsStore(s => s.loading)
  useEffect(() => { if (!initial.length) void fetchEvents() }, [fetchEvents, initial.length])
  const reduce = useReducedMotion()
  const hero = useRef<HTMLElement>(null)
  const [group, setGroup] = useState<typeof groups[number]>('All')
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.15])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '25%'])
  const heroFade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  // The sticky mobile booking bar waits until the hero's own Book button has scrolled away
  const [barShown, setBarShown] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', v => setBarShown(v > 0.75))
  const currentOrdered = useMemo(() => [...activities].sort((a, b) => rank(a) - rank(b)), [activities])
  const counts = useMemo(() => Object.fromEntries(groups.map(g => [g, g === 'All' ? activities.length : activities.filter(e => groupOf(e) === g).length])), [activities])
  const shown = group === 'All' ? currentOrdered : activities.filter(e => groupOf(e) === group)
  const fromPrice = Math.min(...activities.map(amount).filter(Boolean)).toLocaleString('en-IN')
  const experiences = activities

  const stats = [
    { icon: Compass, value: String(activities.length), label: 'Activities' },
    { icon: Sparkles, value: `₹${fromPrice}`, label: 'Starting from' },
    { icon: Users, value: '10+', label: 'Min. age, no experience needed' },
    { icon: ShieldCheck, value: 'PADI', label: 'Certified instructors' },
  ]

  return <main className="xp">
    <Header />

    <section ref={hero} className="xp-hero">
      <m.div className="xp-hero-media" style={{ scale: heroScale, y: heroY }}><Image src="/images/bond-safari.webp" alt="" fill sizes="100vw" priority /></m.div>
      <div className="xp-hero-shade" />
      <m.div className="xp-hero-content" style={{ opacity: heroFade }}>
        <p className={`eyebrow light ${enter({ y: 12, duration: 1, delay: 0.2 }).className}`} style={enter({ y: 12, duration: 1, delay: 0.2 }).style}>Activities · Kovalam, Kerala</p>
        <h1><Mask delay={0.3}>Choose your</Mask><br /><Mask delay={0.45}><i>adventure.</i></Mask></h1>
        <p className={`xp-hero-sub ${enter({ y: 16, duration: 1.2 }).className}`} style={enter({ y: 16, duration: 1.2 }).style}>Underwater scooters, guided dives, snorkelling, kayaking and coracle rides — for every age and ability, with all equipment included.</p>
        <div className={`xp-hero-actions ${enter({ y: 16, duration: 1.2, delay: 0.85 }).className}`} style={enter({ y: 16, duration: 1.2, delay: 0.85 }).style}>
          <BookLink className="book-cta" href="#all-activities"><span className="book-cta-label"><strong>Book an adventure</strong><small>From ₹{fromPrice} per person</small></span><span className="book-cta-icon"><ArrowRight /></span></BookLink>
          <a className="text-link light" href="#all-activities">Browse all {activities.length} <ArrowRight /></a>
        </div>
      </m.div>
    </section>

    <section className="xp-stats" aria-label="At a glance">
      {stats.map((s, i) => <m.div key={s.label} className="xp-stat" initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} custom={i}>
        <span className="xp-stat-icon"><s.icon /></span>
        <div><b>{s.value}</b><span>{s.label}</span></div>
      </m.div>)}
    </section>

    <section className="pg-info pg-key-wrap"><TypeKey links current="Activity" /></section>

    <section id="all-activities" className="xp-list">
      <div className="xp-list-head">
        <m.div initial="hidden" whileInView="show" viewport={{ once: true }}>
          <m.p className="eyebrow" variants={rise}>01 — All activities</m.p>
          <m.h2 variants={rise} custom={1}>Find the one<br /><i>that moves you.</i></m.h2>
        </m.div>
        <m.p className="ab-lead" initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} custom={2}>Every activity is guided by our team, includes all the gear you need, and can be booked in under a minute.</m.p>
      </div>

      <LayoutMotion>
      <div className="xp-filter" role="toolbar" aria-label="Filter activities">
        <div className="xp-filter-chips">
          {groups.filter(g => counts[g]).map(g => <button key={g} type="button" aria-pressed={group === g} className={group === g ? 'is-on' : ''} onClick={() => setGroup(g)}>
            {group === g && <m.span layoutId="xp-chip" className="xp-chip-bg" transition={{ duration: 0.5, ease }} />}
            <span>{g}</span><em>{counts[g]}</em>
          </button>)}
        </div>
        <p className="xp-filter-count" aria-live="polite">Showing <b>{shown.length}</b> of {activities.length}{loading ? ' · Loading…' : ''}</p>
      </div>

      <m.div layout className="xp-grid xp-grid-cards">
        <AnimatePresence mode="popLayout">
          {shown.map((e, i) => <Card key={e.slug} e={e} index={i} />)}
        </AnimatePresence>
      </m.div>
      </LayoutMotion>
    </section>

    <section className="xp-book">
      <div className="xp-book-inner">
        <m.div className="xp-book-copy" initial="hidden" whileInView="show" viewport={{ once: true }}>
          <m.p className="eyebrow light" variants={rise}>02 — Booking made simple</m.p>
          <m.h2 variants={rise} custom={1}>Your day at sea,<br /><i>reserved in a minute.</i></m.h2>
          <m.div className="xp-book-actions" variants={rise} custom={2}>
            <BookLink className="book-cta" href="#all-activities"><span className="book-cta-label"><strong>Book now</strong><small>Reserve your spot</small></span><span className="book-cta-icon"><ArrowRight /></span></BookLink>
            <a className="xp-book-call" href={`tel:${tel}`}><Phone /><span><small>Prefer to talk?</small>{contact.phones[0]}</span></a>
          </m.div>
        </m.div>
        <ol className="xp-steps">
          {[
            { icon: Compass, title: 'Pick an activity', text: 'Choose from underwater, on-the-water or combo adventures.' },
            { icon: CalendarCheck, title: 'Choose date & guests', text: 'Open every day, 8:30 AM – 6:30 PM — Sundays too.' },
            { icon: ShieldCheck, title: 'We take care of the rest', text: 'Briefing, gear and certified guides are all included.' },
          ].map((s, i) => <m.li key={s.title} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={rise} custom={i}>
            <span className="xp-step-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="xp-step-icon"><s.icon /></span>
            <div><h3>{s.title}</h3><p>{s.text}</p></div>
          </m.li>)}
        </ol>
      </div>
    </section>

    <div className={`dt-mobile-bar xp-bar${barShown ? ' is-shown' : ''}`} inert={!barShown}><div><b>{experiences.length} activities</b><span>From ₹{fromPrice} per person</span></div><BookLink className="book-cta book-cta-sm" href="#all-activities"><span className="book-cta-label"><strong>Book</strong></span><span className="book-cta-icon"><ArrowRight /></span></BookLink></div>
  </main>
}
