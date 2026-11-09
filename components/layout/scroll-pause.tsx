'use client'

import { useEffect } from 'react'

// Marks the page with .is-scrolling while it moves, so CSS can pause the looping decorations (the Book button's
// pulse and shine, the chatbot's ring). Those repaint every frame and cost dropped frames during a scroll on phones
export function ScrollPause() {
  useEffect(() => {
    const root = document.documentElement
    let timer: ReturnType<typeof setTimeout> | undefined
    const onScroll = () => {
      if (!timer) root.classList.add('is-scrolling')
      clearTimeout(timer)
      timer = setTimeout(() => { root.classList.remove('is-scrolling'); timer = undefined }, 200)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(timer); root.classList.remove('is-scrolling'); window.removeEventListener('scroll', onScroll) }
  }, [])
  return null
}
