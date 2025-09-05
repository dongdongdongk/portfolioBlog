import { ReactNode } from 'react'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from 'next/image'
import { slug } from 'github-slugger'
import siteMetadata from '@/data/siteMetadata'

const projectDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface Project {
  slug: string
  date: string
  title: string
  tags?: string[]
  summary?: string
  images?: string[]
  liveUrl?: string
  githubUrl?: string
  [key: string]: any
}

interface LayoutProps {
  content: ReactNode
  project: Project
}

export default function ProjectLayout({ content, project }: LayoutProps) {
  const { slug: projectSlug, date, title, tags, summary, images, liveUrl, githubUrl } = project

  return (
    <SectionContainer>
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, projectDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
              {summary && (
                <p className="mx-auto max-w-3xl text-lg leading-7 text-gray-500 dark:text-gray-400">
                  {summary}
                </p>
              )}
              {(liveUrl || githubUrl) && (
                <div className="flex justify-center gap-4 pt-4">
                  {liveUrl && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary-600 hover:bg-primary-700 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      라이브 데모
                    </a>
                  )}
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              )}
              {images && images[0] && (
                <div className="pt-6">
                  <Image
                    src={images[0]}
                    alt={title}
                    width={800}
                    height={400}
                    className="mx-auto rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
            <dl className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-y-8 xl:space-x-0">
                  <li className="flex items-center space-x-2">
                    <dl className="text-sm leading-5 font-medium whitespace-nowrap">
                      <dt className="sr-only">Name</dt>
                      <dd className="text-gray-900 dark:text-gray-100">{siteMetadata.author}</dd>
                    </dl>
                  </li>
                </ul>
              </dd>
            </dl>
            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              <div className="prose dark:prose-invert max-w-none pt-10 pb-8">{content}</div>
            </div>
            <footer>
              <div className="divide-gray-200 text-sm leading-5 font-medium xl:col-start-1 xl:row-start-2 xl:divide-y dark:divide-gray-700">
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${slug(tag)}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                  <div>
                    <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Previous Project
                    </h2>
                    <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                      {/* Add previous project logic here */}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Next Project
                    </h2>
                    <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                      {/* Add next project logic here */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/projects`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="프로젝트 목록으로 돌아가기"
                >
                  &larr; 모든 프로젝트 보기
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
