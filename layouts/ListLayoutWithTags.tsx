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
import AnimatedBackground from '@/components/AnimatedBackground'
import siteMetadata from '@/data/siteMetadata'

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

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      {prevPage ? (
        <Link
          href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
          rel="prev"
          className="flex items-center px-3 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          이전
        </Link>
      ) : (
        <div className="flex items-center px-3 py-2 text-sm text-gray-600 cursor-not-allowed">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          이전
        </div>
      )}

      {/* Page Numbers */}
      <div className="flex items-center space-x-1 mx-4">
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
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                pageNum === currentPage
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800'
              }`}
            >
              {pageNum}
            </Link>
          )
        })}
      </div>

      {/* Next Button */}
      {nextPage ? (
        <Link
          href={`/${basePath}/page/${currentPage + 1}`}
          rel="next"
          className="flex items-center px-3 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors duration-200"
        >
          다음
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div className="flex items-center px-3 py-2 text-sm text-gray-600 cursor-not-allowed">
          다음
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
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
  // 실제 포스트들에서 태그를 추출하고 카운트 계산
  const tagCounts = posts.reduce((acc, post) => {
    post.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)
  
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts
  
  const [isVisible, setIsVisible] = useState(false)
  const [visiblePosts, setVisiblePosts] = useState<boolean[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [filteredPosts, setFilteredPosts] = useState(displayPosts)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Search and tag filter functionality
  useEffect(() => {
    const filtered = displayPosts.filter((post) => {
      // Search filter - 검색어가 빈 문자열이면 모든 포스트 통과
      let matchesSearch = true
      if (searchValue && searchValue.trim() !== '') {
        const searchContent = (
          post.title +
          ' ' +
          (post.summary || '') +
          ' ' +
          (post.tags?.join(' ') || '')
        ).toLowerCase()
        matchesSearch = searchContent.includes(searchValue.toLowerCase().trim())
      }
      
      // Tag filter - 선택된 태그가 없으면 모든 포스트 통과
      let matchesTag = true
      if (selectedTag && selectedTag.trim() !== '') {
        matchesTag = post.tags?.includes(selectedTag) || false
      }
      
      return matchesSearch && matchesTag
    })
    
    setFilteredPosts(filtered)
    // 모든 경우에 포스트를 즉시 표시
    setVisiblePosts(new Array(filtered.length).fill(true))
  }, [searchValue, selectedTag, displayPosts])

  // Initial page load animation - 모든 포스트 즉시 표시
  useEffect(() => {
    setIsVisible(true)
    setVisiblePosts(new Array(filteredPosts.length).fill(true))
  }, [filteredPosts.length])

  // Intersection Observer 제거 - 모든 카드를 즉시 표시 // displayPosts가 아닌 filteredPosts로 변경

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
        {/* Single Unified Section */}
        <section className="relative w-full overflow-hidden">
          {/* Background Elements */}
          <AnimatedBackground />

          {/* Unified Content Container */}
          <div className="relative z-10 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              
              {/* Hero Header - Compact */}
              <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-300">
                    Blog
                  </span>
                </h1>
                <div className="h-1 w-16 bg-gradient-to-r from-primary-500 to-blue-500 mx-auto mb-6 rounded-full"></div>
                <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                  기술과 개발에 대한 인사이트를 공유하며, 새로운 아이디어와 경험을 나눕니다.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-400">
                  <div className="flex items-center space-x-3 px-4 py-2 bg-slate-900/30 rounded-full border border-slate-700/50">
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="font-medium">{posts.length}개의 포스트</span>
                  </div>
                  <div className="flex items-center space-x-3 px-4 py-2 bg-slate-900/30 rounded-full border border-slate-700/50">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="font-medium">{Object.keys(tagCounts).length}개의 카테고리</span>
                  </div>
                </div>
              </div>

              {/* Search and Categories Filter - Inline */}
              <div className={`mb-12 transition-all duration-800 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="backdrop-blur-lg bg-slate-900/30 border border-slate-700/30 rounded-2xl p-6 shadow-xl">
                  {/* Search Input */}
                  <div className="max-w-md mx-auto mb-6">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="포스트 검색..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all duration-300"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-100 mb-2">카테고리별 탐색</h2>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setSelectedTag('')}
                      className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        !selectedTag
                          ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-md'
                          : 'bg-slate-800/50 border border-slate-700 text-gray-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <span className="font-medium">전체</span>
                      <span className="ml-2 px-2 py-0.5 bg-black/20 rounded-full text-xs">{posts.length}</span>
                    </button>
                    
                    {sortedTags.slice(0, 8).map((tag, tagIndex) => {
                      const isActive = selectedTag === tag
                      return (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(isActive ? '' : tag)}
                          className={`inline-flex items-center px-3 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                            isActive
                              ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-md'
                              : 'bg-slate-800/50 border border-slate-700 text-gray-300 hover:bg-slate-700/50'
                          }`}
                        >
                          <span className="font-medium">{tag}</span>
                          <span className="ml-2 px-2 py-0.5 bg-black/20 rounded-full text-xs">{tagCounts[tag]}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Posts Grid - Integrated */}
              {filteredPosts.length === 0 && searchValue && (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">"{searchValue}"에 대한 검색 결과가 없습니다.</p>
                </div>
              )}
              {filteredPosts.length === 0 && !searchValue && (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">포스트가 없습니다.</p>
                </div>
              )}
              {/* Posts Grid */}
              <div className="grid lg:grid-cols-2 gap-8 mb-20">
                {filteredPosts.map((post, index) => {
                  const { path, date, title, summary, tags } = post
                  return (
                    <article 
                      key={path}
                      data-index={index}
                      className={`group relative backdrop-blur-lg bg-slate-900/50 border border-slate-700/50 rounded-3xl overflow-hidden transition-all duration-700 transform hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 hover:scale-[1.02] ${
                        visiblePosts[index] 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-12'
                      }`}
                      style={{
                        transitionDelay: visiblePosts[index] ? '0ms' : `${600 + index * 150}ms`
                      }}
                    >
                      {/* Background Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative p-8">
                        {/* Date Badge */}
                        <div className="inline-flex items-center px-3 py-1.5 bg-slate-800/50 border border-slate-600/50 rounded-full text-sm text-gray-400 mb-6">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, siteMetadata.locale)}
                          </time>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold mb-4 leading-tight group-hover:text-primary-300 transition-colors duration-300">
                          <Link href={path || '#'} className="text-gray-100">
                            {title}
                          </Link>
                        </h2>

                        {/* Summary */}
                        <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3">
                          {summary}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {tags?.slice(0, 3).map((tag, tagIndex) => (
                            <Link
                              key={tag}
                              href={`/tags/${slug(tag)}`}
                              className={`inline-flex items-center px-3 py-1.5 bg-slate-800/50 border border-slate-600/50 rounded-full text-sm text-gray-300 hover:bg-primary-500/20 hover:border-primary-500/50 hover:text-primary-300 transition-all duration-300 ${
                                visiblePosts[index] 
                                  ? 'opacity-100 translate-y-0' 
                                  : 'opacity-0 translate-y-2'
                              }`}
                              style={{
                                transitionDelay: visiblePosts[index] 
                                  ? `${200 + tagIndex * 50}ms` 
                                  : `${600 + index * 150 + 200 + tagIndex * 50}ms`
                              }}
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>

                        {/* Read More Button */}
                        <div className="pt-4 border-t border-slate-700/50">
                          <Link
                            href={path || '#'}
                            className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500/20 to-blue-500/20 border border-primary-500/30 rounded-2xl text-primary-300 hover:from-primary-500/30 hover:to-blue-500/30 hover:text-primary-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary-500/20 ${
                              visiblePosts[index] 
                                ? 'opacity-100 translate-y-0' 
                                : 'opacity-0 translate-y-2'
                            }`}
                            style={{
                              transitionDelay: visiblePosts[index] 
                                ? '400ms' 
                                : `${600 + index * 150 + 400}ms`
                            }}
                          >
                            <span className="font-medium">자세히 읽기</span>
                            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              {/* Pagination - Integrated */}
              {pagination && pagination.totalPages > 1 && (
                <div className={`flex justify-center transition-all duration-800 delay-600 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
      `}</style>
    </>
  )
}