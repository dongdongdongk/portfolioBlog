'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import InteractiveHero from '@/components/InteractiveHero'
import ContentModal from '@/components/ContentModal'
import { slug } from 'github-slugger'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'developer' | 'sound-designer'>('developer')
  const [isVisible, setIsVisible] = useState(false)
  const [visiblePosts, setVisiblePosts] = useState<boolean[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  const navigateToProjects = (role: 'developer' | 'sound-designer') => {
    const roleParam = role === 'developer' ? 'developer' : 'sound-designer'
    router.push(`/projects?role=${roleParam}`)
  }

  const openModal = (type: 'developer' | 'sound-designer') => {
    setModalType(type)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  // Initial page load animation
  useEffect(() => {
    setIsVisible(true)
    setVisiblePosts(new Array(Math.min(posts.length, MAX_DISPLAY)).fill(false))
  }, [posts.length])

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

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
  }, [posts.length])

  return (
    <div className="min-h-screen">
      {/* Full Screen Landing Hero */}
      <InteractiveHero
        onDeveloperClick={() => openModal('developer')}
        onSoundDesignerClick={() => openModal('sound-designer')}
      />

      {/* Content Modal */}
      <ContentModal
        isOpen={modalOpen}
        onClose={closeModal}
        type={modalType}
        onNavigateToProjects={navigateToProjects}
      />

      {/* Content Sections - Only Blog Posts */}
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 pt-20 transition-all delay-1600 duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}
      >
        {/* Latest Posts Section */}
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2
              className={`mb-4 text-4xl font-bold text-gray-100 transition-all delay-200 duration-1000 md:text-5xl ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              최신 포스트
            </h2>
            <div
              className={`from-primary-500 mx-auto mb-6 h-1 w-16 rounded-full bg-gradient-to-r to-blue-500 transition-all delay-400 duration-800 ${
                isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
              }`}
            ></div>
            <p
              className={`text-xl text-gray-400 transition-all delay-600 duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              사운드 디자인과 개발 지식을 기록하고 공유합니다.
            </p>
          </div>

          <div className="grid gap-8">
            {!posts.length && (
              <div className="py-20 text-center">
                <p className="text-lg text-gray-400">아직 포스트가 없습니다.</p>
              </div>
            )}

            {posts.slice(0, MAX_DISPLAY).map((post, index) => {
              const { slug: postSlug, date, title, summary, tags } = post
              const isPostVisible = visiblePosts[index]
              return (
                <article
                  key={postSlug}
                  data-index={index}
                  ref={(el) => {
                    if (el && observerRef.current) {
                      observerRef.current.observe(el)
                    }
                  }}
                  className={`group hover:shadow-primary-500/10 relative transform rounded-2xl border border-gray-800 bg-gray-900/30 p-8 backdrop-blur-lg transition-all duration-700 hover:-translate-y-1 hover:border-gray-700 hover:shadow-2xl ${
                    isPostVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                  style={{
                    transitionDelay: isPostVisible ? '0ms' : `${800 + index * 150}ms`,
                  }}
                >
                  {/* Decorative gradient */}
                  <div className="from-primary-500/5 absolute inset-0 rounded-2xl bg-gradient-to-r to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                  <div className="relative">
                    {/* Date */}
                    <div
                      className={`mb-4 flex items-center text-sm text-gray-400 transition-all duration-500 ${
                        isPostVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                      }`}
                      style={{
                        transitionDelay: isPostVisible ? '100ms' : `${800 + index * 150 + 100}ms`,
                      }}
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                    </div>

                    {/* Title */}
                    <h3
                      className={`mb-4 text-2xl leading-tight font-bold transition-all duration-700 lg:text-3xl ${
                        isPostVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                      style={{
                        transitionDelay: isPostVisible ? '150ms' : `${800 + index * 150 + 150}ms`,
                      }}
                    >
                      <Link
                        href={`/blog/${postSlug}`}
                        className="hover:text-primary-400 group-hover:text-primary-300 text-gray-100 transition-colors duration-200"
                      >
                        {title}
                      </Link>
                    </h3>

                    {/* Summary */}
                    <p
                      className={`mb-6 line-clamp-3 text-lg leading-relaxed text-gray-300 transition-all duration-600 ${
                        isPostVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                      }`}
                      style={{
                        transitionDelay: isPostVisible ? '200ms' : `${800 + index * 150 + 200}ms`,
                      }}
                    >
                      {summary}
                    </p>

                    {/* Tags */}
                    <div className="mb-6 flex flex-wrap gap-2">
                      {tags?.slice(0, 4).map((tag, tagIndex) => (
                        <Link
                          key={tag}
                          href={`/tags/${slug(tag)}`}
                          className={`hover:border-primary-500/50 hover:text-primary-400 inline-flex items-center rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-sm font-medium text-gray-300 transition-all duration-300 ${
                            isPostVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                          }`}
                          style={{
                            transitionDelay: isPostVisible
                              ? `${250 + tagIndex * 50}ms`
                              : `${800 + index * 150 + 250 + tagIndex * 50}ms`,
                          }}
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>

                    {/* Read More */}
                    <Link
                      href={`/blog/${postSlug}`}
                      className={`text-primary-400 hover:text-primary-300 group inline-flex items-center font-medium transition-all duration-300 ${
                        isPostVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                      }`}
                      style={{
                        transitionDelay: isPostVisible ? '450ms' : `${800 + index * 150 + 450}ms`,
                      }}
                    >
                      자세히 읽기
                      <svg
                        className="ml-2 h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1"
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

          {/* View All Posts */}
          {posts.length > MAX_DISPLAY && (
            <div
              className={`mt-16 text-center transition-all delay-1000 duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <Link
                href="/blog"
                className="group inline-flex transform items-center rounded-2xl border border-gray-700 bg-gray-800/50 px-8 py-4 text-lg font-semibold text-gray-200 transition-all duration-300 hover:scale-105 hover:border-gray-600 hover:text-gray-100"
              >
                모든 포스트 보기
                <svg
                  className="ml-2 h-5 w-5 transform transition-transform duration-200 group-hover:translate-x-1"
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
          )}
        </div>
      </div>
    </div>
  )
}
