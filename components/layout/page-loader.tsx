'use client'

import Image from '@/components/ui/photo'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// The branded loading screen between pages. It only appears after a click to another page on this site, and its CSS
// fades it in after 0.2 s, so a quick page change never shows it. (A root app/loading.tsx is not used: Next.js would
// send it ahead of every page on first load and swap the page in afterwards, delaying content and shifting layout.)
export function PageLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  // The new page has rendered
  useEffect(() => setLoading(false), [pathname])
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a')
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const url = new URL(a.href, location.href)
      // Only page changes within this site; same-page links and hash jumps don't load anything
      if (url.origin !== location.origin || url.pathname === location.pathname) return
      setLoading(true)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  // Never leave it up if a navigation is cancelled or fails
  useEffect(() => { if (!loading) return; const t = setTimeout(() => setLoading(false), 10_000); return () => clearTimeout(t) }, [loading])
  if (!loading) return null
  return <div className="pl" role="status" aria-live="polite">
    <div className="pl-inner">
      <Image className="pl-logo" src="/images/logo.webp" alt="" width={447} height={320} sizes="150px" />
      <svg className="pl-waves" viewBox="0 0 240 40" aria-hidden="true">
        <path className="pl-wave pl-wave-1" d="M0 20 Q 15 8 30 20 T 60 20 T 90 20 T 120 20 T 150 20 T 180 20 T 210 20 T 240 20 T 270 20 T 300 20" />
        <path className="pl-wave pl-wave-2" d="M0 26 Q 15 16 30 26 T 60 26 T 90 26 T 120 26 T 150 26 T 180 26 T 210 26 T 240 26 T 270 26 T 300 26" />
      </svg>
      <p className="pl-text">Loading<span>.</span><span>.</span><span>.</span></p>
    </div>
  </div>
}
