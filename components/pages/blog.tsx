'use client'

import Image from '@/components/ui/photo'
import Link from 'next/link'
import { m } from 'framer-motion'
import { ArrowRight, Clock, Newspaper } from 'lucide-react'
import { useEffect, useState } from 'react'
import { postDate, storyMonth, type Card, type StoryCard } from '@/data/blog'
import { PageIntro } from '@/components/pages/pages'

const ease = [0.19, 1, 0.22, 1] as const
const rise = { hidden: { opacity: 0, y: 40 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: i * 0.08 } }) }
const tabs = [['all', 'All'], ['blog', 'Blog'], ['news', 'In the news']] as const
type Tab = typeof tabs[number][0]

export function PostCard({ p, i, big = false }: { p: Card; i: number; big?: boolean }) {
  return <m.article className={big ? 'bl-card is-big' : 'bl-card'} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={rise} custom={i % 3}>
    <Link className="bl-card-media" href={`/blog/${p.slug}`} aria-label={p.title}>
      <Image src={p.image} alt="" fill sizes={big ? '(max-width: 800px) 100vw, 60vw' : '(max-width: 800px) 100vw, 33vw'} style={{ objectPosition: p.imagePosition }} />
      <span className="bl-topic">{p.topic}</span>
    </Link>
    <div className="bl-card-body">
      <p className="bl-meta"><time dateTime={p.date}>{postDate(p.date)}</time><span><Clock /> {p.readMins} min read</span></p>
      <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
      <p>{p.excerpt}</p>
      <Link className="text-link" href={`/blog/${p.slug}`}>Read article <ArrowRight /></Link>
    </div>
  </m.article>
}

// A press story card: the outlet stands in for the author, and older clippings may carry no date
export function StoryCardView({ s, i }: { s: StoryCard; i: number }) {
  return <m.article className="bl-card" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={rise} custom={i % 3}>
    <Link className="bl-card-media" href={`/news/${s.slug}`} aria-label={s.title}>
      <Image src={s.image} alt="" fill sizes="(max-width: 800px) 100vw, 33vw" />
      <span className="bl-topic">{s.topic}</span>
    </Link>
    <div className="bl-card-body">
      <p className="bl-meta"><span><Newspaper /> {s.outlet}</span>{s.month && <time dateTime={s.month}>{storyMonth(s.month)}</time>}</p>
      <h3><Link href={`/news/${s.slug}`}>{s.title}</Link></h3>
      <p>{s.excerpt}</p>
      <Link className="text-link" href={`/news/${s.slug}`}>Read story <ArrowRight /></Link>
    </div>
  </m.article>
}

// Blog articles and press coverage on one page; /news and /blog#news open straight on the coverage
export function BlogPage({ posts, news }: { posts: Card[]; news: StoryCard[] }) {
  const [tab, setTab] = useState<Tab>('all')
  useEffect(() => {
    const open = () => { const h = location.hash.slice(1); if (h === 'news' || h === 'blog') setTab(h) }
    open()
    addEventListener('hashchange', open)
    return () => removeEventListener('hashchange', open)
  }, [])
  const choose = (t: Tab) => { setTab(t); history.replaceState(null, '', t === 'all' ? location.pathname : `#${t}`) }
  const [lead, ...more] = posts

  return <main className="bl">
    <PageIntro eyebrow="Blog & news" title={<>Stories from<br /><i>beneath the waves.</i></>} copy="Diving guides and seasonal tips from our instructors, and the headlines Kovalam’s sea has made — from India’s first underwater wedding to the world’s first underwater CEO conference." image="/images/coral-reef.webp" />

    <section className="bl-wrap">
      <div className="bk-tabs bl-tabs" role="tablist" aria-label="Show">
        {tabs.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'is-on' : ''} onClick={() => choose(id)}>
          {label}<em>{id === 'all' ? posts.length + news.length : id === 'blog' ? posts.length : news.length}</em>
        </button>)}
      </div>

      {tab !== 'news' && <div id="blog" className="bl-section">
        <div className="bl-head"><p className="eyebrow">From the blog</p><h2>Guides & <i>stories.</i></h2></div>
        <div className="bl-grid">
          <PostCard p={lead} i={0} big />
          {more.map((p, i) => <PostCard key={p.slug} p={p} i={i + 1} />)}
        </div>
      </div>}

      {tab !== 'blog' && <div id="news" className="bl-section">
        <div className="bl-head"><p className="eyebrow">Bond Safari in the news</p><h2>Firsts beneath <i>the waves.</i></h2></div>
        <div className="bl-grid">{news.map((s, i) => <StoryCardView key={s.slug} s={s} i={i} />)}</div>
      </div>}
    </section>
  </main>
}
