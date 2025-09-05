import { getAllPosts } from '@/lib/mdx'
import Main from './Main'

export default async function Page() {
  const allPosts = getAllPosts()
  const posts = allPosts.map(post => ({
    slug: post.slug,
    path: `/blog/${post.slug}`,
    date: post.date,
    title: post.title,
    summary: post.summary || '',
    tags: post.tags || [],
    draft: post.draft || false,
  }))
  return <Main posts={posts} />
}
