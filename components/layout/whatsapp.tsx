'use client'

import { usePathname } from 'next/navigation'
import { bySlug } from '@/data/products'
import { whatsappLink } from '@/data/site'

// What the guest is looking at, so the pre-filled message tells the team straight away
function context(path: string) {
  const [, section, slug] = path.split('/')
  if ((section === 'activities' || section === 'courses') && slug) { const p = bySlug(slug); if (p) return `I’m looking at ${p.title}` }
  const pages: Record<string, string> = { '': 'I’m on your website', activities: 'I’m looking at your activities', courses: 'I’m looking at your PADI courses', booking: 'I’m trying to book', contact: 'I have a question', about: 'I’m reading about Bond Safari' }
  return pages[section ?? ''] ?? 'I’m on your website'
}

export function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="wa-icon"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" /></svg>
}

export function WhatsAppButton() {
  const path = usePathname()
  return <a className="cb-launcher wa-launcher" href={whatsappLink(`Hello Bond Safari! ${context(path)}.`)} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp">
    <WhatsAppIcon />
    <span className="cb-tip" aria-hidden="true">Chat on WhatsApp</span>
  </a>
}
