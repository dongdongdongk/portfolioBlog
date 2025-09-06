'use client'

import { useState, useEffect } from 'react'
import AnimatedBackground from '@/components/AnimatedBackground'

interface AboutToggleProps {
  developerData: {
    title: string
    description?: string
  }
  developerHtml: string
  musicData: {
    title: string
    description?: string
  }
  musicHtml: string
}

export default function AboutToggle({
  developerData,
  developerHtml,
  musicData,
  musicHtml,
}: AboutToggleProps) {
  const [activeCategory, setActiveCategory] = useState<'developer' | 'music'>('developer')
  const [isVisible, setIsVisible] = useState(false)

  const currentData = activeCategory === 'developer' ? developerData : musicData
  const currentHtml = activeCategory === 'developer' ? developerHtml : musicHtml

  // Initial page load animation
  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
      {/* Single Unified Section */}
      <section className="relative w-full overflow-hidden">
        {/* Background Elements - 블로그와 동일한 AnimatedBackground 사용 */}
        <AnimatedBackground />

        {/* Unified Content Container */}
        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Hero Header - 블로그와 동일한 스타일 */}
            <div
              className={`mb-16 text-center transition-all delay-200 duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              {/* Profile Header */}
              <div className="mb-8">
                {/* <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                  <span className="text-3xl text-white font-bold">김</span>
                </div> */}
                <h1 className="mb-6 text-5xl font-bold sm:text-6xl md:text-7xl">
                  <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                    About
                  </span>
                </h1>
                <div className="from-primary-500 mx-auto mb-6 h-1 w-16 rounded-full bg-gradient-to-r to-blue-500"></div>
                <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300">
                  <div className="flex items-center space-x-3 rounded-full border border-slate-700/50 bg-slate-900/30 px-4 py-2">
                    <span>📧 dhk9309@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-3 rounded-full border border-slate-700/50 bg-slate-900/30 px-4 py-2">
                    <span>📱 01080055113</span>
                  </div>
                  <a
                    href="https://github.com/dongdongdongk"
                    target="_blank"
                    className="flex items-center space-x-3 rounded-full border border-slate-700/50 bg-slate-900/30 px-4 py-2 text-blue-400 transition-colors duration-200 hover:border-blue-500/50 hover:text-blue-300"
                  >
                    <span>🔗 GitHub</span>
                  </a>
                </div>
              </div>

              {/* Toggle Navigation */}
              <div className="flex justify-center">
                <div className="inline-flex rounded-2xl border border-gray-700/40 bg-gray-800/50 p-2 shadow-2xl backdrop-blur-md">
                  <button
                    onClick={() => setActiveCategory('developer')}
                    className={`rounded-xl px-8 py-3 text-sm font-medium transition-all duration-300 ${
                      activeCategory === 'developer'
                        ? 'border border-blue-400/40 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-200 shadow-lg'
                        : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-200'
                    }`}
                  >
                    Developer
                  </button>
                  <button
                    onClick={() => setActiveCategory('music')}
                    className={`rounded-xl px-8 py-3 text-sm font-medium transition-all duration-300 ${
                      activeCategory === 'music'
                        ? 'border border-purple-400/40 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 shadow-lg'
                        : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-200'
                    }`}
                  >
                    Sound Designer
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area - 블로그와 동일한 컨테이너 */}
            <div className="mx-auto max-w-4xl">
              <div className="notion-content" dangerouslySetInnerHTML={{ __html: currentHtml }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
