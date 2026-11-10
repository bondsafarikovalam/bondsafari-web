'use client'

import Image from '@/components/ui/photo'
import Link from 'next/link'
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDown, ArrowRight, Award, Backpack, Clock, Compass, Eye, Gauge, Glasses, MapPin, Recycle, ShieldCheck, Shirt, Store, Target, Globe, Waves, BriefcaseBusiness, Users, Phone } from 'lucide-react'
import { useRef } from 'react'
import { contact } from '@/data/site'
import { Header } from '@/components/layout/header'
import { Mask as CssMask, enter } from '@/components/layout/intro'

const ease = [0.19, 1, 0.22, 1] as const
const teamPhoto = '/images/team.webp'

const history = 'Bond Safari Kovalam, part of the Bond Group of Companies, is a team of adventurous and experienced Indian businessmen, partnered with Cool Divers SL from Spain to bring a state-of-the-art scuba diving experience to Kerala, India.'

const historyMore = [
  { title: 'How it began', text: 'Our name comes from BOND, the Breathing Observatory Nautical Device: a self-propelled underwater scooter built with technology from Majorca, Spain. Riders steer it themselves, with a dive master and guide close by, and no swimming is needed. It gave guests an easy first step into a world most had only seen from the shore.' },
  { title: 'Where we are today', text: 'For many guests, that first ride was only the beginning, and scuba diving is now at the heart of what we do. From our centre on Beach Road, Kovalam, the team runs sea and freshwater dives, snorkelling, parasailing, kayaking and coracle rides, along with PADI courses through Bond Academy.' },
]

const stats = [
  { value: '5★', label: 'PADI IDC Dive Resort' },
  { value: '186', label: 'Countries recognise PADI' },
  { value: '1M', label: 'Ocean ambassadors — our goal' },
  { value: '1,000+', label: 'Direct jobs we aim to create' },
]

const leaderGoals = [
  { icon: Globe, label: 'UN SDG goals' },
  { icon: Waves, label: '1M ocean ambassadors' },
  { icon: BriefcaseBusiness, label: '1,000 direct jobs' },
  { icon: Users, label: '100,000 indirect jobs' },
]

const blueChef = {
  photos: [
    { src: '/images/blue-chef-launch.webp', alt: 'Guests on stage holding up the Blue Chef logo at the launch', sizes: '(max-width: 800px) 100vw, 580px' },
    { src: '/images/blue-chef-lamp.webp', alt: 'Guests watching the ceremonial lamp being lit at the Blue Chef launch', sizes: '(max-width: 800px) 50vw, 290px' },
    { src: '/images/blue-chef-speaker.webp', alt: 'A speaker smiling at the Ocean Love podium during the launch', sizes: '(max-width: 800px) 50vw, 290px' },
  ],
  press: { src: '/images/blue-chef-press-mangalam.webp', alt: 'Mangalam newspaper clipping showing the lamp being lit at the seminar in Kovalam', paper: 'Mangalam', edition: 'Thiruvananthapuram edition · 9 June 2026, page 2', text: 'D. Venkitesan, Regional Director (South), Union Ministry of Tourism, inaugurating the seminar at Kovalam by lighting the lamp.' },
}

const milestones = [
  { date: 'Jun 2026', title: 'Blue Chef Initiative', text: 'A sustainable seafood and ocean conservation programme with UDS Group of Hotels, Planet Ocean Foundation and Ocean Love.', feature: true },
  { date: 'Jan 2017', title: 'India’s first underwater wedding', text: 'On 26 January, Bond Safari dive instructor Nikhil Pawar married Eunika Pogran 4 metres below the surface at Grove Beach, Kovalam. The team built an underwater stage from coconut palms, wood and leaves, where the couple exchanged rings and shell garlands and said their vows with placards.' },
  { date: 'Mar 2017', title: 'India’s first women-only ocean clean-up', text: 'For Women’s Day, we joined Red FM 93.5 for its No Plastic Challenge at Kovalam. Women from public service, medicine, IT and media, including K Vasuki IAS of the Kerala Suchitwa Mission, dived to collect plastic from the sea floor.' },
  { date: 'Apr 2017', title: 'World’s first underwater corporate conference', text: 'Five business leaders, from companies including TCS and UST Global, dived off Grove Beach to a U-shaped table on the seabed, about 6 metres down. In a 20-minute meeting they pledged to protect marine life, as part of our Ocean Love campaign against marine pollution and global warming.' },
  { date: 'Ongoing', title: 'India’s first mermaid performances', text: 'Mermaid-themed underwater shows that bring the ocean’s magic to new audiences.' },
]

