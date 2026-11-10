'use client'

import { useEffect, useRef, useState } from 'react'
import Image from '@/components/ui/photo'
import { galleryPhotos } from '@/data/gallery'

// Shows the photos a page at a time so the first visit doesn't request hundreds of images
const PAGE = 24

// Bento rhythm: within every 12 tiles, these positions get a bigger cell
const shapeOf = (i: number) => ({ 0: 'big', 5: 'tall', 7: 'wide', 10: 'big' } as Record<number, string>)[i % 12] ?? ''

// Tilts the tile toward the cursor and moves the glare with it
function tilt(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget, r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
  el.style.setProperty('--rx', `${(0.5 - y) * 10}deg`)
  el.style.setProperty('--ry', `${(x - 0.5) * 12}deg`)
  el.style.setProperty('--gx', `${x * 100}%`)
  el.style.setProperty('--gy', `${y * 100}%`)
}
function untilt(e: React.MouseEvent<HTMLDivElement>) {
  for (const p of ['--rx', '--ry']) e.currentTarget.style.removeProperty(p)
}

export function GalleryWall() {
  const [shown, setShown] = useState(PAGE)
  const wall = useRef<HTMLDivElement>(null)

  // Each tile flips in as it scrolls into view (CSS .gallery-tile.is-in); runs again for tiles added by "Load more"
  useEffect(() => {
    const tiles = wall.current?.querySelectorAll<HTMLElement>('.gallery-tile:not(.is-in)')
    if (!tiles?.length) return
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
    }, { rootMargin: '0px 0px -10% 0px' })
    tiles.forEach(t => io.observe(t))
    return () => io.disconnect()
  }, [shown])

  return (
    <section className="section">
      <div className="gallery-wall" ref={wall}>
        {galleryPhotos.slice(0, shown).map((src, i) => (
          <div
            className={`gallery-tile ${shapeOf(i)}`}
            // --d staggers neighbouring tiles so a screenful cascades in
            style={{ '--d': `${(i % 6) * 80}ms` } as React.CSSProperties}
            onMouseMove={tilt}
            onMouseLeave={untilt}
            key={src}
          >
            <div className="gallery-card">
              <Image src={src} alt={`Bond Safari Kovalam photo ${i + 1}`} fill sizes="(max-width:700px) 50vw, 40vw" />
            </div>
          </div>
        ))}
      </div>
      {shown < galleryPhotos.length && (
        <div className="gallery-more">
          <button className="pill pill-dark" onClick={() => setShown(n => n + PAGE)}>
            Load more ({galleryPhotos.length - shown} left)
          </button>
        </div>
      )}
    </section>
  )
}
