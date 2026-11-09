'use client'

import Link from 'next/link'
import { m } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Newspaper } from 'lucide-react'
import { press } from '@/data/site'

const ease = [0.19, 1, 0.22, 1] as const
const rise = { hidden: { opacity: 0, y: 40 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: i * 0.08 } }) }

// The two national "firsts" lead; the rest of the coverage follows as a compact list. Every item opens the Blog & News page
const [wedding, conference, ...rest] = press

export function PressSection() {
  return <section className="pr" aria-label="Bond Safari in the news">
    <div className="xp-list-head">
      <m.div initial="hidden" whileInView="show" viewport={{ once: true }}>
        <m.p className="eyebrow" variants={rise}>Bond Safari in the news</m.p>
        <m.h2 variants={rise} custom={1}>Firsts beneath<br /><i>the waves.</i></m.h2>
      </m.div>
      <m.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} custom={2}>
        <p className="ab-lead">From India’s first underwater wedding to the world’s first underwater CEO conference, Kovalam’s sea has made headlines.</p>
        <Link className="text-link pr-more" href="/blog#news">Read blog & news <ArrowRight /></Link>
      </m.div>
    </div>
    <div className="pr-grid">
      {[wedding, conference].map((p, i) => <m.div key={p.title} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={rise} custom={i}>
        <Link className="pr-feature" href="/blog#news">
          <span className="pr-topic"><Newspaper /> {p.topic}</span>
          <h3>{p.title}</h3>
          <p className="pr-outlets"><small>As covered by</small>{p.outlets.join(' · ')}</p>
          <ArrowUpRight className="pr-arrow" />
        </Link>
      </m.div>)}
    </div>
    <ul className="pr-list">
      {rest.map((p, i) => <m.li key={p.title} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={rise} custom={i % 2}>
        <Link href="/blog#news"><span className="pr-topic">{p.topic}</span><b>{p.title}</b><small>{p.outlets.join(' · ')}</small></Link>
      </m.li>)}
    </ul>
  </section>
}
