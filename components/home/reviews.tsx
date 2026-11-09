'use client'

import { m } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Quote } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { business, reviews } from '@/data/site'

const ease = [0.19, 1, 0.22, 1] as const
const rise = { hidden: { opacity: 0, y: 40 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: i * 0.08 } }) }

const initials = (name: string) => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

// One row of equal review cards: swipe on phones, arrows (same as the Explore section) on larger screens
export function Reviews() {
  const { google } = business
  const track = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const update = () => { const el = track.current; if (el) setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 }) }
  useEffect(() => { update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update) }, [])
  const move = (dir: number) => { const el = track.current; const card = el?.firstElementChild as HTMLElement | null; if (el && card) el.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: 'smooth' }) }

  return <section className="rv" aria-label="Guest reviews">
    <div className="rv-head">
      <m.div initial="hidden" whileInView="show" viewport={{ once: true }}>
        <m.p className="eyebrow" variants={rise}>Guest stories</m.p>
        <m.h2 variants={rise} custom={1}>What our guests<br /><i>tell us.</i></m.h2>
        {google && <m.a className="text-link rv-more" href={google.url} target="_blank" rel="noreferrer" variants={rise} custom={2}>Read all {google.count.toLocaleString('en-IN')} Google reviews <ArrowUpRight /></m.a>}
      </m.div>
      <div className="explore-controls">
        <button onClick={() => move(-1)} disabled={edge.start} aria-label="Previous reviews"><ArrowLeft /></button>
        <button onClick={() => move(1)} disabled={edge.end} aria-label="Next reviews"><ArrowRight /></button>
      </div>
    </div>
    <m.div ref={track} className="rv-track" onScroll={update} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={rise}>
      {reviews.map(r => <figure key={r.name} className="rv-card">
        <Quote className="rv-mark" aria-hidden="true" />
        <p className="rv-title">{r.title}</p>
        <blockquote>{r.text}</blockquote>
        <figcaption>
          <span className="rv-avatar" aria-hidden="true">{initials(r.name)}</span>
          <span><b>{r.name}</b>{(r.source || r.date) && <small>{[r.source, r.date].filter(Boolean).join(' · ')}</small>}</span>
        </figcaption>
      </figure>)}
    </m.div>
  </section>
}
