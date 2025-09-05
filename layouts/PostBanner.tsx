import { ReactNode } from 'react'
import Image from '@/components/Image'
import Bleed from 'pliny/ui/Bleed'

interface Blog {
  slug: string
  date: string
  title: string
  path?: string
  tags?: string[]
  summary?: string
  images?: string[]
  [key: string]: any
}
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import AnimatedBackground from '@/components/AnimatedBackground'

interface LayoutProps {
  content: Blog
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostMinimal({ content, next, prev, children }: LayoutProps) {
  const { slug, title, images } = content
  const displayImage =
    images && images.length > 0 ? images[0] : 'https://picsum.photos/seed/picsum/800/400'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
      {/* Background Elements */}
      <section className="relative w-full overflow-hidden">
        <AnimatedBackground />
        
        {/* Content Container */}
        <div className="relative z-10 w-full">
          <SectionContainer>
            <ScrollTopAndComment />
            <article>
        <div>
          <div className="space-y-1 pb-10 text-center">
            <div className="w-full">
              <Bleed>
                <div className="relative aspect-2/1 w-full">
                  <Image src={displayImage} alt={title} fill className="object-cover" />
                </div>
              </Bleed>
            </div>
            <div className="relative pt-10">
              <PageTitle>{title}</PageTitle>
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none py-4">{children}</div>
          {siteMetadata.comments && (
            <div className="pt-6 pb-6 text-center text-gray-300" id="comment">
              <Comments slug={slug} />
            </div>
          )}
          <footer>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              {prev && prev.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${prev.path}`}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/20 to-primary-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:from-blue-600/30 hover:to-primary-600/30 hover:text-blue-200 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 font-medium text-sm"
                    aria-label={`Previous post: ${prev.title}`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {prev.title}
                  </Link>
                </div>
              )}
              {next && next.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${next.path}`}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/20 to-primary-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:from-blue-600/30 hover:to-primary-600/30 hover:text-blue-200 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 font-medium text-sm"
                    aria-label={`Next post: ${next.title}`}
                  >
                    {next.title}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </footer>
        </div>
      </article>
      </SectionContainer>
        </div>
      </section>
    </div>
  )
}
