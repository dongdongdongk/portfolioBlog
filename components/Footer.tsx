import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-700/30 bg-gradient-to-b from-gray-900 to-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="bg-primary-500/5 absolute top-0 left-1/4 h-32 w-96 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-1/4 h-32 w-80 rounded-full bg-blue-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center py-12">
          {/* Social Links with enhanced design */}
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            {siteMetadata.email && (
              <SocialIcon
                kind="mail"
                href={`mailto:${siteMetadata.email}`}
                size={6}
                className="hover:border-primary-500/50 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 transition-all duration-300 hover:scale-110 hover:bg-slate-700/50"
              />
            )}
            {siteMetadata.github && (
              <SocialIcon
                kind="github"
                href={siteMetadata.github}
                size={6}
                className="hover:border-primary-500/50 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 transition-all duration-300 hover:scale-110 hover:bg-slate-700/50"
              />
            )}
            {siteMetadata.linkedin && (
              <SocialIcon
                kind="linkedin"
                href={siteMetadata.linkedin}
                size={6}
                className="hover:border-primary-500/50 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 transition-all duration-300 hover:scale-110 hover:bg-slate-700/50"
              />
            )}
            {siteMetadata.twitter && (
              <SocialIcon
                kind="twitter"
                href={siteMetadata.twitter}
                size={6}
                className="hover:border-primary-500/50 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 transition-all duration-300 hover:scale-110 hover:bg-slate-700/50"
              />
            )}
            {siteMetadata.youtube && (
              <SocialIcon
                kind="youtube"
                href={siteMetadata.youtube}
                size={6}
                className="hover:border-primary-500/50 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 transition-all duration-300 hover:scale-110 hover:bg-slate-700/50"
              />
            )}
          </div>

          {/* Enhanced copyright section */}
          <div className="mb-6 text-center">
            <div className="mb-3 flex flex-col items-center justify-center gap-2 text-gray-400 sm:flex-row sm:gap-4">
              <span className="font-medium text-gray-300">Dongk Blog</span>
              <span className="hidden sm:inline">•</span>
              <span>© {new Date().getFullYear()}</span>
              <span className="hidden sm:inline">•</span>
              <Link
                href="/"
                className="from-primary-400 hover:from-primary-300 bg-gradient-to-r to-blue-400 bg-clip-text font-medium text-transparent transition-all duration-300 hover:to-blue-300"
              >
                Dongk Blog
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              <Link
                href="https://github.com/timlrx/tailwind-nextjs-starter-blog"
                className="transition-colors duration-300 hover:text-gray-400"
              >
                Built with Dongk
              </Link>
            </div>
          </div>

          {/* Decorative element */}
          <div className="via-primary-500/50 h-px w-24 bg-gradient-to-r from-transparent to-transparent"></div>
        </div>
      </div>
    </footer>
  )
}
