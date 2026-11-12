'use client'

import { Cta } from '@/components/booking/book'
import { ctaOf } from '@/lib/booking/cta'
import Image from '@/components/ui/photo'
import Link from 'next/link'
import { m, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, Award, Briefcase, Clock, Gauge, GraduationCap, Phone, Route, Ship, ShieldCheck, Sparkles, UserRound, Waves } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { courses, pathway } from '@/data/courses'
import { categoryPathways, coursesPage, coursesPageAliases, levelOf, listingOf, programmeOf, type Listing } from '@/data/programmes'
import { Card } from '@/components/pages/programmes'
import { contact } from '@/data/site'
import { Header } from '@/components/layout/header'
import { LayoutMotion } from '@/components/layout/motion-provider'
import { PadiPathway, type PathStep } from '@/components/sections/pathway'
import { Mask as CssMask, enter } from '@/components/layout/intro'
import { liveListing, type ApiCourse } from '@/lib/api/courses'

const ease = [0.19, 1, 0.22, 1] as const
// The course categories, each subcategory resolved to its course cards; a course only the API has joins its category as a card of its own.
// Pathway courses (EFR, Zero to Hero) already have their place in the pathway and feature below, so they don't get a card too
// Only what the API publishes is listed, in the order below, and a category left empty drops out. Without the API the whole catalogue stands in
const isLive = (live: ApiCourse[], slug: string) => !live.length || live.some(c => c.slug === slug)
const listed = new Set([...coursesPage.flatMap(g => g.subcategories.flatMap(s => s.items)), ...pathway.map(c => c.slug)])
const sectionsFrom = (live: ApiCourse[]) => coursesPage.map(g => {
  const added = live.filter(c => c.section === g.slug && !listed.has(c.slug)).map(c => ({ title: c.title, items: [c.slug] }))
  const subs = [...g.subcategories, ...added].map(s => { const items = s.items.filter(slug => isLive(live, slug)); return { ...s, items, list: items.map(slug => liveListing(live, slug)).filter((l): l is Listing => !!l) } }).filter(s => s.list.length)
  return { ...g, subs, total: subs.reduce((n, s) => n + s.list.length, 0) }
}).filter(g => g.total)
const numOf = (i: number) => String(i + 1).padStart(2, '0')
const rise = { hidden: { opacity: 0, y: 40 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: i * 0.1 } }) }
const tel = contact.phones[0].replace(/\s/g, '')
const hero = courses.find(c => c.slug === 'zero-to-hero')!
const freediverInstructor = programmeOf('freediver-instructor')!
const mermaidInstructor = programmeOf('mermaid-instructor')!
const tec50 = programmeOf('tec-50')!

