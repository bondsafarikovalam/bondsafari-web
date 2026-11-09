'use client'

import Image from '@/components/ui/photo'
import Link from 'next/link'
import { m } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Clock, MapPin } from 'lucide-react'
import { statusLabel, typeInfo, type ItemType, type Listing } from '@/data/programmes'
import { Cta, ctaOf } from '@/components/pages/detail'

const ease = [0.19, 1, 0.22, 1] as const

export function Card({ l, index }: { l: Listing; index: number }) {
  const cta = ctaOf(l.title, l.status)
  return <m.article layout className="xp-card cs-card pg-card" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.8, ease, delay: Math.min(index, 6) * 0.06 }}>
    <Link className="xp-card-media" href={l.href} aria-label={`${l.title} — view details`}>
      <Image src={l.image} alt="" fill sizes="(max-width: 800px) 100vw, 33vw" style={{ objectPosition: l.imagePosition }} />
      <span className="pg-type" data-type={l.type}>{l.type}</span>
      {l.status !== 'bookable' && <span className="cs-level pg-status" data-status={l.status}>{statusLabel[l.status]}</span>}
      <span className="xp-card-price">{l.price ?? 'Contact for price'}</span>
    </Link>
    <div className="xp-card-body">
      <p className="xp-card-meta"><span>{l.type === 'Activity' ? 'No certificate needed' : l.kind === 'Professional rating' ? 'Professional rating' : l.kind === 'Programme' ? 'Lessons' : 'Certification'}</span>{l.duration && <span><Clock /> {l.duration}</span>}</p>
      <h3><Link href={l.href}>{l.title}</Link></h3>
      <p className="xp-card-tag">{l.summary}</p>
      <p className="pg-card-loc"><MapPin /> {l.location}</p>
      <div className="xp-card-actions">
        <Cta cta={cta} className="book-cta book-cta-sm"><span className="book-cta-label"><strong>{cta.label}</strong></span><span className="book-cta-icon"><ArrowRight /></span></Cta>
        <Link className="xp-card-more" href={l.href}>View details <ArrowUpRight /></Link>
      </div>
    </div>
  </m.article>
}

// Two plain definitions so nobody has to guess whether something is a one-off experience or a certification course
export function TypeKey({ links = false, current }: { links?: boolean; current?: ItemType }) {
  return <div className="pg-key">{(['Activity', 'Course'] as const).map(t => {
    const here = t === current
    const body = <><span className="pg-type" data-type={t}>{here ? `You’re viewing ${typeInfo[t].plural.toLowerCase()}` : t}</span><p>{typeInfo[t].hint}</p>{links && !here && <b>See all {typeInfo[t].plural.toLowerCase()} <ArrowRight /></b>}</>
    return links && !here ? <Link key={t} href={t === 'Activity' ? '/activities' : '/courses'}>{body}</Link> : <div key={t} className={here ? 'is-current' : undefined}>{body}</div>
  })}</div>
}
