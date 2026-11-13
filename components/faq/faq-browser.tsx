'use client'

import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { answerText, type FaqGroup } from '@/data/faq'
import { FaqItem } from '@/components/faq/faq-item'

const normalise = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[‘’]/g, "'").replace(/\s+/g, ' ')

// Category tabs, search across every category and the accordions. Every panel is in the server HTML;
// the tabs only hide the other two. The chosen category is held by FaqView, which also swaps the hero photo
export function FaqBrowser({ groups, active, onActive: setActive }: { groups: FaqGroup[]; active: string; onActive: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Set<string>>(new Set())

  // A link such as /faq#snorkelling opens on that category
  useEffect(() => {
    const pick = () => { const id = location.hash.slice(1); if (groups.some(g => g.id === id)) setActive(id) }
    pick()
    window.addEventListener('hashchange', pick)
    return () => window.removeEventListener('hashchange', pick)
  }, [groups, setActive])

  const index = useMemo(() => groups.map(g => g.faqs.map(f => normalise(`${f.q}\n${answerText(f.a)}`))), [groups])
  const terms = normalise(query.trim()).split(' ').filter(Boolean)
  const searching = terms.length > 0
  const matches = (gi: number, fi: number) => terms.every(t => index[gi][fi].includes(t))
  const total = searching ? groups.reduce((n, g, gi) => n + g.faqs.filter((_, fi) => matches(gi, fi)).length, 0) : 0

  const toggle = (id: string) => setOpen(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next })
  const choose = (id: string) => { setActive(id); setQuery(''); history.replaceState(null, '', `#${id}`) }
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    const next = groups[(i + step + groups.length) % groups.length]
    choose(next.id)
    document.getElementById(`fq-tab-${next.id}`)?.focus()
  }

  return <div className="fq-browser">
    <div className="fq-tools">
      <div className="fq-tabs" role="tablist" aria-label="FAQ categories">
        {groups.map((g, i) => {
          const selected = !searching && g.id === active
          return <button key={g.id} type="button" role="tab" id={`fq-tab-${g.id}`} aria-selected={selected} aria-controls={g.id} tabIndex={g.id === active ? 0 : -1} className={selected ? 'is-active' : undefined} onClick={() => choose(g.id)} onKeyDown={e => onTabKey(e, i)}>
            {g.title}<span>{g.faqs.length}</span>
          </button>
        })}
      </div>
      <label className="fq-search">
        <Search aria-hidden="true" />
        <span className="sr-only">Search all questions</span>
        <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search all questions…" autoComplete="off" />
        {searching && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X /></button>}
      </label>
    </div>
    <p className="fq-count" aria-live="polite">{searching ? total ? `${total} question${total === 1 ? '' : 's'} found for “${query.trim()}”` : '' : ''}</p>

    {groups.map((g, gi) => {
      const shown = g.faqs.map((f, fi) => ({ f, fi })).filter(({ fi }) => !searching || matches(gi, fi))
      const hidden = searching ? !shown.length : g.id !== active
      return <section key={g.id} id={g.id} className="fq-panel" role="tabpanel" aria-labelledby={`fq-tab-${g.id}`} hidden={hidden}>
        <header className="fq-panel-head"><h2>{g.title} FAQs</h2>{g.subtitle && <p>{g.subtitle}</p>}</header>
        <div className="fq-list">{shown.map(({ f, fi }) => { const id = `${g.id}-${fi + 1}`; return <FaqItem key={id} id={id} item={f} open={open.has(id)} onToggle={() => toggle(id)} /> })}</div>
        {!searching && <aside className="fq-notes" aria-labelledby={`${g.id}-notes`}>
          <h3 id={`${g.id}-notes`}>{g.notes.title}</h3>
          <ul>{g.notes.items.map(n => <li key={n}>{n}</li>)}</ul>
        </aside>}
      </section>
    })}

    {searching && !total && <p className="fq-empty">No questions match “{query.trim()}”. Try another word, or ask us on WhatsApp below.</p>}
  </div>
}