// The go-pro course featured under each category's pathway
type Feature = { slug: string; image: string; imagePosition?: string; alt: string; flag: string; eyebrow: string; title: string; tagline: string; lead: string; points: { icon: typeof Award; t: string }[]; meta: string; price: string; cta: string; ctaNote: string }
const features: Record<string, Feature> = {
  'scuba-diving': { slug: hero.slug, image: hero.image, alt: 'Bond Academy trainees in a confined water session', flag: 'Career programme', eyebrow: 'Scuba · Go pro', title: 'Zero to Hero.', tagline: 'Your career starts here.', lead: hero.description,
    points: [{ icon: GraduationCap, t: '5 PADI certifications' }, { icon: Sparkles, t: 'Unlimited dives' }, { icon: Briefcase, t: '1-month internship' }, { icon: UserRound, t: '100% placement assistance' }],
    meta: `${hero.duration} · all taxes included`, price: hero.price!, cta: 'Apply now', ctaNote: 'Booking from ₹5,000' },
  freediving: { slug: freediverInstructor.slug, image: freediverInstructor.image, imagePosition: freediverInstructor.imagePosition, alt: 'A freediving instructor in the water', flag: 'Career programme', eyebrow: 'Freediving · Go pro', title: 'Freediver Instructor.', tagline: 'From student to teacher.', lead: 'Freediving has no Divemaster stage — you go from student straight to Instructor, the first freediving rating you can be employed on.',
    points: [{ icon: Clock, t: '4-day instructor course' }, { icon: Route, t: '3 routes in' }, { icon: Award, t: 'Scuba instructor crossover' }, { icon: Briefcase, t: 'First employable rating' }],
    meta: `${freediverInstructor.duration} · ${freediverInstructor.location}`, price: 'Coming soon', cta: 'Enquire now', ctaNote: 'Ask about the next batch' },
  mermaid: { slug: mermaidInstructor.slug, image: mermaidInstructor.image, imagePosition: mermaidInstructor.imagePosition, alt: 'A mermaid instructor with a monofin', flag: 'Professional rating', eyebrow: 'Mermaid · Go pro', title: 'Mermaid Instructor.', tagline: 'Teach every level.', lead: 'Teach Discover, Basic, Mermaid and Advanced Mermaid. PADI requires no scuba or freediving rating — Bond instructors hold a freediving certification as well.',
    points: [{ icon: GraduationCap, t: 'Teach all 4 mermaid levels' }, { icon: ShieldCheck, t: 'No scuba rating needed' }, { icon: Waves, t: 'Freediving-certified at Bond' }, { icon: UserRound, t: 'Minimum age 18' }],
    meta: mermaidInstructor.location, price: 'Coming soon', cta: 'Enquire now', ctaNote: 'Ask about the next batch' },
  'technical-diving': { slug: tec50.slug, image: tec50.image, imagePosition: tec50.imagePosition, alt: 'A technical diver underwater', flag: 'Technical programme', eyebrow: 'Technical · Go deeper', title: 'Tec 50.', tagline: 'The gateway to trimix.', lead: tec50.description + ' Both the trimix lane and the Tec Deep Instructor lane start here.',
    points: [{ icon: Gauge, t: 'Training to 50 m' }, { icon: Sparkles, t: 'Two decompression gases' }, { icon: Waves, t: '4 training dives' }, { icon: Route, t: 'Gateway to Tec Instructor' }],
    meta: 'Prerequisite: Tec 45 + Rescue Diver', price: 'Coming soon', cta: 'Enquire now', ctaNote: 'Register your interest' },
}
// Each category's zero-to-instructor ladder; levels are left off where every step shares one (all of Mermaid is "Mermaid")
const pathwayOf = (slug: string, live: ApiCourse[]): PathStep[] => {
  const list = categoryPathways[slug]?.filter(s => isLive(live, s)).map(s => liveListing(live, s)).filter((l): l is Listing => !!l)
  if (!list) return pathway.filter(c => isLive(live, c.slug)).map(c => { const l = liveListing(live, c.slug); return { ...c, title: l?.title ?? c.title, duration: l?.duration ?? c.duration, price: l?.price ?? c.price } })
  const steps = list.map(l => ({ slug: l.slug, title: l.title, href: l.href, duration: l.duration, price: l.price, level: levelOf(l.slug) }))
  return new Set(steps.map(s => s.level)).size > 1 ? steps : steps.map(s => ({ ...s, level: undefined }))
}

// Title lines slide up from behind their masks, in CSS so they show without waiting for JavaScript
const Mask = (props: { children: React.ReactNode; delay?: number }) => <CssMask from="105%" duration={1.6} {...props} />

