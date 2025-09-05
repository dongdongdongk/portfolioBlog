'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from '@/components/Link'
import Image from 'next/image'
import AnimatedBackground from '@/components/AnimatedBackground'
import ProjectToggle from '@/components/ProjectToggle'
import type { BlogPost } from '@/lib/mdx'

interface PaginationProps {
  totalPages: number
  currentPage: number
}

interface ProjectsLayoutProps {
  projects: BlogPost[]
  title: string
  initialDisplayProjects?: BlogPost[]
  pagination?: PaginationProps
  initialRole?: 'Developer' | 'Sound Designer'
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
          className="flex items-center px-3 py-2 text-sm text-gray-400 transition-colors duration-200 hover:text-gray-200"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="flex cursor-not-allowed items-center px-3 py-2 text-sm text-gray-600">
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="mx-4 flex items-center space-x-1">
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
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 ${
                pageNum === currentPage
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
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
          className="flex items-center px-3 py-2 text-sm text-gray-400 transition-colors duration-200 hover:text-gray-200"
        >
          다음
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div className="flex cursor-not-allowed items-center px-3 py-2 text-sm text-gray-600">
          다음
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default function ProjectsLayoutWithTags({
  projects,
  title,
  initialDisplayProjects = [],
  pagination,
  initialRole = 'Developer',
}: ProjectsLayoutProps) {
  const displayProjects = initialDisplayProjects.length > 0 ? initialDisplayProjects : projects

  const [isVisible, setIsVisible] = useState(false)
  const [visibleProjects, setVisibleProjects] = useState<boolean[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [selectedRole, setSelectedRole] = useState<'Developer' | 'Sound Designer'>(initialRole)
  const [filteredProjects, setFilteredProjects] = useState(displayProjects)
  const [showAllTags, setShowAllTags] = useState(false)
  const [sortedTags, setSortedTags] = useState<string[]>([])
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({})
  const searchRef = useRef<HTMLInputElement>(null)
  const projectRefs = useRef<(HTMLElement | null)[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Update tags when role changes
  useEffect(() => {
    const roleFilteredProjects = projects.filter(
      (project) => (project as BlogPost & { role?: string }).role === selectedRole
    )
    const counts = roleFilteredProjects.reduce(
      (acc, project) => {
        project.tags?.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>
    )

    setTagCounts(counts)
    setSortedTags(Object.keys(counts).sort())
    // Role이 변경되면 선택된 태그 초기화
    setSelectedTag('')
  }, [selectedRole, projects])

  // Search, tag, and role filter functionality
  useEffect(() => {
    // 검색이나 필터링이 있을 때는 전체 프로젝트에서 필터링
    const sourceProjects = searchValue || selectedTag ? projects : displayProjects

    const filtered = sourceProjects.filter((project) => {
      // Role filter - role이 일치하는지 확인
      const matchesRole = (project as BlogPost & { role?: string }).role === selectedRole

      // Search filter - 검색어가 빈 문자열이면 모든 프로젝트 통과
      let matchesSearch = true
      if (searchValue && searchValue.trim() !== '') {
        const searchContent = (
          project.title +
          ' ' +
          (project.summary || '') +
          ' ' +
          (project.tags?.join(' ') || '')
        ).toLowerCase()
        matchesSearch = searchContent.includes(searchValue.toLowerCase().trim())
      }

      // Tag filter - 선택된 태그가 없으면 모든 프로젝트 통과
      let matchesTag = true
      if (selectedTag && selectedTag.trim() !== '') {
        matchesTag = project.tags?.includes(selectedTag) || false
      }

      return matchesRole && matchesSearch && matchesTag
    })

    setFilteredProjects(filtered)
    // 모든 경우에 프로젝트를 즉시 표시
    setVisibleProjects(new Array(filtered.length).fill(true))
  }, [searchValue, selectedTag, selectedRole, displayProjects, projects])

  // Initial page load animation
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Update visible projects when filtered projects change - 모든 프로젝트 즉시 표시
  useEffect(() => {
    setVisibleProjects(new Array(filteredProjects.length).fill(true))
  }, [filteredProjects.length])

  // Intersection Observer 제거 - 모든 프로젝트를 즉시 표시

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
                    Projects
                  </span>
                </h1>
                <div className="from-primary-500 mx-auto mb-6 h-1 w-16 rounded-full bg-gradient-to-r to-blue-500"></div>
                <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-300 sm:text-xl">
                  최신 기술과 창의적인 아이디어로 구현한 프로젝트들을 소개합니다.
                </p>

                {/* Role Toggle */}
                <div className="mb-8">
                  <ProjectToggle
                    onRoleChange={setSelectedRole}
                    defaultRole={initialRole}
                    initialRole={selectedRole}
                  />
                </div>
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <span className="font-medium">{filteredProjects.length}개의 프로젝트</span>
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
                    <span className="font-medium">{sortedTags.length}개의 카테고리</span>
                  </div>
                </div>
              </div>

              {/* Search and Categories Filter - Inline */}
              <div
                className={`mb-12 transition-all delay-400 duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <div className="rounded-2xl border border-slate-700/30 bg-slate-900/30 p-6 shadow-xl backdrop-blur-lg">
                  {/* Search Input */}
                  <div className="mx-auto mb-6 max-w-md">
                    <div className="relative">
                      <svg
                        className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
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
                        placeholder="프로젝트 검색..."
                        className="focus:border-primary-500/50 focus:ring-primary-500/50 w-full rounded-xl border border-slate-600/50 bg-slate-800/50 py-3 pr-4 pl-10 text-gray-300 placeholder-gray-500 transition-all duration-300 focus:ring-1 focus:outline-none"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-6 text-center">
                    <h2 className="mb-2 text-xl font-bold text-gray-100">카테고리별 탐색</h2>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
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
                        {
                          projects.filter(
                            (project) =>
                              (project as BlogPost & { role?: string }).role === selectedRole
                          ).length
                        }
                      </span>
                    </button>

                    {(showAllTags ? sortedTags : sortedTags.slice(0, 8)).map((tag, tagIndex) => {
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
                    })}

                    {sortedTags.length > 8 && (
                      <button
                        onClick={() => setShowAllTags(!showAllTags)}
                        className="inline-flex transform items-center rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2 text-gray-300 transition-all duration-300 hover:scale-105 hover:bg-slate-600/50 hover:text-gray-200"
                      >
                        {showAllTags ? (
                          <>
                            <span className="font-medium">접기</span>
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
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          </>
                        ) : (
                          <>
                            <span className="font-medium">더보기</span>
                            <span className="ml-1 text-xs">({sortedTags.length - 8})</span>
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
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Empty Search Results */}
              {filteredProjects.length === 0 && searchValue && (
                <div
                  className={`py-16 text-center transition-all delay-600 duration-1000 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  <div className="mx-auto max-w-lg rounded-2xl border border-slate-700/50 bg-slate-900/30 p-12 backdrop-blur-lg">
                    <svg
                      className="mx-auto mb-4 h-16 w-16 text-gray-400"
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
                    <p className="text-lg text-gray-400">검색 결과가 없습니다</p>
                    <p className="mt-2 text-sm text-gray-500">다른 검색어를 시도해보세요</p>
                  </div>
                </div>
              )}

              {/* Projects List */}
              {filteredProjects.length > 0 && (
                <div
                  className={`mb-20 space-y-8 transition-all delay-600 duration-1000 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {filteredProjects.map((project, index) => {
                    const isProjectVisible = visibleProjects[index]
                    return (
                      <article
                        key={project.slug}
                        data-index={index}
                        className={`group relative transform overflow-hidden rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-lg transition-all duration-700 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 ${
                          isProjectVisible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-12 opacity-0'
                        }`}
                        style={{
                          transitionDelay: isProjectVisible ? '0ms' : `${600 + index * 150}ms`,
                        }}
                      >
                        {/* Animated Border Glow */}
                        <div className="via-primary-500/20 absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 blur-sm transition-opacity duration-700 group-hover:opacity-100"></div>

                        <div className="relative flex flex-col lg:flex-row">
                          {/* Left: Project Image/Icon */}
                          <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-8 lg:w-80">
                            <Link
                              href={`/projects/${project.slug}`}
                              aria-label={`${project.title}로 이동`}
                              className="block flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 transition-colors duration-500 group-hover:border-blue-500/30 lg:h-64"
                            >
                              {project.images?.[0] ? (
                                <Image
                                  alt={project.title}
                                  src={project.images[0]}
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  width={400}
                                  height={256}
                                  sizes="(max-width: 768px) 100vw, 320px"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                                  <svg
                                    className="mb-4 h-16 w-16 text-blue-400/60"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                  </svg>
                                  <span className="text-lg font-medium text-gray-500">
                                    {project.title}
                                  </span>
                                </div>
                              )}
                            </Link>
                          </div>

                          {/* Right: Content */}
                          <div className="flex flex-1 flex-col justify-between p-8 lg:p-12">
                            {/* Header Section */}
                            <div className="mb-6">
                              {/* Project Index & Date */}
                              <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <span className="text-6xl leading-none font-black text-blue-500/20">
                                    {String(index + 1).padStart(2, '0')}
                                  </span>
                                  <div className="border-l border-slate-600/50 pl-4">
                                    <time className="flex items-center text-sm text-gray-400">
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
                                      {new Date(project.date).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                      })}
                                    </time>
                                  </div>
                                </div>

                                {/* External Links */}
                                <div className="flex gap-2">
                                  {typeof project.githubUrl === 'string' && project.githubUrl && (
                                    <a
                                      href={project.githubUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="rounded-lg border border-slate-700 bg-slate-800/50 p-2 text-gray-400 transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:text-blue-400"
                                      aria-label="GitHub 저장소"
                                    >
                                      <svg
                                        className="h-4 w-4"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </a>
                                  )}
                                  {typeof project.liveUrl === 'string' && project.liveUrl && (
                                    <a
                                      href={project.liveUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="rounded-lg border border-slate-700 bg-slate-800/50 p-2 text-gray-400 transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:text-blue-400"
                                      aria-label="라이브 데모"
                                    >
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
                                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                      </svg>
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Title */}
                              <h2 className="mb-4 text-3xl leading-tight font-bold lg:text-4xl">
                                <Link
                                  href={`/projects/${project.slug}`}
                                  className="text-gray-100 transition-colors duration-300 group-hover:text-blue-300 hover:text-blue-400"
                                >
                                  {project.title}
                                </Link>
                              </h2>

                              {/* Description */}
                              <p className="mb-6 line-clamp-3 text-lg leading-relaxed text-gray-300">
                                {project.summary}
                              </p>
                            </div>

                            {/* Footer Section */}
                            <div className="space-y-6">
                              {/* Tags */}
                              {project.tags && project.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {project.tags.slice(0, 6).map((tag, tagIndex) => (
                                    <button
                                      key={tag}
                                      className={`inline-flex cursor-pointer items-center rounded-lg border border-slate-600/40 bg-slate-800/60 px-3 py-1.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/20 hover:text-blue-300 ${
                                        isProjectVisible
                                          ? 'translate-y-0 opacity-100'
                                          : 'translate-y-2 opacity-0'
                                      }`}
                                      style={{
                                        transitionDelay: isProjectVisible
                                          ? `${200 + tagIndex * 50}ms`
                                          : `${600 + index * 150 + 200 + tagIndex * 50}ms`,
                                      }}
                                      onClick={() => setSelectedTag(tag)}
                                      type="button"
                                    >
                                      {tag}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* CTA Button */}
                              <Link
                                href={`/projects/${project.slug}`}
                                className={`to-primary-600/20 hover:to-primary-600/30 inline-flex transform items-center rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-600/20 px-8 py-4 font-medium text-blue-300 transition-all duration-300 hover:scale-105 hover:border-blue-400/50 hover:from-blue-600/30 hover:text-blue-200 hover:shadow-lg hover:shadow-blue-500/20 ${
                                  isProjectVisible
                                    ? 'translate-y-0 opacity-100'
                                    : 'translate-y-2 opacity-0'
                                }`}
                                style={{
                                  transitionDelay: isProjectVisible
                                    ? '400ms'
                                    : `${600 + index * 150 + 400}ms`,
                                }}
                              >
                                <span>프로젝트 상세보기</span>
                                <svg
                                  className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1"
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
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}

              {/* Pagination - Integrated */}
              {pagination && pagination.totalPages > 1 && (
                <div
                  className={`flex justify-center transition-all delay-800 duration-1000 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
