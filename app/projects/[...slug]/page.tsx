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
  params: {
    slug: string[]
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts('projects')
  return posts.map((post) => ({
    slug: post.slug.split('/')
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
            <article className="max-w-4xl mx-auto">
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
                              day: 'numeric'
                            })}
                          </time>
                        </dd>
                      </div>
                    </dl>
                    <div>
                      <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-white sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
                        {post.title}
                      </h1>
                    </div>
                  </div>
                </header>
                
                <div className="pb-8">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="py-4 border-b border-gray-800">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center px-3 py-1.5 bg-slate-800/50 border border-slate-700 text-gray-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-all duration-300 transform hover:scale-105 mr-2 mb-2 text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Table of Contents */}
                  <div className="py-4 border-b border-gray-800">
                    <TableOfContents content={html} />
                  </div>
                  
                  {/* Main Content */}
                  <div className="py-8">
                    <div 
                      className="projects-content"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  </div>
                  
                  {/* Navigation */}
                  {(next || prev) && (
                    <div className="border-t border-gray-800 pt-8">
                      <div className="flex gap-4">
                        {prev && (
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">이전 프로젝트</p>
                            <Link 
                              href={`/projects/${prev.slug}`} 
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/20 to-primary-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:from-blue-600/30 hover:to-primary-600/30 hover:text-blue-200 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 font-medium text-sm"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                              {prev.title}
                            </Link>
                          </div>
                        )}
                        {next && (
                          <div className="flex-1 flex flex-col items-end">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">다음 프로젝트</p>
                            <Link 
                              href={`/projects/${next.slug}`} 
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/20 to-primary-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:from-blue-600/30 hover:to-primary-600/30 hover:text-blue-200 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 font-medium text-sm"
                            >
                              {next.title}
                              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600/20 to-primary-600/20 border border-blue-500/30 rounded-xl text-blue-300 hover:from-blue-600/30 hover:to-primary-600/30 hover:text-blue-200 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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