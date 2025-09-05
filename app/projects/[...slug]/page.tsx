import 'css/blog.css'
import 'css/projects.css'
import 'highlight.js/styles/github-dark.css'

import { getPostBySlug, getPostHtml, getAllPosts } from '@/lib/mdx'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'
import TableOfContents from '@/components/TableOfContents'
import AnimatedBackground from '@/components/AnimatedBackground'
import Link from '@/components/Link'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import SectionContainer from '@/components/SectionContainer'

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

  if (!post) {
    return {}
  }

  return genPageMetadata({
    title: post.title,
    description: post.summary,
  })
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug?.join('/') || ''
  const post = getPostBySlug('projects', slug)

  if (!post) {
    notFound()
  }

  const html = getPostHtml('projects', slug)
  const allProjects = getAllPosts('projects')
  const projectIndex = allProjects.findIndex((p) => p.slug === slug)
  const prev = allProjects[projectIndex + 1] || null
  const next = allProjects[projectIndex - 1] || null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950/80 via-gray-900/60 to-slate-950/80">
      {/* Background Elements - 더 약한 그라데이션 */}
      <section className="relative w-full overflow-hidden">
        <AnimatedBackground />

        {/* Content Container */}
        <div className="relative z-10 w-full">
          <SectionContainer>
            <ScrollTopAndComment />
            <article className="mx-auto max-w-4xl">
              <div className="divide-y divide-gray-800">
                <header className="pt-6 pb-8">
                  <div className="space-y-4">
                    <dl className="space-y-4">
                      <div>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-sm font-medium text-gray-400">
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                        </dd>
                      </div>
                    </dl>
                    <div>
                      <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-white sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
                        {post.title}
                      </h1>
                    </div>
                  </div>
                </header>

                <div className="pb-8">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="border-b border-gray-800 py-4">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="mr-2 mb-2 inline-flex transform items-center rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:scale-105 hover:bg-slate-700/50 hover:text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Table of Contents */}
                  <div className="border-b border-gray-800 py-4">
                    <TableOfContents content={html} />
                  </div>

                  {/* Main Content */}
                  <div className="py-8">
                    <div className="projects-content" dangerouslySetInnerHTML={{ __html: html }} />
                  </div>

                  {/* Navigation */}
                  {(next || prev) && (
                    <div className="border-t border-gray-800 pt-8">
                      <div className="flex gap-4">
                        {prev && (
                          <div className="flex-1">
                            <p className="mb-3 text-xs tracking-wide text-gray-500 uppercase">
                              이전 프로젝트
                            </p>
                            <Link
                              href={`/projects/${prev.slug}`}
                              className="to-primary-600/20 hover:to-primary-600/30 inline-flex transform items-center rounded-lg border border-blue-500/30 bg-gradient-to-r from-blue-600/20 px-4 py-2 text-sm font-medium text-blue-300 transition-all duration-300 hover:scale-105 hover:border-blue-400/50 hover:from-blue-600/30 hover:text-blue-200 hover:shadow-lg hover:shadow-blue-500/20"
                            >
                              <svg
                                className="mr-2 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                              {prev.title}
                            </Link>
                          </div>
                        )}
                        {next && (
                          <div className="flex flex-1 flex-col items-end">
                            <p className="mb-3 text-xs tracking-wide text-gray-500 uppercase">
                              다음 프로젝트
                            </p>
                            <Link
                              href={`/projects/${next.slug}`}
                              className="to-primary-600/20 hover:to-primary-600/30 inline-flex transform items-center rounded-lg border border-blue-500/30 bg-gradient-to-r from-blue-600/20 px-4 py-2 text-sm font-medium text-blue-300 transition-all duration-300 hover:scale-105 hover:border-blue-400/50 hover:from-blue-600/30 hover:text-blue-200 hover:shadow-lg hover:shadow-blue-500/20"
                            >
                              {next.title}
                              <svg
                                className="ml-2 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Back to Projects */}
                  <div className="border-t border-gray-800 pt-6">
                    <Link
                      href="/projects"
                      className="to-primary-600/20 hover:to-primary-600/30 inline-flex transform items-center rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-600/20 px-6 py-3 font-medium text-blue-300 transition-all duration-300 hover:scale-105 hover:border-blue-400/50 hover:from-blue-600/30 hover:text-blue-200 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      프로젝트로 돌아가기
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </SectionContainer>
        </div>
      </section>
    </div>
  )
}
