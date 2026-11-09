'use client'

import { AnimatePresence, m } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'

const ease = [0.19, 1, 0.22, 1] as const

export type PickerOption = { value: string; label?: string }
export type PickerGroup = { label?: string; options: PickerOption[] }

// A styled stand-in for <select>: a button opening a listbox, with the value carried by a hidden input.
// The list opens upward when there is more room above, and never spills out of a scrolling dialog.
export function Picker({ label, name, groups, defaultValue = '', placeholder = 'Choose…', className = '' }: { label: string; name: string; groups: PickerGroup[]; defaultValue?: string; placeholder?: string; className?: string }) {
  const id = useId()
  const box = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const options = groups.flatMap(g => g.options)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const [active, setActive] = useState(0)
  const [place, setPlace] = useState({ up: false, max: 320 })
  const current = options.find(o => o.value === value)

  // A new preset (e.g. the booking popup reopening on another page) resets the choice
  useEffect(() => { setValue(defaultValue) }, [defaultValue])
  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])
  useLayoutEffect(() => {
    if (!open || !box.current) return
    const r = box.current.getBoundingClientRect()
    const scroller = box.current.closest('.bp-dialog')?.getBoundingClientRect()
    const top = Math.max(scroller?.top ?? 0, 0), bottom = Math.min(scroller?.bottom ?? innerHeight, innerHeight)
    const below = bottom - r.bottom - 16, above = r.top - top - 16
    const up = below < 240 && above > below
    setPlace({ up, max: Math.max(160, Math.min(320, up ? above : below)) })
  }, [open])
  // Keep the active option in view by scrolling the list itself (scrollIntoView would also scroll the dialog/page)
  useEffect(() => {
    const ul = list.current, el = ul?.querySelector<HTMLElement>(`[data-i="${active}"]`)
    if (!ul || !el) return
    const top = el.offsetTop, bottom = top + el.offsetHeight
    if (top < ul.scrollTop + 8) ul.scrollTop = top - 8
    else if (bottom > ul.scrollTop + ul.clientHeight - 8) ul.scrollTop = bottom - ul.clientHeight + 8
  }, [open, active, place.max])

  const show = () => { setActive(Math.max(0, options.findIndex(o => o.value === value))); setOpen(true) }
  const pick = (v: string) => { setValue(v); setOpen(false) }
  const onKey = (e: KeyboardEvent) => {
    const move = { ArrowDown: 1, ArrowUp: -1 }[e.key]
    if (move) { e.preventDefault(); if (!open) show(); else setActive(a => (a + move + options.length) % options.length) }
    else if (e.key === 'Home' || e.key === 'End') { if (open) { e.preventDefault(); setActive(e.key === 'Home' ? 0 : options.length - 1) } }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (open) pick(options[active].value); else show() }
    // Escape closes the list without also closing a surrounding dialog
    else if (e.key === 'Escape') { if (open) { e.preventDefault(); e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setOpen(false) } }
    else if (e.key === 'Tab') setOpen(false)
  }

  return <div ref={box} className={`ct-select${open ? ' is-open' : ''} ${className}`}>
    <span id={`${id}-label`}>{label}</span>
    <button type="button" className={current ? '' : 'is-empty'} aria-haspopup="listbox" aria-expanded={open} aria-labelledby={`${id}-label ${id}-btn`} id={`${id}-btn`} aria-controls={`${id}-list`} aria-activedescendant={open ? `${id}-${active}` : undefined} onClick={() => open ? setOpen(false) : show()} onKeyDown={onKey}>
      <span>{current ? current.label ?? current.value : placeholder}</span><ChevronDown />
    </button>
    <input type="hidden" name={name} value={value} />
    <AnimatePresence>{open && <m.ul ref={list} id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} className={`ct-select-list${place.up ? ' is-up' : ''}`} style={{ maxHeight: place.max }} initial={{ opacity: 0, y: place.up ? 8 : -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: place.up ? 6 : -6, scale: 0.98 }} transition={{ duration: 0.25, ease }}>
      {groups.map((g, gi) => <li key={g.label ?? gi} role="presentation">
        {g.label && <p className="ct-select-group" aria-hidden="true">{g.label}</p>}
        <ul role="group" aria-label={g.label}>{g.options.map(o => { const i = options.indexOf(o); return <li key={o.value} id={`${id}-${i}`} data-i={i} role="option" aria-selected={o.value === value} className={i === active ? 'is-active' : ''} onPointerEnter={() => setActive(i)} onClick={() => pick(o.value)}>{o.label ?? o.value}{o.value === value && <Check />}</li> })}</ul>
      </li>)}
    </m.ul>}</AnimatePresence>
  </div>
}
