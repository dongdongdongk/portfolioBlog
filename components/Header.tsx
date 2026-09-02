import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  let headerClass =
    'flex items-center w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 justify-between py-4 px-4 sm:px-6 lg:px-8 transition-all duration-300'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        {/* Logo and Title */}
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="group flex items-center">
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-xl font-bold sm:block">
                <span className="group-hover:from-primary-600 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent transition-all duration-300 group-hover:to-blue-600">
                  {siteMetadata.headerTitle}
                </span>
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-6">
          {/* Desktop Navigation */}
          <nav className="no-scrollbar hidden items-center gap-x-2 overflow-x-auto sm:flex">
            {headerNavLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="group relative rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-all duration-300 hover:text-slate-900"
              >
                <span className="relative z-10">{link.title}</span>
                <div className="from-primary-500/10 border-primary-500/20 group-hover:border-primary-500/40 absolute inset-0 scale-75 rounded-xl border bg-gradient-to-r to-blue-500/10 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"></div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
