import Image from '@/components/ui/photo'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { cardOf, postDate, postOf, posts } from '@/data/blog'
import { Header } from '@/components/layout/header'
import { PostCard } from '@/components/pages/blog'
import { ArticleBody } from '@/components/pages/article-body'
import { JsonLd, abs, breadcrumbLd } from '@/lib/seo'

export const generateStaticParams = () => posts.map(p => ({ slug: p.slug }))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = postOf((await params).slug)
  return { title: p ? `${p.title} | Bond Safari` : 'Blog | Bond Safari', description: p?.excerpt, alternates: { canonical: `/blog/${p?.slug ?? ''}` }, openGraph: p && { type: 'article', images: [p.image] } }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = postOf((await params).slug)
  if (!p) notFound()
  const others = posts.filter(x => x.slug !== p.slug).slice(0, 3).map(cardOf)
  const article = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.excerpt, datePublished: p.date, image: abs(p.image), mainEntityOfPage: abs(`/blog/${p.slug}`), publisher: { '@type': 'Organization', name: 'Bond Safari' } }
  return <main className="bl">
    <JsonLd data={[breadcrumbLd([['Home', '/'], ['Blog & News', '/blog']]), article]} />
    <Header />
    <section className="page-intro bl-hero">
      <Image src={p.image} alt="" fill sizes="100vw" priority style={{ objectPosition: p.imagePosition }} />
      <div>
        <p className="eyebrow light">{p.topic}</p>
        <h1>{p.title}</h1>
        <p className="bl-meta light"><time dateTime={p.date}>{postDate(p.date)}</time><span><Clock /> {p.readMins} min read</span></p>
      </div>
    </section>
    <article className="bl-article">
      <Link className="text-link bl-back" href="/blog"><ArrowLeft /> All stories</Link>
      <p className="bl-lead">{p.excerpt}</p>
      <ArticleBody body={p.body} />
      {p.cta && <Link className="book-cta bl-cta" href={p.cta.href}><span className="book-cta-label"><strong>{p.cta.label}</strong></span><span className="book-cta-icon"><ArrowRight /></span></Link>}
    </article>
    {others.length > 0 && <section className="bl-wrap bl-more">
      <div className="bl-head"><p className="eyebrow">Keep reading</p><h2>More <i>stories.</i></h2></div>
      <div className="bl-grid">{others.map((x, i) => <PostCard key={x.slug} p={x} i={i} />)}</div>
    </section>}
  </main>
}
