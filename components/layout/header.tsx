'use client'

import Image from '@/components/ui/photo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { BookLink } from '@/components/booking/book'

// Kept out of site.tsx so inner pages don't download the home hero's code just to render the header

const nav = [['Home','/'], ['Activities','/activities'], ['Courses','/courses'], ['About','/about'], ['Gallery','/gallery'], ['Blog & News','/blog'], ['FAQ','/faq'], ['Contact','/contact']]

// A section stays highlighted on its detail pages too (e.g. /courses/rescue-diver lights up Courses)
const isActive = (path: string, href: string) => href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`)

export function Header() {
  const [open, setOpen] = useState(false)
  const path = usePathname()
  // Pinned header with a solid backdrop once the page scrolls. It slides away while the visitor scrolls
  // down, and comes back the moment they scroll up or stop (always shown near the top, with the menu open,
  // or while something in it has keyboard focus).
  const [scrolled, setScrolled] = useState(false)
  const [moving, setMoving] = useState(false)
  const box = useRef<HTMLElement>(null)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const up = y < lastY
      lastY = y
      setScrolled(y > 40)
      // Scrolling up means they're looking for it: show it straight away, without waiting for the scroll to stop
      if (y < 120 || up || box.current?.contains(document.activeElement)) { clearTimeout(timer); setMoving(false); return }
      setMoving(true)
      clearTimeout(timer)
      timer = setTimeout(() => setMoving(false), 250)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll) }
  }, [])
  const hidden = moving && !open
  // While the mobile menu is open the page behind it stays put (the lock itself is in CSS, mobile widths only)
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    return () => document.documentElement.classList.remove('menu-open')
  }, [open])
  // A tap anywhere outside the header (and its menu) closes the menu; so does Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])
  // Lets other sticky bars (e.g. the experiences filter) slide up into the space while it's away
  useEffect(() => {
    document.documentElement.toggleAttribute('data-header-hidden', hidden)
    return () => document.documentElement.removeAttribute('data-header-hidden')
  }, [hidden])
  return <header ref={box} className={`site-header${scrolled || open ? ' is-scrolled' : ''}${hidden ? ' is-hidden' : ''}`}><Link className="brand brand-logo" href="/" aria-label="Bond Safari home"><Image src="/images/logo.webp" alt="Bond Safari" width={447} height={320} sizes="101px" priority /><span className="padi-badge"><Image src="/images/padi-light.webp" alt="PADI" width={243} height={320} sizes="40px" priority /></span></Link><nav className="desktop-nav" aria-label="Main">{nav.map(([label, href]) => <Link key={href} href={href} className={isActive(path, href) ? 'is-active' : undefined} aria-current={isActive(path, href) ? 'page' : undefined}>{label}</Link>)}</nav><div className="header-actions"><BookLink className="pill pill-light" href="/activities">Book now <ArrowRight /></BookLink><button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button></div><AnimatePresence>{open && <m.nav className="mobile-nav" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>{nav.map(([label, href]) => <Link onClick={() => setOpen(false)} key={href} href={href} className={isActive(path, href) ? 'is-active' : undefined} aria-current={isActive(path, href) ? 'page' : undefined}>{label}<ArrowRight /></Link>)}<BookLink className="pill pill-dark" href="/activities" onClick={() => setOpen(false)}>Book your adventure <ArrowRight /></BookLink></m.nav>}</AnimatePresence></header>
}

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <m.div className={className} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true, margin:'-80px'}} transition={{duration:.7, ease:[.22,1,.36,1]}}>{children}</m.div> }
