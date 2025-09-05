'use client'

import { useState } from 'react'

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

  const currentData = activeCategory === 'developer' ? developerData : musicData
  const currentHtml = activeCategory === 'developer' ? developerHtml : musicHtml

  return (
    <div className="mx-auto mt-16 max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      {/* 세련된 탭 네비게이션 */}
      <div className="relative mb-12">
        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 scale-150 transform rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-30 blur-3xl"></div>
          <div className="absolute inset-0 scale-125 transform rounded-full bg-gradient-to-r from-cyan-400/5 via-blue-500/5 to-purple-600/5 opacity-40 blur-2xl"></div>
        </div>

        <div className="flex justify-center">
          <div className="relative rounded-2xl border border-gray-700/40 bg-gray-900/60 p-2 shadow-2xl backdrop-blur-md">
            <div
              className={`absolute top-2 bottom-2 w-1/2 rounded-xl bg-gradient-to-r shadow-lg transition-all duration-300 ease-out ${
                activeCategory === 'developer'
                  ? 'left-2 border border-blue-400/40 from-blue-500/30 to-cyan-500/30'
                  : 'left-1/2 border border-purple-400/40 from-purple-500/30 to-pink-500/30'
              }`}
            />
            <div className="relative flex">
              <button
                onClick={() => setActiveCategory('developer')}
                className={`relative z-10 min-w-[200px] rounded-xl px-8 py-4 text-lg font-semibold transition-all duration-300 ${
                  activeCategory === 'developer'
                    ? 'text-blue-200 shadow-lg'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl"></span>
                  <span>Developer</span>
                </div>
              </button>
              <button
                onClick={() => setActiveCategory('music')}
                className={`relative z-10 min-w-[200px] rounded-xl px-8 py-4 text-lg font-semibold transition-all duration-300 ${
                  activeCategory === 'music'
                    ? 'text-purple-200 shadow-lg'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl"></span>
                  <span>Sound Designer</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="about-content" dangerouslySetInnerHTML={{ __html: currentHtml }} />
    </div>
  )
}
