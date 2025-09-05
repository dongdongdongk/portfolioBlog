import 'css/blog.css'
import 'css/about.css'
import 'highlight.js/styles/github-dark.css'

import { getAboutHtml, getAboutByCategory } from '@/lib/mdx'
import AboutToggle from '@/components/AboutToggle'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  // 서버에서 두 카테고리 데이터 모두 미리 로드
  const developerData = getAboutByCategory('developer')
  const developerHtml = getAboutHtml('developer')
  const musicData = getAboutByCategory('music')
  const musicHtml = getAboutHtml('music')
  
  if (!developerData || !musicData) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
        <div className="flex h-screen flex-col justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-500">About 페이지를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AboutToggle
      developerData={developerData}
      developerHtml={developerHtml}
      musicData={musicData}
      musicHtml={musicHtml}
    />
  )
}
