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
  }, [posts.length])

  return (
    <div className="min-h-screen">
      {/* Full Screen Landing Hero */}
      <InteractiveHero onDeveloperClick={() => openModal('developer')} onSoundDesignerClick={() => openModal('sound-designer')} />
      

      {/* Content Modal */}
      <ContentModal isOpen={modalOpen} onClose={closeModal} type={modalType} onNavigateToProjects={navigateToProjects} />

      {/* Content Sections - Only Blog Posts */}
      <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 pt-20 transition-all duration-1000 delay-1600 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>

        {/* Latest Posts Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-100 mb-4 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              최신 포스트
            </h2>
            <div className={`h-1 w-16 bg-gradient-to-r from-primary-500 to-blue-500 mx-auto mb-6 rounded-full transition-all duration-800 delay-400 ${
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}></div>
            <p className={`text-xl text-gray-400 transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              개발과 기술에 대한 최신 이야기들을 만나보세요
            </p>
          </div>

          <div className="grid gap-8">
            {!posts.length && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">아직 포스트가 없습니다.</p>
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
                  className={`group relative backdrop-blur-lg bg-gray-900/30 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-700 hover:shadow-2xl hover:shadow-primary-500/10 transform hover:-translate-y-1 ${
                    isPostVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{
                    transitionDelay: isPostVisible ? '0ms' : `${800 + index * 150}ms`
                  }}
                >
                  {/* Decorative gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    {/* Date */}
                    <div className={`flex items-center text-sm text-gray-400 mb-4 transition-all duration-500 ${
                      isPostVisible 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-4'
                    }`}
                    style={{
                      transitionDelay: isPostVisible 
                        ? '100ms' 
                        : `${800 + index * 150 + 100}ms`
                    }}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <time dateTime={date}>
                        {formatDate(date, siteMetadata.locale)}
                      </time>
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl lg:text-3xl font-bold mb-4 leading-tight transition-all duration-700 ${
                      isPostVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    }`}
                    style={{
                      transitionDelay: isPostVisible 
                        ? '150ms' 
                        : `${800 + index * 150 + 150}ms`
                    }}>
                      <Link 
                        href={`/blog/${postSlug}`} 
                        className="text-gray-100 hover:text-primary-400 transition-colors duration-200 group-hover:text-primary-300"
                      >
                        {title}
                      </Link>
                    </h3>

                    {/* Summary */}
                    <p className={`text-gray-300 text-lg leading-relaxed mb-6 line-clamp-3 transition-all duration-600 ${
                      isPostVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-3'
                    }`}
                    style={{
                      transitionDelay: isPostVisible 
                        ? '200ms' 
                        : `${800 + index * 150 + 200}ms`
                    }}>
                      {summary}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tags?.slice(0, 4).map((tag, tagIndex) => (
                        <Link
                          key={tag}
                          href={`/tags/${slug(tag)}`}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-primary-500/50 hover:text-primary-400 transition-all duration-300 ${
                            isPostVisible 
                              ? 'opacity-100 translate-y-0' 
                              : 'opacity-0 translate-y-2'
                          }`}
                          style={{
                            transitionDelay: isPostVisible 
                              ? `${250 + tagIndex * 50}ms` 
                              : `${800 + index * 150 + 250 + tagIndex * 50}ms`
                          }}
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>

                    {/* Read More */}
                    <Link
                      href={`/blog/${postSlug}`}
                      className={`inline-flex items-center text-primary-400 hover:text-primary-300 font-medium transition-all duration-300 group ${
                        isPostVisible 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-2'
                      }`}
                      style={{
                        transitionDelay: isPostVisible 
                          ? '450ms' 
                          : `${800 + index * 150 + 450}ms`
                      }}
                    >
                      자세히 읽기
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>

          {/* View All Posts */}
          {posts.length > MAX_DISPLAY && (
            <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <Link
                href="/blog"
                className="inline-flex items-center px-8 py-4 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 text-gray-200 hover:text-gray-100 font-semibold text-lg transition-all duration-300 transform hover:scale-105 group"
              >
                모든 포스트 보기
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
