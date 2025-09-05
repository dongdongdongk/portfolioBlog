import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-slate-950 border-t border-slate-700/30">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-80 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-12 flex flex-col items-center">
          
          {/* Social Links with enhanced design */}
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            {siteMetadata.email && (
              <SocialIcon 
                kind="mail" 
                href={`mailto:${siteMetadata.email}`} 
                size={6}
                className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-primary-500/50 hover:bg-slate-700/50 transition-all duration-300 hover:scale-110"
              />
            )}
            {siteMetadata.github && (
              <SocialIcon 
                kind="github" 
                href={siteMetadata.github} 
                size={6}
                className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-primary-500/50 hover:bg-slate-700/50 transition-all duration-300 hover:scale-110"
              />
            )}
            {siteMetadata.linkedin && (
              <SocialIcon 
                kind="linkedin" 
                href={siteMetadata.linkedin} 
                size={6}
                className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-primary-500/50 hover:bg-slate-700/50 transition-all duration-300 hover:scale-110"
              />
            )}
            {siteMetadata.twitter && (
              <SocialIcon 
                kind="twitter" 
                href={siteMetadata.twitter} 
                size={6}
                className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-primary-500/50 hover:bg-slate-700/50 transition-all duration-300 hover:scale-110"
              />
            )}
            {siteMetadata.youtube && (
              <SocialIcon 
                kind="youtube" 
                href={siteMetadata.youtube} 
                size={6}
                className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-primary-500/50 hover:bg-slate-700/50 transition-all duration-300 hover:scale-110"
              />
            )}
          </div>

          {/* Enhanced copyright section */}
          <div className="text-center mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-gray-400 mb-3">
              <span className="font-medium text-gray-300">{siteMetadata.author}</span>
              <span className="hidden sm:inline">•</span>
              <span>© {new Date().getFullYear()}</span>
              <span className="hidden sm:inline">•</span>
              <Link 
                href="/" 
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400 hover:from-primary-300 hover:to-blue-300 transition-all duration-300 font-medium"
              >
                {siteMetadata.title}
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              <Link 
                href="https://github.com/timlrx/tailwind-nextjs-starter-blog"
                className="hover:text-gray-400 transition-colors duration-300"
              >
                Built with Tailwind NextJS
              </Link>
            </div>
          </div>

          {/* Decorative element */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
        </div>
      </div>
    </footer>
  )
}
