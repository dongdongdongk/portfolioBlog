import 'css/blog.css'
import 'css/projects.css'
import 'highlight.js/styles/github.css'

import { getPostBySlug, getPostHtml, getAllPosts } from '@/lib/mdx'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'
import TableOfContents from '@/components/TableOfContents'
import Link from '@/components/Link'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

export async function generateStaticParams() {
  const posts = getAllPosts('projects')
  return posts.map((post) => ({
    slug: post.slug.split('/'),
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug?.join('/') || ''
  const post = getPostBySlug('projects', slug)
  if (!post) return {}
  return genPageMetadata({ title: post.title, description: post.summary })
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug?.join('/') || ''
  const post = getPostBySlug('projects', slug)

  if (!post) notFound()

  const html = getPostHtml('projects', slug)
  const allProjects = getAllPosts('projects')
  const projectIndex = allProjects.findIndex((p) => p.slug === slug)
  const prev = allProjects[projectIndex + 1] || null
  const next = allProjects[projectIndex - 1] || null

  return (
    <div className="min-h-screen bg-white">
      <ScrollTopAndComment />

      {/* Header */}
      <div className="border-b border-gray-100 py-10">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
          <time dateTime={post.date} className="text-sm text-slate-400">
            {new Date(post.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{post.title}</h1>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-12">
        {/* Table of Contents */}
        <div className="mb-8 border-b border-gray-100 pb-8">
          <TableOfContents content={html} />
        </div>

        {/* Main Content */}
        <div className="projects-content" dangerouslySetInnerHTML={{ __html: html }} />

        {/* Navigation */}
        {(next || prev) && (
          <div className="mt-12 border-t border-gray-100 pt-8">
            <div className="flex gap-4">
              {prev && (
                <div className="flex-1">
                  <p className="mb-2 text-xs text-slate-400">이전 프로젝트</p>
                  <Link
                    href={`/projects/${prev.slug}`}
                    className="inline-flex items-center text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    ← {prev.title}
                  </Link>
                </div>
              )}
              {next && (
                <div className="flex flex-1 flex-col items-end">
                  <p className="mb-2 text-xs text-slate-400">다음 프로젝트</p>
                  <Link
                    href={`/projects/${next.slug}`}
                    className="inline-flex items-center text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    {next.title} →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-8 border-t border-gray-100 pt-6">
          <Link
            href="/projects"
            className="text-sm text-slate-500 transition-colors hover:text-slate-900"
          >
            ← 프로젝트 목록
          </Link>
        </div>
      </div>
    </div>
  )
}