const awards = [
  { title: 'Governor’s Special Award', by: 'Governor of Kerala', text: 'Honoured by the Governor of Kerala for exceptional support to the Indian Army across a range of initiatives.', image: '/images/award-governor-kerala.webp', alt: 'The Governor of Kerala presenting the Governor’s Special Award to the Bond Safari team' },
  { title: 'Indian Army Civilian Coordination Award', by: 'Indian Army', text: 'For a world-record underwater portrait of Kargil War hero Captain Vikram Batra.', image: '/images/award-indian-army.webp', alt: 'An Indian Army officer presenting medals to Bond Safari divers beside a pool' },
  { title: 'SATA Award 2023', by: 'South Asian Travel Awards', text: 'Best Water Sports Activity Service Provider in South India.', image: '/images/award-sata-2023.webp', alt: 'Bond Safari receiving the SATA 2023 winner’s plaque on stage' },
  { title: 'National Adventure Tourism Leadership Award', by: 'Chief Minister of Jammu & Kashmir', text: 'Presented by the Chief Minister of Jammu & Kashmir.', image: '/images/award-jk-leadership.webp', alt: 'The Chief Minister of Jammu & Kashmir presenting the Excellence Award 2026 plaque to the Bond Safari founder on stage' },
]

const network = [
  { name: 'Cristina Zenato, “The Shark Whisperer”', text: 'Bahamas-based shark conservationist and cave diver with 25+ years removing fishing hooks from Caribbean reef sharks.', image: '/images/network-cristina-zenato-hd.webp', alt: 'Cristina Zenato with the Bond team at ADEX' },
  { name: 'Ahmed Gabr, World Record Diver', text: 'Former Egyptian Army officer who set the Guinness World Record for the deepest scuba dive at 332.35 metres.', image: '/images/network-ahmed-gabr-hd.webp', alt: 'Ahmed Gabr with the Bond team' },
  { name: 'Michael AW, Ocean Geographic', text: 'Underwater photographer and founder of Ocean Geographic & Asian Geographic magazines.', image: '/images/network-michael-aw-hd.webp', alt: 'Michael AW with the Bond team at his exhibition stand' },
  { name: 'Director, Deep Dive Dubai', text: 'Founder of the Global Underwater Explorers Foundation.', image: '/images/network-deep-dive-dubai-hd.webp', alt: 'The Director of Deep Dive Dubai with the Bond team' },
  { name: 'Maldives President', text: 'Direct engagement at the heart of the Maldives’ marine tourism industry.', image: '/images/network-maldives-president-hd.webp', alt: 'The Maldives President meeting the Bond team at their stand' },
  { name: 'Maldives Vice President', text: 'Strong connections across the Maldivian tourism ecosystem.', image: '/images/network-maldives-vp-hd.webp', alt: 'The Maldives Vice President meeting the Bond team at their stand' },
  { name: 'Maldives Former President', text: 'Plus key boating associations, resorts and yacht charter companies.', image: '/images/network-maldives-former-president-hd.webp', alt: 'The Maldives Former President meeting the Bond team' },
  { name: 'PADI Platinum Course Director', text: 'Conducted a full Instructor Development Training Program on-site in Kovalam.', image: '/images/network-padi-course-director-hd.webp', alt: 'A PADI Platinum Course Director training students in Kovalam' },
  { name: 'With Hydroman', text: 'Met at the Singapore Ocean Week ADEX Ocean Festival 2024.', image: '/images/network-hydroman-hd.webp', alt: 'The Bond team with Hydroman at the ADEX Ocean Festival' },
]

const partners = [
  { name: 'Planet Ocean Foundation', logo: '/images/partner-planet-ocean.webp' },
  { name: 'IODA', logo: '/images/partner-ioda.webp' },
  { name: 'KATPS, Kerala Adventure Tourism Promotion Society', logo: '/images/partner-katps.webp' },
  { name: 'Shark Guardian', logo: '/images/partner-shark-guardian.webp', dark: true },
  { name: 'Manta Trust', logo: '/images/partner-manta-trust.webp', dark: true },
  { name: 'PADI', logo: '/images/partner-padi.webp' },
]

