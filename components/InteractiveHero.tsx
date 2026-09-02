'use client'

import { useEffect, useState } from 'react'

export default function InteractiveHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="flex min-h-[80vh] flex-col justify-end border-b border-gray-200 bg-white pt-32 pb-14">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 lg:px-12">
        {/* Name + Meta */}
        <div
          className={`mb-6 flex items-end justify-between gap-8 transition-all duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h1
            className="leading-none font-black tracking-tighter text-slate-900"
            style={{ fontSize: 'clamp(4.5rem, 13vw, 10rem)' }}
          >
            김동현
          </h1>
          <div className="mb-2 shrink-0 text-right">
            <p className="text-sm font-medium text-slate-500">Developer</p>
            <p className="text-sm font-medium text-slate-500">Sound Designer</p>
            <p className="mt-3 text-xs text-slate-300">Seoul, KR</p>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`h-px w-full bg-gray-200 transition-all delay-200 duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Tagline + Year */}
        <div
          className={`mt-5 flex items-center justify-between transition-all delay-300 duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-sm text-slate-500">코드와 소리로 새로운 경험을 만듭니다.</p>
          <p className="text-xs text-slate-300 tabular-nums">2026</p>
        </div>
      </div>
    </div>
  )
}
