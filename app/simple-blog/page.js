import { getAllPosts } from '@/lib/markdown'
import Link from 'next/link'

export default function SimpleBlog() {
  const posts = getAllPosts()
  
  return (
    <div className="min-h-screen bg-[#18181A] text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">간단한 블로그</h1>
        
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.slug} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h2 className="text-2xl font-semibold mb-2">
                <Link href={`/simple-blog/${post.slug}`} className="hover:text-blue-400">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-400 mb-2">{post.date}</p>
              <p className="text-gray-300">{post.summary}</p>
              <div className="flex gap-2 mt-4">
                {post.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}