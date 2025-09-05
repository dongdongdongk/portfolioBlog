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

  const pageNumber = 1
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE)
  const initialDisplayProjects = projects.slice(0, PROJECTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ProjectsClient
      projects={projects}
      initialDisplayProjects={initialDisplayProjects}
      pagination={pagination}
      title="All Projects"
    />
  )
}
