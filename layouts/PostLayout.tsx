import React, { ReactNode } from 'react'

interface Blog {
  slug: string
  date: string
  title: string
  tags?: string[]
  summary?: string
  filePath?: string
  path?: string
  [key: string]: unknown
}

interface Authors {
  name: string
  avatar?: string
  [key: string]: unknown
}
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import AnimatedBackground from '@/components/AnimatedBackground'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: Blog
  authorDetails: Authors[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags } = content
  const basePath = path?.split('/')[0] || 'blog'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
      {/* Background Elements */}
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
                          <time dateTime={date}>
                            {new Date(date).toLocaleDateString(
                              siteMetadata.locale,
                              postDateTemplate
                            )}
                          </time>
                        </dd>
                      </div>
                    </dl>
                    <div>
                      <PageTitle>{title}</PageTitle>
                    </div>
                  </div>
                </header>
                <div className="pb-8">
                  {/* Tags */}
                  {tags && (
                    <div className="border-b border-gray-800 py-4">
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Main Content */}
                  <div className="blog-content py-8">{children}</div>

                  {/* Navigation */}
                  {(next || prev) && (
                    <div className="border-t border-gray-800 pt-8">
                      <div className="flex gap-4">
                        {prev && prev.path && (
                          <div className="flex-1">
                            <p className="mb-3 text-xs tracking-wide text-gray-500 uppercase">
                              이전 글
                            </p>
                            <Link
                              href={prev.path}
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
                        {next && next.path && (
                          <div className="flex flex-1 flex-col items-end">
                            <p className="mb-3 text-xs tracking-wide text-gray-500 uppercase">
                              다음 글
                            </p>
                            <Link
                              href={next.path}
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

                  {/* Back to Blog */}
                  <div className="border-t border-gray-800 pt-6">
                    <Link
                      href="/blog"
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
                      블로그로 돌아가기
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
