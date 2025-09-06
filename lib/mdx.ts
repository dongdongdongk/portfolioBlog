import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import hljs from 'highlight.js'
import { slug as slugger } from 'github-slugger'

const postsDirectory = path.join(process.cwd(), 'data/blog')
const aboutDirectory = path.join(process.cwd(), 'data/about')
const projectsDirectory = path.join(process.cwd(), 'data/projects')

// 커스텀 렌더러 설정
const renderer = new marked.Renderer()

// 헤딩에 대한 커스텀 렌더러 (한글 지원)
renderer.heading = function ({ text, depth }: { text: string; depth: number }) {
  const cleanText = typeof text === 'string' ? text : String(text)
  const id = slugger(cleanText)
  return `<h${depth} id="${id}" class="content-header"><a href="#${id}" class="content-header-link">#</a>${cleanText}</h${depth}>`
}

// Marked 설정
marked.setOptions({
  gfm: true,
  breaks: true,
  renderer: renderer,
})

export interface BlogPost {
  slug: string
  content: string
  title: string
  date: string
  tags?: string[]
  draft?: boolean
  summary?: string
  [key: string]: unknown
}

export interface AboutPage {
  slug: string
  content: string
  title: string
  category: string
  description?: string
  [key: string]: unknown
}

export function getAllPosts(type: 'blog' | 'projects' = 'blog'): BlogPost[] {
  const directory = type === 'blog' ? postsDirectory : projectsDirectory

  if (!fs.existsSync(directory)) {
    return []
  }

  function getAllFilesRecursively(dir: string): string[] {
    const files: string[] = []

    function scanDirectory(currentDir: string, relativePath = '') {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name)
        const relativeFilePath = relativePath ? path.join(relativePath, entry.name) : entry.name

        if (entry.isDirectory()) {
          scanDirectory(fullPath, relativeFilePath)
        } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
          files.push(relativeFilePath)
        }
      }
    }

    scanDirectory(dir)
    return files
  }

  const fileNames = getAllFilesRecursively(directory)
  const allPostsData = fileNames
    .map((fileName): BlogPost => {
      const slug = fileName.replace(/\.(mdx|md)$/, '').replace(/\\/g, '/')
      const fullPath = path.join(directory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        content,
        title: data.title || '',
        date: data.date || '',
        ...data,
      } as BlogPost
    })
    .filter((post) => !post.draft) // draft가 true인 포스트 제외
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return allPostsData
}

export function getPostBySlug(type: 'blog' | 'projects', slug: string): BlogPost | null {
  const directory = type === 'blog' ? postsDirectory : projectsDirectory

  try {
    let fullPath = path.join(directory, `${slug}.mdx`)
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(directory, `${slug}.md`)
      if (!fs.existsSync(fullPath)) {
        return null
      }
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      content,
      title: data.title || '',
      date: data.date || '',
      ...data,
    } as BlogPost
  } catch (error) {
    return null
  }
}

export function getPostHtml(type: 'blog' | 'projects', slug: string): string {
  const post = getPostBySlug(type, slug)
  if (!post) {
    return '<p>게시물을 찾을 수 없습니다.</p>'
  }
  const result = marked(post.content)
  return typeof result === 'string' ? result : String(result)
}

// About 페이지 관련 함수들
export function getAllAboutPages(): AboutPage[] {
  if (!fs.existsSync(aboutDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(aboutDirectory)
  const allAboutData = fileNames
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))
    .map((fileName): AboutPage => {
      const slug = fileName.replace(/\.(mdx|md)$/, '')
      const fullPath = path.join(aboutDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        content,
        title: data.title || '',
        category: data.category || '',
        ...data,
      } as AboutPage
    })

  return allAboutData
}

export function getAboutByCategory(category: string): AboutPage | null {
  try {
    let fullPath = path.join(aboutDirectory, `${category}.mdx`)
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(aboutDirectory, `${category}.md`)
      if (!fs.existsSync(fullPath)) {
        return null
      }
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: category,
      content,
      title: data.title || '',
      category: data.category || category,
      ...data,
    } as AboutPage
  } catch (error) {
    return null
  }
}

export function getAboutHtml(category: string): string {
  const page = getAboutByCategory(category)
  if (!page) {
    return '<p>페이지를 찾을 수 없습니다.</p>'
  }
  const result = marked(page.content)
  return typeof result === 'string' ? result : String(result)
}
