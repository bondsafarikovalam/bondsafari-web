'use client'

import Link from 'next/link'
import { m } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { experiences } from '@/data/experiences'
import { courses } from '@/data/courses'

const ease = [0.19, 1, 0.22, 1] as const
const rise = { hidden: { opacity: 0, y: 30 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: i * 0.08 } }) }

const exp = (slug: string) => experiences.find(e => e.slug === slug)!
const course = (slug: string) => courses.find(c => c.slug === slug)!

// The upsell path for guests who have dived once: dive again, get certified, or go further
const steps = [
  { label: 'Dive again', item: { ...exp('scuba-diving'), title: 'Discover Scuba Dive' }, href: '/activities/scuba-diving' },
  { label: 'Get certified', item: course('open-water-diver'), href: '/courses/open-water-diver' },
  { label: 'Already certified', item: course('advanced-open-water'), href: '/courses/advanced-open-water' },
]

export function NextStep() {
  return <section className="ns" aria-label="Already tried diving?">
    <m.div className="ns-band" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
      <m.div className="ns-copy" variants={rise}>
        <p className="eyebrow light">Already tried diving?</p>
        <h2>Here’s your <i>next&nbsp;step.</i></h2>
      </m.div>
      <div className="ns-links">
        {steps.map((s, i) => <m.div key={s.href} variants={rise} custom={i + 1}>
          <Link className="ns-link" href={s.href}>
            <small>{s.label}</small>
            <strong>{s.item.title}</strong>
            <span>{s.item.duration} · {s.item.price ? s.item.price.replace(' per person', '') : 'Price on request'}</span>
            <ArrowUpRight className="ns-arrow" />
          </Link>
        </m.div>)}
      </div>
    </m.div>
  </section>
}
