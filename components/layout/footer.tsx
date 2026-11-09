import Image from '@/components/ui/photo'
import Link from 'next/link'
import { contact, socials } from '@/data/site'
import { SocialIcon } from '@/components/layout/social-icons'

// Static markup only, so it renders on the server and ships no JavaScript

export function Footer() { return <footer className="footer"><div className="footer-brand"><Link className="footer-logo" href="/" aria-label="Bond Safari home"><Image src="/images/logo.webp" alt="Bond Safari Kovalam" width={447} height={320} sizes="90px" /></Link><p className="footer-place">Kovalam · Kerala</p><p className="footer-tagline">Enjoy the sea life with Bond Safari and feel the marvels hidden beneath.</p></div><div><p className="eyebrow">Find us</p><p>{contact.address.map(l => <span key={l}>{l}<br /></span>)}<a href={contact.mapUrl} target="_blank" rel="noreferrer">Open in Maps</a></p></div><div><p className="eyebrow">Say hello</p><p><a href={`mailto:${contact.email}`}>{contact.email}</a><br />{contact.phones.map(n => <span key={n}><a href={`tel:${n.replace(/\s/g,'')}`}>{n}</a><br /></span>)}{contact.hours}</p></div><div><p className="eyebrow">Follow along</p><ul className="footer-social">{socials.map(([label, href]) => <li key={label}><a href={href} target="_blank" rel="noreferrer" aria-label={`Bond Safari on ${label}`} title={label}><SocialIcon label={label} /></a></li>)}</ul></div><div className="footer-bottom">© {new Date().getFullYear()} Bond Safari Kovalam <span>In partnership with Cool Divers SL, Spain</span></div></footer> }
