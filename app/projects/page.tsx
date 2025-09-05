import 'css/blog.css'
import 'css/projects.css'
import 'highlight.js/styles/github-dark.css'

import { getAllPosts } from '@/lib/mdx'
import { genPageMetadata } from 'app/seo'
import ProjectsClient from '@/components/ProjectsClient'

const PROJECTS_PER_PAGE = 6

export const metadata = genPageMetadata({ title: 'Projects' })

export default async function Projects() {
  const allProjects = getAllPosts('projects')
  // Contentlayer와 같은 구조로 변환 및 날짜 순으로 정렬
  const projects = allProjects
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((project) => ({
      ...project,
      path: `/projects/${project.slug}`,
      url: `/projects/${project.slug}`,
    }))

  return (
    <ProjectsClient
      projects={projects}
      initialDisplayProjects={[]} // 무한스크롤에서는 사용하지 않음
      title="All Projects"
    />
  )
}
