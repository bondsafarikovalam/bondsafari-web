import Image from '@/components/ui/photo'
import type { Block } from '@/data/blog'

// The body of a blog post or press story: headings, paragraphs, lists, photos and YouTube videos
export function ArticleBody({ body }: { body: Block[] }) {
  return body.map((b, i) => 'h' in b ? <h2 key={i}>{b.h}</h2>
    : 'p' in b ? <p key={i}>{b.p}</p>
    : 'video' in b ? <figure key={i} className="bl-video"><iframe src={`https://www.youtube-nocookie.com/embed/${b.video}`} title={b.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></figure>
    : 'img' in b ? <figure key={i} className="bl-photo"><Image src={b.img} alt={b.alt} width={b.width} height={b.height} sizes="(max-width: 800px) 100vw, 720px" /></figure>
    : <ul key={i}>{b.list.map(x => <li key={x}>{x}</li>)}</ul>)
}
