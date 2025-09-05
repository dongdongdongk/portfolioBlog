import { getAllPosts, getPostBySlug } from '@/lib/markdown'
import { marked } from 'marked'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPost({ params }) {
  const post = getPostBySlug(params.slug)
  const htmlContent = marked(post.content)
  
  return (
    <div className="min-h-screen bg-[#18181A] text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-400 mb-2">{post.date}</p>
          <p className="text-gray-300 mb-6">{post.summary}</p>
          
          <div className="flex gap-2 mb-8">
            {post.tags?.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded">
                {tag}
              </span>
            ))}
          </div>
          
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    </div>
  )
}