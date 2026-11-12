'use client'

import Image from '@/components/ui/photo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { AlertCircle, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Clock, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { useRef } from 'react'
import { contact } from '@/data/site'
import { statusLabel, type Fact, type Faq, type ItemType, type Kind, type Status, type Step } from '@/data/programmes'
import { Brochure } from '@/components/pages/brochure'
import { Cta } from '@/components/booking/book'
import { ctaOf } from '@/lib/booking/cta'
import { Header } from '@/components/layout/header'
import { Mask as CssMask, enter } from '@/components/layout/intro'

const ease = [0.19, 1, 0.22, 1] as const
const rise = { hidden: { opacity: 0, y: 36 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: i * 0.08 } }) }

export type DetailItem = { title: string; category: string; duration: string; price?: string; image: string; imagePosition?: string; eyebrow?: string; description?: string; tagline?: string; overview?: string[]; details?: string[]; brochure?: string; section: { label: string; href: string }
  // Course information: each section shows only when the course has it
  type?: ItemType; kind?: Kind; level?: string; status?: Status; location?: string; requirements?: Fact[]; performance?: Fact[]; learn?: string[]; training?: Step[]; safety?: string[]; certification?: string; next?: { title: string; href: string }; faqs?: Faq[]; verify?: string
  // Activity information from the events API
  meetingPoint?: string; mapLink?: string; ageLimit?: string; highlights?: { title?: string; text: string }[]; notes?: { title: string; items: string[] }[]; policies?: { title: string; items: string[] }[] }
export type RelatedItem = { title: string; category: string; image: string; href: string; imagePosition?: string; price?: string; duration?: string; tagline?: string; status?: Status }

// How to get a place, in one sentence, for the Location & availability section
const availability: Record<Status, string> = {
  bookable: 'Tap Book now to choose your date and pay securely online.',
  enquire: 'Dates are arranged on request. Message us and we’ll tell you the next dates and the price.',
  apply: 'Places follow a short eligibility check. Apply on WhatsApp and the Academy team will take you through the next steps and dates.',
  paused: 'This activity is paused for now. Message us to hear when it’s running again.',
  'coming-soon': 'Not running yet. Register your interest and we’ll contact you when the first dates open.',
  referred: 'Bond does not teach this level. We help you plan the route and refer you to an established partner centre.',
  experience: 'Not a course you enrol on: this rating is awarded once the teaching record is met.',
}
// What is earned at the end, in plain words
// Every certificate is PADI's; swimming is lessons only, and activities don't show this row at all
const certificationOf = (item: DetailItem) => item.kind === 'Professional rating' ? 'PADI professional rating' : item.title === 'Swimming Course' ? 'Lessons' : 'PADI certification'
const Facts = ({ rows }: { rows: Fact[] }) => <dl className="dt-facts-list">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>

// Title lines slide up from behind their masks, in CSS so they show without waiting for JavaScript
const Mask = (props: { children: React.ReactNode; delay?: number }) => <CssMask from="105%" duration={1.5} {...props} />

