'use client'

import { m } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { contact } from '@/data/site'

const ease = [0.19, 1, 0.22, 1] as const
const rise = { hidden: { opacity: 0, y: 40 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: i * 0.12 } }) }
const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent('Bond Safari, Suseela Tower, Beach Road, Kovalam, Kerala 695527')}&z=16&output=embed`

// Google Map with the address card, shared by the Contact page and the home page. The iframe loads only near the viewport
export function MapSection({ eyebrow }: { eyebrow: string }) {
  return <section className="ct-map" aria-label="Location">
    <m.div className="ct-map-frame" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={rise}>
      <iframe src={mapEmbed} title="Bond Safari on Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      <div className="ct-map-card">
        <p className="eyebrow light">{eyebrow}</p>
        <p className="ct-map-title">Find us on<br /><i>Beach Road.</i></p>
        <p className="ct-map-address">{contact.address.map(l => <span key={l}>{l}<br /></span>)}</p>
        <a className="text-link light" href={contact.mapUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight /></a>
      </div>
    </m.div>
  </section>
}
