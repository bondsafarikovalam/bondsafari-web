import { Header } from '@/components/layout/header'
import { GalleryWall } from '@/components/gallery-wall'
import { GalleryHero } from '@/components/gallery-hero'
import { pageMeta } from '@/lib/seo'
export const metadata = pageMeta({ title: 'Photo Gallery | Bond Safari Kovalam', description: 'Underwater photos and ocean moments from scuba dives, snorkelling trips and PADI courses with Bond Safari in Kovalam, Kerala.', path: '/gallery' })
export default function Page(){return <main><Header/><GalleryHero/><GalleryWall/></main>}
