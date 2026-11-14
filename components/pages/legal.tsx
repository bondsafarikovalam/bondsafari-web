import Link from 'next/link'
import { Fragment } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { FLAG, LAST_UPDATED, LEGAL_APPROVED, legalBusiness, legalDocs, type LegalBlock, type LegalDoc } from '@/data/legal'

// One layout for the four legal pages (content in data/legal.ts): a quiet hero, a contents list beside the text on
// wide screens, and the business details at the end. Server-rendered only; no JavaScript ships for these pages

// Turns [[label|/path]] into links and highlights the management-confirmation flag
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[\[[^\]]+\]\]|\[MANAGEMENT CONFIRMATION REQUIRED\])/g)
  return <>{parts.map((p, i) => {
    if (p === FLAG) return <mark key={i} className="lg-flag">{p}</mark>
    const link = p.match(/^\[\[([^|]+)\|([^\]]+)\]\]$/)
    if (link) return <Link key={i} href={link[2]}>{link[1]}</Link>
    return <Fragment key={i}>{p}</Fragment>
  })}</>
}

function Block({ b }: { b: LegalBlock }) {
  if (typeof b === 'string') return <p><Rich text={b} /></p>
  if ('sub' in b) return <h3>{b.sub}</h3>
  if ('note' in b) return <p className="lg-note"><Rich text={b.note} /></p>
  if ('list' in b) return <ul>{b.list.map(i => <li key={i}><Rich text={i} /></li>)}</ul>
  return <div className="lg-table"><table>
    <thead><tr>{b.table.head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
    <tbody>{b.table.rows.map(r => <tr key={r[0]}>{r.map((c, i) => i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>)}</tr>)}</tbody>
  </table></div>
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return <main className="lg">
    <Header />
    <section className="lg-hero">
      <p className="eyebrow light">{doc.eyebrow}</p>
      <h1>{doc.title}</h1>
      <p className="lg-updated">Last updated: {LAST_UPDATED ?? <mark className="lg-flag">[DATE TO BE CONFIRMED]</mark>}</p>
      <nav className="lg-switch" aria-label="Legal pages">{legalDocs.map(d => <Link key={d.slug} href={`/${d.slug}`} aria-current={d.slug === doc.slug ? 'page' : undefined}>{d.title}</Link>)}</nav>
    </section>

    <div className="lg-wrap">
      <aside className="lg-toc" aria-label="On this page">
        <p className="eyebrow">On this page</p>
        <ol>{doc.sections.map(s => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}<li><a href="#contact">Contact us</a></li></ol>
      </aside>

      <article className="lg-body">
        {!LEGAL_APPROVED && <div className="lg-draft" role="note"><b>Draft for review.</b> This policy has not yet been approved by Bond Safari&apos;s Managing Director and a qualified legal professional. Points marked <mark className="lg-flag">{FLAG}</mark> are still to be confirmed.</div>}
        <p className="lg-intro"><Rich text={doc.intro} /></p>
        {doc.sections.map((s, i) => <section key={s.id} id={s.id} className="lg-section">
          <h2><span>{String(i + 1).padStart(2, '0')}</span>{s.title}</h2>
          {s.blocks.map((b, k) => <Block key={k} b={b} />)}
        </section>)}

        <section id="contact" className="lg-section lg-contact">
          <h2><span>{String(doc.sections.length + 1).padStart(2, '0')}</span>Contact us</h2>
          <p>For questions about this {doc.title.toLowerCase()}, please contact us:</p>
          <ul className="lg-contact-list">
            <li><Mail /><span><small>Email</small><a href={`mailto:${legalBusiness.email}`}>{legalBusiness.email}</a>{doc.slug === 'privacy-policy' && <> · Privacy complaints: <a href={`mailto:${legalBusiness.privacyEmail}`}>{legalBusiness.privacyEmail}</a></>}</span></li>
            <li><Phone /><span><small>Phone</small><a href={`tel:${legalBusiness.phone.replace(/\s/g, '')}`}>{legalBusiness.phone}</a></span></li>
            <li><MapPin /><span><small>Registered address</small>{legalBusiness.address}</span></li>
          </ul>
          <div className="lg-business">
            <p className="eyebrow">Business information</p>
            <dl>
              <div><dt>Brand</dt><dd>{legalBusiness.brand}</dd></div>
              <div><dt>Business type</dt><dd>{legalBusiness.type}</dd></div>
              {legalBusiness.entities.map(e => <div key={e.gstin}><dt>{e.name}</dt><dd>GSTIN {e.gstin}</dd></div>)}
              <div><dt>Website</dt><dd><a href={legalBusiness.website}>www.bondsafarikovalam.com</a></dd></div>
            </dl>
            {!LEGAL_APPROVED && <p className="lg-note"><mark className="lg-flag">{FLAG}</mark> Which of the two registered companies operates this website and enters into bookings with customers.</p>}
          </div>
        </section>
      </article>
    </div>
  </main>
}
