'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([])

  useEffect(() => {
    // HTML에서 헤딩 추출
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headings = doc.querySelectorAll('h2, h3, h4')

    const tocItems: TocItem[] = Array.from(headings).map((heading, index) => {
      // # 앵커 링크를 제외한 실제 텍스트만 추출
      let text = heading.textContent || ''
      text = text.replace(/^#\s*/, '') // 앞의 # 제거

      return {
        id: heading.id || `heading-${index}`,
        text: text.trim(),
        level: parseInt(heading.tagName.charAt(1)),
      }
    })

    setToc(tocItems.filter((item) => item.level <= 4)) // h2-h4만 표시
  }, [content])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  if (toc.length === 0) return null

  return (
    <div className="inline-toc">
      <h2>📋 목차</h2>
      <ol className="toc-list">
        {toc.map((item, index) => (
          <li key={`${item.id}-${index}`} className={`toc-item-${item.level}`}>
            <button onClick={() => scrollToHeading(item.id)} className="toc-link">
              {item.text}
            </button>
          </li>
        ))}
      </ol>
      <hr />
    </div>
  )
}
