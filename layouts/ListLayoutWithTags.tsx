'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

interface Blog {
  slug: string
  date: string
  title: string
  summary?: string
  tags?: string[]
  path?: string
  url?: string
  content?: string
  category?: string
  [key: string]: any
}
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import AnimatedBackground from '@/components/AnimatedBackground'
import CategoryTree from '@/components/CategoryTree'
import siteMetadata from '@/data/siteMetadata'
import { buildCategoryTree, BlogPost } from '@/lib/categoryTree'

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

// 마크다운 문법을 제거하고 검색용 텍스트를 정제하는 함수
function cleanContentForSearch(content: string): string {
  if (!content) return ''

  return (
    content
      // 코드 블록 제거 (```...```)
      .replace(/```[\s\S]*?```/g, '')
      // 인라인 코드 제거 (`...`)
      .replace(/`[^`]*`/g, '')
      // 마크다운 링크 제거 [text](url)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // 이미지 제거 ![alt](url)
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      // 헤더 마크업 제거 (###, ##, #)
      .replace(/^#{1,6}\s+/gm, '')
      // 볼드, 이탤릭 마크업 제거
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // HTML 태그 제거
      .replace(/<[^>]*>/g, '')
      // 여러 공백을 하나로 정리
      .replace(/\s+/g, ' ')
      .trim()
  )
}

// 검색어가 매칭된 부분의 컨텍스트를 추출하는 함수
function extractMatchingContext(
  content: string,
  searchTerm: string,
  contextLength: number = 150
): string[] {
  if (!content || !searchTerm) return []

  const cleanedContent = cleanContentForSearch(content)
  const lowerContent = cleanedContent.toLowerCase()
  const lowerSearchTerm = searchTerm.toLowerCase().trim()

  if (!lowerContent.includes(lowerSearchTerm)) return []

  const contexts: string[] = []
  let startIndex = 0

  // 모든 매칭되는 부분 찾기
  while (true) {
    const matchIndex = lowerContent.indexOf(lowerSearchTerm, startIndex)
    if (matchIndex === -1) break

    // 컨텍스트 시작과 끝 위치 계산
    const contextStart = Math.max(0, matchIndex - contextLength / 2)
    const contextEnd = Math.min(
      cleanedContent.length,
      matchIndex + lowerSearchTerm.length + contextLength / 2
    )

    let contextText = cleanedContent.slice(contextStart, contextEnd).trim()

    // 앞뒤에 "..." 추가
    if (contextStart > 0) contextText = '...' + contextText
    if (contextEnd < cleanedContent.length) contextText = contextText + '...'

    contexts.push(contextText)
    startIndex = matchIndex + 1

    // 최대 3개의 컨텍스트만 표시
    if (contexts.length >= 3) break
  }

  return contexts
}

// 텍스트에서 검색어를 하이라이트하는 함수
function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-300 text-black px-1 rounded">$1</mark>')
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  // 실제 포스트들에서 태그를 추출하고 카운트 계산
  const tagCounts = posts.reduce(
    (acc, post) => {
      post.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>
  )

  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  const displayPosts = posts

  const [isVisible, setIsVisible] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredPosts, setFilteredPosts] = useState(displayPosts)
  const [showAllTags, setShowAllTags] = useState(false)
  const [searchMode, setSearchMode] = useState<'title' | 'titleAndContent'>('title')

  // 검색어 debounce (300ms 지연)
  const debouncedSearchValue = useDebounce(searchValue, 300)

  // 무한스크롤 훅 사용
  const {
    displayedItems: displayedPosts,
    hasMore,
    isLoading: isLoadingMore,
    observerRef,
    reset: resetInfiniteScroll,
  } = useInfiniteScroll({
    items: filteredPosts,
    itemsPerPage: 6,
    threshold: 0.1,
    rootMargin: '200px',
  })

  // localStorage에서 검색 모드 설정 불러오기
  useEffect(() => {
    const savedSearchMode = localStorage.getItem('blog-search-mode') as 'title' | 'titleAndContent'
    if (savedSearchMode && (savedSearchMode === 'title' || savedSearchMode === 'titleAndContent')) {
      setSearchMode(savedSearchMode)
    }
  }, [])

  // 검색 모드 변경시 localStorage에 저장
  const handleSearchModeChange = (mode: 'title' | 'titleAndContent') => {
    setSearchMode(mode)
    localStorage.setItem('blog-search-mode', mode)
  }

  // Category tree 생성 - 전체 posts를 사용해야 함
  const categoryTree = buildCategoryTree(posts as BlogPost[])

  // Search, tag and category filter functionality
  useEffect(() => {
    const filtered = displayPosts.filter((post) => {
      // Search filter - 검색어가 빈 문자열이면 모든 포스트 통과
      let matchesSearch = true
      if (debouncedSearchValue && debouncedSearchValue.trim() !== '') {
        let searchContent = ''

        if (searchMode === 'title') {
          // 제목만 검색
          searchContent = (post.title || '').toLowerCase()
        } else {
          // 제목 + 내용 검색
          const cleanedContent = cleanContentForSearch(post.content || '')
          searchContent = (
            post.title +
            ' ' +
            (post.summary || '') +
            ' ' +
            cleanedContent +
            ' ' +
            (post.tags?.join(' ') || '') +
            ' ' +
            (post.category || '')
          ).toLowerCase()
        }

        matchesSearch = searchContent.includes(debouncedSearchValue.toLowerCase().trim())
      }

      // Tag filter - 선택된 태그가 없으면 모든 포스트 통과
      let matchesTag = true
      if (selectedTag && selectedTag.trim() !== '') {
        matchesTag = post.tags?.includes(selectedTag) || false
      }

      // Category filter - 선택된 카테고리가 없으면 모든 포스트 통과
      let matchesCategory = true
      if (selectedCategory && selectedCategory.trim() !== '') {
        matchesCategory = post.category?.startsWith(selectedCategory) || false
      }

      return matchesSearch && matchesTag && matchesCategory
    })

    setFilteredPosts(filtered)
  }, [debouncedSearchValue, selectedTag, selectedCategory, displayPosts, searchMode])

  // 필터링된 포스트가 변경될 때 무한스크롤 리셋
  useEffect(() => {
    resetInfiniteScroll()
  }, [filteredPosts, resetInfiniteScroll])

  // 검색 컨텍스트 사전 계산 (메모이제이션)
  const postsWithSearchData = useMemo(() => {
    return displayedPosts.map((post) => {
      const searchContexts =
        searchMode === 'titleAndContent' && debouncedSearchValue && post.content
          ? extractMatchingContext(post.content, debouncedSearchValue)
          : []

      const highlightedTitle =
        (searchMode === 'title' || searchMode === 'titleAndContent') && debouncedSearchValue
          ? highlightSearchTerm(post.title, debouncedSearchValue)
          : post.title

      return {
        ...post,
        searchContexts,
        highlightedTitle,
      }
    })
  }, [displayedPosts, searchMode, debouncedSearchValue])

  // Initial page load animation
  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
        {/* Single Unified Section */}
        <section className="relative w-full overflow-hidden">
          {/* Background Elements */}
          <AnimatedBackground />

          {/* Unified Content Container */}
          <div className="relative z-10 w-full">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              {/* Hero Header - Compact */}
              <div
                className={`mb-16 text-center transition-all delay-200 duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <h1 className="mb-6 text-5xl font-bold sm:text-6xl md:text-7xl">
                  <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                    Blog
                  </span>
                </h1>
                <div className="from-primary-500 mx-auto mb-6 h-1 w-16 rounded-full bg-gradient-to-r to-blue-500"></div>
                <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-300 sm:text-xl">
                  기술과 개발에 대한 인사이트를 공유하며, 새로운 아이디어와 경험을 나눕니다.
                </p>
                <div className="flex flex-col items-center justify-center gap-6 text-gray-400 sm:flex-row">
                  <div className="flex items-center space-x-3 rounded-full border border-slate-700/50 bg-slate-900/30 px-4 py-2">
                    <svg
                      className="text-primary-400 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <span className="font-medium">{posts.length}개의 포스트</span>
                  </div>
                  <div className="flex items-center space-x-3 rounded-full border border-slate-700/50 bg-slate-900/30 px-4 py-2">
                    <svg
                      className="h-4 w-4 text-blue-400"
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
                    <span className="font-medium">
                      {Object.keys(tagCounts).length}개의 카테고리
                    </span>
                  </div>
                </div>
              </div>

              {/* Search and Categories Filter - Inline */}
              <div
                className={`mb-12 transition-all delay-400 duration-800 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <div className="rounded-2xl border border-slate-700/30 bg-slate-900/30 p-6 shadow-xl backdrop-blur-lg">
                  {/* Search Input with Options */}
                  <div className="mx-auto mb-6 max-w-2xl">
                    {/* Search Mode Toggle */}
                    <div className="mb-4 flex justify-center">
                      <div className="search-toggle-container relative inline-flex rounded-lg border border-slate-600/50 bg-slate-800/50 p-1 transition-all duration-200 hover:border-slate-500/70">
                        {/* Sliding Background */}
                        <div
                          className={`search-toggle-bg from-primary-500 absolute top-1 bottom-1 rounded-md bg-gradient-to-r to-blue-500 shadow-lg transition-all duration-300 ease-out ${
                            searchMode === 'title'
                              ? 'left-1 w-[calc(50%-0.125rem)]'
                              : 'left-[50%] w-[calc(50%-0.125rem)]'
                          }`}
                        />

                        {/* Buttons */}
                        <button
                          onClick={() => handleSearchModeChange('title')}
                          className={`relative z-10 rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 ease-out active:scale-95 ${
                            searchMode === 'title'
                              ? 'scale-105 transform font-semibold text-white'
                              : 'text-gray-400 hover:scale-105 hover:text-gray-200'
                          }`}
                        >
                          <span
                            className={`flex items-center gap-2 transition-all duration-200 ${
                              searchMode === 'title' ? 'drop-shadow-sm' : ''
                            }`}
                          >
                            <svg
                              className={`h-4 w-4 transition-all duration-300 ${
                                searchMode === 'title'
                                  ? 'scale-110 rotate-0 opacity-100'
                                  : 'rotate-12 opacity-70'
                              }`}
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
                            <span
                              className={`transition-all duration-300 ${
                                searchMode === 'title' ? 'tracking-wide' : ''
                              }`}
                            >
                              제목만
                            </span>
                          </span>
                        </button>
                        <button
                          onClick={() => handleSearchModeChange('titleAndContent')}
                          className={`relative z-10 rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 ease-out active:scale-95 ${
                            searchMode === 'titleAndContent'
                              ? 'scale-105 transform font-semibold text-white'
                              : 'text-gray-400 hover:scale-105 hover:text-gray-200'
                          }`}
                        >
                          <span
                            className={`flex items-center gap-2 transition-all duration-200 ${
                              searchMode === 'titleAndContent' ? 'drop-shadow-sm' : ''
                            }`}
                          >
                            <svg
                              className={`h-4 w-4 transition-all duration-300 ${
                                searchMode === 'titleAndContent'
                                  ? 'scale-110 rotate-0 opacity-100'
                                  : '-rotate-12 opacity-70'
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span
                              className={`transition-all duration-300 ${
                                searchMode === 'titleAndContent' ? 'tracking-wide' : ''
                              }`}
                            >
                              제목+내용
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                      <svg
                        className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 transition-all duration-300 ${
                          searchValue ? 'text-primary-400 scale-110' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>

                      {/* Animated Placeholder */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder=""
                          className={`focus:border-primary-500/50 focus:ring-primary-500/50 focus:border-primary-400/70 focus:shadow-primary-500/10 w-full rounded-xl border border-slate-600/50 bg-slate-800/50 py-3 pr-4 pl-10 text-gray-300 transition-all duration-300 focus:shadow-lg focus:ring-1 focus:outline-none ${
                            searchValue ? 'border-slate-500/70 bg-slate-700/50' : ''
                          }`}
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                        />

                        {/* Custom animated placeholder */}
                        {!searchValue && (
                          <div className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2">
                            <span
                              key={searchMode} // Key를 추가하여 리렌더링 트리거
                              className="animate-fade-in text-gray-500"
                            >
                              {searchMode === 'title'
                                ? '제목에서 검색...'
                                : '제목과 내용에서 검색...'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Categories and Tags Grid */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Category Tree Section */}
                    <div className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
                      <CategoryTree
                        tree={categoryTree}
                        onCategorySelect={setSelectedCategory}
                        selectedCategory={selectedCategory}
                      />
                    </div>

                    {/* Tags Section */}
                    <div className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          태그
                        </div>
                        {sortedTags.length > 6 && (
                          <button
                            onClick={() => setShowAllTags(!showAllTags)}
                            className="text-xs text-blue-400 transition-colors hover:text-blue-300"
                          >
                            {showAllTags ? '접기' : '더보기'}
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedTag('')}
                          className={`inline-flex transform items-center rounded-xl px-4 py-2 transition-all duration-300 hover:scale-105 ${
                            !selectedTag
                              ? 'from-primary-500 bg-gradient-to-r to-blue-500 text-white shadow-md'
                              : 'border border-slate-700 bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
                          }`}
                        >
                          <span className="font-medium">전체</span>
                          <span className="ml-2 rounded-full bg-black/20 px-2 py-0.5 text-xs">
                            {posts.length}
                          </span>
                        </button>

                        {(showAllTags ? sortedTags : sortedTags.slice(0, 8)).map(
                          (tag, tagIndex) => {
                            const isActive = selectedTag === tag
                            return (
                              <button
                                key={tag}
                                onClick={() => setSelectedTag(isActive ? '' : tag)}
                                className={`inline-flex transform items-center rounded-xl px-3 py-2 transition-all duration-300 hover:scale-105 ${
                                  isActive
                                    ? 'from-primary-500 bg-gradient-to-r to-blue-500 text-white shadow-md'
                                    : 'border border-slate-700 bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
                                }`}
                              >
                                <span className="font-medium">{tag}</span>
                                <span className="ml-2 rounded-full bg-black/20 px-2 py-0.5 text-xs">
                                  {tagCounts[tag]}
                                </span>
                              </button>
                            )
                          }
                        )}

                        {sortedTags.length > 8 && (
                          <button
                            onClick={() => setShowAllTags(!showAllTags)}
                            className="inline-flex transform items-center rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2 text-gray-300 transition-all duration-300 hover:scale-105 hover:bg-slate-600/50 hover:text-gray-200"
                          >
                            {showAllTags ? (
                              <>
                                <span className="font-medium">접기</span>
                                <svg
                                  className="ml-2 h-4 w-4 transition-transform duration-300"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </>
                            ) : (
                              <>
                                <span className="font-medium">
                                  +{sortedTags.length - 8}개 더 보기
                                </span>
                                <svg
                                  className="ml-2 h-4 w-4 transition-transform duration-300"
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
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Active Filters */}
                  {(selectedCategory || selectedTag) && (
                    <div className="mt-4 rounded-lg border border-slate-700/30 bg-slate-800/50 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-400">활성 필터:</span>
                        {selectedCategory && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs text-white">
                            📁 {selectedCategory}
                            <button
                              onClick={() => setSelectedCategory('')}
                              className="rounded px-1 hover:bg-blue-700"
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {selectedTag && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs text-white">
                            🏷️ {selectedTag}
                            <button
                              onClick={() => setSelectedTag('')}
                              className="rounded px-1 hover:bg-green-700"
                            >
                              ×
                            </button>
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setSelectedCategory('')
                            setSelectedTag('')
                          }}
                          className="text-xs text-red-400 underline hover:text-red-300"
                        >
                          모든 필터 제거
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Results Info */}
              {(debouncedSearchValue || selectedCategory || selectedTag) && (
                <div className="mb-8 rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {debouncedSearchValue && (
                        <span>
                          "{debouncedSearchValue}"{' '}
                          {searchMode === 'title' ? '(제목)' : '(제목+내용)'} 검색 결과
                        </span>
                      )}
                      {!debouncedSearchValue && (selectedCategory || selectedTag) && (
                        <span>필터 적용된 결과</span>
                      )}
                    </div>
                    <span className="font-medium text-gray-300">
                      {displayedPosts.length}/{filteredPosts.length}개의 포스트
                    </span>
                  </div>
                </div>
              )}

              {/* Posts Grid - Integrated */}
              {displayedPosts.length === 0 && debouncedSearchValue && (
                <div className="py-20 text-center">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <p className="mb-2 text-lg text-gray-400">
                    "{debouncedSearchValue}"에 대한 검색 결과가 없습니다.
                  </p>
                  <p className="text-sm text-gray-500">
                    {searchMode === 'title' ? '제목' : '제목과 내용'}에서 검색했습니다.
                  </p>
                </div>
              )}
              {displayedPosts.length === 0 && !debouncedSearchValue && (
                <div className="py-20 text-center">
                  <p className="text-lg text-gray-400">포스트가 없습니다.</p>
                </div>
              )}
              {/* Posts Grid */}
              <div className="mb-8 grid gap-8 lg:grid-cols-2">
                {postsWithSearchData.map((post, index) => {
                  const { path, date, title, summary, tags, searchContexts, highlightedTitle } =
                    post

                  return (
                    <article
                      key={`${path}-${index}`}
                      data-index={index}
                      className="group hover:shadow-primary-500/10 relative translate-y-0 transform overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900/50 opacity-100 backdrop-blur-lg transition-all duration-700 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl"
                    >
                      {/* Background Gradient */}
                      <div className="from-primary-500/5 absolute inset-0 bg-gradient-to-br via-transparent to-blue-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                      <div className="relative p-8">
                        {/* Date Badge */}
                        <div className="mb-6 inline-flex items-center rounded-full border border-slate-600/50 bg-slate-800/50 px-3 py-1.5 text-sm text-gray-400">
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
                        <h2 className="group-hover:text-primary-300 mb-4 text-2xl leading-tight font-bold transition-colors duration-300">
                          <Link href={path || '#'} className="text-gray-100">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlightedTitle,
                              }}
                            />
                          </Link>
                        </h2>

                        {/* Summary */}
                        <p className="mb-4 line-clamp-3 leading-relaxed text-gray-400">{summary}</p>

                        {/* Search Context - 검색어가 내용에서 발견되었을 때만 표시 */}
                        {searchContexts.length > 0 && (
                          <div className="mb-6 rounded-xl border border-yellow-600/30 bg-yellow-900/20 p-4">
                            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-yellow-400">
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                              검색어 발견 위치
                            </div>
                            {searchContexts.map((context, contextIndex) => (
                              <div
                                key={contextIndex}
                                className="mb-2 text-sm leading-relaxed text-yellow-100/90"
                                dangerouslySetInnerHTML={{
                                  __html: highlightSearchTerm(context, debouncedSearchValue),
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {/* Tags */}
                        <div className="mb-6 flex flex-wrap gap-2">
                          {tags?.slice(0, 3).map((tag) => (
                            <Link
                              key={tag}
                              href={`/tags/${slug(tag)}`}
                              className="hover:bg-primary-500/20 hover:border-primary-500/50 hover:text-primary-300 inline-flex translate-y-0 items-center rounded-full border border-slate-600/50 bg-slate-800/50 px-3 py-1.5 text-sm text-gray-300 opacity-100 transition-all duration-300"
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>

                        {/* Read More Button */}
                        <div className="border-t border-slate-700/50 pt-4">
                          <Link
                            href={path || '#'}
                            className="from-primary-500/20 border-primary-500/30 text-primary-300 hover:from-primary-500/30 hover:text-primary-200 hover:shadow-primary-500/20 inline-flex translate-y-0 transform items-center rounded-2xl border bg-gradient-to-r to-blue-500/20 px-6 py-3 opacity-100 transition-all duration-300 hover:scale-105 hover:to-blue-500/30 hover:shadow-lg"
                          >
                            <span className="font-medium">자세히 읽기</span>
                            <svg
                              className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
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
                      </div>
                    </article>
                  )
                })}
              </div>

              {/* 무한스크롤 로딩 인디케이터 및 Observer */}
              {hasMore && (
                <div ref={observerRef} className="flex justify-center py-8">
                  <div className="group flex items-center gap-3 rounded-xl border border-slate-700/30 bg-slate-800/30 px-6 py-3 text-gray-400 transition-all duration-300 hover:border-slate-600/50 hover:bg-slate-700/30">
                    <div className="border-primary-500 group-hover:border-primary-400 h-5 w-5 animate-spin rounded-full border-2 border-r-transparent transition-colors duration-300"></div>
                    <span className="text-sm font-medium transition-colors duration-300 group-hover:text-gray-300">
                      {isLoadingMore ? '로딩 중...' : '더 많은 포스트 로딩 중...'}
                    </span>
                    <div className="flex gap-1">
                      <div
                        className="bg-primary-500 h-1 w-1 animate-pulse rounded-full"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="bg-primary-500 h-1 w-1 animate-pulse rounded-full"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="bg-primary-500 h-1 w-1 animate-pulse rounded-full"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* 모든 포스트 로드 완료 */}
              {!hasMore && displayedPosts.length > 0 && (
                <div className="flex justify-center py-8">
                  <div className="flex items-center gap-3 rounded-xl border border-green-700/30 bg-green-900/20 px-6 py-3 text-green-300 transition-all duration-300 hover:border-green-600/50 hover:bg-green-800/30">
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm font-medium">모든 포스트를 불러왔습니다</span>
                    <span className="text-xs text-green-400/70">({filteredPosts.length}개)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        /* Custom hover effects for search toggle */
        .search-toggle-container:hover .search-toggle-bg {
          box-shadow: 0 4px 12px rgba(var(--primary-500), 0.3);
        }
      `}</style>
    </>
  )
}
