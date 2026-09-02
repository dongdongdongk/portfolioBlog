'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import Link from '@/components/Link'
import Image from 'next/image'
import type { BlogPost } from '@/lib/mdx'

interface ProjectsLayoutProps {
  projects: BlogPost[]
  title: string
  initialDisplayProjects?: BlogPost[]
  pagination?: {
    totalPages: number
    currentPage: number
    currentRole?: 'Developer' | 'Sound Designer'
  }
  initialRole?: 'Developer' | 'Sound Designer'
}

export default function ProjectsLayoutWithTags({
  projects,
  title,
  initialDisplayProjects = [],
  pagination,
  initialRole = 'Developer',
}: ProjectsLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [searchValue, setSearchValue] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [selectedRole, setSelectedRole] = useState<'Developer' | 'Sound Designer'>(initialRole)
  const [filteredProjects, setFilteredProjects] = useState<BlogPost[]>([])
  const [displayedProjects, setDisplayedProjects] = useState<BlogPost[]>([])
  const [sortedTags, setSortedTags] = useState<string[]>([])
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({})
  const [itemsToShow, setItemsToShow] = useState(12)
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleChange = (role: 'Developer' | 'Sound Designer') => {
    setSelectedRole(role)
    const roleParam = role === 'Sound Designer' ? '?role=sound-designer' : '?role=developer'
    if (pathname.includes('/projects/page/') || pathname === '/projects') {
      router.push(`/projects${roleParam}`)
    }
  }

  useEffect(() => {
    const roleFiltered = projects.filter(
      (p) => (p as BlogPost & { role?: string }).role === selectedRole
    )
    const counts = roleFiltered.reduce(
      (acc, p) => {
        p.tags?.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>
    )
    setTagCounts(counts)
    setSortedTags(Object.keys(counts).sort())
    setSelectedTag('')
  }, [selectedRole, projects])

  useEffect(() => {
    const filtered = projects.filter((p) => {
      const matchesRole = (p as BlogPost & { role?: string }).role === selectedRole
      const matchesSearch =
        !searchValue.trim() ||
        (p.title + ' ' + (p.summary || '') + ' ' + (p.tags?.join(' ') || ''))
          .toLowerCase()
          .includes(searchValue.toLowerCase().trim())
      const matchesTag = !selectedTag.trim() || p.tags?.includes(selectedTag)
      return matchesRole && matchesSearch && matchesTag
    })
    setFilteredProjects(filtered)
    setItemsToShow(12)
  }, [searchValue, selectedTag, selectedRole, projects])

  useEffect(() => {
    setDisplayedProjects(filteredProjects.slice(0, itemsToShow))
  }, [filteredProjects, itemsToShow])

  const loadMore = () => {
    if (isLoading || itemsToShow >= filteredProjects.length) return
    setIsLoading(true)
    setTimeout(() => {
      setItemsToShow((prev) => prev + 12)
      setIsLoading(false)
    }, 300)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 800) {
        loadMore()
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, itemsToShow, filteredProjects.length])

  const totalRoleProjects = projects.filter(
    (p) => (p as BlogPost & { role?: string }).role === selectedRole
  ).length

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 py-10">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-400">개발 및 사운드 디자인 프로젝트 모음</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-12">
        {/* Role Toggle */}
        <div className="mb-8 flex gap-1 border-b border-gray-100 pb-0">
          {(['Developer', 'Sound Designer'] as const).map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`pr-5 pb-3 text-sm font-semibold transition-colors duration-150 ${
                selectedRole === role
                  ? 'border-b-2 border-slate-900 text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Search + Tag filters */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="프로젝트 검색..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-slate-400"
          />

          {sortedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedTag('')}
                className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                  !selectedTag
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                전체 {totalRoleProjects}
              </button>
              {sortedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {tag} {tagCounts[tag]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active filter info */}
        {(searchValue || selectedTag) && (
          <p className="mb-6 text-sm text-slate-400">
            {filteredProjects.length}개의 프로젝트
            {selectedTag && (
              <>
                {' '}
                — <span className="text-slate-600">{selectedTag}</span>
              </>
            )}
            {searchValue && <> — &quot;{searchValue}&quot;</>}
          </p>
        )}

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-400">검색 결과가 없습니다.</div>
        )}

        {/* Project list */}
        <div className="grid gap-4 sm:grid-cols-2">
          {displayedProjects.map((project) => (
            <article
              key={project.slug}
              className="group overflow-hidden rounded-xl border border-gray-200 transition-colors hover:border-gray-400"
            >
              {project.images?.[0] && (
                <Link href={`/projects/${project.slug}`} className="block overflow-hidden">
                  <Image
                    alt={project.title}
                    src={project.images[0]}
                    width={600}
                    height={300}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </Link>
              )}
              <div className="p-5">
                <h2 className="text-sm font-semibold text-slate-900">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="transition-colors group-hover:text-blue-700"
                  >
                    {project.title}
                  </Link>
                </h2>
                {project.summary && (
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
                    {project.summary}
                  </p>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.tags.slice(0, 5).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                        className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-200"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Load more */}
        {itemsToShow < filteredProjects.length && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="rounded-lg border border-gray-200 px-6 py-2 text-sm text-slate-500 transition-colors hover:border-gray-400 hover:text-slate-900 disabled:opacity-50"
            >
              {isLoading ? '로딩 중...' : `더 보기 (${filteredProjects.length - itemsToShow})`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
