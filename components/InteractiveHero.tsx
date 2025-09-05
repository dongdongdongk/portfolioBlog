'use client'

import { useState, useEffect, useRef } from 'react'
import Link from '@/components/Link'

interface InteractiveHeroProps {
  onDeveloperClick: () => void
  onSoundDesignerClick: () => void
}

export default function InteractiveHero({ onDeveloperClick, onSoundDesignerClick }: InteractiveHeroProps) {
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
        { href: '/projects', text: '프로젝트 보기' }
      ]
    }
    
    if (isLeft) {
      return [
        { href: '/music', text: '음악 보기' },
        { href: '/sound-projects', text: '사운드 프로젝트' }
      ]
    } else {
      return [
        { href: '/blog', text: '블로그 보기' },
        { href: '/projects', text: '프로젝트 보기' }
      ]
    }
  }

  const title = getTitle()
  const description = getDescription()
  const buttons = getButtons()

  return (
    <div 
      ref={heroRef}
      className="relative overflow-hidden h-screen flex items-center bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute inset-0 bg-gradient-to-r transition-all duration-1000 ${
          isHovered
            ? isLeft
              ? 'from-purple-400/30 via-violet-400/20 to-transparent'
              : !isLeft
              ? 'from-transparent via-blue-500/20 to-blue-500/30'
              : 'from-purple-400/10 to-blue-500/10'
            : 'from-purple-400/10 to-blue-500/10'
        }`} />
      </div>

      {/* Top Title */}
      <div className="absolute top-8 md:top-16 lg:top-20 left-1/2 transform -translate-x-1/2 text-center z-20 max-w-xs sm:max-w-2xl md:max-w-4xl px-4 sm:px-6 md:px-8">
        <h1 className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          안녕하세요<br />김동현입니다.
        </h1>
        <p className={`text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-400 leading-relaxed mb-3 md:mb-4 transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          저는 <span className="text-blue-400 font-semibold">Developer</span> & <span className="text-purple-400 font-semibold">Sound Designer</span>로서,
        </p>
        <p className={`text-sm sm:text-base md:text-xl lg:text-2xl text-gray-500 leading-relaxed transition-all duration-1000 delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          두 영역의 시너지를 통해 특별한 경험과 가치를 설계합니다.
        </p>
      </div>

      {/* Center Divider Line - moved below content */}
      <div className={`absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent transform -translate-x-1/2 z-0 transition-all duration-1000 delay-400 ${
        isVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
      }`} />

      {/* Floating Particles Effect */}
      <div className={`absolute inset-0 overflow-hidden transition-all duration-1000 delay-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
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
              animationDelay: Math.random() * 3 + 's'
            }}
          />
        ))}
      </div>

      {/* Left Side - Sound Designer */}
      <div 
        className={`absolute left-1/2 top-1/2 transform -translate-x-full -translate-y-1/2 cursor-pointer group
                   -ml-12 sm:-ml-16 md:-ml-20 lg:-ml-24 transition-all duration-1000 delay-1200 ${
          isVisible ? 'opacity-100 -translate-x-full' : 'opacity-0'
        }`}
        onMouseEnter={() => {setIsHovered(true); setIsLeft(true)}}
        onMouseLeave={() => {setIsHovered(false); setIsLeft(false)}}
        onClick={onSoundDesignerClick}
      >
        <div className={`text-center transition-all duration-1000 ease-out ${
          isHovered 
            ? isLeft 
              ? 'scale-110 opacity-100' 
              : 'scale-90 opacity-30'
            : 'scale-100 opacity-100'
        }`}>
          {/* Icon */}
          <div className={`mb-4 sm:mb-6 md:mb-8 transition-all duration-1000 ${
            isHovered && isLeft ? 'scale-125' : ''
          }`}>
            <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-1000 ${
              isHovered && isLeft 
                ? 'bg-gradient-to-br from-purple-400 to-violet-500 shadow-2xl shadow-purple-500/50' 
                : 'bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30'
            }`}>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
          </div>
          
          <h2 className={`text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 transition-all duration-1000 ${
            isHovered && isLeft 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-violet-400' 
              : isHovered && !isLeft
              ? 'text-white/20'
              : 'text-white/90 group-hover:text-purple-300'
          }`}>
            Sound<br />Designer
          </h2>
          
          <div className={`transition-all duration-1000 ${
            isHovered && isLeft ? 'opacity-100' : 'opacity-60'
          }`}>
            <p className={`text-sm sm:text-base md:text-lg leading-relaxed max-w-xs mx-auto transition-all duration-1000 ${
              isHovered && isLeft 
                ? 'text-purple-100' 
                : isHovered && !isLeft
                ? 'text-white/10'
                : 'text-white/70'
            }`}>
              음악과 소리로 감동을 전달하며,<br />
              창의적인 오디오 경험을 만듭니다
            </p>
            
            {isHovered && isLeft && (
              <div className="mt-6 animate-fade-in">
                <div className="flex items-center justify-center space-x-2 text-purple-300 text-sm">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                  <span>Audio • Music • Sound Design</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Developer */}
      <div 
        className={`absolute left-1/2 top-1/2 transform -translate-y-1/2 cursor-pointer group
                   ml-12 sm:ml-16 md:ml-20 lg:ml-24 transition-all duration-1000 delay-1400 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0'
        }`}
        onMouseEnter={() => {setIsHovered(true); setIsLeft(false)}}
        onMouseLeave={() => {setIsHovered(false); setIsLeft(false)}}
        onClick={onDeveloperClick}
      >
        <div className={`text-center transition-all duration-1000 ease-out ${
          isHovered 
            ? !isLeft 
              ? 'scale-110 opacity-100' 
              : 'scale-90 opacity-30'
            : 'scale-100 opacity-100'
        }`}>
          {/* Icon */}
          <div className={`mb-8 transition-all duration-1000 ${
            isHovered && !isLeft ? 'scale-125' : ''
          }`}>
            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-1000 ${
              isHovered && !isLeft 
                ? 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-2xl shadow-blue-500/50' 
                : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
            }`}>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
          </div>
          
          <h2 className={`text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 transition-all duration-1000 ${
            isHovered && !isLeft 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400' 
              : isHovered && isLeft
              ? 'text-white/20'
              : 'text-white/90 group-hover:text-blue-300'
          }`}>
            Developer
          </h2>
          
          <div className={`transition-all duration-1000 ${
            isHovered && !isLeft ? 'opacity-100' : 'opacity-60'
          }`}>
            <p className={`text-sm sm:text-base md:text-lg leading-relaxed max-w-xs mx-auto transition-all duration-1000 ${
              isHovered && !isLeft 
                ? 'text-blue-100' 
                : isHovered && isLeft
                ? 'text-white/10'
                : 'text-white/70'
            }`}>
              코드로 문제를 해결하며,<br />
              혁신적인 디지털 솔루션을 구현합니다
            </p>
            
            {isHovered && !isLeft && (
              <div className="mt-6 animate-fade-in">
                <div className="flex items-center justify-center space-x-2 text-blue-300 text-sm">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  <span>Code • Design • Innovation</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}