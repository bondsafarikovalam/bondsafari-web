'use client'

import { useState } from 'react'
import NextImage, { type ImageProps } from 'next/image'
import { blurOf } from '@/data/blur'

// next/image with a soft preview of the photo while it loads (data/blur.ts). The 16px preview is simply stretched as
// a background: upscaling blurs it on its own, and unlike placeholder="blur" there is no SVG blur filter to repaint
// while scrolling. A photo with no preview (not yet in data/blur.ts) shows a shimmer instead until it has loaded.
// Images still load lazily as they near the screen; `priority` heroes load first, as before
export default function Image({ style, className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false)
  const blur = typeof props.src === 'string' ? blurOf[props.src] : undefined
  // The preview is dropped once the photo has loaded, so it never shows around a logo or any object-fit:contain image
  if (blur) return <NextImage
    style={loaded ? style : { backgroundImage: `url(${blur})`, backgroundSize: 'cover', backgroundPosition: style?.objectPosition ?? 'center', ...style }}
    className={className}
    onLoad={e => { setLoaded(true); onLoad?.(e) }}
    onError={() => setLoaded(true)}
    {...props}
  />
  return (
    <NextImage
      style={style}
      className={loaded ? className : [className, 'photo-loading'].filter(Boolean).join(' ')}
      onLoad={e => { setLoaded(true); onLoad?.(e) }}
      onError={() => setLoaded(true)}
      {...props}
    />
  )
}
