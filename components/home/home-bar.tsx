'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { experiences } from '@/data/experiences'
import { whatsappLink } from '@/data/site'
import { WhatsAppIcon } from '@/components/layout/whatsapp'

const fromPrice = Math.min(...experiences.map(e => Number(e.price?.replace(/[^\d]/g, '') || 0)).filter(Boolean)).toLocaleString('en-IN')

// Mobile only (same bar as the Activities page): Book and WhatsApp stay in thumb reach once the hero's buttons scroll away
export function HomeBar() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const update = () => setShown(window.scrollY > window.innerHeight * 0.9)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <div className={`dt-mobile-bar xp-bar home-bar${shown ? ' is-shown' : ''}`} inert={!shown}>
    <div><b>Book an adventure</b><span>From ₹{fromPrice} per person</span></div>
    <div className="home-bar-actions">
      <a className="home-bar-wa" href={whatsappLink('Hello Bond Safari! I’d like to book an adventure in Kovalam.')} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp"><WhatsAppIcon /></a>
      <Link className="book-cta book-cta-sm" href="/booking"><span className="book-cta-label"><strong>Book</strong></span><span className="book-cta-icon"><ArrowRight /></span></Link>
    </div>
  </div>
}
