import Image from '@/components/ui/photo'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { muzirisLocations } from '@/data/locations'
import { Reveal } from '@/components/layout/header'

// A short introduction to the two Muziris locations. Their own live website owns the details and booking, so each
// card links out to it (Explore More, once the URL is confirmed in data/locations.ts) instead of booking here.
export function MuzirisSection() {
  const list = muzirisLocations.filter(l => l.published)
  return <section className="xp-list mz" aria-labelledby="mz-title">
    <div className="xp-list-head">
      <Reveal><p className="eyebrow">Muziris Heritage Water Trails</p><h2 id="mz-title">Explore our<br /><i>Muziris locations.</i></h2></Reveal>
      <Reveal><p className="ab-lead">Discover our Muziris locations and explore the experiences available across these unique destinations.</p></Reveal>
    </div>
    <div className="xp-grid mz-grid">{list.map(l => <Reveal key={l.id} className="xp-card">
      <div className="xp-card-media"><Image src={l.image.src} alt={l.image.alt} fill sizes="(max-width: 800px) 100vw, 50vw" style={{ objectPosition: l.image.position }} /></div>
      <div className="xp-card-body">
        <p className="xp-card-meta"><span>{l.district} district</span><span>{l.environment}</span></p>
        <h3>{l.name}</h3>
        <p className="xp-card-tag">{l.summary}</p>
        {l.meetingPoint && <p className="pg-card-loc"><MapPin /> Meeting point: {l.meetingPoint}</p>}
        <ul className="mz-tags">{l.highlights.map(h => <li key={h}>{h}</li>)}</ul>
        <div className="xp-card-actions">
          {l.website && <a className="book-cta book-cta-sm" href={l.website} target="_blank" rel="noopener noreferrer"><span className="book-cta-label"><strong>Explore More</strong></span><span className="book-cta-icon"><ArrowUpRight /></span></a>}
          <a className="xp-card-more" href={l.directionsUrl} target="_blank" rel="noopener noreferrer">Directions <ArrowUpRight /></a>
        </div>
      </div>
    </Reveal>)}</div>
  </section>
}
