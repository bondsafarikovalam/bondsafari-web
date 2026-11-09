import Image from '@/components/ui/photo'
import { Header } from '@/components/layout/header'
const photos=[['Underwater light','/images/underwater-light.webp'],['Coastal mornings','/images/coastal-morning.webp'],['Open water','/images/coral-reef.webp'],['The quiet blue','/images/quiet-blue.webp']]
export default function Page(){return <main><Header/><section className="page-intro simple"><div><p className="eyebrow light">Postcards from Kovalam</p><h1>The world<br/><i>as we see it.</i></h1></div></section><section className="gallery-grid section">{photos.map(([alt,src],i)=><div className={`gallery-photo photo-${i}`} key={src}><Image src={src} alt={alt} fill sizes="(max-width:700px) 100vw, 50vw"/></div>)}</section></main>}
