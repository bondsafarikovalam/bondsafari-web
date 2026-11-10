import Image from '@/components/ui/photo'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Phone } from 'lucide-react'
import { cardOf, postDate, postOf, posts } from '@/data/blog'
import { Header } from '@/components/layout/header'
import { PostCard } from '@/components/pages/blog'
import { ArticleBody, headingId } from '@/components/pages/article-body'
import { contact } from '@/data/site'
import { JsonLd, abs, breadcrumbLd, pageMeta } from '@/lib/seo'

export const generateStaticParams = () => posts.map(p => ({ slug: p.slug }))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = postOf((await params).slug)
  return p ? pageMeta({ title: `${p.title} | Bond Safari`, description: p.excerpt, path: `/blog/${p.slug}`, image: p.image, type: 'article' }) : { title: 'Blog | Bond Safari' }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = postOf((await params).slug)
  if (!p) notFound()
  const contents = p.body.flatMap(b => 'h' in b ? [b.h] : [])
  const others = posts.filter(x => x.slug !== p.slug).slice(0, 3).map(cardOf)
  const article = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.excerpt, datePublished: p.date, image: abs(p.image), mainEntityOfPage: abs(`/blog/${p.slug}`), publisher: { '@type': 'Organization', name: 'Bond Safari' } }
  return <main className="bl">
    <JsonLd data={[breadcrumbLd([['Home', '/'], ['Blog & News', '/blog']]), article]} />
    <Header />
    <section className="page-intro bl-hero">
      <Link className="bl-hero-back" href="/blog"><span><ArrowLeft /></span>All stories</Link>
      <Image src={p.image} alt="" fill sizes="100vw" priority style={{ objectPosition: p.imagePosition }} />
      <div>
        <p className="eyebrow light">{p.topic}</p>
        <h1>{p.title}</h1>
        <p className="bl-meta light"><time dateTime={p.date}>{postDate(p.date)}</time><span><Clock /> {p.readMins} min read</span></p>
      </div>
    </section>
    <div className="bl-layout">
      <article className="bl-article">
        <p className="bl-lead">{p.excerpt}</p>
        <ArticleBody body={p.body} />
        {p.cta && <Link className="book-cta bl-cta" href={p.cta.href}><span className="book-cta-label"><strong>{p.cta.label}</strong></span><span className="book-cta-icon"><ArrowRight /></span></Link>}
      </article>
      <aside className="bl-aside">
        <div className="bl-aside-card">
          <p className="eyebrow">{p.topic}</p>
          <p className="bl-aside-meta"><span><CalendarDays /><time dateTime={p.date}>{postDate(p.date)}</time></span><span><Clock /> {p.readMins} min read</span></p>
          {contents.length > 1 && <nav aria-label="In this story"><p className="bl-aside-label">In this story</p><ol>{contents.map(h => <li key={h}><a href={`#${headingId(h)}`}>{h}</a></li>)}</ol></nav>}
        </div>
        <div className="bl-aside-card is-dark">
          <p className="bl-aside-label">Ready to dive in?</p>
          <p className="bl-aside-title">Feel the marvels <i>hidden beneath.</i></p>
          <Link className="book-cta" href={p.cta?.href ?? '/booking'}><span className="book-cta-label"><strong>{p.cta?.label ?? 'Book now'}</strong></span><span className="book-cta-icon"><ArrowRight /></span></Link>
          <a className="bl-aside-call" href={`tel:${contact.phones[0].replace(/\s/g, '')}`}><Phone /> {contact.phones[0]}</a>
        </div>
      </aside>
    </div>
    {others.length > 0 && <section className="bl-wrap bl-more">
      <div className="bl-head"><p className="eyebrow">Keep reading</p><h2>More <i>stories.</i></h2></div>
      <div className="bl-grid">{others.map((x, i) => <PostCard key={x.slug} p={x} i={i} />)}</div>
    </section>}
  </main>
}
