'use client'

import { useState, useEffect } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

interface ContentModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'developer' | 'sound-designer'
}

export default function ContentModal({ isOpen, onClose, type }: ContentModalProps) {
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
      <ScrollReveal className="text-center mb-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl mb-8">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400 mb-6">
          Developer 김동현
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          이젠솔루션과 우리아이시티에서 근무하며 다양한 프로젝트를 수행한 자기주도 학습형 개발자입니다. 
          Java, Spring Framework, MERN 스택 등 다양한 기술로 문제를 해결합니다.
        </p>
      </ScrollReveal>
      
      {/* Skills Overview */}
      <ScrollReveal delay={200} className="mb-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-blue-200 mb-4">핵심 기술 스택</h3>
          <p className="text-gray-400 text-lg">실무에서 활용하는 다양한 기술과 도구들</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ScrollReveal delay={400}>
            <div className="backdrop-blur-lg bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 hover:bg-blue-900/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                <h4 className="text-2xl font-bold text-blue-300">백엔드 기술</h4>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Java & Spring Framework
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Spring Boot & E-Gov 4.0
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Node.js & Express.js
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  RESTful API 설계 & 구현
                </li>
              </ul>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={600}>
            <div className="backdrop-blur-lg bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 hover:bg-blue-900/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-cyan-400 rounded-full mr-3"></div>
                <h4 className="text-2xl font-bold text-cyan-300">프론트엔드 기술</h4>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
                  React & Next.js
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
                  JavaScript & TypeScript
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
                  Mi-Platform & Nexacro 17
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
                  Tailwind CSS & Bootstrap
                </li>
              </ul>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={800}>
            <div className="backdrop-blur-lg bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 hover:bg-blue-900/30 transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                <h4 className="text-2xl font-bold text-purple-300">데이터베이스 & 인프라</h4>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  MySQL & Oracle 관리
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  MongoDB & Prisma ORM
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Linux 서버 운영
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Bamboo CI/CD 파이프라인
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </ScrollReveal>

      {/* Work Experience */}
      <ScrollReveal delay={1000} className="mb-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-blue-200 mb-4">실무 경험</h3>
          <p className="text-gray-400 text-lg">다양한 프로젝트를 통해 쌓아온 개발 역량</p>
        </div>
        <div className="space-y-12">
          {/* 우리아이시티 */}
          <ScrollReveal delay={1200}>
            <div className="backdrop-blur-lg bg-blue-900/10 border border-blue-500/20 rounded-3xl p-8 hover:bg-blue-900/20 transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-blue-400 rounded-full mr-4 animate-pulse"></div>
                <div>
                  <h3 className="text-3xl font-bold text-blue-300">우리아이시티</h3>
                  <p className="text-blue-200">SI 개발 사원 (2024 - 현재)</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-900/30 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-blue-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    금감원 FSS 프로젝트
                  </h4>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• 금융감독원 플랫폼 전환 프로젝트 참여</li>
                    <li>• Nexacro 17, Mi-Platform 활용 개발</li>
                    <li>• Spring Framework & E-Gov 4.0 기반 백엔드</li>
                    <li>• Oracle 데이터베이스 연동 및 최적화</li>
                  </ul>
                </div>
                
                <div className="bg-blue-900/30 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-blue-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    성과 및 역량
                  </h4>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• 공공·금융 분야 시스템 개발 경험</li>
                    <li>• 팀 단위 파견 프로젝트 협업</li>
                    <li>• 다양한 이해관계자와의 소통</li>
                    <li>• 실무 문제 해결 능력 향상</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-l-4 border-blue-400 pl-6">
                <p className="text-gray-300 leading-relaxed">
                  외근 형태의 팀 단위 파견을 통해 현장에서 직접 고객의 요구사항을 분석하고, 
                  복잡한 금융 업무 프로세스를 시스템으로 구현하는 경험을 쌓았습니다.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* 이젠솔루션 */}
          <ScrollReveal delay={1400}>
            <div className="backdrop-blur-lg bg-cyan-900/10 border border-cyan-500/20 rounded-3xl p-8 hover:bg-cyan-900/20 transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-cyan-400 rounded-full mr-4 animate-pulse"></div>
                <div>
                  <h3 className="text-3xl font-bold text-cyan-300">이젠솔루션</h3>
                  <p className="text-cyan-200">SI 개발 및 운영 사원</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-cyan-900/30 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-cyan-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                    인프라 & DevOps
                  </h4>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Linux 서버 환경 구축 및 운영</li>
                    <li>• Bamboo CI/CD 파이프라인 관리</li>
                    <li>• Tomcat, Apache 웹서버 설정</li>
                    <li>• 배포 자동화 프로세스 구축</li>
                  </ul>
                </div>
                
                <div className="bg-cyan-900/30 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-cyan-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                    개발 & 운영
                  </h4>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• 다양한 SI 프로젝트 개발 참여</li>
                    <li>• 시스템 안정성 모니터링</li>
                    <li>• 서비스 품질 향상 기여</li>
                    <li>• 장애 대응 및 문제 해결</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-l-4 border-cyan-400 pl-6">
                <p className="text-gray-300 leading-relaxed">
                  본사 내근 형태로 근무하며 개발부터 운영까지 전 과정을 경험했습니다. 
                  특히 CI/CD 파이프라인 구축과 Linux 서버 관리를 통해 DevOps 역량을 키웠습니다.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </ScrollReveal>

      {/* Additional Skills */}
      <ScrollReveal delay={1600} className="mb-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-blue-200 mb-4">추가 역량</h3>
          <p className="text-gray-400 text-lg">지속적인 학습을 통해 확장해온 기술 영역</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal delay={1800}>
            <div className="backdrop-blur-lg bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">🌐</div>
              <h4 className="text-lg font-bold text-blue-300 mb-2">MERN Stack</h4>
              <p className="text-gray-400 text-sm">MongoDB, Express, React, Node.js</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={2000}>
            <div className="backdrop-blur-lg bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="text-lg font-bold text-purple-300 mb-2">Next.js & Prisma</h4>
              <p className="text-gray-400 text-sm">모던 풀스택 개발</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={2200}>
            <div className="backdrop-blur-lg bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">🔥</div>
              <h4 className="text-lg font-bold text-green-300 mb-2">Firebase & Supabase</h4>
              <p className="text-gray-400 text-sm">서버리스 백엔드 서비스</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={2400}>
            <div className="backdrop-blur-lg bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-purple-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">🎨</div>
              <h4 className="text-lg font-bold text-violet-300 mb-2">UI/UX Design</h4>
              <p className="text-gray-400 text-sm">Figma, 반응형 디자인</p>
            </div>
          </ScrollReveal>
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