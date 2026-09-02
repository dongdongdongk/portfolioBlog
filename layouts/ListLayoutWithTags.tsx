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

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-gray-100 py-10">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
          <h1 className="text-3xl font-bold text-slate-900">Blog</h1>
          <p className="mt-1 text-sm text-slate-400">
            {posts.length}개의 포스트 · {Object.keys(tagCounts).length}개의 태그
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-12">
        <div className="flex gap-12">
          {/* Sidebar */}
          <aside className="hidden w-48 shrink-0 lg:block">
            {/* Search */}
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
                검색
              </p>
              <div className="relative">
                <svg
                  className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
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
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-3 pl-9 text-sm text-slate-700 placeholder-slate-400 focus:border-gray-400 focus:bg-white focus:outline-none"
                  placeholder={searchMode === 'title' ? '제목 검색...' : '내용 검색...'}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <div className="mt-2 flex gap-1">
                <button
                  onClick={() => handleSearchModeChange('title')}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    searchMode === 'title'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  제목
                </button>
                <button
                  onClick={() => handleSearchModeChange('titleAndContent')}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    searchMode === 'titleAndContent'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  제목+내용
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <p className="mb-3 text-xs font-bold tracking-widest text-slate-400 uppercase">
                카테고리
              </p>
              <CategoryTree
                tree={categoryTree}
                onCategorySelect={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
            </div>

            {/* Tags */}
            <div>
              <p className="mb-3 text-xs font-bold tracking-widest text-slate-400 uppercase">
                태그
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedTag('')}
                  className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                    !selectedTag
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  전체 ({posts.length})
                </button>
                {(showAllTags ? sortedTags : sortedTags.slice(0, 15)).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag} ({tagCounts[tag]})
                  </button>
                ))}
                {sortedTags.length > 15 && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {showAllTags ? '접기' : `+${sortedTags.length - 15}개 더`}
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1">
            {/* Mobile Search + Tag Filter */}
            <div className="mb-6 lg:hidden">
              <div className="relative mb-3">
                <svg
                  className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
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
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-3 pl-9 text-sm text-slate-700 placeholder-slate-400 focus:border-gray-400 focus:bg-white focus:outline-none"
                  placeholder="검색..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedTag('')}
                  className={`shrink-0 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    !selectedTag ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  전체
                </button>
                {sortedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    className={`shrink-0 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory || selectedTag || debouncedSearchValue) && (
              <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>필터:</span>
                {debouncedSearchValue && (
                  <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                    "{debouncedSearchValue}"
                    <button
                      onClick={() => setSearchValue('')}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedTag && (
                  <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                    #{selectedTag}
                    <button
                      onClick={() => setSelectedTag('')}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                <span className="text-slate-400">— {filteredPosts.length}개</span>
              </div>
            )}

            {/* Empty States */}
            {displayedPosts.length === 0 && debouncedSearchValue && (
              <div className="py-20 text-center">
                <p className="text-slate-500">"{debouncedSearchValue}"에 대한 결과가 없습니다.</p>
                <p className="mt-1 text-sm text-slate-400">
                  {searchMode === 'title' ? '제목' : '제목과 내용'}에서 검색했습니다.
                </p>
              </div>
            )}
            {displayedPosts.length === 0 && !debouncedSearchValue && (
              <div className="py-20 text-center">
                <p className="text-slate-400">포스트가 없습니다.</p>
              </div>
            )}

            {/* Posts List */}
            <div>
              {postsWithSearchData.map((post, index) => {
                const { path, date, title, summary, tags, searchContexts, highlightedTitle } = post
                return (
                  <article
                    key={`${path}-${index}`}
                    data-index={index}
                    className="group border-b border-gray-100 py-7 first:border-t first:border-gray-100"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="flex-1 text-lg leading-snug font-semibold text-slate-900 group-hover:text-blue-700 sm:text-xl">
                        <Link href={path || '#'} className="transition-colors duration-150">
                          <span dangerouslySetInnerHTML={{ __html: highlightedTitle }} />
                        </Link>
                      </h2>
                      <time
                        dateTime={date}
                        className="shrink-0 text-sm text-slate-400"
                        suppressHydrationWarning
                      >
                        {formatDate(date, siteMetadata.locale)}
                      </time>
                    </div>

                    {summary && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                        {summary}
                      </p>
                    )}

                    {searchContexts.length > 0 && (
                      <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                        <p className="mb-1 text-xs font-semibold text-yellow-700">
                          검색어 발견 위치
                        </p>
                        {searchContexts.map((context, contextIndex) => (
                          <div
                            key={contextIndex}
                            className="text-sm leading-relaxed text-yellow-800"
                            dangerouslySetInnerHTML={{
                              __html: highlightSearchTerm(context, debouncedSearchValue),
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tags?.slice(0, 4).map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${slug(tag)}`}
                          className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 transition-colors duration-150 hover:bg-blue-100 hover:text-blue-700"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Infinite Scroll Observer */}
            {hasMore && (
              <div ref={observerRef} className="flex justify-center py-10">
                <span className="text-sm text-slate-400">로딩 중...</span>
              </div>
            )}

            {/* All Loaded */}
            {!hasMore && displayedPosts.length > 0 && (
              <div className="py-10 text-center text-xs text-slate-400">
                모든 포스트를 불러왔습니다 ({filteredPosts.length}개)
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