const pillars = [
  { icon: Target, label: 'Our goal', title: 'State-of-the-art adventure', text: 'To develop state-of-the-art adventure tourism products in India.' },
  { icon: Eye, label: 'Our vision', title: 'Revolutionise adventure tourism', text: 'To revolutionise the adventure tourism industry in India through innovative and exciting adventure tourism products.' },
  { icon: Compass, label: 'Our mission', title: 'World-class partners', text: 'To partner with companies operating across the world with revolutionary, adrenaline-pumping yet absolutely safe adventure products — and bring them to the right Indian market.' },
]

const ocean = [
  { icon: Waves, title: 'The Ocean Love campaign', text: 'Our campaign to clear plastic from the ocean and raise public awareness of marine pollution and global warming.' },
  { icon: Recycle, title: 'Beach clean-ups', text: 'Most floating trash comes from the shore, so the team collects rubbish on the beach as well as in the water, often with help from guests.' },
  { icon: Globe, title: 'One million ocean ambassadors', text: 'Our goal is to train one million lifelong ocean ambassadors, in support of the UN Sustainable Development Goals.' },
]

const activities = ['Snorkel', 'Dive', 'Swim', 'Sail', 'Get suntanned']

const store = [
  { icon: Backpack, title: 'Rental equipment', text: 'Quality gear, ready for the day' },
  { icon: Compass, title: 'Diving & snorkelling gear', text: 'A fully stocked retail shop' },
  { icon: Gauge, title: 'Dive computers', text: 'Track every descent' },
  { icon: Shirt, title: 'Wetsuits', text: 'For warm tropical waters' },
  { icon: ShieldCheck, title: 'Rash guards', text: 'Sun and reef protection' },
  { icon: Glasses, title: 'Goggles', text: 'See the marine world clearly' },
]

// Title lines slide up from behind their masks, in CSS so they show without waiting for JavaScript
const Mask = (props: { children: React.ReactNode; delay?: number }) => <CssMask from="105%" duration={1.6} {...props} />

// Words brighten one by one as the paragraph scrolls through the viewport
function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [i / total, (i + 1) / total], [0.14, 1])
  return <m.span style={{ opacity }}>{word} </m.span>
}
function ScrollText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  if (reduce) return <p className="ab-history-text">{text}</p>
  return <p ref={ref} className="ab-history-text" aria-label={text}>{words.map((w, i) => <Word key={i} word={w} i={i} total={words.length} progress={scrollYProgress} />)}</p>
}

const rise = { hidden: { opacity: 0, y: 40 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: i * 0.12 } }) }

// Leadership: the photo wipes open from the left while it settles from a slight zoom, then the name rises word by word
const wipe = { hidden: { clipPath: 'inset(0% 100% 0% 0% round 28px)' }, show: { clipPath: 'inset(0% 0% 0% 0% round 28px)', transition: { duration: 1.4, ease } } }
const settle = { hidden: { scale: 1.25 }, show: { scale: 1, transition: { duration: 1.8, ease } } }
const wordUp = { hidden: { y: '110%' }, show: (i = 0) => ({ y: '0%', transition: { duration: 1, ease, delay: 0.35 + i * 0.1 } }) }
const chipIn = { hidden: { opacity: 0, y: 14, scale: 0.85 }, show: (i = 0) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease, delay: 0.9 + i * 0.08 } }) }
const fade = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }

// Awards: each photo rises out of its frame and settles from a zoom, a beat after its card arrives
const awardCard = { hidden: { opacity: 0, y: 60 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1.1, ease, delay: i * 0.15 } }) }
const awardPhoto = { hidden: { clipPath: 'inset(100% 0% 0% 0%)' }, show: (i = 0) => ({ clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.3, ease, delay: 0.15 + i * 0.15 } }) }
const awardZoom = { hidden: { scale: 1.3 }, show: (i = 0) => ({ scale: 1, transition: { duration: 1.8, ease, delay: 0.15 + i * 0.15 } }) }

