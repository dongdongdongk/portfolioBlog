import React, { ReactNode } from 'react'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface Blog {
  slug: string
  date: string
  title: string
  tags?: string[]
  summary?: string
  filePath?: string
  path?: string
  [key: string]: unknown
}

interface Authors {
  name: string
  avatar?: string
  [key: string]: unknown
}

interface LayoutProps {
  content: Blog
  authorDetails: Authors[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { path, date, title, tags } = content

  return (
    <div className="min-h-screen bg-white">
      <ScrollTopAndComment />

      {/* Header */}
      <div className="border-b border-gray-100 py-10">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
          <time dateTime={date} className="text-sm text-slate-400">
            {new Date(date).toLocaleDateString(siteMetadata.locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
          {tags && tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-12">
        <div className="blog-content">{children}</div>

        {/* Navigation */}
        {(next || prev) && (
          <div className="mt-12 border-t border-gray-100 pt-8">
            <div className="flex gap-4">
              {prev && prev.path && (
                <div className="flex-1">
                  <p className="mb-2 text-xs text-slate-400">이전 글</p>
                  <Link
                    href={prev.path}
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    ← {prev.title}
                  </Link>
                </div>
              )}
              {next && next.path && (
                <div className="flex flex-1 flex-col items-end">
                  <p className="mb-2 text-xs text-slate-400">다음 글</p>
                  <Link
                    href={next.path}
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    {next.title} →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-8 border-t border-gray-100 pt-6">
          <Link
            href="/blog"
            className="text-sm text-slate-500 transition-colors hover:text-slate-900"
          >
            ← 블로그 목록
          </Link>
        </div>
      </div>
    </div>
  )
}
