'use client'

import Image from '@/components/ui/photo'
import Link from 'next/link'
import { m, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { statusOf } from '@/data/programmes'
import { Cta } from '@/components/booking/book'
import { ctaOf, eventOfHref } from '@/lib/booking/cta'

const cards = [
  { title: 'PADI Discover Scuba Diving', kind: 'Activity', bookAs: 'PADI Discover Scuba Diving', href: '/activities/scuba-diving', image: '/images/scuba.webp', text: 'Your first breath underwater in the Arabian Sea: a short briefing, shallow-water practice, then an open-sea dive of up to 12 m with a PADI Instructor or Divemaster beside you. No swimming needed.', tagline: 'Discover the unknown world in a day!' },
  { title: 'Sea Life Safari', kind: 'Activity', bookAs: 'Sea Life Safari', href: '/activities/sea-life-safari', image: '/images/sea-life.webp', text: 'This 2.5-hour Sea Life Safari takes you through fantastic moments in the ocean’s aquarium, accompanied by a marine biologist who dives at interesting places, explaining the facts and peculiarities of the mysterious world underwater — with spectacular photo opportunities.', tagline: 'Explore the beauty above and below the sea.' },
  { title: 'Introduction to Scuba Diving', kind: 'Activity', bookAs: 'Introduction to Scuba Diving', href: '/activities/dive-safari', image: '/images/dive-safari.webp', text: 'An adrenaline-pumping way to experience the silence, the tranquillity, the weightlessness and the heart-touching beauty of the marine world. Plunge into the water for an unforgettable tour with safe, high-quality equipment.', tagline: 'Be cool, dive cool!' },
  { title: 'Swimming Course', kind: 'Course', bookAs: 'Swimming Course', href: '/courses/swimming-course', image: '/images/swimming.webp', text: 'Bond Safari Kids and Adults are unique programmes designed by national and international swim coaches. Our coordinators and instructors are trained to international standards, with a background in water safety in Trivandrum. Lessons are divided into six separate levels.', tagline: 'Swim well, live well!' },
  { title: 'Bond Safari', kind: 'Activity', bookAs: 'Bond Safari', href: '/activities/bond-safari', image: '/images/bond-safari.webp', text: 'A unique centre for scuba diving in Kerala, open to anyone without the rigours of typical diving. The self-propelled, eco-friendly electric scooter leads you effortlessly underwater so you can enjoy the magnificent marine life. All age groups can explore with BOND — no diving or scuba experience is necessary.', tagline: 'Sit down, submerge & drive off!' },
]

const n = cards.length
const pad = (v: number) => String(v).padStart(2, '0')

// Pointer-driven parallax + spotlight, written straight to CSS variables to avoid re-renders
function onMove(e: PointerEvent<HTMLDivElement>) {
  if (e.pointerType !== 'mouse') return
  const r = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
  const s = e.currentTarget.style
  s.setProperty('--mx', `${(0.5 - x) * 28}px`); s.setProperty('--my', `${(0.5 - y) * 18}px`)
  s.setProperty('--px', `${x * 100}%`); s.setProperty('--py', `${y * 100}%`)
}
function onLeave(e: PointerEvent<HTMLDivElement>) { const s = e.currentTarget.style; s.removeProperty('--mx'); s.removeProperty('--my') }

function Card({ c, i, active, pos, reduce, onSelect }: { c: typeof cards[number]; i: number; active: boolean; pos: MotionValue<number>; reduce: boolean; onSelect: () => void }) {
  // Distance from the centre slot (0 = in focus): the photo drifts against the track for depth
  const d = useTransform(pos, v => v - i)
  const imgX = useTransform(d, v => reduce ? '0%' : `${Math.max(-1, Math.min(1, v)) * 10}%`)
  const cardY = useTransform(d, v => reduce ? 0 : Math.min(Math.abs(v), 1) * 26)
  return <m.li className={active ? 'explore-card active' : 'explore-card'} aria-hidden={!active} onClick={active ? undefined : onSelect} style={{ y: cardY }}>
    <div className="explore-image" onPointerMove={active && !reduce ? onMove : undefined} onPointerLeave={onLeave}>
      <m.div className="explore-parallax" style={{ x: imgX }}><Image src={c.image} alt={c.title} fill sizes="(max-width: 800px) 86vw, 62vw" /></m.div>
      <span className="explore-shade" />
      <span className="explore-chip">{c.kind}</span>
      <span className="explore-num" aria-hidden="true">{pad(i + 1)}</span>
      <span className="explore-peek" aria-hidden="true"><small>{c.kind}</small>{c.title}</span>
    </div>
    <div className="explore-panel">
      <p className="explore-meta"><span>{pad(i + 1)}</span>{c.kind}</p>
      <h3><span>{c.title}</span></h3>
      <p className="explore-text">{c.text}</p>
      <p className="explore-tagline">{c.tagline}</p>
      <div className="explore-actions">{(() => { const cta = ctaOf(c.bookAs, eventOfHref(c.href), statusOf(c.href.split('/').pop()!)); return <Cta cta={cta} className="book-cta book-cta-sm" tabIndex={active ? 0 : -1}><span className="book-cta-label"><strong>{cta.label}</strong></span><span className="book-cta-icon"><ArrowRight /></span></Cta> })()}<Link className="explore-link" href={c.href} tabIndex={active ? 0 : -1}>Explore <ArrowRight /></Link></div>
    </div>
  </m.li>
}

function Segment({ i, pos, active, title, onSelect }: { i: number; pos: MotionValue<number>; active: boolean; title: string; onSelect: () => void }) {
  // Segment 0 is full on arrival; each later one fills as its card slides in
  const fill = useTransform(pos, v => i === 0 ? 1 : Math.max(0, Math.min(1, v - i + 1)))
  return <button onClick={onSelect} aria-label={`Show ${title}`} aria-current={active} className={active ? 'now' : ''}>
    <span><m.i style={{ scaleX: fill }} /></span>
    <em>{title}</em>
  </button>
}

export function ExploreCarousel({ photos = {} }: { photos?: Record<string, string> }) {
  // A tall scene pins the section while vertical scroll drives the track right-to-left
  const scene = useRef<HTMLElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const [step, setStep] = useState(0)
  const [index, setIndex] = useState(0)
  const reduce = !!useReducedMotion()
  // Phones swipe the track sideways (native scroll-snap); larger screens pin the section and scroll it
  const [mobile, setMobile] = useState(false)
  useEffect(() => { const mq = window.matchMedia('(max-width: 800px)'); const update = () => setMobile(mq.matches); update(); mq.addEventListener('change', update); return () => mq.removeEventListener('change', update) }, [])
  // The cards follow the scroll exactly, frame for frame: no spring, so they never trail behind the finger or drift on
  const { scrollYProgress } = useScroll({ target: scene, offset: ['start start', 'end end'] })
  // Card position (0 = first card in focus), fed by page scroll on desktop and by the swipe on phones
  const pos = useMotionValue(0)
  useMotionValueEvent(scrollYProgress, 'change', v => { if (!mobile) pos.set(v * (n - 1)) })
  const onSwipe = () => { const el = track.current; if (el && step) pos.set(Math.max(0, Math.min(n - 1, el.scrollLeft / step))) }
  const x = useTransform(pos, v => -v * step)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const measure = () => { const first = el.firstElementChild as HTMLElement | null; if (first) setStep(first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')) }
    measure()
    const ro = new ResizeObserver(measure); ro.observe(el)
    return () => ro.disconnect()
  }, [])
  useMotionValueEvent(pos, 'change', v => setIndex(Math.round(Math.max(0, Math.min(n - 1, v)))))

  const goTo = (i: number) => {
    if (mobile) { track.current?.scrollTo({ left: Math.max(0, Math.min(n - 1, i)) * step, behavior: reduce ? 'auto' : 'smooth' }); return }
    const el = scene.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (el.offsetHeight - window.innerHeight) * (Math.max(0, Math.min(n - 1, i)) / (n - 1)), behavior: reduce ? 'auto' : 'smooth' })
  }

  return <section ref={scene} className="explore-scene" style={{ '--steps': n - 1 } as React.CSSProperties} aria-roledescription="carousel" aria-label="Explore our adventures">
    <div className="explore section">
      <div className="explore-head"><div><p className="eyebrow">Explore</p><h2>Adventures<br /><i>above &amp; below.</i></h2></div>
        <div className="explore-controls"><button onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous"><ArrowLeft /></button><span className="explore-count" aria-live="polite"><b key={index}>{pad(index + 1)}</b> <i>/</i> {pad(n)}</span><button onClick={() => goTo(index + 1)} disabled={index === n - 1} aria-label="Next"><ArrowRight /></button></div>
      </div>
      <div className="explore-viewport">
        <m.ul ref={track} className="explore-track" style={mobile ? undefined : { x }} onScroll={mobile ? onSwipe : undefined}>
          {cards.map((c, i) => <Card key={c.title} c={{ ...c, image: photos[c.href] ?? c.image }} i={i} active={i === index} pos={pos} reduce={reduce} onSelect={() => goTo(i)} />)}
        </m.ul>
      </div>
      <div className="explore-progress">
        {cards.map((c, i) => <Segment key={c.title} i={i} pos={pos} active={i === index} title={c.title} onSelect={() => goTo(i)} />)}
      </div>
      <p className="explore-hint" aria-hidden="true" style={{ opacity: index === 0 ? 1 : 0 }}>Scroll to explore <ArrowRight /></p>
    </div>
  </section>
}
