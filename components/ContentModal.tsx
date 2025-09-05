'use client'

import { useState, useEffect } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

interface ContentModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'developer' | 'sound-designer'
  onNavigateToProjects?: (role: 'developer' | 'sound-designer') => void
}

export default function ContentModal({
  isOpen,
  onClose,
  type,
  onNavigateToProjects,
}: ContentModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isDeveloper = type === 'developer'

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div className="fixed inset-0 overflow-y-auto" onClick={handleBackdropClick}>
        <div
          className="flex min-h-full items-start justify-center p-4 pt-8"
          onClick={handleBackdropClick}
        >
          <div
            className={`relative w-full max-w-6xl ${
              isDeveloper
                ? 'border border-slate-700/50 bg-slate-900/95'
                : 'border border-purple-500/30 bg-slate-900/95'
            } transform rounded-3xl shadow-2xl backdrop-blur-xl transition-all duration-500 ${
              isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 h-10 w-10 rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
              aria-label="Close modal"
            >
              <svg
                className="mx-auto h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Content */}
            <div className="p-8 md:p-12">
              {isDeveloper ? <DeveloperContent /> : <SoundDesignerContent />}

              {/* Navigate to Projects Button */}
              {onNavigateToProjects && (
                <div className="mt-12 border-t border-gray-700/50 pt-8 text-center">
                  <button
                    onClick={() => {
                      onNavigateToProjects(type)
                      onClose()
                    }}
                    className={`group inline-flex transform items-center rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                      isDeveloper
                        ? 'border border-blue-500/30 bg-gray-800/50 text-blue-200 hover:border-blue-400/50 hover:text-blue-100'
                        : 'border border-purple-500/30 bg-gray-800/50 text-purple-200 hover:border-purple-400/50 hover:text-purple-100'
                    }`}
                  >
                    {isDeveloper ? '개발 프로젝트 보러가기' : '사운드 프로젝트 보러가기'}
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
                  </button>
                  <p className="mt-3 text-sm text-gray-400">
                    실제 프로젝트와 포트폴리오를 확인해보세요
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeveloperContent() {
  return (
    <>
      {/* Header Section with Profile */}
      <div className="relative">
        <div className="mb-12 flex flex-col items-center gap-8 lg:flex-row lg:items-start">
          {/* Profile Image & Basic Info */}
          <div className="flex-shrink-0 text-center lg:text-left">
            <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 shadow-2xl shadow-blue-500/20 lg:mx-0 lg:h-40 lg:w-40">
              <svg
                className="h-16 w-16 text-white lg:h-20 lg:w-20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white lg:text-4xl">김동현</h1>
              <p className="text-xl font-medium text-blue-300">Full Stack Developer</p>
              <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                  Frontend
                </span>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-300">
                  Backend
                </span>
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">
                  DevOps
                </span>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="flex-1">
            <h2 className="mb-4 text-2xl font-bold text-blue-200 lg:text-3xl">About Me</h2>
            <div className="space-y-4 leading-relaxed text-gray-300">
              <p>
                <strong className="text-blue-300">문제 해결 중심의 개발자</strong>로서, 이젠솔루션과
                우리아이시티에서 다양한 SI 프로젝트를 경험하며 실무 역량을 쌓아왔습니다.
              </p>
              <p>
                Java/Spring Framework부터 MERN 스택까지 다양한 기술을 활용하여
                <strong className="text-cyan-300">효율적이고 확장 가능한 솔루션</strong>을 구현하는
                것을 지향합니다.
              </p>
              <p>
                현재는 <strong className="text-blue-300">금융권 시스템 개발</strong>에 참여하여
                대규모 프로젝트의 아키텍처 설계와 구현 경험을 쌓고 있습니다.
              </p>
            </div>

            {/* Contact Info */}
            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div className="flex items-center space-x-2">
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
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-300">roono.help@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-300">서울특별시</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-purple-400"
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
                  <span className="text-gray-300">GitHub: @roonokun</span>
                </div>
                <div className="flex items-center space-x-2">
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
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0v10a2 2 0 002 2h4a2 2 0 002-2V6"
                    />
                  </svg>
                  <span className="text-gray-300">2년+ 실무 경험</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Skills Section */}
      <ScrollReveal delay={200} className="mb-12">
        <h2 className="mb-6 flex items-center text-2xl font-bold text-blue-200">
          <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Technical Skills
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
            <h3 className="mb-4 text-lg font-semibold text-blue-300">Backend</h3>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-200">
                Java
              </span>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-200">
                Spring Framework
              </span>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-200">
                Spring Boot
              </span>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-200">
                Node.js
              </span>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-200">
                Express.js
              </span>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-200">
                E-Gov 4.0
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
            <h3 className="mb-4 text-lg font-semibold text-cyan-300">Frontend</h3>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-200">
                React
              </span>
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-200">
                Next.js
              </span>
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-200">
                TypeScript
              </span>
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-200">
                JavaScript
              </span>
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-200">
                Nexacro 17
              </span>
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-200">
                Mi-Platform
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
            <h3 className="mb-4 text-lg font-semibold text-purple-300">Database & DevOps</h3>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-200">
                MySQL
              </span>
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-200">
                Oracle
              </span>
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-200">
                MongoDB
              </span>
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-200">
                Linux
              </span>
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-200">
                Bamboo CI/CD
              </span>
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-200">
                Prisma ORM
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Work Experience */}
      <ScrollReveal delay={300} className="mb-12">
        <h2 className="mb-6 flex items-center text-2xl font-bold text-blue-200">
          <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0v10a2 2 0 002 2h4a2 2 0 002-2V6"
            />
          </svg>
          Work Experience
        </h2>
        <div className="space-y-8">
          {/* 우리아이시티 */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-6">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-blue-300">우리아이시티</h3>
                <p className="font-medium text-blue-200">SI 개발 사원</p>
              </div>
              <div className="mt-2 text-sm text-gray-400 md:mt-0">2024 - 현재</div>
            </div>
            <div className="mb-4">
              <h4 className="mb-2 font-semibold text-gray-300">
                주요 프로젝트: 금감원 FSS 플랫폼 전환
              </h4>
              <ul className="ml-4 space-y-1 text-gray-400">
                <li>• 금융감독원 플랫폼 전환 프로젝트 참여</li>
                <li>• Spring Framework & E-Gov 4.0 기반 백엔드 개발</li>
                <li>• Nexacro 17, Mi-Platform 활용한 프론트엔드 구현</li>
                <li>• Oracle 데이터베이스 연동 및 쿼리 최적화</li>
              </ul>
            </div>
            <p className="border-l-3 border-blue-400 pl-3 text-sm text-gray-300">
              대규모 금융 시스템 개발을 통해 공공 분야 요구사항 분석부터 시스템 구현까지의 전 과정을
              경험했습니다.
            </p>
          </div>

          {/* 이젠솔루션 */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-6">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-cyan-300">이젠솔루션</h3>
                <p className="font-medium text-cyan-200">SI 개발 및 운영 사원</p>
              </div>
              <div className="mt-2 text-sm text-gray-400 md:mt-0">2022 - 2024</div>
            </div>
            <div className="mb-4">
              <h4 className="mb-2 font-semibold text-gray-300">주요 업무: DevOps 및 시스템 운영</h4>
              <ul className="ml-4 space-y-1 text-gray-400">
                <li>• Linux 서버 환경 구축 및 운영</li>
                <li>• Bamboo CI/CD 파이프라인 구축 및 관리</li>
                <li>• Tomcat, Apache 웹서버 설정 및 최적화</li>
                <li>• 시스템 모니터링 및 장애 대응</li>
              </ul>
            </div>
            <p className="border-l-3 border-cyan-400 pl-3 text-sm text-gray-300">
              개발부터 운영까지 전체 라이프사이클을 경험하며 DevOps 관점에서의 시스템 관리 역량을
              쌓았습니다.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Projects & Personal Development */}
      <ScrollReveal delay={400} className="mb-12">
        <h2 className="mb-6 flex items-center text-2xl font-bold text-blue-200">
          <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Personal Projects
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
            <h3 className="mb-3 text-lg font-semibold text-blue-300">Roono Play</h3>
            <p className="mb-3 text-sm text-gray-400">
              심리테스트 플랫폼 - Next.js, TypeScript, Supabase 활용
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-200">
                Next.js
              </span>
              <span className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-200">
                TypeScript
              </span>
              <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-200">
                Supabase
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
            <h3 className="mb-3 text-lg font-semibold text-blue-300">TalentSwap</h3>
            <p className="mb-3 text-sm text-gray-400">
              재능교환 플랫폼 - 가상 스크롤링, 실시간 채팅 구현
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-200">
                React
              </span>
              <span className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-200">
                Supabase Realtime
              </span>
              <span className="rounded bg-yellow-500/20 px-2 py-1 text-xs text-yellow-200">
                Virtual Scrolling
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Education & Certifications */}
      <ScrollReveal delay={500} className="mb-8">
        <h2 className="mb-6 flex items-center text-2xl font-bold text-blue-200">
          <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          Focus Areas
        </h2>
        <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-2xl">💻</div>
              <h3 className="mb-1 font-semibold text-blue-300">Full Stack Development</h3>
              <p className="text-sm text-gray-400">Modern web technologies</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl">🏗️</div>
              <h3 className="mb-1 font-semibold text-cyan-300">System Architecture</h3>
              <p className="text-sm text-gray-400">Scalable solutions</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl">🔧</div>
              <h3 className="mb-1 font-semibold text-purple-300">DevOps & Automation</h3>
              <p className="text-sm text-gray-400">CI/CD and infrastructure</p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </>
  )
}

function SoundDesignerContent() {
  return (
    <>
      {/* Header Section with Profile */}
      <div className="relative">
        <div className="mb-12 flex flex-col items-center gap-8 lg:flex-row lg:items-start">
          {/* Profile Image & Basic Info */}
          <div className="flex-shrink-0 text-center lg:text-left">
            <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 shadow-2xl shadow-purple-500/20 lg:mx-0 lg:h-40 lg:w-40">
              <svg
                className="h-16 w-16 text-white lg:h-20 lg:w-20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white lg:text-4xl">김동현</h1>
              <p className="text-xl font-medium text-purple-300">Sound Designer & Audio Engineer</p>
              <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">
                  Game Audio
                </span>
                <span className="rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-300">
                  Music Production
                </span>
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">
                  Voice Recording
                </span>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="flex-1">
            <h2 className="mb-4 text-2xl font-bold text-purple-200 lg:text-3xl">About Me</h2>
            <div className="space-y-4 leading-relaxed text-gray-300">
              <p>
                <strong className="text-purple-300">작곡 전공 출신</strong>으로서 학창시절 게임과
                영상 음악 작업을 시작하여 자연스럽게 사운드 디자인 업무를 접하게 되었습니다.
              </p>
              <p>
                넷마블F&C, 토이푸딩, 스톰프 뮤직에서
                <strong className="text-violet-300">애니메이션, 앱, 게임 등 규모있는 콘텐츠</strong>
                를 제작하며 창의적 마인드와 팀 협업 능력을 키워왔습니다.
              </p>
              <p>
                <strong className="text-purple-300">Wwise, FMOD, 언리얼/유니티</strong> 등 게임
                엔진과 미들웨어를 심도있게 학습하여 게임 제작 전반에 대한 이해도를 갖추고 있습니다.
              </p>
            </div>

            {/* Skills & Tools */}
            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <span className="text-gray-300">DAW & Plugin 전문</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-violet-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  <span className="text-gray-300">RX9 보이스 에디팅</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18.5l-7.5-7.5 1.5-1.5L12 15.5l6-6 1.5 1.5L12 18.5z"
                    />
                  </svg>
                  <span className="text-gray-300">Wwise & FMOD 통합</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-violet-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="text-gray-300">팀 리더십 & 디렉팅</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Competencies */}
      <ScrollReveal delay={200} className="mb-12">
        <h2 className="mb-6 flex items-center text-2xl font-bold text-purple-200">
          <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Core Competencies
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
            <h3 className="mb-4 text-lg font-semibold text-purple-300">문서화 & 효율적 관리</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• 작업 소스 목록 엑셀 문서화</p>
              <p>• 우선순위 등급 시스템 구축</p>
              <p>• 지속적 소통 및 혼선 방지</p>
              <p>• 프로젝트 마감 기한 준수</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
            <h3 className="mb-4 text-lg font-semibold text-violet-300">창의적 사운드 제작</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• DAW & 다양한 Plugin 활용</p>
              <p>• 일상 소리 기반 몬스터 보이스</p>
              <p>• 창의적 사운드 디자인 기법</p>
              <p>• 특색있는 오디오 결과물</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
            <h3 className="mb-4 text-lg font-semibold text-purple-300">보이스 레코딩 & 디렉팅</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• 퀄리티 높은 보이스 샘플 제작</p>
              <p>• RX9 활용 보이스 에디팅</p>
              <p>• 성우 디렉팅 및 역량 극대화</p>
              <p>• 250만 조회수 콘텐츠 제작</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Work Experience */}
      <ScrollReveal delay={300} className="mb-12">
        <h2 className="mb-6 flex items-center text-2xl font-bold text-purple-200">
          <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0v10a2 2 0 002 2h4a2 2 0 002-2V6"
            />
          </svg>
          Work Experience
        </h2>
        <div className="space-y-8">
          {/* 넷마블F&C */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-6">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-purple-300">넷마블F&C</h3>
                <p className="font-medium text-purple-200">사운드디자인, 믹싱</p>
              </div>
              <div className="mt-2 text-sm text-gray-400 md:mt-0">2022 - 2023</div>
            </div>
            <div className="mb-4">
              <h4 className="mb-2 font-semibold text-gray-300">
                주요 프로젝트: 아스달 연대기, 블레이드 & 소울 레볼루션
              </h4>
              <ul className="ml-4 space-y-1 text-gray-400">
                <li>• 언리얼 엔진 오디오 시스템을 활용한 게임 사운드 적용</li>
                <li>• 캐릭터 및 NPC 대사 녹음 및 편집</li>
                <li>• 몬스터 공격, 이동, 피격 사운드 효과 제작</li>
                <li>• 시네마틱 컷신 사운드 디자인 및 믹싱</li>
              </ul>
            </div>
            <p className="border-l-3 border-purple-400 pl-3 text-sm text-gray-300">
              대형 게임 개발사에서 AAA급 타이틀의 사운드 디자인을 담당하며 대규모 프로젝트 경험을
              쌓았습니다.
            </p>
          </div>

          {/* 토이푸딩 */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-6">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-violet-300">토이푸딩</h3>
                <p className="font-medium text-violet-200">사운드디자인, 믹싱, 작곡, 편곡</p>
              </div>
              <div className="mt-2 text-sm text-gray-400 md:mt-0">2020 - 2022</div>
            </div>
            <div className="mb-4">
              <h4 className="mb-2 font-semibold text-gray-300">
                주요 성과: Baby Doli 애니메이션 2717만 조회수 달성
              </h4>
              <ul className="ml-4 space-y-1 text-gray-400">
                <li>• 유아 대상 캐주얼 게임 사운드디자인 & BGM 제작</li>
                <li>• 3D 애니메이션 30화 사운드디자인, 레코딩, 작곡 담당</li>
                <li>• 숏폼 SNS 앱 UI 사운드디자인 (누적 50만 다운로드)</li>
                <li>• 서울산업진흥원 애니메이션 제작지원사업 본선 진출</li>
              </ul>
            </div>
            <p className="border-l-3 border-violet-400 pl-3 text-sm text-gray-300">
              다양한 미디어 콘텐츠의 오디오 전반을 담당하며 창작자로서의 역량을 발휘했습니다.
            </p>
          </div>

          {/* 스톰프뮤직 */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-6">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-purple-300">스톰프뮤직</h3>
                <p className="font-medium text-purple-200">작곡, 편곡 외주검수 & 관리, 레코딩</p>
              </div>
              <div className="mt-2 text-sm text-gray-400 md:mt-0">2019 - 2020</div>
            </div>
            <div className="mb-4">
              <h4 className="mb-2 font-semibold text-gray-300">주요 업무: 음악 프로덕션 전문</h4>
              <ul className="ml-4 space-y-1 text-gray-400">
                <li>• 외주 작곡/편곡 프로젝트 검수 및 관리</li>
                <li>• 전문 스튜디오 레코딩 세션 진행</li>
                <li>• 다양한 장르 음악 제작 및 프로덕션</li>
                <li>• 클라이언트 요구사항 분석 및 품질 관리</li>
              </ul>
            </div>
            <p className="border-l-3 border-purple-400 pl-3 text-sm text-gray-300">
              음악 프로덕션 전문 회사에서 프로젝트 관리와 음악 제작 전반에 대한 전문성을 갖췄습니다.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Major Projects */}
      <ScrollReveal delay={400} className="mb-12">
        <h2 className="mb-6 flex items-center text-2xl font-bold text-purple-200">
          <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Major Projects
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
            <h3 className="mb-3 text-lg font-semibold text-purple-300">Baby Doli Fantastic Home</h3>
            <p className="mb-3 text-sm text-gray-400">
              유아 대상 캐주얼 게임 - 누적 다운로드 10만 회, 중국 수출
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-200">
                사운드디자인
              </span>
              <span className="rounded bg-violet-500/20 px-2 py-1 text-xs text-violet-200">
                BGM 제작
              </span>
              <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-200">
                보이스 레코딩
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
            <h3 className="mb-3 text-lg font-semibold text-purple-300">아스달 연대기</h3>
            <p className="mb-3 text-sm text-gray-400">넷마블 대형 RPG 게임 - G-STAR 2023 출품</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-200">
                언리얼 엔진
              </span>
              <span className="rounded bg-violet-500/20 px-2 py-1 text-xs text-violet-200">
                사운드 시스템
              </span>
              <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-200">
                몬스터 사운드
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
            <h3 className="mb-3 text-lg font-semibold text-purple-300">Baby Doli Nursery Rhymes</h3>
            <p className="mb-3 text-sm text-gray-400">
              3D 애니메이션 30화 - 누적 2717만 조회수, 다국가 수출
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-200">
                사운드디자인
              </span>
              <span className="rounded bg-violet-500/20 px-2 py-1 text-xs text-violet-200">
                보이스 레코딩
              </span>
              <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-200">
                BGM 작곡
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
            <h3 className="mb-3 text-lg font-semibold text-purple-300">CJ CGV PACONNIE</h3>
            <p className="mb-3 text-sm text-gray-400">CGV 대표 캐릭터 3D 애니메이션 프로젝트</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-200">
                캐릭터 보이스
              </span>
              <span className="rounded bg-violet-500/20 px-2 py-1 text-xs text-violet-200">
                사운드디자인
              </span>
              <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-200">
                믹싱&마스터링
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Technical Skills */}
      <ScrollReveal delay={500} className="mb-8">
        <h2 className="mb-6 flex items-center text-2xl font-bold text-purple-200">
          <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          Technical Stack
        </h2>
        <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-5">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-2xl">🎵</div>
              <h3 className="mb-1 font-semibold text-purple-300">DAW & Synth</h3>
              <p className="text-sm text-gray-400">Pro Tools, Logic, Cubase</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl">🎮</div>
              <h3 className="mb-1 font-semibold text-violet-300">Game Audio</h3>
              <p className="text-sm text-gray-400">Unreal, Unity, Wwise, FMOD</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl">🎙️</div>
              <h3 className="mb-1 font-semibold text-purple-300">Voice Editing</h3>
              <p className="text-sm text-gray-400">RX9, 레코딩 & 디렉팅</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl">🎼</div>
              <h3 className="mb-1 font-semibold text-violet-300">Music Production</h3>
              <p className="text-sm text-gray-400">오케스트레이션, 편곡</p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </>
  )
}
