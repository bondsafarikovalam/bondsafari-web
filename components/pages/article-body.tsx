import Image from '@/components/ui/photo'
import type { Block } from '@/data/blog'

// Anchor for a heading, so a contents list can link to it
export const headingId = (h: string) => h.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// The body of a blog post or press story: headings, paragraphs, lists, photos and YouTube videos
export function ArticleBody({ body }: { body: Block[] }) {
  return body.map((b, i) => 'h' in b ? <h2 key={i} id={headingId(b.h)}>{b.h}</h2>
    : 'p' in b ? <p key={i}>{b.p}</p>
    : 'video' in b ? <figure key={i} className="bl-video"><iframe src={`https://www.youtube-nocookie.com/embed/${b.video}`} title={b.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></figure>
    : 'img' in b ? <figure key={i} className="bl-photo"><Image src={b.img} alt={b.alt} width={b.width} height={b.height} sizes="(max-width: 800px) 100vw, 860px" /></figure>
    : <ul key={i}>{b.list.map(x => <li key={x}>{x}</li>)}</ul>)
}
