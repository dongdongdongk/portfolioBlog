'use client'

import { useState, useEffect, useRef } from 'react'
import Link from '@/components/Link'

interface InteractiveHeroProps {
  onDeveloperClick: () => void
  onSoundDesignerClick: () => void
}

export default function InteractiveHero({
  onDeveloperClick,
  onSoundDesignerClick,
}: InteractiveHeroProps) {
  const [isLeft, setIsLeft] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  // Initial page load animation
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Remove the global mouse tracking since we handle it per element now

  const getTitle = () => {
    if (!isHovered) {
      return { main: '안녕하세요,', sub: '개발자입니다' }
    }

    if (isLeft) {
      return { main: '안녕하세요,', sub: '사운드 디자이너입니다' }
    } else {
      return { main: '안녕하세요,', sub: '개발자입니다' }
    }
  }

  const getDescription = () => {
    if (!isHovered) {
      return '새로운 기술과 아이디어로 세상을 변화시키고 싶은 열정적인 개발자입니다. 코드를 통해 문제를 해결하고 가치를 창조합니다.'
    }

    if (isLeft) {
      return '음악과 소리를 통해 감동을 전달하는 사운드 디자이너입니다. 오디오 기술과 창의성을 결합하여 독특한 청각적 경험을 만들어냅니다.'
    } else {
      return '새로운 기술과 아이디어로 세상을 변화시키고 싶은 열정적인 개발자입니다. 코드를 통해 문제를 해결하고 가치를 창조합니다.'
    }
  }

  const getButtons = () => {
    if (!isHovered) {
      return [
        { href: '/blog', text: '블로그 보기' },
        { href: '/projects', text: '프로젝트 보기' },
      ]
    }

    if (isLeft) {
      return [
        { href: '/music', text: '음악 보기' },
        { href: '/sound-projects', text: '사운드 프로젝트' },
      ]
    } else {
      return [
        { href: '/blog', text: '블로그 보기' },
        { href: '/projects', text: '프로젝트 보기' },
      ]
    }
  }

  const title = getTitle()
  const description = getDescription()
  const buttons = getButtons()

  return (
    <div
      ref={heroRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 py-8 sm:py-12 md:py-16"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className={`absolute inset-0 bg-gradient-to-r transition-all duration-1000 ${
            isHovered
              ? isLeft
                ? 'from-purple-400/30 via-violet-400/20 to-transparent'
                : !isLeft
                  ? 'from-transparent via-blue-500/20 to-blue-500/30'
                  : 'from-purple-400/10 to-blue-500/10'
              : 'from-purple-400/10 to-blue-500/10'
          }`}
        />
      </div>

      {/* Top Title - Made responsive */}
      <div className="absolute top-8 left-1/2 z-20 w-full max-w-xs -translate-x-1/2 transform px-4 text-center sm:top-12 sm:max-w-2xl sm:px-6 md:top-16 md:max-w-4xl md:px-8 lg:top-20 xl:top-24">
        <h1
          className={`mb-2 text-xl leading-tight font-bold text-white transition-all delay-200 duration-1000 sm:mb-3 sm:text-2xl md:mb-4 md:text-4xl lg:mb-6 lg:text-5xl xl:text-6xl ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          안녕하세요
          <br />
          김동현입니다.
        </h1>
        <p
          className={`mb-1 text-sm leading-relaxed text-gray-400 transition-all delay-600 duration-1000 sm:mb-2 sm:text-base md:mb-3 md:text-lg lg:mb-4 lg:text-xl xl:text-2xl ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          저는 <span className="font-semibold text-blue-400">Developer</span> &{' '}
          <span className="font-semibold text-purple-400">Sound Designer</span>로서,
        </p>
        <p
          className={`text-sm leading-relaxed text-gray-500 transition-all delay-800 duration-1000 sm:text-base md:text-lg lg:text-xl xl:text-2xl ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          두 영역의 시너지를 통해 특별한 경험과 가치를 설계합니다.
        </p>
      </div>

      {/* Center Divider Line - positioned between title and interactive components */}
      <div
        className={`absolute top-1/4 bottom-8 left-1/2 z-0 w-px -translate-x-1/2 transform bg-gradient-to-b from-transparent via-white/10 to-transparent transition-all delay-400 duration-1000 ${
          isVisible ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
        }`}
      />

      {/* Floating Particles Effect */}
      <div
        className={`absolute inset-0 overflow-hidden transition-all delay-1000 duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full transition-all duration-1000 ${
              i % 2 === 0 ? 'bg-amber-500/20' : 'bg-blue-500/20'
            }`}
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
            }}
          />
        ))}
      </div>

      {/* Interactive Components Container */}
      <div
        className={`absolute left-1/2 flex -translate-x-1/2 transform items-start justify-center gap-16 transition-all delay-1200 duration-1000 sm:gap-20 md:gap-28 lg:gap-36 xl:gap-48 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } top-[45%] sm:top-[42%] md:top-[40%] lg:top-[38%] xl:top-[36%]`}
      >
        {/* Left Side - Sound Designer - Made responsive */}
        <div
          className="group cursor-pointer"
          onMouseEnter={() => {
            setIsHovered(true)
            setIsLeft(true)
          }}
          onMouseLeave={() => {
            setIsHovered(false)
            setIsLeft(false)
          }}
          onClick={onSoundDesignerClick}
        >
          <div
            className={`text-center transition-all duration-1000 ease-out ${
              isHovered
                ? isLeft
                  ? 'scale-110 opacity-100'
                  : 'scale-90 opacity-30'
                : 'scale-100 opacity-100'
            }`}
          >
            {/* Icon */}
            <div
              className={`mb-2 transition-all duration-1000 sm:mb-3 md:mb-4 lg:mb-6 ${
                isHovered && isLeft ? 'scale-125' : ''
              }`}
            >
              <div
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-1000 sm:h-10 sm:w-10 sm:rounded-xl md:h-12 md:w-12 lg:h-16 lg:w-16 lg:rounded-2xl xl:h-20 xl:w-20 ${
                  isHovered && isLeft
                    ? 'bg-gradient-to-br from-purple-400 to-violet-500 shadow-2xl shadow-purple-500/50'
                    : 'border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-violet-500/20'
                }`}
              >
                <svg
                  className="h-4 w-4 text-white sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 xl:h-10 xl:w-10"
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
            </div>

            <h2
              className={`mb-1 text-lg font-bold transition-all duration-1000 sm:mb-2 sm:text-xl md:mb-3 md:text-2xl lg:mb-4 lg:text-4xl xl:mb-6 xl:text-6xl ${
                isHovered && isLeft
                  ? 'bg-gradient-to-r from-purple-300 to-violet-400 bg-clip-text text-transparent'
                  : isHovered && !isLeft
                    ? 'text-white/20'
                    : 'text-white/90 group-hover:text-purple-300'
              }`}
            >
              Sound
              <br />
              Designer
            </h2>

            <div
              className={`transition-all duration-1000 ${
                isHovered && isLeft ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <p
                className={`mx-auto max-w-24 text-xs leading-relaxed transition-all duration-1000 sm:max-w-32 sm:text-sm md:max-w-40 md:text-base lg:max-w-xs lg:text-lg ${
                  isHovered && isLeft
                    ? 'text-purple-100'
                    : isHovered && !isLeft
                      ? 'text-white/10'
                      : 'text-white/70'
                }`}
              >
                음악과 소리로 감동을 전달하며,
                <br />
                창의적인 오디오 경험을 만듭니다
              </p>

              {isHovered && isLeft && (
                <div className="animate-fade-in mt-6">
                  <div className="flex items-center justify-center space-x-2 text-sm text-purple-300">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400"></span>
                    <span>Audio • Music • Sound Design</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Developer - Made responsive */}
        <div
          className="group cursor-pointer"
          onMouseEnter={() => {
            setIsHovered(true)
            setIsLeft(false)
          }}
          onMouseLeave={() => {
            setIsHovered(false)
            setIsLeft(false)
          }}
          onClick={onDeveloperClick}
        >
          <div
            className={`text-center transition-all duration-1000 ease-out ${
              isHovered
                ? !isLeft
                  ? 'scale-110 opacity-100'
                  : 'scale-90 opacity-30'
                : 'scale-100 opacity-100'
            }`}
          >
            {/* Icon */}
            <div
              className={`mb-2 transition-all duration-1000 sm:mb-3 md:mb-4 lg:mb-6 ${
                isHovered && !isLeft ? 'scale-125' : ''
              }`}
            >
              <div
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-1000 sm:h-10 sm:w-10 sm:rounded-xl md:h-12 md:w-12 lg:h-16 lg:w-16 lg:rounded-2xl xl:h-20 xl:w-20 ${
                  isHovered && !isLeft
                    ? 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-2xl shadow-blue-500/50'
                    : 'border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
                }`}
              >
                <svg
                  className="h-4 w-4 text-white sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 xl:h-10 xl:w-10"
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
            </div>

            <h2
              className={`mb-1 text-lg font-bold transition-all duration-1000 sm:mb-2 sm:text-xl md:mb-3 md:text-2xl lg:mb-4 lg:text-4xl xl:mb-6 xl:text-6xl ${
                isHovered && !isLeft
                  ? 'bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent'
                  : isHovered && isLeft
                    ? 'text-white/20'
                    : 'text-white/90 group-hover:text-blue-300'
              }`}
            >
              Developer
            </h2>

            <div
              className={`transition-all duration-1000 ${
                isHovered && !isLeft ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <p
                className={`mx-auto max-w-24 text-xs leading-relaxed transition-all duration-1000 sm:max-w-32 sm:text-sm md:max-w-40 md:text-base lg:max-w-xs lg:text-lg ${
                  isHovered && !isLeft
                    ? 'text-blue-100'
                    : isHovered && isLeft
                      ? 'text-white/10'
                      : 'text-white/70'
                }`}
              >
                코드로 문제를 해결하며,
                <br />
                혁신적인 디지털 솔루션을 구현합니다
              </p>

              {isHovered && !isLeft && (
                <div className="animate-fade-in mt-6">
                  <div className="flex items-center justify-center space-x-2 text-sm text-blue-300">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></span>
                    <span>Code • Design • Innovation</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
