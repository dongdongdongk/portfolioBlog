import Link from '@/components/Link'
import Image from 'next/image'

interface ProjectCardProps {
  title: string
  description: string
  imgSrc: string
  href: string
  tags?: string[]
  date: string
  liveUrl?: string
  githubUrl?: string
  index?: number
}

export default function ProjectCard({
  title,
  description,
  imgSrc,
  href,
  tags = [],
  date,
  liveUrl,
  githubUrl,
  index = 0,
}: ProjectCardProps) {
  return (
    <article
      className="group hover:shadow-primary-500/10 relative transform overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/30 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:border-gray-700 hover:shadow-2xl"
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Decorative gradient */}
      <div className="from-primary-500/5 absolute inset-0 rounded-2xl bg-gradient-to-r to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="relative flex h-full flex-col lg:flex-row">
        {/* Image Section */}
        {imgSrc && (
          <div className="relative h-64 overflow-hidden bg-white lg:h-full lg:w-1/3">
            <Link
              href={href}
              aria-label={`${title}로 이동`}
              className="flex h-full w-full items-center justify-center"
            >
              <Image
                alt={title}
                src={imgSrc}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                width={400}
                height={256}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </Link>
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 p-8">
          {/* Date and Actions */}
          <div className="mb-4 flex items-center justify-between">
            <time className="flex items-center text-sm text-gray-400">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
              })}
            </time>

            <div className="flex gap-3">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-700 bg-gray-800/50 p-2.5 text-gray-400 transition-all duration-200 hover:scale-110 hover:border-gray-600 hover:text-gray-200"
                  aria-label="GitHub 저장소"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-700 bg-gray-800/50 p-2.5 text-gray-400 transition-all duration-200 hover:scale-110 hover:border-gray-600 hover:text-gray-200"
                  aria-label="라이브 데모"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-4 text-2xl leading-tight font-bold lg:text-3xl">
            <Link
              href={href}
              className="hover:text-primary-400 group-hover:text-primary-300 text-gray-100 transition-colors duration-200"
            >
              {title}
            </Link>
          </h2>

          {/* Description */}
          <p className="mb-6 line-clamp-3 text-lg leading-relaxed text-gray-300">{description}</p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {tags.slice(0, 6).map((tag) => (
                <span
                  key={tag}
                  className="hover:border-primary-500/50 hover:text-primary-400 inline-flex items-center rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-sm font-medium text-gray-300 transition-all duration-200"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 6 && (
                <span className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800/30 px-3 py-1.5 text-sm font-medium text-gray-400">
                  +{tags.length - 6}
                </span>
              )}
            </div>
          )}

          {/* Read More */}
          <Link
            href={href}
            className="text-primary-400 hover:text-primary-300 group inline-flex items-center font-medium transition-colors duration-200"
            aria-label={`"${title}"에 대해 더 알아보기`}
          >
            자세히 읽기
            <svg
              className="ml-2 h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}