// Blue Chef: the big photo wipes open from the left, the two smaller ones from below, each settling from a zoom in turn
const chefPhoto = { hidden: (i = 0) => ({ clipPath: i ? 'inset(100% 0% 0% 0% round 16px)' : 'inset(0% 100% 0% 0% round 16px)' }), show: (i = 0) => ({ clipPath: 'inset(0% 0% 0% 0% round 16px)', transition: { duration: 1.3, ease, delay: i * 0.18 } }) }
const chefZoom = { hidden: { scale: 1.3 }, show: (i = 0) => ({ scale: 1, transition: { duration: 1.8, ease, delay: i * 0.18 } }) }

export function About() {
  const reduce = useReducedMotion()
  const hero = useRef<HTMLElement>(null)
  const collage = useRef<HTMLDivElement>(null)
  const band = useRef<HTMLElement>(null)
  const { scrollYProgress: heroP } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const heroScale = useTransform(heroP, [0, 1], [1, reduce ? 1 : 1.18])
  const heroY = useTransform(heroP, [0, 1], ['0%', reduce ? '0%' : '30%'])
  const heroFade = useTransform(heroP, [0, 0.7], [1, 0])
  const { scrollYProgress: colP } = useScroll({ target: collage, offset: ['start end', 'end start'] })
  const backY = useTransform(colP, [0, 1], reduce ? ['0%', '0%'] : ['10%', '-10%'])
  const frontY = useTransform(colP, [0, 1], reduce ? ['0%', '0%'] : ['30%', '-25%'])
  const { scrollYProgress: bandP } = useScroll({ target: band, offset: ['start end', 'end start'] })
  const bandY = useTransform(bandP, [0, 1], reduce ? ['0%', '0%'] : ['-12%', '12%'])
  const bandClip = useTransform(bandP, [0, 0.45], reduce ? ['inset(0% 0% round 0px)', 'inset(0% 0% round 0px)'] : ['inset(8% 10% round 32px)', 'inset(0% 0% round 0px)'])
  const leader = useRef<HTMLDivElement>(null)
  const { scrollYProgress: leaderP } = useScroll({ target: leader, offset: ['start end', 'end start'] })
  const leaderY = useTransform(leaderP, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%'])

  return <main className="ab">
    <Header />

    <section ref={hero} className="ab-hero">
      <m.div className="ab-hero-media" style={{ scale: heroScale, y: heroY }}><Image src="/images/dive-safari.webp" alt="" fill sizes="100vw" priority /></m.div>
      <div className="ab-hero-shade" />
      <m.div className="ab-hero-content" style={{ opacity: heroFade }}>
        <p className={`eyebrow light ${enter({ y: 12, duration: 1, delay: 0.2 }).className}`} style={enter({ y: 12, duration: 1, delay: 0.2 }).style}>Our history · Kovalam, Kerala</p>
        <h1><Mask delay={0.3}>Born in Kerala.</Mask><br /><Mask delay={0.45}><i>Built for the deep.</i></Mask></h1>
        <div className={`ab-hero-foot ${enter({ duration: 1.2, delay: 1 }).className}`} style={enter({ duration: 1.2, delay: 1 }).style}>
          <span className="ab-partner"><b>In partnership with</b>Cool Divers SL · Spain</span>
          <span className="ab-scroll">Scroll <ArrowDown /></span>
        </div>
      </m.div>
    </section>

    <section className="ab-history section">
      <m.p className="eyebrow" initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise}>01 — Our history</m.p>
      <ScrollText text={history} />
      <div className="ab-history-more">
        {historyMore.map((h, i) => <m.div key={h.title} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={rise} custom={i}>
          <h3>{h.title}</h3><p>{h.text}</p>
        </m.div>)}
      </div>
      <div className="ab-stats">
        {stats.map((s, i) => <m.div key={s.label} className="ab-stat" initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} custom={i}>
          <strong>{s.value}</strong><span>{s.label}</span>
        </m.div>)}
      </div>
    </section>

    <section className="ab-pillars section">
      <div className="ab-pillars-head">
        <m.p className="eyebrow light" initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise}>02 — What drives us</m.p>
        <m.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} custom={1}>Goal, vision<br /><i>&amp; mission.</i></m.h2>
      </div>
      <div className="ab-pillar-grid">
        {pillars.map((p, i) => <m.article key={p.label} className="ab-pillar" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={rise} custom={i}>
          <div className="ab-pillar-top"><span className="ab-pillar-num">{String(i + 1).padStart(2, '0')}</span><span className="ab-pillar-icon"><p.icon /></span></div>
          <p className="ab-pillar-label">{p.label}</p>
          <h3>{p.title}</h3>
          <p>{p.text}</p>
        </m.article>)}
      </div>
    </section>

    <div className="ab-marquee" aria-hidden="true"><div>{[0, 1].map(k => <span key={k}>{activities.map(a => <em key={a}>{a}<i>✦</i></em>)}</span>)}</div></div>

    <section className="ab-welcome section">
      <div ref={collage} className="ab-collage">
        <m.div className="ab-collage-back" style={{ y: backY }}><Image src="/images/sea-life.webp" alt="Marine life at Kovalam" fill sizes="(max-width: 800px) 80vw, 34vw" /></m.div>
        <m.div className="ab-collage-front" style={{ y: frontY }}><Image src="/images/scuba.webp" alt="A diver exploring underwater" fill sizes="(max-width: 800px) 55vw, 22vw" /></m.div>
        <span className="ab-collage-badge">On &amp;<br /><i>under</i><br />the water</span>
      </div>
      <m.div className="ab-welcome-copy" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        <m.p className="eyebrow" variants={rise}>03 — Welcome aboard</m.p>
        <m.h2 variants={rise} custom={1}>Explore a world<br /><i>on &amp; under the water.</i></m.h2>
        <m.p className="ab-lead" variants={rise} custom={2}>Come visit us and spend some time with our professional, courteous and fun-loving scuba diving team in Kerala. Let us take you on a wonderful journey on one of our beautiful, well-maintained boats.</m.p>
        <m.ul className="ab-chips" variants={rise} custom={3}>{activities.map(a => <li key={a}>{a}</li>)}</m.ul>
        <m.p className="ab-note" variants={rise} custom={4}>No matter which water activity you choose, we have all the quality equipment and supplies you need to get the most out of your vacation.</m.p>
      </m.div>
    </section>

    <section ref={band} className="ab-band">
      <m.div className="ab-band-frame" style={{ clipPath: bandClip }}>
        <m.div className="ab-band-media" style={{ y: bandY }}><Image src={teamPhoto} alt="The Bond Safari dive team taking an ocean pledge on Kovalam beach" fill sizes="100vw" /></m.div>
        <div className="ab-band-caption"><p className="eyebrow light">The team</p><p>Professional, courteous &amp; fun-loving.</p></div>
      </m.div>
    </section>

    <section className="ab-leader section">
      <m.div ref={leader} className="ab-leader-split" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        <m.div className="ab-leader-photo" variants={reduce ? fade : wipe}><m.div className="ab-leader-media" variants={reduce ? fade : settle} style={{ y: leaderY }}><Image src="/images/jackson-peter.jpg" alt="Jackson Peter, Managing Director, Bond Group of Companies, with his quote on training lifelong Ocean Ambassadors" fill sizes="(max-width: 800px) 100vw, 45vw" /></m.div></m.div>
        <div className="ab-leader-body">
          <m.p className="eyebrow" variants={reduce ? fade : rise} custom={1}>04 — Leadership</m.p>
          <h2 aria-label="Jackson Peter">{['Jackson', 'Peter'].map((w, i) => <span key={w} className="ab-leader-word" aria-hidden="true"><m.span variants={reduce ? fade : wordUp} custom={i}>{w}</m.span></span>)}</h2>
          <m.p className="ab-leader-role" variants={reduce ? fade : rise} custom={4}>Managing Director, Bond Group of Companies</m.p>
          <m.p className="ab-leader-bio" variants={reduce ? fade : rise} custom={5}>An award-winning adventure entrepreneur who put Kovalam on India’s underwater map. Jackson leads Bond Safari’s work across water sports and marine tourism, from India’s first underwater wedding to the world’s first underwater CEO conference, always with the same aim: safe, sustainable ocean experiences that create jobs on the coast.</m.p>
          <m.p className="ab-note" variants={reduce ? fade : rise} custom={6}>“The ocean is another world in itself, which includes mountains, caves, plants and different types of animals.”</m.p>
          <ul className="ab-leader-goals">{leaderGoals.map(({ icon: Icon, label }, i) => <m.li key={label} variants={reduce ? fade : chipIn} custom={i}><Icon />{label}</m.li>)}</ul>
          <m.div className="ab-leader-actions" variants={reduce ? fade : rise} custom={9}>
            <a className="pill pill-dark" href="https://www.instagram.com/jackson.peter.aj/" target="_blank" rel="noreferrer">Meet Jackson <ArrowRight /></a>
            <a className="pill pill-line" href={`tel:${contact.phones[0].replace(/\s/g, '')}`}><Phone />{contact.phones[0]}</a>
          </m.div>
        </div>
      </m.div>
    </section>

    <section className="ab-milestones section">
      <m.div initial="hidden" whileInView="show" viewport={{ once: true }}>
        <m.p className="eyebrow light" variants={rise}>05 — Firsts &amp; milestones</m.p>
        <m.h2 variants={rise} custom={1}>Making history<br /><i>underwater.</i></m.h2>
      </m.div>
      <ol className="ab-timeline">
        {milestones.map((ms, i) => <m.li key={ms.title} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={rise} custom={i % 2}>
          <span className="ab-timeline-date">{ms.date}</span>
          <div>
            <h3>{ms.title}</h3><p>{ms.text}</p>
            {ms.feature && <>
              <m.div className="ab-timeline-photos" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>{blueChef.photos.map((ph, i) => <m.div key={ph.src} className="ab-timeline-photo" variants={reduce ? fade : chefPhoto} custom={i}><m.div className="ab-timeline-media" variants={reduce ? fade : chefZoom} custom={i}><Image src={ph.src} alt={ph.alt} fill sizes={ph.sizes} /></m.div></m.div>)}</m.div>
              <m.figure className="ab-timeline-press" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={reduce ? fade : rise}>
                <a href={blueChef.press.src} target="_blank" rel="noreferrer" aria-label={'Open the ' + blueChef.press.paper + ' clipping full size'}><Image src={blueChef.press.src} alt={blueChef.press.alt} fill sizes="(max-width: 800px) 100vw, 320px" /></a>
                <figcaption><span>In the press</span><h4>{blueChef.press.paper}</h4><small>{blueChef.press.edition}</small><p>{blueChef.press.text}</p></figcaption>
              </m.figure>
            </>}
          </div>
        </m.li>)}
      </ol>
    </section>

    <section className="ab-awards section">
      <div className="ab-centre-head">
        <m.div initial="hidden" whileInView="show" viewport={{ once: true }}>
          <m.p className="eyebrow" variants={rise}>06 — Awards &amp; recognition</m.p>
          <m.h2 variants={rise} custom={1}>Honoured on<br /><i>national stages.</i></m.h2>
        </m.div>
        <m.p className="ab-lead" initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} custom={2}>From the Governor of Kerala to the Chief Minister of Jammu &amp; Kashmir, the Bond Group’s work has earned recognition far beyond Kovalam.</m.p>
      </div>
      <m.div className="ab-award-grid" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
        {awards.map((a, i) => <m.article key={a.title} className="ab-award" variants={reduce ? fade : awardCard} custom={i}>
          <m.div className="ab-award-photo" variants={reduce ? fade : awardPhoto} custom={i}>
            <m.div className="ab-award-media" variants={reduce ? fade : awardZoom} custom={i}><Image src={a.image} alt={a.alt} fill sizes="(max-width: 800px) 100vw, 50vw" /></m.div>
            <span className="ab-award-by"><Award />{a.by}</span>
          </m.div>
          <div className="ab-award-body"><h3>{a.title}</h3><p>{a.text}</p></div>
        </m.article>)}
      </m.div>
    </section>

    <section className="ab-centre section">
      <div className="ab-centre-head ab-network-head">
        <m.div initial="hidden" whileInView="show" viewport={{ once: true }}>
          <m.p className="eyebrow" variants={rise}>07 — Global network</m.p>
          <m.h2 variants={rise} custom={1}>In rooms with the people<br /><i>shaping this industry.</i></m.h2>
        </m.div>
        <m.p className="ab-lead" initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} custom={2}>Our students train under an academy with real relationships across the global diving and ocean conservation world.</m.p>
      </div>
      <div className="ab-network">
        {network.map((n, i) => <m.article key={n.name} className="ab-network-card" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={rise} custom={i % 3}>
          <div className="ab-network-photo"><Image src={n.image} alt={n.alt} fill sizes="140px" /></div>
          <div><h3>{n.name}</h3><p>{n.text}</p></div>
        </m.article>)}
      </div>
    </section>

    <section className="ab-centre section">
      <div className="ab-centre-head">
        <m.div initial="hidden" whileInView="show" viewport={{ once: true }}>
          <m.p className="eyebrow" variants={rise}>08 — Visit our scuba diving centre</m.p>
          <m.h2 variants={rise} custom={1}>Everything you need,<br /><i>in one place.</i></m.h2>
        </m.div>
        <m.p className="ab-lead" initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} custom={2}>Our diving centre has quality rental equipment and a fully stocked retail shop, with just about anything you need for the beautiful tropical waters of Kerala.</m.p>
      </div>
      <div className="ab-store">
        {store.map((s, i) => <m.div key={s.title} className="ab-store-item" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={rise} custom={i % 3}>
          <span className="ab-store-icon"><s.icon /></span>
          <div><h3>{s.title}</h3><p>{s.text}</p></div>
        </m.div>)}
      </div>
      <m.div className="ab-visit" initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise}>
        <p className="ab-visit-extra"><Store /> Our store also carries shirts, shorts, shoes and caps for when you aren’t on the water.</p>
        <div className="ab-visit-info">
          <a href={contact.mapUrl} target="_blank" rel="noreferrer"><MapPin /><span>{contact.address.join(', ')}</span></a>
          <span><Clock /><span>{contact.hours}</span></span>
        </div>
      </m.div>
    </section>

    <section className="ab-centre section">
      <div className="ab-centre-head">
        <m.div initial="hidden" whileInView="show" viewport={{ once: true }}>
          <m.p className="eyebrow" variants={rise}>09 — Ocean Love</m.p>
          <m.h2 variants={rise} custom={1}>Protecting the sea<br /><i>we dive in.</i></m.h2>
        </m.div>
        <m.p className="ab-lead" initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} custom={2}>More than three billion people depend on marine and coastal biodiversity for their livelihoods. Ocean Love is how we turn time in the water into care for it.</m.p>
      </div>
      <div className="ab-store">
        {ocean.map((o, i) => <m.div key={o.title} className="ab-store-item" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={rise} custom={i}>
          <span className="ab-store-icon"><o.icon /></span>
          <div><h3>{o.title}</h3><p>{o.text}</p></div>
        </m.div>)}
      </div>
    </section>

    <section className="ab-partners">
      <m.div className="ab-partners-head" initial="hidden" whileInView="show" viewport={{ once: true }}>
        <m.p className="eyebrow" variants={rise}>10 — Conservation partners</m.p>
        <m.h2 variants={rise} custom={1}>Stronger together<br /><i>for the ocean.</i></m.h2>
        <m.p className="ab-lead" variants={rise} custom={2}>The organisations we work alongside to protect the sea.</m.p>
      </m.div>
      <div className="ab-logos">
        <div className="ab-logos-track">
          {[0, 1, 2, 3].map(k => <ul key={k} aria-hidden={k > 0 || undefined}>
            {partners.map(p => <li key={p.name} className={p.dark ? 'dark' : undefined}><span><Image src={p.logo} alt={k ? '' : p.name} fill sizes="180px" /></span></li>)}
          </ul>)}
        </div>
      </div>
    </section>

    <section className="ab-cta">
      <Image src="/images/sea-life.webp" alt="" fill sizes="100vw" />
      <m.div className="ab-cta-inner" initial="hidden" whileInView="show" viewport={{ once: true }}>
        <m.p className="eyebrow light" variants={rise}>Your next story</m.p>
        <m.h2 variants={rise} custom={1}>Start your underwater<br /><i>adventure now.</i></m.h2>
        <m.div className="ab-cta-actions" variants={rise} custom={2}>
          <Link className="book-cta" href="/booking"><span className="book-cta-label"><strong>Book now</strong><small>Reserve your spot</small></span><span className="book-cta-icon"><ArrowRight /></span></Link>
          <Link className="text-link light" href="/contact">Get in touch <ArrowRight /></Link>
        </m.div>
      </m.div>
    </section>
  </main>
}
