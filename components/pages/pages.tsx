import Image from '@/components/ui/photo'
import { Header } from '@/components/layout/header'

export function PageIntro({ eyebrow, title, copy, image }: { eyebrow: string; title: React.ReactNode; copy: string; image: string }) { return <><Header /><section className="page-intro"><Image src={image} alt="" fill sizes="100vw" priority /><div><p className="eyebrow light">{eyebrow}</p><h1>{title}</h1><p>{copy}</p></div></section></> }
