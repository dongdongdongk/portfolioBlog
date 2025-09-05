'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import ProjectsLayoutWithTags from '@/layouts/ProjectsLayoutWithTags'
import { BlogPost } from '@/lib/mdx'

interface ProjectsClientProps {
  projects: BlogPost[]
  initialDisplayProjects: BlogPost[]
  pagination?: {
    currentPage: number
    totalPages: number
  }
  title: string
}

function ProjectsContent({
  projects,
  initialDisplayProjects,
  pagination,
  title,
}: ProjectsClientProps) {
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')

  // URL 파라미터에서 초기 역할 결정
  let initialRole: 'Developer' | 'Sound Designer' = 'Developer'
  if (roleParam === 'developer') {
    initialRole = 'Developer'
  } else if (roleParam === 'sound-designer') {
    initialRole = 'Sound Designer'
  }

  return (
    <ProjectsLayoutWithTags
      projects={projects}
      initialDisplayProjects={initialDisplayProjects}
      pagination={pagination}
      title={title}
      initialRole={initialRole}
    />
  )
}

export default function ProjectsClient(props: ProjectsClientProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsContent {...props} />
    </Suspense>
  )
}
