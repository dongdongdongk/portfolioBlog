'use client'

import { useState, useEffect } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

interface ContentModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'developer' | 'sound-designer'
  onNavigateToProjects?: (role: 'developer' | 'sound-designer') => void
}

export default function ContentModal({ isOpen, onClose, type, onNavigateToProjects }: ContentModalProps) {
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
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="fixed inset-0 overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div 
          className="min-h-full flex items-start justify-center p-4 pt-8"
          onClick={handleBackdropClick}
        >
          <div className={`relative w-full max-w-6xl ${
            isDeveloper 
              ? 'bg-slate-900/95 border border-slate-700/50' 
              : 'bg-slate-900/95 border border-purple-500/30'
          } backdrop-blur-xl rounded-3xl shadow-2xl transform transition-all duration-500 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
          >
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="p-8 md:p-12">
              {isDeveloper ? (
                <DeveloperContent />
              ) : (
                <SoundDesignerContent />
              )}
              
              {/* Navigate to Projects Button */}
              {onNavigateToProjects && (
                <div className="mt-12 pt-8 border-t border-gray-700/50 text-center">
                  <button
                    onClick={() => {
                      onNavigateToProjects(type)
                      onClose()
                    }}
                    className={`inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 group ${
                      isDeveloper
                        ? 'bg-gray-800/50 border border-blue-500/30 hover:border-blue-400/50 text-blue-200 hover:text-blue-100'
                        : 'bg-gray-800/50 border border-purple-500/30 hover:border-purple-400/50 text-purple-200 hover:text-purple-100'
                    }`}
                  >
                    {isDeveloper ? '개발 프로젝트 보러가기' : '사운드 프로젝트 보러가기'}
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  <p className="text-gray-400 text-sm mt-3">
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
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-12">
          {/* Profile Image & Basic Info */}
          <div className="flex-shrink-0 text-center lg:text-left">
            <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto lg:mx-0 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20">
              <svg className="w-16 h-16 lg:w-20 lg:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-white">김동현</h1>
              <p className="text-xl text-blue-300 font-medium">Full Stack Developer</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Frontend</span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">Backend</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">DevOps</span>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="flex-1">
            <h2 className="text-2xl lg:text-3xl font-bold text-blue-200 mb-4">About Me</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                <strong className="text-blue-300">문제 해결 중심의 개발자</strong>로서, 이젠솔루션과 우리아이시티에서 
                다양한 SI 프로젝트를 경험하며 실무 역량을 쌓아왔습니다.
              </p>
              <p>
                Java/Spring Framework부터 MERN 스택까지 다양한 기술을 활용하여 
                <strong className="text-cyan-300">효율적이고 확장 가능한 솔루션</strong>을 구현하는 것을 지향합니다.
              </p>
              <p>
                현재는 <strong className="text-blue-300">금융권 시스템 개발</strong>에 참여하여 
                대규모 프로젝트의 아키텍처 설계와 구현 경험을 쌓고 있습니다.
              </p>
            </div>

            {/* Contact Info */}
            <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300">roono.help@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-300">서울특별시</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="text-gray-300">GitHub: @roonokun</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0v10a2 2 0 002 2h4a2 2 0 002-2V6" />
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
        <h2 className="text-2xl font-bold text-blue-200 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Technical Skills
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-blue-300 mb-4">Backend</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm">Java</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm">Spring Framework</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm">Spring Boot</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm">Node.js</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm">Express.js</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm">E-Gov 4.0</span>
            </div>
          </div>
          
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">Frontend</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-200 rounded-full text-sm">React</span>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-200 rounded-full text-sm">Next.js</span>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-200 rounded-full text-sm">TypeScript</span>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-200 rounded-full text-sm">JavaScript</span>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-200 rounded-full text-sm">Nexacro 17</span>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-200 rounded-full text-sm">Mi-Platform</span>
            </div>
          </div>
          
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-purple-300 mb-4">Database & DevOps</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">MySQL</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">Oracle</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">MongoDB</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">Linux</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">Bamboo CI/CD</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">Prisma ORM</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Work Experience */}
      <ScrollReveal delay={300} className="mb-12">
        <h2 className="text-2xl font-bold text-blue-200 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0v10a2 2 0 002 2h4a2 2 0 002-2V6" />
          </svg>
          Work Experience
        </h2>
        <div className="space-y-8">
          {/* 우리아이시티 */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-blue-300">우리아이시티</h3>
                <p className="text-blue-200 font-medium">SI 개발 사원</p>
              </div>
              <div className="text-sm text-gray-400 mt-2 md:mt-0">
                2024 - 현재
              </div>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-300 mb-2">주요 프로젝트: 금감원 FSS 플랫폼 전환</h4>
              <ul className="text-gray-400 space-y-1 ml-4">
                <li>• 금융감독원 플랫폼 전환 프로젝트 참여</li>
                <li>• Spring Framework & E-Gov 4.0 기반 백엔드 개발</li>
                <li>• Nexacro 17, Mi-Platform 활용한 프론트엔드 구현</li>
                <li>• Oracle 데이터베이스 연동 및 쿼리 최적화</li>
              </ul>
            </div>
            <p className="text-gray-300 text-sm border-l-3 border-blue-400 pl-3">
              대규모 금융 시스템 개발을 통해 공공 분야 요구사항 분석부터 시스템 구현까지의 전 과정을 경험했습니다.
            </p>
          </div>

          {/* 이젠솔루션 */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-cyan-300">이젠솔루션</h3>
                <p className="text-cyan-200 font-medium">SI 개발 및 운영 사원</p>
              </div>
              <div className="text-sm text-gray-400 mt-2 md:mt-0">
                2022 - 2024
              </div>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-300 mb-2">주요 업무: DevOps 및 시스템 운영</h4>
              <ul className="text-gray-400 space-y-1 ml-4">
                <li>• Linux 서버 환경 구축 및 운영</li>
                <li>• Bamboo CI/CD 파이프라인 구축 및 관리</li>
                <li>• Tomcat, Apache 웹서버 설정 및 최적화</li>
                <li>• 시스템 모니터링 및 장애 대응</li>
              </ul>
            </div>
            <p className="text-gray-300 text-sm border-l-3 border-cyan-400 pl-3">
              개발부터 운영까지 전체 라이프사이클을 경험하며 DevOps 관점에서의 시스템 관리 역량을 쌓았습니다.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Projects & Personal Development */}
      <ScrollReveal delay={400} className="mb-12">
        <h2 className="text-2xl font-bold text-blue-200 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Personal Projects
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">Roono Play</h3>
            <p className="text-gray-400 text-sm mb-3">
              심리테스트 플랫폼 - Next.js, TypeScript, Supabase 활용
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-green-500/20 text-green-200 rounded text-xs">Next.js</span>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded text-xs">TypeScript</span>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded text-xs">Supabase</span>
            </div>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">TalentSwap</h3>
            <p className="text-gray-400 text-sm mb-3">
              재능교환 플랫폼 - 가상 스크롤링, 실시간 채팅 구현
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-green-500/20 text-green-200 rounded text-xs">React</span>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded text-xs">Supabase Realtime</span>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-200 rounded text-xs">Virtual Scrolling</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Education & Certifications */}
      <ScrollReveal delay={500} className="mb-8">
        <h2 className="text-2xl font-bold text-blue-200 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Focus Areas
        </h2>
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">💻</div>
              <h3 className="font-semibold text-blue-300 mb-1">Full Stack Development</h3>
              <p className="text-sm text-gray-400">Modern web technologies</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🏗️</div>
              <h3 className="font-semibold text-cyan-300 mb-1">System Architecture</h3>
              <p className="text-sm text-gray-400">Scalable solutions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔧</div>
              <h3 className="font-semibold text-purple-300 mb-1">DevOps & Automation</h3>
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
      <ScrollReveal className="text-center mb-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-violet-500 rounded-2xl mb-8">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-violet-400 mb-6">
          Sound Designer 김동현
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          넷마블, 토이푸딩, 스톰프 뮤직에서 쌓아온 풍부한 오디오 경험을 바탕으로 
          게임 사운드 엔지니어링부터 음악 프로덕션까지 다양한 영역을 아우르는 사운드 전문가입니다.
        </p>
      </ScrollReveal>
      
      {/* Audio Expertise Overview */}
      <ScrollReveal delay={200} className="mb-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-purple-200 mb-4">오디오 전문 분야</h3>
          <p className="text-gray-400 text-lg">다양한 환경에서 축적한 오디오 기술과 경험</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ScrollReveal delay={400}>
            <div className="backdrop-blur-lg bg-purple-900/20 border border-purple-500/30 rounded-2xl p-6 hover:bg-purple-900/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                <h4 className="text-2xl font-bold text-purple-300">게임 오디오</h4>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  언리얼 엔진 사운드 시스템
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  인게임 사운드 이펙트 디자인
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  오디오 최적화 & 성능 튜닝
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Wwise & FMOD 통합
                </li>
              </ul>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={600}>
            <div className="backdrop-blur-lg bg-purple-900/20 border border-purple-500/30 rounded-2xl p-6 hover:bg-purple-900/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-violet-400 rounded-full mr-3"></div>
                <h4 className="text-2xl font-bold text-violet-300">음악 프로덕션</h4>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-violet-500 rounded-full mr-3"></span>
                  작곡 & 편곡
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-violet-500 rounded-full mr-3"></span>
                  믹싱 & 마스터링
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-violet-500 rounded-full mr-3"></span>
                  스튜디오 레코딩
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-violet-500 rounded-full mr-3"></span>
                  오디오 포스트 프로덕션
                </li>
              </ul>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={800}>
            <div className="backdrop-blur-lg bg-purple-900/20 border border-purple-500/30 rounded-2xl p-6 hover:bg-purple-900/30 transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                <h4 className="text-2xl font-bold text-purple-300">팀 리더십 & 관리</h4>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  사운드팀 리더십
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  외주 업체 관리
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  프로젝트 일정 관리
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  품질 관리 & 표준화
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </ScrollReveal>

      {/* Work Experience */}
      <ScrollReveal delay={1000} className="mb-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-purple-200 mb-4">오디오 경력</h3>
          <p className="text-gray-400 text-lg">다양한 분야에서 쌓아온 오디오 전문 경험</p>
        </div>
        <div className="space-y-12">
          {/* 넷마블 */}
          <ScrollReveal delay={1200}>
            <div className="backdrop-blur-lg bg-purple-900/10 border border-purple-500/20 rounded-3xl p-8 hover:bg-purple-900/20 transition-all duration-500">
              <div className="flex items-center mb-5">
                <div className="w-4 h-4 bg-purple-400 rounded-full mr-4 animate-pulse"></div>
                <div>
                  <h3 className="text-3xl font-bold text-purple-300">넷마블</h3>
                  <p className="text-purple-200">사운드 개발팀 사원</p>
                </div>
              </div>
              <div className="border-l-4 border-purple-400 mb-5 pl-6">
                <p className="text-gray-300 leading-relaxed">
                  대규모 게임 개발 환경에서 사운드 디자인과 게임 사운드 엔지니어링을 담당하며, 
                  언리얼 엔진의 오디오 시스템을 활용한 고품질 게임 사운드 구현 경험을 쌓았습니다.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-5">
                <div className="bg-purple-900/30 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-purple-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    게임 사운드 엔지니어링
                  </h4>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• 언리얼 엔진 기반 게임 사운드 시스템 구축</li>
                    <li>• 인게임 사운드 이펙트 디자인 및 구현</li>
                    <li>• 대규모 프로젝트 오디오 최적화</li>
                    <li>• 실시간 오디오 처리 및 성능 튜닝</li>
                  </ul>
                </div>
                
                <div className="bg-purple-900/30 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-purple-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    기술 스택 & 도구
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs">Unreal Engine</span>
                    <span className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs">Wwise</span>
                    <span className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs">Pro Tools</span>
                    <span className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs">C++</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    대형 게임 개발 환경에서 고품질 오디오 시스템 구현 경험
                  </p>
                </div>
              </div>
              
            </div>
          </ScrollReveal>

          {/* 토이푸딩 */}
          <ScrollReveal delay={1400}>
            <div className="backdrop-blur-lg bg-violet-900/10 border border-violet-500/20 rounded-3xl p-8 hover:bg-violet-900/20 transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-violet-400 rounded-full mr-4 animate-pulse"></div>
                <div>
                  <h3 className="text-3xl font-bold text-violet-300">토이푸딩</h3>
                  <p className="text-violet-200">사운드팀 팀장 (콘텐츠 개발팀)</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-violet-900/30 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-violet-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-violet-400 rounded-full mr-2"></span>
                    팀 리더십 & 프로젝트 관리
                  </h4>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• 사운드팀 인력 관리 및 업무 조율</li>
                    <li>• 외주 업체 관리 및 품질 관리</li>
                    <li>• 프로젝트 일정 및 워크플로우 최적화</li>
                    <li>• 팀원 역량 개발 및 기술 지원</li>
                  </ul>
                </div>
                
                <div className="bg-violet-900/30 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-violet-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-violet-400 rounded-full mr-2"></span>
                    오디오 프로덕션
                  </h4>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• 사운드 디자인 및 음향 효과 제작</li>
                    <li>• 믹싱, 작곡, 편곡 업무</li>
                    <li>• 레코딩 세션 진행 및 관리</li>
                    <li>• 다양한 미디어 콘텐츠 오디오 담당</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-l-4 border-violet-400 pl-6">
                <p className="text-gray-300 leading-relaxed">
                  콘텐츠 개발팀에서 사운드팀을 이끌며 다양한 미디어 프로젝트의 오디오 전반을 담당했습니다. 
                  팀 관리와 기술적 실무를 동시에 수행하며 리더십과 전문성을 모두 발휘했습니다.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* 스톰프 뮤직 */}
          <ScrollReveal delay={1600}>
            <div className="backdrop-blur-lg bg-purple-900/10 border border-purple-500/20 rounded-3xl p-8 hover:bg-purple-900/20 transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-purple-400 rounded-full mr-4 animate-pulse"></div>
                <div>
                  <h3 className="text-3xl font-bold text-purple-300">스톰프 뮤직</h3>
                  <p className="text-purple-200">콘텐츠팀 사원</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-purple-900/30 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-purple-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    음악 프로덕션
                  </h4>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• 믹싱 및 마스터링 전문 업무</li>
                    <li>• 편곡 및 작곡 프로젝트</li>
                    <li>• 전문 스튜디오 레코딩</li>
                    <li>• 다양한 장르 음악 제작 경험</li>
                  </ul>
                </div>
                
                <div className="bg-purple-900/30 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-purple-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    프로젝트 관리 & 기술
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs">Logic Pro X</span>
                    <span className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs">Cubase</span>
                    <span className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs">Pro Tools</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    외주 프로젝트 관리 및 고품질 음악 프로덕션
                  </p>
                </div>
              </div>
              
              <div className="border-l-4 border-purple-400 pl-6">
                <p className="text-gray-300 leading-relaxed">
                  음악 프로덕션 전문 회사에서 다양한 오디오 제작 업무를 경험하며, 
                  믹싱/마스터링부터 작곡/편곡까지 음악 제작의 전 과정에 대한 깊은 이해를 갖추었습니다.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </ScrollReveal>

      {/* Audio Technologies & Tools */}
      <ScrollReveal delay={1800} className="mb-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-purple-200 mb-4">오디오 기술 스택</h3>
          <p className="text-gray-400 text-lg">전문적인 오디오 제작을 위한 도구와 기술</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal delay={2000}>
            <div className="backdrop-blur-lg bg-gradient-to-br from-purple-900/20 to-violet-900/20 border border-purple-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">🎵</div>
              <h4 className="text-lg font-bold text-purple-300 mb-2">DAW & 편집</h4>
              <div className="space-y-1 text-sm text-gray-400">
                <p>Pro Tools, Logic Pro X</p>
                <p>Cubase, Ableton Live</p>
              </div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={2200}>
            <div className="backdrop-blur-lg bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-purple-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">🎮</div>
              <h4 className="text-lg font-bold text-violet-300 mb-2">게임 오디오</h4>
              <div className="space-y-1 text-sm text-gray-400">
                <p>Unreal Engine Audio</p>
                <p>Wwise, FMOD, Unity</p>
              </div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={2400}>
            <div className="backdrop-blur-lg bg-gradient-to-br from-purple-900/20 to-violet-900/20 border border-purple-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">🔊</div>
              <h4 className="text-lg font-bold text-purple-300 mb-2">사운드 디자인</h4>
              <div className="space-y-1 text-sm text-gray-400">
                <p>Audio Mixing</p>
                <p>Sound Effects, Foley</p>
              </div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={2600}>
            <div className="backdrop-blur-lg bg-gradient-to-br from-purple-900/20 to-violet-900/20 border border-purple-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">👥</div>
              <h4 className="text-lg font-bold text-purple-300 mb-2">팀 리더십</h4>
              <div className="space-y-1 text-sm text-gray-400">
                <p>Project Management</p>
                <p>Quality Control</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </ScrollReveal>

      {/* Creative Philosophy */}
      <ScrollReveal delay={2800} className="mb-16">
        <div className="text-center bg-gradient-to-r from-purple-900/20 to-violet-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/10">
          <h3 className="text-3xl font-bold text-purple-100 mb-6">오디오 철학</h3>
          <p className="text-lg text-purple-200/90 max-w-4xl mx-auto leading-relaxed mb-8">
            소리는 단순한 청각적 요소를 넘어 감정과 이야기를 전달하는 강력한 매체입니다. 
            기술적 완성도와 창의적 표현의 균형을 추구하며, 
            각 프로젝트의 고유한 정체성을 살리는 맞춤형 오디오 솔루션을 제공합니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-200 px-4 py-2 rounded-full border border-purple-500/30">감정 전달</span>
            <span className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-200 px-4 py-2 rounded-full border border-purple-500/30">기술적 완성도</span>
            <span className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-200 px-4 py-2 rounded-full border border-purple-500/30">창의적 혁신</span>
            <span className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-200 px-4 py-2 rounded-full border border-purple-500/30">협업과 소통</span>
          </div>
        </div>
      </ScrollReveal>
    </>
  )
}