import Image from '@/components/ui/photo'
import { ArrowDown } from 'lucide-react'
import { galleryPhotos } from '@/data/gallery'
import { Mask, enter } from '@/components/layout/intro'

// Gallery hero: the title on the left, and three columns of gallery photos drifting past on the right (up, down, up).
// Each column's photos are listed twice so the CSS loop (translateY 0 → -50%) runs without a seam.
// On phones the columns sit behind the title as a darkened backdrop.
const COLS = 3, PER = 5
const step = Math.max(1, Math.floor(galleryPhotos.length / (COLS * PER)))
const columns = Array.from({ length: COLS }, (_, c) => Array.from({ length: PER }, (_, i) => galleryPhotos[((c * PER + i) * step) % galleryPhotos.length]))

export function GalleryHero() {
  return (
    <section className="gh">
      <div className="gh-wall" aria-hidden="true">
        {columns.map((col, c) => (
          <div key={c} className="gh-col" style={{ '--gh-t': `${48 + c * 10}s` } as React.CSSProperties}>
            <div className="gh-col-track">
              {[...col, ...col].map((src, i) => <div key={i} className="gh-photo"><Image src={src} alt="" fill sizes="(max-width: 800px) 34vw, 240px" /></div>)}
            </div>
          </div>
        ))}
      </div>
      <div className="gh-shade" aria-hidden="true" />
      <div className="gh-content">
        <p className={`eyebrow light ${enter({ y: 12, duration: 1, delay: 0.2 }).className}`} style={enter({ y: 12, duration: 1, delay: 0.2 }).style}>Postcards from Kovalam</p>
        <h1><Mask delay={0.3}>The world</Mask><br /><Mask delay={0.45}><i>as we see it.</i></Mask></h1>
        <p className={`gh-copy ${enter({ y: 16, duration: 1.2, delay: 0.7 }).className}`} style={enter({ y: 16, duration: 1.2, delay: 0.7 }).style}>Turtles, reefs and first breaths underwater: moments from our dives, courses and days on the Arabian Sea.</p>
        <div className={`gh-foot ${enter({ duration: 1.2, delay: 1 }).className}`} style={enter({ duration: 1.2, delay: 1 }).style}>
          <span className="gh-count"><b>{galleryPhotos.length}</b>photos &amp; counting</span>
          <a className="gh-scroll" href="#photos">Browse the gallery <ArrowDown /></a>
        </div>
      </div>
    </section>
  )
}
