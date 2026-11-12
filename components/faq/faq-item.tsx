import type { FaqBlock, FaqItem as Item } from '@/data/faq'

// One answer's paragraphs, sub-headings, bullet lists and tables
export function FaqAnswer({ blocks }: { blocks: FaqBlock[] }) {
  return <>{blocks.map((b, i) =>
    typeof b === 'string' ? <p key={i}>{b}</p>
      : 'sub' in b ? <p key={i} className="fq-sub"><strong>{b.sub}</strong></p>
      : 'list' in b ? <ul key={i}>{b.list.map(item => <li key={item}>{item}</li>)}</ul>
      : <div key={i} className="fq-table" role="region" aria-label={b.table.head[0]} tabIndex={0}>
        <table>
          <thead><tr>{b.table.head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
          <tbody>{b.table.rows.map(r => <tr key={r[0]}><th scope="row">{r[0]}</th>{r.slice(1).map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>,
  )}</>
}

// A question that opens its answer. The answer stays in the HTML when closed, so search engines read it
export function FaqItem({ id, item, open, onToggle }: { id: string; item: Item; open: boolean; onToggle: () => void }) {
  return <div className={`fq-item${open ? ' is-open' : ''}`}>
    <h3>
      <button type="button" id={`${id}-q`} aria-expanded={open} aria-controls={`${id}-a`} onClick={onToggle}>
        <span>{item.q}</span><i className="fq-icon" aria-hidden="true" />
      </button>
    </h3>
    <div className="fq-a" id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} inert={!open}>
      <div><div className="fq-a-body"><FaqAnswer blocks={item.a} /></div></div>
    </div>
  </div>
}
