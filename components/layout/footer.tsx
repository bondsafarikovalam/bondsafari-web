import Image from '@/components/ui/photo'
import Link from 'next/link'
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { contact, socials, whatsappLink } from '@/data/site'
import { SocialIcon } from '@/components/layout/social-icons'

// Static markup only, so it renders on the server and ships no JavaScript

const tel = (n: string) => `tel:${n.replace(/\s/g, '')}`

export function Footer() {
  return <footer className="footer">
    <div className="footer-brand">
      <Link className="footer-logo" href="/" aria-label="Bond Safari home"><Image src="/images/logo.webp" alt="Bond Safari Kovalam" width={447} height={320} sizes="90px" /></Link>
      <p className="footer-place">Kovalam · Kerala</p>
      <p className="footer-tagline">Enjoy the sea life with Bond Safari and feel the marvels hidden beneath.</p>
      <p className="footer-hours"><Clock />Open every day · {contact.hours.split('·').pop()?.trim()}</p>
    </div>
    <div className="footer-contact-wrap">
      <p className="eyebrow">Get in touch</p>
      <ul className="footer-contact">
        {contact.phones.map(n => <li key={n}><a href={tel(n)}><span className="footer-contact-icon"><Phone /></span><span><small>Call us</small><strong>{n}</strong></span></a></li>)}
        <li><a href={whatsappLink('Hello Bond Safari! I’m on your website.')} target="_blank" rel="noreferrer"><span className="footer-contact-icon"><SocialIcon label="WhatsApp" /></span><span><small>WhatsApp</small><strong>Chat with us</strong></span></a></li>
        <li><a href={`mailto:${contact.email}`}><span className="footer-contact-icon"><Mail /></span><span><small>Email</small><strong>{contact.email}</strong></span></a></li>
        <li><a href={contact.mapUrl} target="_blank" rel="noreferrer"><span className="footer-contact-icon"><MapPin /></span><span><small>Visit us</small><strong>{contact.address[0]}</strong><em>{contact.address.slice(1).join(', ')}</em></span><ArrowUpRight className="footer-contact-go" /></a></li>
      </ul>
    </div>
    <div><p className="eyebrow">Follow along</p><ul className="footer-social">{socials.map(([label, href]) => <li key={label}><a href={href} target="_blank" rel="noreferrer" aria-label={`Bond Safari on ${label}`} title={label}><SocialIcon label={label} /></a></li>)}</ul></div>
    <div className="footer-bottom">© {new Date().getFullYear()} Bond Safari Kovalam <span>In partnership with Cool Divers SL, Spain</span></div>
  </footer>
}
