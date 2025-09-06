import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  let headerClass =
    'flex items-center w-full backdrop-blur-lg bg-slate-950/90 border-b border-slate-700/30 justify-between py-4 px-4 sm:px-6 lg:px-8 transition-all duration-300'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        {/* Logo and Title */}
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="group flex items-center">
            <div className="mr-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Logo />
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-xl font-bold sm:block">
                <span className="group-hover:from-primary-400 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent transition-all duration-300 group-hover:to-blue-400">
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
            {headerNavLinks
              .filter((link) => link.href !== '/')
              .map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="group relative rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:text-white"
                >
                  <span className="relative z-10">{link.title}</span>
                  <div className="from-primary-500/20 border-primary-500/30 group-hover:border-primary-500/50 absolute inset-0 scale-75 rounded-xl border bg-gradient-to-r to-blue-500/20 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"></div>
                </Link>
              ))}
          </nav>

          {/* Action Buttons */}
          {/* <div className="flex items-center space-x-3">
            <div className="hidden sm:block">
              <SearchButton />
            </div>
            <MobileNav />
          </div> */}
        </div>
      </div>
    </header>
  )
}

export default Header
