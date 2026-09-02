'use client'

import Link from '@/components/Link'
import Image from 'next/image'

const DEV_SKILLS = [
  'Unreal Engine',
  'Unity',
  'C#',
  'C++',
  'Java',
  'Spring',
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Linux',
]
const SOUND_SKILLS = [
  'Reaper',
  'Cubase',
  'Wwise',
  'FMOD',
  'iZotope RX',
  'Orchestration',
  'Composition & Arrangement',
  'Sound Design',
]

export default function Home({ postCount }: { postCount: number }) {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
          {/* Left: Text */}
          <div className="flex-1">
            <div className="mb-8 space-y-1">
              <p className="text-4xl leading-snug text-slate-900 sm:text-5xl">안녕하세요,</p>
              <p className="text-4xl leading-snug text-slate-900 sm:text-5xl">
                <span className="inline-block border-2 border-slate-900 px-2 font-light">
                  Technical
                </span>{' '}
                <span className="font-extrabold">Sound Designer</span>
              </p>
              <p className="text-4xl leading-snug font-extrabold text-slate-900 sm:text-5xl">
                김동현입니다.
              </p>
            </div>

            <p className="mb-8 max-w-md text-sm leading-relaxed text-slate-500">
              넷마블, 토이푸딩 등에서 근무하며 「아스달 연대기」, 「블레이드 앤 소울」 등 AAA 규모
              게임을 비롯해 다양한 인디 게임, 애니메이션, 광고, 영화의 사운드 제작에 참여했습니다.
              개발자로서는 금융감독원과 LG U+ 관련 시스템의 개발·운영을 담당했으며, 1인 개발
              공포게임 「OverTime」을 제작했습니다. 사운드 디자인, 인터랙티브 오디오, Audio DSP,
              오케스트레이션부터 풀스택 웹, Unity·Unreal 개발까지 폭넓은 실무 경험을 바탕으로,
              오디오와 개발을 함께 이해하고 설계·구현할 수 있는 역량을 보유하고 있습니다.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="mailto:dhk9309@gmail.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-slate-700"
                aria-label="이메일"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
              <a
                href="https://github.com/dongdongdongk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
                aria-label="GitHub"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0z" />
                </svg>
              </a>
              <Link
                href="/about"
                className="flex h-10 items-center rounded-full border-2 border-slate-900 px-5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
              >
                About →
              </Link>
              <Link
                href="/portfolio"
                className="flex h-10 items-center rounded-full border-2 border-slate-900 px-5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
              >
                Portfolio →
              </Link>
            </div>
          </div>

          {/* Right: Interactive dot grid */}
          <div className="relative hidden lg:block lg:h-96 lg:w-96 xl:h-[480px] xl:w-[480px]">
            <Image
              src="/mainright4.png"
              alt="Technical Sound Designer illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-12">
          <h2 className="mb-12 text-center text-2xl text-slate-900">
            My <strong>Skills</strong>
          </h2>

          <div className="mb-10">
            <p className="mb-4 text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Sound Designer
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {SOUND_SKILLS.map((skill, i) => (
                <div
                  key={skill}
                  className="flex items-center justify-center rounded-xl border border-gray-200 px-2 py-5 text-center text-xs font-semibold text-slate-700 transition-all duration-150 hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Developer
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {DEV_SKILLS.map((skill, i) => (
                <div
                  key={skill}
                  className="flex items-center justify-center rounded-xl border border-gray-200 px-2 py-5 text-center text-xs font-semibold text-slate-700 transition-all duration-150 hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl text-slate-900">
                협업 · <strong>외주 문의</strong>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                협업 제안이나 프로젝트 문의가 있으시면 편하게 연락해주세요.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex h-10 items-center rounded-full border-2 border-slate-900 px-6 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
            >
              Contact →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Links ── */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: '/portfolio', title: 'Portfolio', desc: '개발 및 사운드 작업물' },
              { href: '/blog', title: 'Blog', desc: `포스트 ${postCount}개` },
              { href: '/projects', title: 'Projects', desc: '사이드 프로젝트' },
              { href: '/about', title: 'About', desc: '더 알아보기' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between rounded-xl border border-gray-200 px-5 py-4 transition-colors hover:border-gray-400"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">{item.desc}</p>
                </div>
                <span className="text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-blue-500">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
