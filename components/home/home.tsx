import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Award, CalendarCheck, Clock, MapPin, MessageCircle, Newspaper, Plus, Star } from 'lucide-react'
import { pathway } from '@/data/courses'
import { inr, taxLabel } from '@/data/catalogue'
import { bySlug } from '@/data/products'
import { business, contact, meetingPoint, press, reviews, whatsappLink } from '@/data/site'
import { Reveal } from '@/components/layout/header'

// Homepage sections below the hero, in the order the audit recommends. Server components: they ship no JS
// beyond the shared Reveal animation.


export function TrustStrip() {
  const items = [
    business.google && { icon: Star, value: `${business.google.rating} ★`, label: `${inr(business.google.count)} Google reviews`, href: business.google.url },
    { icon: Award, value: 'PADI 5★', label: 'Instructor Development Center' },
    { icon: CalendarCheck, value: 'Open daily', label: `${contact.hours.replace('Monday – Sunday · ', '')}, Sundays too` },
    { icon: Newspaper, value: 'In the news', label: 'Times of India · NDTV · Economic Times', href: '/blog#news' },
    business.registration && { icon: Award, value: 'Registered', label: business.registration },
  ].filter(Boolean) as { icon: typeof Star; value: string; label: string; href?: string }[]
  return <section className="trust-strip" aria-label="Why Bond Safari">
    {items.slice(0, 4).map(s => { const body = <><span className="xp-stat-icon"><s.icon /></span><div><b>{s.value}</b><span>{s.label}</span></div></>; return s.href ? <Link key={s.label} href={s.href} className="xp-stat">{body}</Link> : <div key={s.label} className="xp-stat">{body}</div> })}
  </section>
}

export function PathwayTeaser() {
  return <section className="cs-path home-path" aria-labelledby="path-title">
    <div className="xp-list-head">
      <Reveal><p className="eyebrow">Learn with Bond Academy</p><h2 id="path-title">From zero<br /><i>to instructor.</i></h2></Reveal>
      <Reveal><p className="ab-lead">Already tried diving? Your next step is Open Water. Every PADI course builds on the last.</p><Link className="text-link" href="/courses">All courses <ArrowRight /></Link></Reveal>
    </div>
    <ol className="cs-steps">{pathway.map((c, i) => <li key={c.slug}><Link href={`/courses/${c.slug}`}><span className="cs-step-dot">{String(i + 1).padStart(2, '0')}</span><span className="cs-step-level">{c.level}</span><b>{c.title.replace('PADI ', '').replace(' (IDC)', '').replace('®', '')}</b><span className="cs-step-meta">{c.duration}{c.price ? ` · ${c.price}` : ''}{taxLabel(bySlug(c.slug) ?? {}) ? ` ${taxLabel(bySlug(c.slug) ?? {})}` : ''}</span></Link></li>)}</ol>
  </section>
}

// Testimonials published on the previous bondsafarikovalam.com homepage. They carry no date or platform, so
// none is invented here; verified Google/TripAdvisor figures appear once configured in data/site.ts.
export function Reviews() {
  return <section className="reviews section" aria-labelledby="reviews-title">
    <div className="reviews-head">
      <Reveal><p className="eyebrow">In our guests’ words</p><h2 id="reviews-title">Another world,<br /><i>they said.</i></h2></Reveal>
      <Reveal className="reviews-links">
        {business.google && <a className="text-link" href={business.google.url} target="_blank" rel="noreferrer">{business.google.rating} ★ · {inr(business.google.count)} Google reviews <ArrowUpRight /></a>}
        {business.tripadvisor && <a className="text-link" href={business.tripadvisor.url} target="_blank" rel="noreferrer">{business.tripadvisor.rating} · TripAdvisor <ArrowUpRight /></a>}
      </Reveal>
    </div>
    <ul className="reviews-list">{reviews.map(r => <li key={r.name}><Reveal><blockquote><p className="reviews-title">{r.title}</p><p>“{r.text}”</p></blockquote><p className="reviews-name">— {r.name}</p></Reveal></li>)}</ul>
  </section>
}

export function PlanVisit() {
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(`Bond Safari, ${meetingPoint.address}`)}&z=16&output=embed`
  const seasons = [
    ['Monsoon', 'Freshwater scuba, Scuba in the Rain and the Monsoon Combo run in calm, rain-fed quarries.'],
    ['Coracle rides', 'Best Jan – Apr, Aug, Sep and Nov.'],
    ['Kayaking', 'Best Apr – Aug.'],
    ['Advanced Open Water', 'Best Nov – Jul.'],
  ]
  const faqs = ['scuba-diving', 'bond-safari'].flatMap(s => bySlug(s)?.faqs?.slice(0, 2) ?? [])
  return <section className="plan section" aria-labelledby="plan-title">
    <Reveal className="plan-head"><p className="eyebrow">Plan your visit</p><h2 id="plan-title">Find us on<br /><i>Beach Road.</i></h2></Reveal>
    <div className="plan-grid">
      <Reveal className="plan-map"><iframe src={mapEmbed} title="Bond Safari on Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></Reveal>
      <Reveal className="plan-info">
        <p><MapPin /> <span><b>{meetingPoint.name}</b><br />{meetingPoint.address}</span></p>
        <p><Clock /> <span>{contact.hours} — Sundays too{meetingPoint.arrival ? `. ${meetingPoint.arrival}` : ''}</span></p>
        <div className="plan-actions"><a className="pill pill-dark" href={contact.mapUrl} target="_blank" rel="noreferrer">Directions <ArrowUpRight /></a><a className="pill pill-sand" href={whatsappLink('Hello Bond Safari, I’m planning a visit to Kovalam and have a question.')} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></div>
        <p className="eyebrow plan-sub">Season guide</p>
        <dl className="plan-seasons">{seasons.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        {business.weatherPolicy && <p className="dt-note">{business.weatherPolicy}</p>}
      </Reveal>
    </div>
    {faqs.length > 0 && <Reveal className="plan-faq"><p className="eyebrow">Common questions</p><div className="dt-faq">{faqs.map(f => <details key={f.q}><summary>{f.q}<Plus /></summary><p>{f.a}</p></details>)}</div></Reveal>}
  </section>
}

export function PressStrip() {
  const firsts = press.filter(p => p.topic === 'Underwater wedding' || p.topic === 'Underwater CEO conference')
  return <section className="press section" aria-labelledby="press-title">
    <Reveal><p className="eyebrow light">Firsts beneath the waves</p><h2 id="press-title">As seen in<br /><i>the news.</i></h2></Reveal>
    <div className="press-grid">{firsts.map(p => <Reveal key={p.title} className="press-card"><p className="eyebrow light">{p.topic}</p><h3>{p.title}</h3><p>{p.outlets.join(' · ')}</p></Reveal>)}</div>
    <Link className="pill pill-light" href="/blog#news">All press stories <ArrowRight /></Link>
  </section>
}
