import { getAllPosts } from '@/lib/mdx'
import Main from './Main'

export default async function Page() {
  const postCount = getAllPosts().length
  return <Main postCount={postCount} />
}
