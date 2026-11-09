import Image from '@/components/ui/photo'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { stories, storyCard, storyMonth, storyOf } from '@/data/blog'
import { Header } from '@/components/layout/header'
import { StoryCardView } from '@/components/pages/blog'
import { ArticleBody } from '@/components/pages/article-body'
import { JsonLd, abs, breadcrumbLd } from '@/lib/seo'

export const generateStaticParams = () => stories.map(s => ({ slug: s.slug }))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = storyOf((await params).slug)
  return { title: s ? `${s.title} – ${s.outlet} | Bond Safari` : 'News | Bond Safari', description: s?.excerpt, alternates: { canonical: `/news/${s?.slug ?? ''}` }, openGraph: s && { type: 'article', images: [s.image] } }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const s = storyOf((await params).slug)
  if (!s) notFound()
  // More coverage of the same event first, then the rest
  const others = [...stories.filter(x => x.slug !== s.slug && x.topic === s.topic), ...stories.filter(x => x.topic !== s.topic)].slice(0, 3).map(storyCard)
  const article = { '@context': 'https://schema.org', '@type': 'Article', headline: s.title, description: s.excerpt, image: abs(s.image), mainEntityOfPage: abs(`/news/${s.slug}`), ...(s.month && { datePublished: s.month }), publisher: { '@type': 'Organization', name: s.outlet } }
  return <main className="bl">
    <JsonLd data={[breadcrumbLd([['Home', '/'], ['Blog & News', '/blog'], ['In the news', '/blog#news']]), article]} />
    <Header />
    <section className="page-intro bl-hero">
      <Image src={s.image} alt="" fill sizes="100vw" priority />
      <div>
        <p className="eyebrow light">{s.topic}</p>
        <h1>{s.title}</h1>
        <p className="bl-meta light"><span>{s.outlet}</span>{s.month && <time dateTime={s.month}>{storyMonth(s.month)}</time>}<span><Clock /> {s.readMins} min read</span></p>
      </div>
    </section>
    <article className="bl-article">
      <Link className="text-link bl-back" href="/blog#news"><ArrowLeft /> All news</Link>
      <p className="bl-source">As covered by {s.outlet}</p>
      <p className="bl-lead">{s.excerpt}</p>
      <ArticleBody body={s.body} />
      <Link className="book-cta bl-cta" href="/booking?activity=scuba-diving"><span className="book-cta-label"><strong>Dive with Bond Safari</strong></span><span className="book-cta-icon"><ArrowRight /></span></Link>
    </article>
    {others.length > 0 && <section className="bl-wrap bl-more">
      <div className="bl-head"><p className="eyebrow">In the news</p><h2>More <i>coverage.</i></h2></div>
      <div className="bl-grid">{others.map((x, i) => <StoryCardView key={x.slug} s={x} i={i} />)}</div>
    </section>}
  </main>
}
