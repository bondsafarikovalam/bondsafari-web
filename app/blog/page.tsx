import { BlogPage } from '@/components/pages/blog'
import { cardOf, posts, stories, storyCard } from '@/data/blog'
import { pageMeta } from '@/lib/seo'
export const metadata = pageMeta({ title: 'Blog & News | Bond Safari', description: 'Diving guides, seasonal tips and press coverage from Bond Safari, Kovalam — India’s first underwater wedding, the world’s first underwater CEO conference and more.', path: '/blog' })
export default function Page(){return <BlogPage posts={posts.map(cardOf)} news={stories.map(storyCard)}/>}
