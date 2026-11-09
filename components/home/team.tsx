'use client'

import Image from '@/components/ui/photo'
import Link from 'next/link'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Award, Globe, LifeBuoy } from 'lucide-react'
import { useRef } from 'react'

const ease = [0.19, 1, 0.22, 1] as const
const rise = { hidden: { opacity: 0, y: 36 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1.1, ease, delay: i * 0.1 } }) }
const teamPhoto = '/images/team.webp'

const chips = ['PADI professionals', 'International staff', 'Cool Divers SL · Spain']

const points = [
  { icon: Award, title: 'Well trained & equipped', text: 'A dedicated team trained to make your sea adventure vibrant, beautiful and safe.' },
  { icon: LifeBuoy, title: 'Always at your service', text: 'Beside you as you learn, explore and experience the marvels of nature underwater.' },
  { icon: Globe, title: 'Indian & Spanish expertise', text: 'Experienced Indian founders partnered with Cool Divers SL from Spain.' },
]

export function TeamSection() {
  const reduce = useReducedMotion()
  const photo = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: photo, offset: ['start end', 'end start'] })
  // The frame opens from an inset, rounded window to full width as it scrolls into view
  const clip = useTransform(scrollYProgress, [0, 0.45], reduce ? ['inset(0% 0% round 32px)', 'inset(0% 0% round 32px)'] : ['inset(10% 12% round 48px)', 'inset(0% 0% round 32px)'])
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-10%', '10%'])
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [reduce ? 1 : 1.2, 1])

  return <section className="team section" aria-labelledby="team-title">
    <div className="team-head">
      <m.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        <m.p className="eyebrow" variants={rise}>Meet our scuba diving advisors</m.p>
        <m.h2 id="team-title" variants={rise} custom={1}>Dive with people<br /><i>who live for the sea.</i></m.h2>
      </m.div>
      <m.div className="team-intro" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        <m.p variants={rise} custom={2}>Meet our Bond Safari divers team — well trained and equipped to make your sea adventure vibrant and beautiful. As a dedicated team, they will always be there to guide you on your journey of learning and experiencing the marvels of nature underwater.</m.p>
        <m.p className="team-quote" variants={rise} custom={3}>So come in, relax, and dive with some of our most professional international staff.</m.p>
      </m.div>
    </div>

    <div ref={photo} className="team-photo">
      <m.div className="team-frame" style={{ clipPath: clip }}>
        <m.div className="team-img" style={{ y: imgY, scale: imgScale }}><Image src={teamPhoto} alt="The Bond Safari dive team on Kovalam beach" fill sizes="(max-width: 800px) 100vw, 84vw" /></m.div>
        <div className="team-shade" />
        <ul className="team-chips">{chips.map((c, i) => <m.li key={c} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 1, ease, delay: 0.3 + i * 0.12 }}><i />{c}</m.li>)}</ul>
        <m.div className="team-caption" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1.2, ease, delay: 0.2 }}>
          <span>Dive the adventure</span>
          <p>Scuba diving in Kerala<br /><i>with Bond Safari.</i></p>
        </m.div>
      </m.div>
    </div>

    <div className="team-story">
      <m.div className="team-story-copy" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        <m.p className="eyebrow" variants={rise}>Our scuba diving team</m.p>
        <m.p className="team-lead" variants={rise} custom={1}>A team of adventurous, experienced Indian entrepreneurs, partnered with <em>Cool Divers SL</em> from Spain to bring a state-of-the-art diving experience to Kerala.</m.p>
        <m.p className="team-goal" variants={rise} custom={2}><b>Our goal</b> — to develop state-of-the-art adventure tourism products in India.</m.p>
        <m.div className="team-actions" variants={rise} custom={3}>
          <Link className="book-cta" href="/booking"><span className="book-cta-label"><strong>Dive with us</strong><small>Reserve your spot</small></span><span className="book-cta-icon"><ArrowRight /></span></Link>
          <Link className="text-link" href="/about">Our story <ArrowRight /></Link>
        </m.div>
      </m.div>
      <ol className="team-points">
        {points.map((p, i) => <m.li key={p.title} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={rise} custom={i}>
          <span className="team-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="team-icon"><p.icon /></span>
          <div><h3>{p.title}</h3><p>{p.text}</p></div>
        </m.li>)}
      </ol>
    </div>
  </section>
}
