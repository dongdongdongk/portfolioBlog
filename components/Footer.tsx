import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="bg-black">
      <div className="mx-auto max-w-5xl px-6 py-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">© {new Date().getFullYear()} 김동현</div>
          <div className="flex items-center gap-3 [&_a]:transition-colors [&_svg]:fill-slate-400 [&_svg]:hover:fill-white">
            {siteMetadata.email && (
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
            )}
            {siteMetadata.github && (
              <SocialIcon kind="github" href={siteMetadata.github} size={5} />
            )}
            {siteMetadata.linkedin && (
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
            )}
            {siteMetadata.twitter && (
              <SocialIcon kind="twitter" href={siteMetadata.twitter} size={5} />
            )}
            {siteMetadata.youtube && (
              <SocialIcon kind="youtube" href={siteMetadata.youtube} size={5} />
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
