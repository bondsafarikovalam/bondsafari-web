'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const tawkPropertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID
const tawkWidgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID

type TawkWindow = typeof window & { Tawk_API?: { customStyle?: unknown; onLoad?: () => void; toggle?: () => void }; Tawk_LoadStart?: Date }

// tawk.to live chat: injects their embed script once, after the page is interactive.
// Their own launcher is hidden in globals.css; this fish opens and closes the chat instead
export function TawkChat() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!tawkPropertyId || !tawkWidgetId || document.getElementById('tawk-script')) return
    const w = window as TawkWindow
    w.Tawk_API = w.Tawk_API || {}
    // Bottom-right, where the site's own launcher sat; on phones it clears the sticky Book bar
    w.Tawk_API.customStyle = { visibility: { desktop: { position: 'br', xOffset: 24, yOffset: 24 }, mobile: { position: 'br', xOffset: 16, yOffset: 84 } } }
    w.Tawk_API.onLoad = () => setReady(true)
    // The chat is not needed for the first paint: its script (and the work it does) waits until the page has finished
    // loading and the browser is idle, at most 4 s more, so it doesn't compete with the page's own start-up
    const inject = () => {
      if (document.getElementById('tawk-script')) return
      w.Tawk_LoadStart = new Date()
      const s = document.createElement('script')
      s.id = 'tawk-script'
      s.async = true
      s.src = `https://embed.tawk.to/${tawkPropertyId}/${tawkWidgetId}`
      s.charset = 'UTF-8'
      s.setAttribute('crossorigin', '*')
      document.body.appendChild(s)
    }
    let idle: number | undefined, timer: ReturnType<typeof setTimeout> | undefined
    // Safari has no requestIdleCallback: a short timer after load stands in
    const whenIdle = () => { if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(inject, { timeout: 4000 }); else timer = setTimeout(inject, 2000) }
    if (document.readyState === 'complete') whenIdle(); else window.addEventListener('load', whenIdle, { once: true })
    return () => { window.removeEventListener('load', whenIdle); if (idle !== undefined) window.cancelIdleCallback(idle); if (timer !== undefined) clearTimeout(timer) }
  }, [])
  if (!ready) return null
  return <button type="button" className="nemo-chat" aria-label="Chat with Nemo, your AI Ocean Buddy" onClick={() => (window as TawkWindow).Tawk_API?.toggle?.()}>
    <Image src="/images/nemo-chat-anim.webp" alt="" width={84} height={84} unoptimized />
  </button>
}
