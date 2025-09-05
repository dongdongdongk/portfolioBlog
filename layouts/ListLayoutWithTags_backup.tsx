'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { useState, useEffect, useRef } from 'react'

interface Blog {
  slug: string
  date: string
  title: string
  summary?: string
  tags?: string[]
  path?: string
  url?: string
  [key: string]: any
}
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: Blog[]
  title: string
  initialDisplayPosts?: Blog[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]
  const basePath = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/page\/\d+\/?$/, '') // Remove any trailing /page
    .replace(/\/$/, '') // Remove trailing slash
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="backdrop-blur-lg bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
      <nav className="flex items-center justify-between">
        {/* Previous Button with Animation */}
        {prevPage ? (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            className={`flex items-center px-6 py-3 rounded-xl bg-primary-500/20 border border-primary-500/30 text-primary-400 hover:bg-primary-500/30 hover:text-primary-300 transition-all duration-300 group transform hover:scale-105 hover:shadow-lg hover:shadow-primary-500/20 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-2 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전
          </Link>
        ) : (
          <div className={`flex items-center px-6 py-3 rounded-xl bg-gray-800/30 border border-gray-700/50 text-gray-600 cursor-not-allowed transition-all duration-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전
          </div>
        )}

        {/* Page Numbers */}
        <div className="flex items-center space-x-2">
          {/* Generate page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <Link
                key={pageNum}
                href={pageNum === 1 ? `/${basePath}/` : `/${basePath}/page/${pageNum}`}
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-medium transition-all duration-300 transform hover:scale-110 ${
                  pageNum === currentPage
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-105'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-gray-100 border border-gray-700 hover:shadow-lg hover:shadow-gray-500/20'
                } ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
                style={{
                  transitionDelay: `${100 + i * 50}ms`
                }}
              >
                {pageNum}
              </Link>
            )
          })}
        </div>

        {/* Next Button with Animation */}
        {nextPage ? (
          <Link
            href={`/${basePath}/page/${currentPage + 1}`}
            rel="next"
            className={`flex items-center px-6 py-3 rounded-xl bg-primary-500/20 border border-primary-500/30 text-primary-400 hover:bg-primary-500/30 hover:text-primary-300 transition-all duration-300 group transform hover:scale-105 hover:shadow-lg hover:shadow-primary-500/20 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}
          >
            다음
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <div className={`flex items-center px-6 py-3 rounded-xl bg-gray-800/30 border border-gray-700/50 text-gray-600 cursor-not-allowed transition-all duration-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}>
            다음
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </nav>
      
      {/* Page Info with Animation */}
      <div className="mt-4 text-center">
        <span className={`text-sm text-gray-400 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`} style={{ transitionDelay: '400ms' }}>
          {totalPages}페이지 중 {currentPage}페이지
        </span>
      </div>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  const [isVisible, setIsVisible] = useState(false)
  const [visiblePosts, setVisiblePosts] = useState<boolean[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  // Initial page load animation
  useEffect(() => {
    setIsVisible(true)
    setVisiblePosts(new Array(displayPosts.length).fill(false))
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setVisiblePosts(prev => {
              const updated = [...prev]
              updated[index] = true
              return updated
            })
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [displayPosts.length])

  return (
    <>
      <div className="min-h-screen">
        {/* Modern Header with Animation */}
        <div className="relative pt-16 pb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-blue-500/10 blur-3xl"></div>
          <div className="relative">
            <h1 className={`text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent text-center mb-4 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}>
              {title}
            </h1>
            <p className={`text-xl text-gray-400 text-center max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              개발과 기술에 대한 이야기를 공유합니다
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Modern Sidebar with Animation */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-8 space-y-6">
                {/* Categories Card */}
                <div className={`backdrop-blur-lg bg-gray-900/50 border border-gray-800 rounded-2xl p-6 shadow-2xl transition-all duration-800 delay-500 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}>
                  <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    카테고리
                  </h3>
                  
                  <div className="space-y-2">
                    <Link
                      href={`/blog`}
                      className={`block px-4 py-3 rounded-xl transition-all duration-200 group ${
                        pathname.startsWith('/blog') && !pathname.includes('/tags/')
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                          : 'hover:bg-gray-800/50 text-gray-300 hover:text-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">모든 포스트</span>
                        <span className="text-sm text-gray-500 group-hover:text-gray-400">
                          {posts.length}
                        </span>
                      </div>
                    </Link>
                    
                    {sortedTags.slice(0, 8).map((t, tagIndex) => {
                      const isActive = decodeURI(pathname.split('/tags/')[1]) === slug(t)
                      return (
                        <Link
                          key={t}
                          href={`/tags/${slug(t)}`}
                          className={`block px-4 py-3 rounded-xl transition-all duration-300 group transform hover:scale-[1.02] ${
                            isActive
                              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30 shadow-lg shadow-primary-500/10'
                              : 'hover:bg-gray-800/50 text-gray-300 hover:text-gray-100 hover:shadow-lg hover:shadow-gray-500/10'
                          } ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                          }`}
                          style={{
                            transitionDelay: `${700 + tagIndex * 50}ms`
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">{t}</span>
                            <span className={`text-sm transition-all duration-200 ${
                              isActive ? 'text-primary-300' : 'text-gray-500 group-hover:text-gray-400'
                            }`}>
                              {tagCounts[t]}
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </aside>

            {/* Modern Posts Grid */}
            <main className="flex-1">
              <div className="grid gap-8">
                {displayPosts.map((post, index) => {
                  const { path, date, title, summary, tags } = post
                  return (
                    <article 
                      key={path}
                      data-index={index}
                      ref={(el) => {
                        if (el && observerRef.current) {
                          observerRef.current.observe(el)
                        }
                      }}
                      className={`group relative backdrop-blur-lg bg-gray-900/30 border border-gray-800 rounded-2xl p-8 transition-all duration-700 transform ${
                        visiblePosts[index] 
                          ? 'opacity-100 translate-y-0 scale-100' 
                          : 'opacity-0 translate-y-8 scale-95'
                      } hover:border-gray-700 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1 hover:scale-[1.01]`}
                      style={{
                        transitionDelay: visiblePosts[index] ? '0ms' : `${index * 100}ms`
                      }}
                    >
                      {/* Decorative gradient */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative">
                        {/* Date */}
                        <div className="flex items-center text-sm text-gray-400 mb-4">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, siteMetadata.locale)}
                          </time>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                          <Link 
                            href={path} 
                            className="text-gray-100 hover:text-primary-400 transition-colors duration-200 group-hover:text-primary-300"
                          >
                            {title}
                          </Link>
                        </h2>

                        {/* Summary */}
                        <p className="text-gray-300 text-lg leading-relaxed mb-6 line-clamp-3">
                          {summary}
                        </p>

                        {/* Tags with Stagger Animation */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {tags?.slice(0, 4).map((tag, tagIndex) => (
                            <Link
                              key={tag}
                              href={`/tags/${slug(tag)}`}
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-primary-500/50 hover:text-primary-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary-500/20 ${
                                visiblePosts[index] 
                                  ? 'opacity-100 translate-y-0' 
                                  : 'opacity-0 translate-y-2'
                              }`}
                              style={{
                                transitionDelay: visiblePosts[index] 
                                  ? `${200 + tagIndex * 50}ms` 
                                  : `${index * 100 + 300 + tagIndex * 50}ms`
                              }}
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>

                        {/* Read More with Enhanced Animation */}
                        <Link
                          href={path}
                          className={`inline-flex items-center text-primary-400 hover:text-primary-300 font-medium transition-all duration-300 group hover:scale-105 ${
                            visiblePosts[index] 
                              ? 'opacity-100 translate-y-0' 
                              : 'opacity-0 translate-y-2'
                          }`}
                          style={{
                            transitionDelay: visiblePosts[index] 
                              ? '400ms' 
                              : `${index * 100 + 500}ms`
                          }}
                        >
                          자세히 읽기
                          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>

              {/* Modern Pagination with Animation */}
              {pagination && pagination.totalPages > 1 && (
                <div className={`mt-16 transition-all duration-800 delay-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}