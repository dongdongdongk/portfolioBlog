import 'css/about.css'

import { getAboutHtml, getAboutByCategory } from '@/lib/mdx'
import { genPageMetadata } from 'app/seo'
import Image from 'next/image'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const data = getAboutByCategory('developer')
  const html = getAboutHtml('developer')

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">About 페이지를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 py-10">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
          <h1 className="text-3xl font-bold text-slate-900">About</h1>
          <p className="mt-1 text-sm text-slate-400">
            김동현 · Technical Sound Designer & Developer
          </p>
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
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: Image */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <Image
              src="/my2.png"
              alt="김동현"
              width={600}
              height={900}
              className="h-auto w-full"
              priority
            />
          </div>

          {/* Right: Text */}
          <div>
            <h2 className="mb-6 text-3xl leading-tight text-slate-900">
              About <strong>Me</strong>
            </h2>
            <div className="about-content" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </div>
  )
}
