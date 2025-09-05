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
  [key: string]: unknown
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
    <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6 backdrop-blur-lg">
      <nav className="flex items-center justify-between">
        {/* Previous Button with Animation */}
        {prevPage ? (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            className={`bg-primary-500/20 border-primary-500/30 text-primary-400 hover:bg-primary-500/30 hover:text-primary-300 group hover:shadow-primary-500/20 flex transform items-center rounded-xl border px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`}
          >
            <svg
              className="mr-2 h-5 w-5 transform transition-all duration-300 group-hover:-translate-x-2 group-hover:scale-110"
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
            이전
          </Link>
        ) : (
          <div
            className={`flex cursor-not-allowed items-center rounded-xl border border-gray-700/50 bg-gray-800/30 px-6 py-3 text-gray-600 transition-all duration-300 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`}
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
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
                className={`flex h-12 w-12 transform items-center justify-center rounded-xl font-medium transition-all duration-300 hover:scale-110 ${
                  pageNum === currentPage
                    ? 'bg-primary-500 shadow-primary-500/30 scale-105 text-white shadow-lg'
                    : 'border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-gray-100 hover:shadow-lg hover:shadow-gray-500/20'
                } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                style={{
                  transitionDelay: `${100 + i * 50}ms`,
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
            className={`bg-primary-500/20 border-primary-500/30 text-primary-400 hover:bg-primary-500/30 hover:text-primary-300 group hover:shadow-primary-500/20 flex transform items-center rounded-xl border px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
            }`}
          >
            다음
            <svg
              className="ml-2 h-5 w-5 transform transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <div
            className={`flex cursor-not-allowed items-center rounded-xl border border-gray-700/50 bg-gray-800/30 px-6 py-3 text-gray-600 transition-all duration-300 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
            }`}
          >
            다음
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </nav>

      {/* Page Info with Animation */}
      <div className="mt-4 text-center">
        <span
          className={`text-sm text-gray-400 transition-all duration-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
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
  }, [displayPosts.length])

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setVisiblePosts((prev) => {
              const updated = [...prev]
              updated[index] = true
              return updated
            })
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
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
          <div className="from-primary-500/10 absolute inset-0 bg-gradient-to-r to-blue-500/10 blur-3xl"></div>
          <div className="relative">
            <h1
              className={`mb-4 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-center text-5xl font-bold text-transparent transition-all duration-1000 md:text-7xl ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
              }`}
            >
              {title}
            </h1>
            <p
              className={`mx-auto max-w-2xl text-center text-xl text-gray-400 transition-all delay-300 duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              개발과 기술에 대한 이야기를 공유합니다
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row">
            {/* Modern Sidebar with Animation */}
            <aside className="flex-shrink-0 lg:w-80">
              <div className="sticky top-8 space-y-6">
                {/* Categories Card */}
                <div
                  className={`rounded-2xl border border-gray-800 bg-gray-900/50 p-6 shadow-2xl backdrop-blur-lg transition-all delay-500 duration-800 ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                  }`}
                >
                  <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-100">
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    카테고리
                  </h3>

                  <div className="space-y-2">
                    <Link
                      href={`/blog`}
                      className={`group block rounded-xl px-4 py-3 transition-all duration-200 ${
                        pathname.startsWith('/blog') && !pathname.includes('/tags/')
                          ? 'bg-primary-500/20 text-primary-400 border-primary-500/30 border'
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-gray-100'
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
                          className={`group block transform rounded-xl px-4 py-3 transition-all duration-300 hover:scale-[1.02] ${
                            isActive
                              ? 'bg-primary-500/20 text-primary-400 border-primary-500/30 shadow-primary-500/10 border shadow-lg'
                              : 'text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 hover:shadow-lg hover:shadow-gray-500/10'
                          } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                          style={{
                            transitionDelay: `${700 + tagIndex * 50}ms`,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">{t}</span>
                            <span
                              className={`text-sm transition-all duration-200 ${
                                isActive
                                  ? 'text-primary-300'
                                  : 'text-gray-500 group-hover:text-gray-400'
                              }`}
                            >
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
                      className={`group relative transform rounded-2xl border border-gray-800 bg-gray-900/30 p-8 backdrop-blur-lg transition-all duration-700 ${
                        visiblePosts[index]
                          ? 'translate-y-0 scale-100 opacity-100'
                          : 'translate-y-8 scale-95 opacity-0'
                      } hover:shadow-primary-500/10 hover:-translate-y-1 hover:scale-[1.01] hover:border-gray-700 hover:shadow-2xl`}
                      style={{
                        transitionDelay: visiblePosts[index] ? '0ms' : `${index * 100}ms`,
                      }}
                    >
                      {/* Decorative gradient */}
                      <div className="from-primary-500/5 absolute inset-0 rounded-2xl bg-gradient-to-r to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                      <div className="relative">
                        {/* Date */}
                        <div className="mb-4 flex items-center text-sm text-gray-400">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, siteMetadata.locale)}
                          </time>
                        </div>

                        {/* Title */}
                        <h2 className="mb-4 text-2xl leading-tight font-bold lg:text-3xl">
                          <Link
                            href={path || '#'}
                            className="hover:text-primary-400 group-hover:text-primary-300 text-gray-100 transition-colors duration-200"
                          >
                            {title}
                          </Link>
                        </h2>

                        {/* Summary */}
                        <p className="mb-6 line-clamp-3 text-lg leading-relaxed text-gray-300">
                          {summary}
                        </p>

                        {/* Tags with Stagger Animation */}
                        <div className="mb-6 flex flex-wrap gap-2">
                          {tags?.slice(0, 4).map((tag, tagIndex) => (
                            <Link
                              key={tag}
                              href={`/tags/${slug(tag)}`}
                              className={`hover:border-primary-500/50 hover:text-primary-400 hover:shadow-primary-500/20 inline-flex transform items-center rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                                visiblePosts[index]
                                  ? 'translate-y-0 opacity-100'
                                  : 'translate-y-2 opacity-0'
                              }`}
                              style={{
                                transitionDelay: visiblePosts[index]
                                  ? `${200 + tagIndex * 50}ms`
                                  : `${index * 100 + 300 + tagIndex * 50}ms`,
                              }}
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>

                        {/* Read More with Enhanced Animation */}
                        <Link
                          href={path || '#'}
                          className={`text-primary-400 hover:text-primary-300 group inline-flex items-center font-medium transition-all duration-300 hover:scale-105 ${
                            visiblePosts[index]
                              ? 'translate-y-0 opacity-100'
                              : 'translate-y-2 opacity-0'
                          }`}
                          style={{
                            transitionDelay: visiblePosts[index]
                              ? '400ms'
                              : `${index * 100 + 500}ms`,
                          }}
                        >
                          자세히 읽기
                          <svg
                            className="ml-2 h-4 w-4 transform transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>

              {/* Modern Pagination with Animation */}
              {pagination && pagination.totalPages > 1 && (
                <div
                  className={`mt-16 transition-all delay-700 duration-800 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                  />
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
