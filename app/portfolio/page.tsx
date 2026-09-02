'use client'

import { useState } from 'react'
import { genPageMetadata } from 'app/seo'

type VimeoItem = {
  title: string
  description: string
  tags: string[]
  type: 'vimeo'
  embedId: string
  embedSrc: string
}

type YoutubeItem = {
  title: string
  description: string
  tags: string[]
  type: 'youtube'
  embedId: string
}

type PortfolioItem = VimeoItem | YoutubeItem

const soundDesignItems: PortfolioItem[] = [
  {
    title: 'Batman Arkham — Sound Design',
    description: '배트맨 아캄 시리즈를 소재로 한 사운드 디자인 포트폴리오 영상.',
    type: 'vimeo',
    embedId: '731211072',
    embedSrc:
      'https://player.vimeo.com/video/731211072?badge=0&autopause=0&player_id=0&app_id=58479',
    tags: ['Sound Design', 'SFX'],
  },
  {
    title: 'Warhammer 40,000: Space Marine 2 — Sound Design',
    description: 'Warhammer 40,000: Space Marine 2를 소재로 한 사운드 디자인 포트폴리오 영상.',
    type: 'vimeo',
    embedId: '731215361',
    embedSrc:
      'https://player.vimeo.com/video/731215361?badge=0&autopause=0&player_id=0&app_id=58479',
    tags: ['Sound Design', 'SFX', 'Action'],
  },
  {
    title: 'Casual Style — Sound Design & Composition',
    description: '캐주얼 스타일 사운드 디자인 및 음악 작곡 포트폴리오 영상.',
    type: 'vimeo',
    embedId: '731735440',
    embedSrc:
      'https://player.vimeo.com/video/731735440?badge=0&autopause=0&player_id=0&app_id=58479',
    tags: ['Sound Design', 'Composition', 'Casual', 'SFX'],
  },
  {
    title: 'FORSPOKEN — Sound Design',
    description: 'FORSPOKEN을 소재로 한 스킬 사운드 디자인 포트폴리오 영상.',
    type: 'vimeo',
    embedId: '731215776',
    embedSrc:
      'https://player.vimeo.com/video/731215776?badge=0&autopause=0&player_id=0&app_id=58479',
    tags: ['Sound Design', 'SFX'],
  },
]

const systemItems: PortfolioItem[] = [
  {
    title: '1인칭 호러 게임 「OverTime」',
    description:
      'Unity 기반 1인칭 공포 게임. 사운드 디자인, 게임플레이, 레벨 디자인 전반을 1인 개발.',
    type: 'youtube',
    embedId: 'Th7y8oyaKOg',
    tags: ['Unity', 'C#', 'Sound Design', 'Game Dev'],
  },
  {
    title: '물리 상호작용 기반 절차적 사운드 생성 시스템',
    description:
      '오브젝트의 물리 충돌 데이터를 실시간으로 분석해 절차적으로 사운드를 생성하는 시스템.',
    type: 'youtube',
    embedId: 'MSVq0Zz2MMk',
    tags: ['Unity', 'Audio DSP', 'Procedural Audio'],
  },
]

function VideoItem({ item }: { item: PortfolioItem }) {
  const src =
    item.type === 'vimeo' ? item.embedSrc : `https://www.youtube.com/embed/${item.embedId}`

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.description}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div
        className="overflow-hidden rounded-xl border border-gray-200 shadow-sm"
        style={{ aspectRatio: '16/9' }}
      >
        <iframe
          src={src}
          title={item.title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          allowFullScreen
          className="h-full w-full"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  )
}

function Section({ title, items }: { title: string; items: PortfolioItem[] }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="mb-12">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between border-b border-gray-100 pb-3 text-left"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <span className="text-xs text-slate-400">{items.length}</span>
        </div>
        <span className="text-xs text-slate-400 transition-all duration-200">
          {open ? '접기' : '펼치기'}
        </span>
      </button>

      {open && (
        <div className="grid gap-14 pt-8">
          {items.map((item) => (
            <VideoItem key={item.embedId} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 py-10">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
          <h1 className="text-3xl font-bold text-slate-900">Portfolio</h1>
          <p className="mt-1 text-sm text-slate-400">개발 및 사운드 디자인 포트폴리오</p>
        </div>
      </div>

      {/* Items */}
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-0">
          <Section title="사운드 디자인" items={soundDesignItems} />
          <Section title="시스템 구현" items={systemItems} />
        </div>
      </div>
    </div>
  )
}
