import { getAllPosts } from '@/lib/mdx'

export default function DebugBlogPage() {
  const blogs = getAllPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Blog Debug Info (MDX)</h1>
      <div className="space-y-4">
        <p>
          <strong>Total blogs found:</strong> {blogs.length}
        </p>
        {blogs.map((blog, index) => (
          <div key={index} className="rounded border p-4">
            <h3 className="font-bold">{blog.title}</h3>
            <p>
              <strong>Slug:</strong> {blog.slug}
            </p>
            <p>
              <strong>Date:</strong> {blog.date}
            </p>
            <p>
              <strong>Draft:</strong> {blog.draft?.toString()}
            </p>
            <p>
              <strong>Summary:</strong> {blog.summary}
            </p>
            <p>
              <strong>Tags:</strong> {blog.tags?.join(', ')}
            </p>
            <hr className="my-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
