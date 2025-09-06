'use client'

import { useEffect } from 'react'
import hljs from 'highlight.js'

export default function CodeHighlight() {
  useEffect(() => {
    // 모든 pre > code 블록을 찾아서 하이라이팅 적용
    const codeBlocks = document.querySelectorAll('pre code')

    codeBlocks.forEach((block) => {
      // 이미 하이라이팅된 경우 건너뛰기
      if (block.classList.contains('hljs')) {
        return
      }

      // 하이라이팅 적용
      hljs.highlightElement(block as HTMLElement)
    })
  }, [])

  return null // 렌더링할 내용 없음
}
