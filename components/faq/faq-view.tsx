'use client'

import Image from '@/components/ui/photo'
import { useState } from 'react'
import type { FaqGroup } from '@/data/faq'
import { FaqBrowser } from '@/components/faq/faq-browser'

// The FAQ hero and the questions together, so the hero shows the photo of the category being read.
// All the categories' photos sit in the hero and cross-fade; the first loads with priority, the others right after (not lazily),
// so a tab switch shows its photo at once
export function FaqView({ groups, children }: { groups: FaqGroup[]; children?: React.ReactNode }) {
  const [active, setActive] = useState(groups[0].id)
  return <>
    <section className="fq-hero">
      <div className="fq-hero-media" aria-hidden="true">
        {groups.map((g, i) => <div key={g.id} className={`fq-hero-photo${g.id === active ? ' is-on' : ''}`}>
          <Image src={g.image} alt="" fill sizes="100vw" priority={i === 0} loading={i === 0 ? undefined : 'eager'} style={{ objectPosition: g.imagePosition }} />
        </div>)}
      </div>
      <div className="fq-hero-shade" aria-hidden="true" />
      <p className="eyebrow light">FAQ · Kovalam, Kerala</p>
      <h1>Frequently asked<br /><i>questions.</i></h1>
      <p>Everything guests ask us before parasailing, snorkelling, scuba diving and kayaking in Kovalam.</p>
    </section>
    <div className="fq-body">
      <FaqBrowser groups={groups} active={active} onActive={setActive} />
      {children}
    </div>
  </>
}
