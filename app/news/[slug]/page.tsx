import Image from '@/components/ui/photo'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Newspaper, Phone } from 'lucide-react'
import { stories, storyCard, storyMonth, storyOf } from '@/data/blog'
import { Header } from '@/components/layout/header'
import { StoryCardView } from '@/components/pages/blog'
import { ArticleBody, headingId } from '@/components/pages/article-body'
import { contact } from '@/data/site'
import { JsonLd, abs, breadcrumbLd, pageMeta } from '@/lib/seo'

export const generateStaticParams = () => stories.map(s => ({ slug: s.slug }))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = storyOf((await params).slug)
  return s ? pageMeta({ title: `${s.title} – ${s.outlet} | Bond Safari`, description: s.excerpt, path: `/news/${s.slug}`, image: s.image, type: 'article' }) : { title: 'News | Bond Safari' }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const s = storyOf((await params).slug)
  if (!s) notFound()
  const contents = s.body.flatMap(b => 'h' in b ? [b.h] : [])
  // Other outlets that covered the same event
  const alsoIn = stories.filter(x => x.slug !== s.slug && x.topic === s.topic)
  // More coverage of the same event first, then the rest
  const others = [...stories.filter(x => x.slug !== s.slug && x.topic === s.topic), ...stories.filter(x => x.topic !== s.topic)].slice(0, 3).map(storyCard)
  const article = { '@context': 'https://schema.org', '@type': 'Article', headline: s.title, description: s.excerpt, image: abs(s.image), mainEntityOfPage: abs(`/news/${s.slug}`), ...(s.month && { datePublished: s.month }), publisher: { '@type': 'Organization', name: s.outlet } }
  return <main className="bl">
    <JsonLd data={[breadcrumbLd([['Home', '/'], ['Blog & News', '/blog'], ['In the news', '/blog#news']]), article]} />
    <Header />
    <section className="page-intro bl-hero">
      <Link className="bl-hero-back" href="/blog#news"><span><ArrowLeft /></span>All news</Link>
      <Image src={s.image} alt="" fill sizes="100vw" priority />
      <div>
        <p className="eyebrow light">{s.topic}</p>
        <h1>{s.title}</h1>
        <p className="bl-meta light"><span>{s.outlet}</span>{s.month && <time dateTime={s.month}>{storyMonth(s.month)}</time>}<span><Clock /> {s.readMins} min read</span></p>
      </div>
    </section>
    <div className="bl-layout">
      <article className="bl-article">
        <p className="bl-source">As covered by {s.outlet}</p>
        <p className="bl-lead">{s.excerpt}</p>
        <ArticleBody body={s.body} />
        <Link className="book-cta bl-cta" href="/activities/scuba-diving"><span className="book-cta-label"><strong>Dive with Bond Safari</strong></span><span className="book-cta-icon"><ArrowRight /></span></Link>
      </article>
      <aside className="bl-aside">
        <div className="bl-aside-card">
          <p className="eyebrow">{s.topic}</p>
          <p className="bl-aside-meta"><span><Newspaper /> {s.outlet}</span>{s.month && <span><CalendarDays /><time dateTime={s.month}>{storyMonth(s.month)}</time></span>}<span><Clock /> {s.readMins} min read</span></p>
          {contents.length > 1 && <nav aria-label="In this story"><p className="bl-aside-label">In this story</p><ol>{contents.map(h => <li key={h}><a href={`#${headingId(h)}`}>{h}</a></li>)}</ol></nav>}
          {alsoIn.length > 0 && <nav aria-label="Also covered by"><p className="bl-aside-label">Also covered by</p><ul className="bl-aside-outlets">{alsoIn.slice(0, 6).map(x => <li key={x.slug}><Link href={`/news/${x.slug}`}>{x.outlet}<ArrowRight /></Link></li>)}</ul></nav>}
        </div>
        {/* <div className="bl-aside-card is-dark">
          <p className="bl-aside-label">Be part of the story</p>
          <p className="bl-aside-title">Feel the marvels <i>hidden beneath.</i></p>
          <Link className="book-cta" href="/activities/scuba-diving"><span className="book-cta-label"><strong>Dive with us</strong></span><span className="book-cta-icon"><ArrowRight /></span></Link>
          <a className="bl-aside-call" href={`tel:${contact.phones[0].replace(/\s/g, '')}`}><Phone /> {contact.phones[0]}</a>
        </div> */}
           <div className="bl-aside-card is-dark">
          <p className="bl-aside-label">Be part of the story</p>
          <p className="bl-aside-title">Feel the marvels <i>hidden beneath.</i></p>
          <Link className="book-cta" href="/activities/scuba-diving"><span className="book-cta-label"><strong>Dive with us</strong></span><span className="book-cta-icon"><ArrowRight /></span></Link>
          <a className="bl-aside-call" href={`tel:${contact.phones[0].replace(/\s/g, '')}`}><Phone /> {contact.phones[0]}</a>
        </div>
      </aside>
    </div>
    {others.length > 0 && <section className="bl-wrap bl-more">
      <div className="bl-head"><p className="eyebrow">In the news</p><h2>More <i>coverage.</i></h2></div>
      <div className="bl-grid">{others.map((x, i) => <StoryCardView key={x.slug} s={x} i={i} />)}</div>
    </section>}
  </main>
}
