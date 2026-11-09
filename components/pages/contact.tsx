'use client'

import Image from '@/components/ui/photo'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { useRef, type FormEvent } from 'react'
import { experiences } from '@/data/experiences'
import { courses } from '@/data/courses'
import { contact, socials } from '@/data/site'
import { Header } from '@/components/layout/header'
import { SocialIcon } from '@/components/layout/social-icons'
import { MapSection } from '@/components/sections/map'
import { Picker } from '@/components/booking/picker'
import { Mask as CssMask, enter } from '@/components/layout/intro'

const ease = [0.19, 1, 0.22, 1] as const
const rise = { hidden: { opacity: 0, y: 40 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: i * 0.12 } }) }
const tel = (n: string) => `tel:${n.replace(/\s/g, '')}`
const groups = [{ label: 'Activities', options: experiences.map(e => ({ value: e.title })) }, { label: 'Courses', options: courses.map(c => ({ value: c.title })) }, { label: 'Other', options: [{ value: 'Something else' }] }]

// Title lines slide up from behind their masks, in CSS so they show without waiting for JavaScript
const Mask = (props: { children: React.ReactNode; delay?: number }) => <CssMask from="105%" duration={1.6} {...props} />

const cards = [
  { icon: Phone, label: 'Call us', lines: contact.phones.map(n => ({ text: n, href: tel(n) })) },
  { icon: Mail, label: 'Write to us', lines: [{ text: contact.email.replace('@', '@​'), href: `mailto:${contact.email}` }] },
  { icon: MapPin, label: 'Visit the centre', lines: [{ text: contact.address.join(', '), href: contact.mapUrl }] },
  { icon: Clock, label: 'Opening hours', lines: [{ text: contact.hours }, { text: 'We are open on Sundays too' }] },
]

export function Contact() {
  const reduce = useReducedMotion()
  const hero = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.15])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '25%'])
  const heroFade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // No backend yet: the enquiry opens in the visitor's mail app, already filled in
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    const body = [`Name: ${get('name')}`, `Email: ${get('email')}`, `Phone: ${get('phone')}`, `Interested in: ${get('topic')}`, '', get('message')].join('\n')
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`Enquiry from ${get('name')}`)}&body=${encodeURIComponent(body)}`
  }

  return <main className="ct">
    <Header />

    <section ref={hero} className="ct-hero">
      <m.div className="ct-hero-media" style={{ scale: heroScale, y: heroY }}><Image src="/images/scuba.webp" alt="" fill sizes="100vw" priority /></m.div>
      <div className="ct-hero-shade" />
      <m.div className="ct-hero-content" style={{ opacity: heroFade }}>
        <p className={`eyebrow light ${enter({ y: 12, duration: 1, delay: 0.2 }).className}`} style={enter({ y: 12, duration: 1, delay: 0.2 }).style}>Contact us · Kovalam, Kerala</p>
        <h1><Mask delay={0.3}>Get in touch</Mask><br /><Mask delay={0.45}><i>with us.</i></Mask></h1>
        <div className={`ct-hero-foot ${enter({ duration: 1.2, delay: 1 }).className}`} style={enter({ duration: 1.2, delay: 1 }).style}>
          <p>Please address your queries to our scuba diving centre representative, who is at your service always.</p>
          <span className="ab-scroll">Scroll <ArrowDown /></span>
        </div>
      </m.div>
    </section>

    <section className="ct-cards">
      {cards.map((c, i) => <m.article key={c.label} className="ct-card" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={rise} custom={i}>
        <span className="ct-card-icon"><c.icon /></span>
        <p className="ct-card-label">{c.label}</p>
        {c.lines.map(l => 'href' in l && l.href
          ? <a key={l.text} href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{l.text}</a>
          : <span key={l.text}>{l.text}</span>)}
      </m.article>)}
    </section>

    <section className="ct-enquire section">
      <m.div className="ct-enquire-copy" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        <m.p className="eyebrow" variants={rise}>01 — Send an enquiry</m.p>
        <m.h2 variants={rise} custom={1}>Have a question?<br /><i>We are available.</i></m.h2>
        <m.p className="ab-lead" variants={rise} custom={2}>Tell us what you&apos;d like to try and when you&apos;re visiting Kovalam. Our team will get back to you with times, prices and everything you need to know.</m.p>
        <m.div className="ct-social" variants={rise} custom={3}>
          <p className="eyebrow">Follow along</p>
          <ul>{socials.map(([label, href]) => <li key={label}><a href={href} target="_blank" rel="noreferrer"><SocialIcon label={label} />{label}</a></li>)}</ul>
        </m.div>
      </m.div>

      <m.form className="ct-form" onSubmit={submit} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={rise} custom={1}>
        <div className="bp-fields">
          <label>Your name<input name="name" required autoComplete="name" placeholder="Full name" /></label>
          <label>Phone<input name="phone" type="tel" autoComplete="tel" placeholder="+91" /></label>
          <label className="ct-wide">Email<input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></label>
          <Picker className="ct-wide" label="Interested in" name="topic" groups={groups} placeholder="Choose an activity" />
          <label className="ct-wide">Your message<textarea name="message" rows={5} placeholder="Tell us a little about your plans" /></label>
        </div>
        <button type="submit" className="book-cta"><span className="book-cta-label"><strong>Submit now</strong><small>We reply within a day</small></span><span className="book-cta-icon"><ArrowRight /></span></button>
      </m.form>
    </section>

    <MapSection eyebrow="02 — Location" />
  </main>
}
