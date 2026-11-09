import NextImage, { type ImageProps } from 'next/image'
import { blurOf } from '@/data/blur'

// next/image with a soft preview of the photo while it loads (data/blur.ts). The 16px preview is simply stretched as
// a background: upscaling blurs it on its own, and unlike placeholder="blur" there is no SVG blur filter to repaint
// while scrolling. Images still load lazily as they near the screen; `priority` heroes load first, as before
export default function Image({ style, ...props }: ImageProps) {
  const blur = typeof props.src === 'string' ? blurOf[props.src] : undefined
  if (!blur) return <NextImage style={style} {...props} />
  return <NextImage style={{ backgroundImage: `url(${blur})`, backgroundSize: 'cover', backgroundPosition: style?.objectPosition ?? 'center', ...style }} {...props} />
}
