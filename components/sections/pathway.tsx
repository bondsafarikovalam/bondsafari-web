'use client'

import Link from 'next/link'
import { m } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { pathway } from '@/data/courses'

const ease = [0.19, 1, 0.22, 1] as const
const rise = { hidden: { opacity: 0, y: 40 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: i * 0.1 } }) }
const short = (t: string) => t.replace('PADI ', '').replace(/\s*\(\s*IDC\s*\)/, '').replace('®', '')

export type PathStep = { slug: string; title: string; level?: string; duration?: string; price?: string; href?: string }

// The zero-to-instructor timeline, shared by the Courses page (one per category) and the home page teaser; defaults to the PADI scuba pathway
export function PadiPathway({ eyebrow, id, more = false, steps = pathway }: { eyebrow: string; id?: string; more?: boolean; steps?: PathStep[] }) {
  return <section id={id} className="cs-path">
    <div className="xp-list-head">
      <m.div initial="hidden" whileInView="show" viewport={{ once: true }}>
        <m.p className="eyebrow" variants={rise}>{eyebrow}</m.p>
        <m.h2 variants={rise} custom={1}>From zero<br /><i>to instructor.</i></m.h2>
      </m.div>
      <m.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} custom={2}>
        <p className="ab-lead">Every course builds on the last. Start wherever you are today — each step unlocks the next.</p>
        {more && <Link className="text-link cs-path-more" href="/courses">Explore all courses <ArrowRight /></Link>}
      </m.div>
    </div>
    <ol className="cs-steps" style={{ '--steps': steps.length } as React.CSSProperties}>
      {steps.map((c, i) => <m.li key={c.slug} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={rise} custom={i}>
        <Link href={c.href ?? `/courses/${c.slug}`}>
          <span className="cs-step-dot">{String(i + 1).padStart(2, '0')}</span>
          {c.level && <span className="cs-step-level">{c.level}</span>}
          <b>{short(c.title)}</b>
          <span className="cs-step-meta">{[c.duration, c.price].filter(Boolean).join(' · ')}</span>
        </Link>
      </m.li>)}
    </ol>
  </section>
}
