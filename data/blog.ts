import { press } from '@/data/site'
import imported from '@/data/blog-posts.json'
import coverage from '@/data/news-stories.json'

// Blog articles and press coverage for the Blog & News page. Article facts come from the course and activity
// copy elsewhere in data/, so a price or depth changed there should be changed here too.
export type Block = { h: string } | { p: string } | { list: string[] } | { video: string; title: string } | { img: string; alt: string; width: number; height: number }
export type Post = {
  slug: string; title: string; topic: string; date: string; readMins: number
  excerpt: string; image: string; imagePosition?: string
  body: Block[]; cta?: { label: string; href: string }
}

const ours: Post[] = [
  {
    slug: 'your-first-dive-in-kovalam', title: 'Your first dive in Kovalam: what to expect', topic: 'Scuba diving', date: '2026-11-02', readMins: 4,
    excerpt: 'No swimming needed, three hours, and an instructor beside you the whole way. Here’s how a first scuba dive in the Arabian Sea actually goes.',
    image: '/images/scuba.webp',
    body: [
      { p: 'Most people who walk into Bond Safari have never breathed underwater before. That’s exactly who our first dive is made for: you don’t need to know how to swim, and you don’t need any certification.' },
      { h: 'How the three hours go' },
      { p: 'The whole experience takes about two and a half to three hours. It starts on land with a calm briefing, moves to shallow water where you practise a few simple skills, and ends with an open-sea dive of up to 12 metres off Kovalam.' },
      { p: 'A PADI Instructor or Divemaster stays beside you underwater the whole time, so you never have to work anything out on your own.' },
      { h: 'What to bring' },
      { list: ['Swimwear and a towel', 'Sunscreen', 'Your glasses prescription, if you wear them: ask for an optical mask'] },
      { p: 'Everything else, wetsuit included, is ready when you arrive.' },
      { h: 'What it costs' },
      { p: 'A first dive in the sea is ₹4,500 per person, taxes included. If it hooks you, the PADI Open Water Diver course is the next step: four days, and a certification that lets you dive anywhere in the world.' },
    ],
    cta: { label: 'Book your first dive', href: '/activities/scuba-diving' },
  },
  {
    slug: 'diving-in-the-monsoon', title: 'Diving in the monsoon: why we head to the quarry', topic: 'Seasons', date: '2026-10-20', readMins: 3,
    excerpt: 'When the sea turns rough, Kerala’s rain-fed quarries turn calm and clear. Here’s what freshwater diving is like.',
    image: '/images/freshwater-scuba-dive.webp', imagePosition: '45% center',
    body: [
      { p: 'Kovalam’s best season for sea diving runs from November to July. When the monsoon makes the Arabian Sea rough, we don’t stop diving: we move inland to calm, rain-fed freshwater quarries.' },
      { h: 'What makes a quarry different' },
      { p: 'Unlike the ocean, a quarry gives you clear freshwater, stable conditions and landscapes you won’t find on a reef: rock ledges, sunken trees and dramatic drop-offs. During the monsoon the quarries refill with rainwater and come alive with aquatic life.' },
      { h: 'Still made for beginners' },
      { p: 'Our freshwater dive is a PADI Discover Scuba Diving programme, so no certification or swimming skills are needed. It takes about four hours, including a theory session, confined water training and one full quarry dive to up to 12 metres with a PADI instructor.' },
      { list: ['Transport to and from the dive site', 'All scuba gear: wetsuit, mask, fins and tank', 'Underwater photos and a PADI DSD certificate'] },
      { p: 'Want more than a dive? The monsoon combo pairs the quarry dive with kayaking on the same water.' },
    ],
    cta: { label: 'See the freshwater dive', href: '/activities/freshwater-scuba' },
  },
  {
    slug: 'scuba-or-freediving-first', title: 'Scuba or freediving: which should you learn first?', topic: 'Courses', date: '2026-10-05', readMins: 4,
    excerpt: 'Both take you underwater, but they build different careers. Our advice if you’re choosing where to start.',
    image: '/images/course-freediving-hd.webp', imagePosition: '70% center',
    body: [
      { p: 'Scuba and freediving both take you beneath the surface, but they are very different sports. Scuba gives you air to stay down and explore. Freediving is breath-hold diving: one breath, and the skill is in relaxing, equalising and moving efficiently.' },
      { h: 'If you just want to explore' },
      { p: 'Start with scuba. The PADI Open Water Diver course takes four days and lets you dive to 18 metres anywhere in the world. You can try a single sea dive first, with no swimming needed.' },
      { h: 'If you want to work in the water' },
      { p: 'Freediving has no Divemaster stage: you go from student straight to Freediver Instructor, the first freediving rating you can be employed on.' },
      { p: 'For most people building a career, we recommend scuba first and adding freediving later. Freediving makes a scuba professional more employable, and scuba makes a freediving professional more secure. A PADI scuba instructor can reach Freediver Instructor through a crossover route.' },
      { h: 'Our pathways' },
      { list: ['Scuba: Open Water → Advanced Open Water → Rescue → Divemaster → Instructor', 'Freediving: Basic Freediver → Freediver → Advanced → Master → Instructor'] },
    ],
    cta: { label: 'Compare the courses', href: '/courses' },
  },
]

// Articles from the Bond Adventure Academy blog (bondadventureacademy.com), converted to the same blocks; newest first
export const posts: Post[] = [...ours, ...(imported as Post[])].sort((a, b) => b.date.localeCompare(a.date))
// What a post card needs: the article body stays on the server instead of shipping to the browser with the listing
export type Card = Omit<Post, 'body' | 'cta'>
export const cardOf = ({ body, cta, ...card }: Post): Card => card
export const postOf = (slug: string) => posts.find(p => p.slug === slug)

// Press coverage, grouped by event, for the home page highlights
export const news = press

// Full press stories from the old bondsafarikovalam.com News page, one page each at /news/<slug>. `month` is
// YYYY-MM, or blank where the clipping carries no date; dated stories come first, newest first
export type Story = {
  slug: string; title: string; outlet: string; topic: string; month: string; readMins: number
  excerpt: string; image: string; body: Block[]
}
export const stories: Story[] = [...(coverage as Story[])].sort((a, b) => (b.month || '0').localeCompare(a.month || '0'))
export type StoryCard = Omit<Story, 'body'>
export const storyCard = ({ body, ...card }: Story): StoryCard => card
export const storyOf = (slug: string) => stories.find(s => s.slug === slug)
export const storyMonth = (m: string) => m ? new Date(`${m}-01T00:00:00`).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : ''

export const postDate = (d: string) => { const [y, m, day] = d.split('-').map(Number); return new Date(y, m - 1, day).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