export function Courses({ live = [] }: { live?: ApiCourse[] }) {
  const sections = useMemo(() => sectionsFrom(live), [live])
  const courseCount = new Set(sections.flatMap(g => g.subs.flatMap(s => s.items))).size
  const start = liveListing(live, pathway[0].slug) ?? pathway[0]
  const reduce = useReducedMotion()
  const top = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: top, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.15])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '25%'])
  const heroFade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const [barShown, setBarShown] = useState(false)
  useEffect(() => { console.log('Courses API:', live.length, live) }, [live])
  // Which category's courses are showing; a link like /courses#freediving opens that one
  const [chosen, setChosen] = useState<string>(sections[0].slug)
  const current = sections.find(g => g.slug === chosen) ?? sections[0]
  const featured = features[current.slug] ?? features['scuba-diving']
  const steps = pathwayOf(current.slug, live)
  const featuredLive = live.find(c => c.slug === featured.slug)
  const feature = featuredLive ? { ...featured, image: featuredLive.image, imagePosition: undefined, price: featuredLive.price ?? featured.price } : featured
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const open = () => { const h = coursesPageAliases[location.hash.slice(1)] ?? location.hash.slice(1); if (sections.some(g => g.slug === h)) { setChosen(h); document.getElementById('categories')?.scrollIntoView() } }
    open()
    addEventListener('hashchange', open)
    return () => removeEventListener('hashchange', open)
  }, [sections])
  const choose = (slug: string) => {
    setChosen(slug)
    history.replaceState(null, '', `#${slug}`)
    // Bring the chosen category's course list into view (it stops below the sticky header via scroll-margin-top)
    requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }))
  }
  useMotionValueEvent(scrollYProgress, 'change', v => setBarShown(v > 0.75))

  const stats = [
    { icon: Award, value: 'PADI 5★', label: 'Instructor Development Center' },
    { icon: ShieldCheck, value: 'ASAP', label: 'Kerala Govt. training partner' },
    { icon: GraduationCap, value: String(courseCount), label: 'Courses, beginner to pro' },
    { icon: Ship, value: 'Own boat', label: 'Dedicated dive boat' },
  ]

  return <main className="xp cs">
    <Header />

    <section ref={top} className="xp-hero">
      <m.div className="xp-hero-media" style={{ scale: heroScale, y: heroY }}><Image src="/images/course-open-water-hd.webp" alt="" fill sizes="100vw" priority style={{ objectPosition: "center 70%" }} /></m.div>
      <div className="xp-hero-shade" />
      <m.div className="xp-hero-content" style={{ opacity: heroFade }}>
        <p className={`eyebrow light ${enter({ y: 12, duration: 1, delay: 0.2 }).className}`} style={enter({ y: 12, duration: 1, delay: 0.2 }).style}>Bond Academy · PADI 5 Star IDC</p>
        <h1><Mask delay={0.3}>Learn to dive.</Mask><br /><Mask delay={0.45}><i>Then lead.</i></Mask></h1>
        <p className={`xp-hero-sub ${enter({ y: 16, duration: 1.2 }).className}`} style={enter({ y: 16, duration: 1.2 }).style}>Internationally recognised PADI courses in Kovalam — from your very first breath underwater to becoming an instructor.</p>
        <div className={`xp-hero-actions ${enter({ y: 16, duration: 1.2, delay: 0.85 }).className}`} style={enter({ y: 16, duration: 1.2, delay: 0.85 }).style}>
          <Cta cta={ctaOf(start.title)} className="book-cta"><span className="book-cta-label"><strong>Start with Open Water</strong><small>{start.duration} · {start.price}</small></span><span className="book-cta-icon"><ArrowRight /></span></Cta>
          <a className="text-link light" href="#pathway">See the pathway <ArrowRight /></a>
        </div>
      </m.div>
    </section>

    <section className="xp-stats" aria-label="Why Bond Academy">
      {stats.map((s, i) => <m.div key={s.label} className="xp-stat" initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} custom={i}>
        <span className="xp-stat-icon"><s.icon /></span>
        <div><b>{s.value}</b><span>{s.label}</span></div>
      </m.div>)}
    </section>

    <section id="categories" className="xp-list cp-pick">
      <div className="xp-list-head">
        <m.div initial="hidden" whileInView="show" viewport={{ once: true }}>
          <m.p className="eyebrow" variants={rise}>{courseCount} courses · {sections.length} categories</m.p>
          <m.h2 variants={rise} custom={1}>Choose a<br /><i>category.</i></m.h2>
        </m.div>
        <m.p className="ab-lead" initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} custom={2}>Tap a category to see its courses. Each one opens to the full requirements, training and next level.</m.p>
      </div>

      {/* The four categories as cards; the chosen one's courses show underneath */}
      <div className="pg-cats cp-cats" role="tablist" aria-label="Course categories">
        {sections.map((g, i) => {
          const here = g.slug === current.slug
          return <button key={g.slug} type="button" role="tab" id={`tab-${g.slug}`} aria-selected={here} aria-controls="category-courses" className={here ? 'is-current' : ''} onClick={() => choose(g.slug)}>
            <Image src={g.image} alt="" fill sizes="(max-width: 800px) 100vw, (max-width: 1100px) 50vw, 25vw" style={{ objectPosition: g.imagePosition }} />
            <span className="pg-cat-shade" />
            <span className="pg-cat-num">{numOf(i)}</span>
            <span className="pg-cat-body">
              <b>{g.title.replace(/ Courses$/, '')} <i>Courses</i></b>
              <span className="cp-explore"><span>{here ? 'Viewing courses' : 'Explore courses'}</span><span className="cp-explore-icon">{here ? <ArrowDown /> : <ArrowRight />}</span></span>
            </span>
          </button>
        })}
      </div>

      <div id="category-courses" ref={panel} className="cp-panel" role="tabpanel" aria-labelledby={`tab-${current.slug}`}>
        <div className="cp-head">
          <div>
            <p className="cp-num">{numOf(sections.indexOf(current))}.</p>
            <h2>{current.title}</h2>
            <p className="cp-sub">{current.subs.length} subcategories · {current.total} courses</p>
          </div>
        </div>
        <LayoutMotion>
          {/* Keyed by category so switching swaps the whole grid instead of animating old cards out.
              Single-course subcategories share one grid; a subcategory of several courses gets its own heading */}
          <div key={current.slug}>
            <div className="xp-grid">{current.subs.filter(s => s.list.length === 1).map((s, n) => <Card key={s.title} l={s.list[0]} index={n} />)}</div>
            {current.subs.filter(s => s.list.length > 1).map(s => <div key={s.title} className="cp-group">
              <div className="pg-group-head"><h3>{s.title}</h3><p>{s.list.length} courses</p></div>
              <div className="xp-grid">{s.list.map((l, n) => <Card key={l.slug} l={l} index={n} />)}</div>
            </div>)}
          </div>
        </LayoutMotion>
      </div>
    </section>

    {steps.length > 1 && <PadiPathway key={current.slug} id="pathway" eyebrow={`${current.title.replace(/ Courses$/, '')} · The PADI pathway`} steps={steps} />}

    {isLive(live, featured.slug) && <section className="cs-hero-course">
      <m.div key={feature.slug} className="cs-feature" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={rise}>
        <div className="cs-feature-media"><Image src={feature.image} alt={feature.alt} fill sizes="(max-width: 800px) 100vw, 50vw" style={{ objectPosition: feature.imagePosition }} /><span className="xp-card-flag"><Sparkles /> {feature.flag}</span></div>
        <div className="cs-feature-body">
          <p className="eyebrow light">{feature.eyebrow}</p>
          <h2>{feature.title}<br /><i>{feature.tagline}</i></h2>
          <p className="cs-feature-lead">{feature.lead}</p>
          <ul className="cs-feature-points">
            {feature.points.map(p => <li key={p.t}><p.icon />{p.t}</li>)}
          </ul>
          <div className="cs-feature-foot">
            <div className="cs-feature-price"><small>{feature.meta}</small><b>{feature.price}</b></div>
            {/* A featured course the API marks bookable opens the booking; otherwise it's an enquiry */}
            {(() => { const name = listingOf(feature.slug)?.title ?? feature.title; const cta = ctaOf(name, featuredLive?.bookable ? 'bookable' : 'enquire'); return <Cta cta={cta} className="book-cta"><span className="book-cta-label"><strong>{cta.book ? cta.label : feature.cta}</strong><small>{feature.ctaNote}</small></span><span className="book-cta-icon"><ArrowRight /></span></Cta> })()}
          </div>
        </div>
      </m.div>
    </section>}

    <section className="xp-book">
      <div className="xp-book-inner">
        <m.div className="xp-book-copy" initial="hidden" whileInView="show" viewport={{ once: true }}>
          <m.p className="eyebrow light" variants={rise}>Not sure where to start?</m.p>
          <m.h2 variants={rise} custom={1}>Talk to our<br /><i>course advisor.</i></m.h2>
          <m.div className="xp-book-actions" variants={rise} custom={2}>
            <Link className="book-cta" href="#categories"><span className="book-cta-label"><strong>Enrol now</strong><small>Secure your batch</small></span><span className="book-cta-icon"><ArrowRight /></span></Link>
            <a className="xp-book-call" href={`tel:${tel}`}><Phone /><span><small>Call or WhatsApp</small>{contact.phones[0]}</span></a>
          </m.div>
        </m.div>
        <ol className="xp-steps">
          {[
            { icon: GraduationCap, title: 'Choose your course', text: 'Never dived? Start with Open Water. Already certified? Level up.' },
            { icon: ShieldCheck, title: 'Pay a booking amount', text: 'Reserve your batch with a part payment — the balance before you start.' },
            { icon: Award, title: 'Train & get certified', text: 'Learn with PADI 5★★★★★ Master Instructor, IDC Staff Instructors and Elite Instructors and earn a certification recognised worldwide.' },
          ].map((s, i) => <m.li key={s.title} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={rise} custom={i}>
            <span className="xp-step-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="xp-step-icon"><s.icon /></span>
            <div><h3>{s.title}</h3><p>{s.text}</p></div>
          </m.li>)}
        </ol>
      </div>
    </section>

    <div className={`dt-mobile-bar xp-bar${barShown ? ' is-shown' : ''}`} inert={!barShown}><div><b>{courseCount} courses</b><span>{sections.map(g => g.title.replace(/( Diving)? Courses$/, '')).join(' · ')}</span></div><Link className="book-cta book-cta-sm" href="#categories"><span className="book-cta-label"><strong>Enrol</strong></span><span className="book-cta-icon"><ArrowRight /></span></Link></div>
  </main>
}
