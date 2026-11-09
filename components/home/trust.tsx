'use client'

import { m } from 'framer-motion'
import { Award, CalendarCheck, Clock, MapPin, ShieldCheck, Star, Users, type LucideIcon } from 'lucide-react'
import { business } from '@/data/site'

const ease = [0.19, 1, 0.22, 1] as const
const rise = { hidden: { opacity: 0, y: 30 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: i * 0.08 } }) }

type Fact = { icon: LucideIcon; value: string; label: string; href?: string }

// Confirmed facts come first; unconfirmed ones (rating, years, guests) appear only once set in data/site.ts
function facts(): Fact[] {
  const { google, since, guestsServed } = business
  const list: (Fact | false)[] = [
    !!google && { icon: Star, value: `${google.rating.toFixed(1)}★`, label: `${google.count.toLocaleString('en-IN')} Google reviews`, href: google.url },
    { icon: Award, value: 'PADI 5★', label: 'Instructor Development Center' },
    !!since && { icon: CalendarCheck, value: `${new Date().getFullYear() - since}+`, label: 'Years at sea' },
    !!guestsServed && { icon: Users, value: guestsServed, label: 'Guests served' },
    { icon: Clock, value: '7 days', label: 'Open 8:30 AM – 6:30 PM' },
  ]
  const shown = list.filter((f): f is Fact => !!f)
  // Keep the strip full while the business facts are pending
  const fillers: Fact[] = [{ icon: MapPin, value: 'Kovalam', label: 'On the beach, Kerala' }, { icon: ShieldCheck, value: 'All gear', label: 'Included with every activity' }]
  return [...shown, ...fillers].slice(0, Math.max(4, Math.min(shown.length, 5)))
}

export function TrustStrip() {
  const list = facts()
  return <section className="xp-stats home-trust" style={{ '--n': list.length } as React.CSSProperties} aria-label="Why guests trust Bond Safari">
    {list.map((f, i) => {
      const body = <><span className="xp-stat-icon"><f.icon /></span><div><b>{f.value}</b><span>{f.label}</span></div></>
      return <m.div key={f.label} className="xp-stat" initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} custom={i}>
        {f.href ? <a className="home-trust-link" href={f.href} target="_blank" rel="noreferrer">{body}</a> : body}
      </m.div>
    })}
  </section>
}