export function Detail({ item, related }: { item: DetailItem; related: RelatedItem[] }) {
  const reduce = useReducedMotion()
  const router = useRouter()
  // Go back within the site when we came from it, otherwise land on the listing page
  const goBack = () => { if (document.referrer.startsWith(location.origin) && history.length > 1) router.back(); else router.push(item.section.href) }
  const hero = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const slide = (dir: number) => { const t = track.current; if (t) t.scrollBy({ left: dir * t.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' }) }
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.15])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '25%'])
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const overview = item.overview?.length ? item.overview : item.description ? [item.description] : []
  const details = item.details ?? []
  const cta = ctaOf(item.title, item.status)
  const asked = item.status && item.status !== 'bookable'
  const facts = [['Duration', item.duration], ['Type', item.type ? (item.type === 'Activity' ? 'Activity' : `${item.type} · certification`) : item.category], ['Price', item.price ?? 'Contact for price'], item.location ? ['Location', item.location] : ['Good to know', item.eyebrow ?? 'All ages welcome']]
  // At a glance: only what the item records; location, price and duration already lead the page in the hero
  const age = item.requirements?.find(([k]) => k === 'Minimum age')?.[1] ?? item.ageLimit
  const depth = item.performance?.find(([k]) => /depth/i.test(k))
  const glance = ([['Level', item.level ?? item.category], age && ['Minimum age', age], depth, item.type === 'Activity' ? undefined : ['Certification', certificationOf(item)], ['Availability', statusLabel[item.status ?? 'bookable']]] as (Fact | undefined | '')[]).filter((f): f is Fact => !!f)
  const block = { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-60px' } } as const

  return <main className="dt">
    <Header />
    <section ref={hero} className="dt-hero">
      <m.div className="dt-hero-media" style={{ scale, y }}><Image src={item.image} alt={item.title} fill sizes="100vw" priority style={{ objectPosition: item.imagePosition }} /></m.div>
      <div className="dt-hero-shade" />
      <button type="button" onClick={goBack} className={`dt-back ${enter({ x: -16, duration: 1, delay: 0.15 }).className}`} style={enter({ x: -16, duration: 1, delay: 0.15 }).style}><span><ArrowLeft /></span>Back</button>
      <m.div className="dt-hero-content" style={{ opacity: fade }}>
        <nav aria-label="Breadcrumb" className={`dt-crumbs ${enter({ duration: 1, delay: 0.2 }).className}`} style={enter({ duration: 1, delay: 0.2 }).style}><Link href="/">Home</Link><span>/</span><Link href={item.section.href}>{item.section.label}</Link><span>/</span><b>{item.title}</b></nav>
        {item.type && <span data-type={item.type} className={`pg-type dt-type ${enter({ duration: 1, delay: 0.25 }).className}`} style={enter({ duration: 1, delay: 0.25 }).style}>{item.type === 'Activity' ? 'Activity · one session' : 'Course · training with certification'}</span>}
        <h1 className={item.title.length > 24 ? 'dt-title-long' : undefined}><Mask delay={0.25}>{item.title}</Mask></h1>
        <p className={`dt-tagline ${enter({ y: 16, duration: 1.2 }).className}`} style={enter({ y: 16, duration: 1.2 }).style}>{item.tagline ?? item.description}</p>
        <div className={`dt-hero-actions ${enter({ y: 16, duration: 1.2, delay: 0.75 }).className}`} style={enter({ y: 16, duration: 1.2, delay: 0.75 }).style}>
          <Cta cta={cta} className="book-cta"><span className="book-cta-label"><strong>{cta.label}</strong><small>{item.price ?? (asked ? statusLabel[item.status!] : 'Reserve your spot')}</small></span><span className="book-cta-icon"><ArrowRight /></span></Cta>
          <a className="text-link light" href="#overview">Full details <ArrowDown /></a>
        </div>
      </m.div>
      <dl className={`dt-facts ${enter({ y: 30, duration: 1.2, delay: 0.9 }).className}`} style={enter({ y: 30, duration: 1.2, delay: 0.9 }).style}>
        {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
    </section>

    <section id="overview" className="dt-body section">
      <div className="dt-main">
        <m.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <m.p className="eyebrow" variants={rise}>Overview</m.p>
          <m.p className="dt-lead" variants={rise} custom={1}>{overview[0]}</m.p>
          {overview.slice(1).map((p, i) => <m.p key={i} className="dt-copy" variants={rise} custom={2 + i}>{p}</m.p>)}
        </m.div>
        <m.div className="dt-block" {...block}>
          <m.p className="eyebrow" variants={rise}>At a glance</m.p>
          <m.div variants={rise} custom={1}><Facts rows={glance} /></m.div>
        </m.div>
        {item.highlights?.length ? <m.div className="dt-block" {...block}>
          <m.p className="eyebrow" variants={rise}>Highlights</m.p>
          <ul className="dt-steps dt-perks">{item.highlights.map((h, i) => <m.li key={h.text} variants={rise} custom={i + 1}><span><Check /></span><div>{h.title && <b>{h.title}</b>}<p>{h.text}</p></div></m.li>)}</ul>
        </m.div> : null}
        {item.learn?.length ? <m.div className="dt-highlights" {...block}>
          <m.p className="eyebrow" variants={rise}>What you will learn</m.p>
          <ul>{item.learn.map((d, i) => <m.li key={d} variants={rise} custom={i + 1}><span><Check /></span>{d}</m.li>)}</ul>
        </m.div> : null}
        {item.training?.length ? <m.div className="dt-block" {...block}>
          <m.p className="eyebrow" variants={rise}>{item.title === 'Zero to Hero' ? 'Programme stages' : 'Course structure'}</m.p>
          <ol className="dt-steps">{item.training.map((t, i) => <m.li key={t.title} variants={rise} custom={i + 1}><span>{String(i + 1).padStart(2, '0')}</span><div><b>{t.title}</b><p>{t.text}</p></div></m.li>)}</ol>
        </m.div> : null}
        {details.length > 0 && <m.div className="dt-highlights" {...block}>
          <m.p className="eyebrow" variants={rise}>What’s included</m.p>
          <ul>{details.map((d, i) => <m.li key={d} variants={rise} custom={i + 1}><span><Check /></span>{d}</m.li>)}</ul>
        </m.div>}
        {item.notes?.map(n => <m.div key={n.title} className="dt-highlights" {...block}>
          <m.p className="eyebrow" variants={rise}>{n.title}</m.p>
          <ul>{n.items.map((d, i) => <m.li key={d} variants={rise} custom={i + 1}><span><Check /></span>{d}</m.li>)}</ul>
        </m.div>)}
        {item.requirements?.length ? <m.div className="dt-block" {...block}>
          <m.p className="eyebrow" variants={rise}>Course requirements</m.p>
          <m.div variants={rise} custom={1}><Facts rows={item.requirements} /></m.div>
          {item.verify && <m.p className="dt-verify" variants={rise} custom={2}><AlertCircle /> {item.verify}</m.p>}
        </m.div> : null}
        {item.performance?.length ? <m.div className="dt-block" {...block}>
          <m.p className="eyebrow" variants={rise}>Training standards</m.p>
          <m.div variants={rise} custom={1}><Facts rows={item.performance} /></m.div>
          <m.p className="dt-note" variants={rise} custom={2}>As published by PADI. Standards can change, so we confirm the current requirements with you before you start.</m.p>
        </m.div> : null}
        {item.safety?.length ? <m.div className="dt-highlights" {...block}>
          <m.p className="eyebrow" variants={rise}>Equipment & safety</m.p>
          <ul>{item.safety.map((d, i) => <m.li key={d} variants={rise} custom={i + 1}><span><ShieldCheck /></span>{d}</m.li>)}</ul>
        </m.div> : null}
        {(item.certification || item.next) && <m.div className="dt-block" {...block}>
          <m.p className="eyebrow" variants={rise}>{item.type === 'Activity' ? 'Take it further' : 'Certification & next level'}</m.p>
          {item.certification && <m.p className="dt-copy" variants={rise} custom={1}>{item.certification}</m.p>}
          {item.next && <m.div variants={rise} custom={2}><Link className="dt-next" href={item.next.href}><small>{item.type === 'Activity' ? 'Want a certificate? Course' : 'Next level'}</small><b>{item.next.title}</b><ArrowRight /></Link></m.div>}
        </m.div>}
        <m.div className="dt-block" {...block}>
          <m.p className="eyebrow" variants={rise}>Location & availability</m.p>
          {item.location && <m.p className="dt-copy dt-where" variants={rise} custom={1}><MapPin /> {item.location}</m.p>}
          {item.meetingPoint && <m.p className="dt-copy" variants={rise} custom={2}>Meet at {item.meetingPoint}.</m.p>}
          <m.p className="dt-copy" variants={rise} custom={2}>{availability[item.status ?? 'bookable']}</m.p>
          {item.mapLink && <m.a className="text-link" href={item.mapLink} target="_blank" rel="noopener noreferrer" variants={rise} custom={3}>Get directions <ArrowUpRight /></m.a>}
        </m.div>
        {item.faqs?.length ? <m.div className="dt-block" {...block}>
          <m.p className="eyebrow" variants={rise}>Questions</m.p>
          <div className="dt-faq">{item.faqs.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
        </m.div> : null}
        {item.policies?.length ? <m.div className="dt-block" {...block}>
          <m.p className="eyebrow" variants={rise}>Before you book</m.p>
          <div className="dt-faq">{item.policies.map(p => <details key={p.title}><summary>{p.title}</summary><ul>{p.items.map(d => <li key={d}>{d}</li>)}</ul></details>)}</div>
        </m.div> : null}
      </div>
      <aside className="dt-aside">
        <m.div className="dt-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease }}>
          <p className="eyebrow">Reserve your spot</p>
          <p className="dt-card-title">{item.title}</p>
          {asked && <p className="dt-status" data-status={item.status}>{statusLabel[item.status!]}</p>}
          <p className="dt-card-price">{item.price ?? 'Contact for price'}</p>
          <ul className="dt-card-meta"><li><Clock /> {item.duration}</li>{item.location && <li><MapPin /> {item.location}</li>}{item.eyebrow && <li><Check /> {item.eyebrow}</li>}</ul>
          <Cta cta={cta} className="book-cta dt-card-cta"><span className="book-cta-label"><strong>{cta.label}</strong></span><span className="book-cta-icon"><ArrowRight /></span></Cta>
          <Brochure item={item} />
          <div className="dt-card-call"><p>Prefer to talk? We’re open {contact.hours.replace('Monday – Sunday · ', 'daily, ')}.</p>{contact.phones.map(n => <a key={n} href={`tel:${n.replace(/\s/g, '')}`}><Phone /> {n}</a>)}</div>
        </m.div>
      </aside>
    </section>

    {related.length > 0 && <section className="dt-related section">
      <div className="dt-related-head">
        <m.div initial="hidden" whileInView="show" viewport={{ once: true }}><m.p className="eyebrow" variants={rise}>Keep exploring · {related.length} more</m.p><m.h2 variants={rise} custom={1}>You might<br /><i>also love.</i></m.h2></m.div>
        <div className="dt-related-nav">
          <button type="button" aria-label="Previous suggestions" onClick={() => slide(-1)}><ArrowLeft /></button>
          <button type="button" aria-label="Next suggestions" onClick={() => slide(1)}><ArrowRight /></button>
        </div>
      </div>
      <div ref={track} className="dt-related-track">{related.map((r, i) => <m.div key={r.href} className="dt-related-slide" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={rise} custom={Math.min(i, 3)}>
        <Link className="dt-related-card" href={r.href}>
          <div className="dt-related-img"><Image src={r.image} alt={r.title} fill sizes="(max-width: 800px) 80vw, 26vw" style={{ objectPosition: r.imagePosition }} />{r.price && <span className="dt-related-price">{r.price.replace(' per person', '')}</span>}</div>
          <div className="dt-related-info"><span>{r.category}{r.duration && ` · ${r.duration}`}</span><h3>{r.title}</h3>{r.tagline && <p>{r.tagline}</p>}<i><ArrowUpRight /></i></div>
        </Link>
        {(() => { const c = ctaOf(r.title, r.status); return <Cta cta={c} className="dt-related-book">{c.external ? c.label : `Book ${r.title}`} <ArrowRight /></Cta> })()}
      </m.div>)}</div>
    </section>}

    <div className="dt-mobile-bar"><div><b>{item.title}</b><span>{item.price ?? item.duration}</span></div><Cta cta={cta} className="book-cta book-cta-sm"><span className="book-cta-label"><strong>{cta.external ? cta.label.replace(' now', '') : 'Book'}</strong></span><span className="book-cta-icon"><ArrowRight /></span></Cta></div>
  </main>
}
