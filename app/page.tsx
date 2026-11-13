import { Hero } from '@/components/home/site'
import { TrustStrip } from '@/components/home/trust'
import { ExperienceStack } from '@/components/home/stack'
import { NextStep } from '@/components/home/next-step'
import { ExploreCarousel } from '@/components/home/explore'
import { exploreCards } from '@/data/explore'
import { PadiPathway } from '@/components/sections/pathway'
import { Reviews } from '@/components/home/reviews'
import { PressSection } from '@/components/home/press'
import { TeamSection } from '@/components/home/team'
import { HomeBar } from '@/components/home/home-bar'
import { MapSection } from '@/components/sections/map'
import { MuzirisSection } from '@/components/sections/muziris'
import { listActivities, listEvents, livePages } from '@/lib/api/events-server'
import { coverIn, isLivePage } from '@/lib/api/events'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({ title: 'Bond Safari | Scuba Diving & Water Sports in Kovalam', description: 'Scuba diving, snorkelling, kayaking, surfing and PADI diving courses in Kovalam, Kerala. Guided ocean adventures with all gear included — book online.', path: '/' })

export const revalidate = 300

export default async function Home() {
  const [events, activities, live] = await Promise.all([listEvents(), listActivities(), livePages()])
  // Explore shows only pages the API publishes: its own write-ups for those (with the API's photo), then API activities up to five cards
  const kept = exploreCards.filter(c => isLivePage(live, c.href)).map(c => ({ ...c, image: coverIn(events, c.href.split('/').pop()!) ?? c.image }))
  const added = activities.filter(a => !kept.some(c => c.href === `/activities/${a.slug}`)).map(a => ({ title: a.title, kind: 'Activity', bookAs: a.title, href: `/activities/${a.slug}`, image: a.image, text: a.description, tagline: a.tagline }))
  const explore = [...kept, ...added].slice(0, exploreCards.length)
  return <main><Hero /><div className="home-body"><TrustStrip /><ExperienceStack initial={activities} /><NextStep /><ExploreCarousel cards={explore} /><PadiPathway eyebrow="Learn with Bond Academy" more /><Reviews /><PressSection /><TeamSection /><MuzirisSection /><MapSection eyebrow="Plan your visit" /><HomeBar /></div></main>
}
