import ProjectsLayoutWithTags from '@/layouts/ProjectsLayoutWithTags'
import { getAllPosts } from '@/lib/mdx'
import { notFound } from 'next/navigation'

const PROJECTS_PER_PAGE = 6

export const generateStaticParams = async () => {
  const allProjects = getAllPosts('projects')
  const totalPages = Math.ceil(allProjects.length / PROJECTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const allProjects = getAllPosts('projects')
  const projects = allProjects
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((project) => ({
      ...project,
      path: `/projects/${project.slug}`,
      url: `/projects/${project.slug}`,
    }))

  const pageNumber = parseInt(params.page as string)
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const initialDisplayProjects = projects.slice(
    PROJECTS_PER_PAGE * (pageNumber - 1),
    PROJECTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ProjectsLayoutWithTags
      projects={projects}
      initialDisplayProjects={initialDisplayProjects}
      pagination={pagination}
      title="All Projects"
    />
  )
}
