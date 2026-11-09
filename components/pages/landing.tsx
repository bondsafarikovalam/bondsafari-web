import Image from '@/components/ui/photo'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ageLabel, inr, taxLabel } from '@/data/catalogue'
import { bySlug, hrefOf, type Product } from '@/data/products'
import type { Landing } from '@/data/landing'
import { enquiryMessage, isBookable, statusOf } from '@/data/programmes'
import { whatsappLink } from '@/data/site'
import { PageIntro } from '@/components/pages/pages'
import { Reveal } from '@/components/layout/header'

const book = (p: Product) => `/booking?activity=${encodeURIComponent(p.title)}`

export function LandingPage({ page }: { page: Landing }) {
  const items = page.products.map(bySlug).filter((p): p is Product => !!p)
  return <main className="landing">
    <PageIntro eyebrow={page.eyebrow} title={<>{page.heading[0]}<br /><i>{page.heading[1]}</i></>} copy={page.description} image={page.image} />
    <section className="section landing-body">
      <Reveal className="landing-intro">{page.intro.map(p => <p key={p} className="ab-lead">{p}</p>)}</Reveal>
      {page.priceTable && <Reveal><table className="landing-prices">
        <caption className="eyebrow">Prices per person</caption>
        <thead><tr><th scope="col">Activity</th><th scope="col">Duration</th><th scope="col">Age</th><th scope="col">Price</th><th scope="col"><span className="sr-only">Book</span></th></tr></thead>
        <tbody>{items.map(p => <tr key={p.slug}>
          <th scope="row"><Link href={hrefOf(p)}>{p.title}</Link></th>
          <td>{p.duration ?? '—'}</td>
          <td>{ageLabel(p) ?? '—'}</td>
          <td>{p.amount ? <>₹{inr(p.amount)}{taxLabel(p) && <small> {taxLabel(p)}</small>}</> : 'Contact for price'}</td>
          <td>{isBookable(p.slug)
            ? <Link className="text-link" href={book(p)}>Book <ArrowRight /></Link>
            : <a className="text-link" href={whatsappLink(enquiryMessage(p.title))} target="_blank" rel="noopener noreferrer">{statusOf(p.slug) === 'apply' ? 'Apply' : 'Enquire'} <ArrowRight /></a>}</td>
        </tr>)}</tbody>
      </table></Reveal>}
      <div className="cat-grid landing-grid">{items.map(p => <Reveal key={p.slug} className="cat-tile"><Link href={hrefOf(p)}>
        <div className="cat-img"><Image src={p.image} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" style={{ objectPosition: p.imagePosition }} /></div>
        <div className="cat-body"><p className="cat-meta"><span>{p.kind === 'activity' ? p.category : p.level}</span><span>{p.amount ? `₹${inr(p.amount)}` : 'On request'}</span></p><h3>{p.title}</h3><p>{p.description}</p><span className="text-link">Details <ArrowRight /></span></div>
      </Link></Reveal>)}</div>
    </section>
  </main>
}
