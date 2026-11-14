'use client'

import { useEffect, useRef, useState } from 'react'
import Image from '@/components/ui/photo'
import NextImage from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
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

// Gallery page only: a ring that eases after the mouse plus a dot right on it. The ring grows over photos and
// buttons and squeezes on click. Mouse devices only, and not with reduced motion; the normal cursor stays too
function useRingCursor() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const ring = document.createElement('div'), dot = document.createElement('div')
    ring.className = 'ring-cursor'; dot.className = 'ring-cursor ring-cursor-dot'
    for (const el of [ring, dot]) { el.innerHTML = '<span></span>'; el.setAttribute('aria-hidden', 'true') }
    document.body.append(ring, dot)
    let x = -100, y = -100, rx = -100, ry = -100, frame = 0
    const follow = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`
      frame = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(follow) : 0
    }
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY
      dot.style.transform = `translate3d(${x}px,${y}px,0)`
      const t = e.target instanceof Element ? e.target : null
      ring.classList.toggle('is-hover', !!t?.closest('a,button,[role="button"]'))
      // White over the photos and the dark viewer, so it shows on them
      const light = !!t?.closest('.gallery-card,.lightbox')
      ring.classList.toggle('is-light', light); dot.classList.toggle('is-light', light)
      ring.classList.add('is-visible'); dot.classList.add('is-visible')
      if (!frame) frame = requestAnimationFrame(follow)
    }
    const out = (e: MouseEvent) => { if (!e.relatedTarget) { ring.classList.remove('is-visible'); dot.classList.remove('is-visible') } }
    const down = () => ring.classList.add('is-active'), up = () => ring.classList.remove('is-active')
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseout', out)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', move); window.removeEventListener('mouseout', out)
      window.removeEventListener('mousedown', down); window.removeEventListener('mouseup', up)
      ring.remove(); dot.remove()
    }
  }, [])
}

export function GalleryWall() {
  useRingCursor()
  const [shown, setShown] = useState(PAGE)
  // Index of the photo open in the viewer, or null when it's closed
  const [open, setOpen] = useState<number | null>(null)
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
    <section id="photos" className="section gallery-section">
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
            <button type="button" className="gallery-card" onClick={() => setOpen(i)} aria-label={`View photo ${i + 1} of ${galleryPhotos.length}`}>
              <Image src={src} alt={`Bond Safari Kovalam photo ${i + 1}`} fill sizes="(max-width:700px) 50vw, 40vw" />
            </button>
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
      {open !== null && <Viewer index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </section>
  )
}

// Full-screen photo viewer: arrows / swipe / ←→ keys step through every photo, Escape or a tap on the backdrop closes it
function Viewer({ index, onChange, onClose }: { index: number; onChange: (i: number) => void; onClose: () => void }) {
  const total = galleryPhotos.length
  const go = (d: number) => onChange((index + d + total) % total)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const swipe = useRef<number | null>(null)
  // A swipe ends with a click too; this keeps that click from closing the viewer
  const swiped = useRef(false)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeBtn.current?.focus()
    document.documentElement.classList.add('lightbox-open')
    return () => { document.documentElement.classList.remove('lightbox-open'); opener?.focus({ preventScroll: true }) }
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onChange((index + 1) % total)
      else if (e.key === 'ArrowLeft') onChange((index - 1 + total) % total)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index, total, onChange, onClose])

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={e => { if (e.target === e.currentTarget && !swiped.current) onClose() }}
      onPointerDown={e => { swipe.current = e.clientX; swiped.current = false }}
      onPointerUp={e => { if (swipe.current === null) return; const dx = e.clientX - swipe.current; swipe.current = null; if (Math.abs(dx) > 50) { swiped.current = true; go(dx < 0 ? 1 : -1) } }}>
      <div className="lightbox-photo" onClick={() => { if (!swiped.current) onClose() }}>
        <NextImage key={index} src={galleryPhotos[index]} alt={`Bond Safari Kovalam photo ${index + 1}`} fill sizes="100vw" quality={75} onClick={e => e.stopPropagation()} />
      </div>
      <span className="lightbox-count">{index + 1} / {total}</span>
      <button ref={closeBtn} type="button" className="lightbox-btn lightbox-close" onClick={onClose} aria-label="Close"><X /></button>
      <button type="button" className="lightbox-btn lightbox-prev" onClick={() => go(-1)} aria-label="Previous photo"><ChevronLeft /></button>
      <button type="button" className="lightbox-btn lightbox-next" onClick={() => go(1)} aria-label="Next photo"><ChevronRight /></button>
    </div>
  )
}
