// 클라이언트 사이드용 카테고리 트리 유틸리티
export interface BlogPost {
  slug: string
  content: string
  title: string
  date: string
  category?: string
  tags?: string[]
  draft?: boolean
  summary?: string
  [key: string]: unknown
}

export interface CategoryTree {
  name: string
  path: string
  posts: BlogPost[]
  children: CategoryTree[]
}

export function buildCategoryTree(posts: BlogPost[]): CategoryTree[] {
  const tree: CategoryTree[] = []
  const pathMap = new Map<string, CategoryTree>()

  posts.forEach((post) => {
    if (!post.category) return

    const pathParts = post.category.split('/')
    let currentPath = ''

    pathParts.forEach((part, index) => {
      const parentPath = currentPath
      currentPath = currentPath ? `${currentPath}/${part}` : part

      if (!pathMap.has(currentPath)) {
        const node: CategoryTree = {
          name: part,
          path: currentPath,
          posts: [],
          children: [],
        }

        pathMap.set(currentPath, node)

        if (parentPath && pathMap.has(parentPath)) {
          pathMap.get(parentPath)!.children.push(node)
        } else {
          tree.push(node)
        }
      }

      // 마지막 경로 부분일 때만 포스트 추가
      if (index === pathParts.length - 1) {
        pathMap.get(currentPath)!.posts.push(post)
      }
    })
  })

  return tree
}

export function getPostsByCategory(posts: BlogPost[], category: string): BlogPost[] {
  return posts.filter((post) => post.category && post.category.startsWith(category))
}
