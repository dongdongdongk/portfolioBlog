'use client'

import { useState } from 'react'
import Image from 'next/image'

interface AboutToggleProps {
  developerData: { title: string; description?: string }
  developerHtml: string
  musicData: { title: string; description?: string }
  musicHtml: string
}

export default function AboutToggle({
  developerData,
  developerHtml,
  musicData,
  musicHtml,
}: AboutToggleProps) {
  const [activeCategory, setActiveCategory] = useState<'developer' | 'music'>('developer')

  const currentHtml = activeCategory === 'developer' ? developerHtml : musicHtml

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 py-10">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
          <h1 className="text-3xl font-bold text-slate-900">About</h1>
          <p className="mt-1 text-sm text-slate-400">김동현 · Developer & Sound Designer</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <a
              href="mailto:dhk9309@gmail.com"
              className="text-slate-500 transition-colors hover:text-slate-900"
            >
              dhk9309@gmail.com
            </a>
            <span className="text-slate-200">·</span>
            <span className="text-slate-500">010-8005-5113</span>
            <span className="text-slate-200">·</span>
            <a
              href="https://github.com/dongdongdongk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 transition-colors hover:text-slate-900"
            >
              GitHub →
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-12">
        {/* Toggle */}
        <div className="mb-10 flex gap-1 border-b border-gray-100 pb-0">
          {(['developer', 'music'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pr-5 pb-3 text-sm font-semibold transition-colors duration-150 ${
                activeCategory === cat
                  ? 'border-b-2 border-slate-900 text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {cat === 'developer' ? 'Developer' : 'Sound Designer'}
            </button>
          ))}
        </div>

        {/* 2-column layout */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: Image */}
          <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-200">
            <Image src="/mainright3.png" alt="김동현" fill className="object-cover" priority />
          </div>

          {/* Right: Text */}
          <div>
            <h2 className="mb-6 text-3xl leading-tight text-slate-900">
              About{' '}
              <strong>{activeCategory === 'developer' ? 'Developer' : 'Sound Designer'}</strong>
            </h2>
            <div className="about-content" dangerouslySetInnerHTML={{ __html: currentHtml }} />
          </div>
        </div>
      </div>
    </div>
  )
}
