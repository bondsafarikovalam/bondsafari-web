import { Header } from '@/components/layout/header'
import { GalleryWall } from '@/components/gallery-wall'
import { pageMeta } from '@/lib/seo'
export const metadata = pageMeta({ title: 'Photo Gallery | Bond Safari Kovalam', description: 'Underwater photos and ocean moments from scuba dives, snorkelling trips and PADI courses with Bond Safari in Kovalam, Kerala.', path: '/gallery' })
export default function Page(){return <main><Header/><section className="page-intro simple"><div><p className="eyebrow light">Postcards from Kovalam</p><h1>The world<br/><i>as we see it.</i></h1></div></section><GalleryWall/></main>}
