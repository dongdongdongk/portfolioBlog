'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { CategoryTree as CategoryTreeType, BlogPost } from '@/lib/categoryTree'

interface CategoryTreeProps {
  tree: CategoryTreeType[]
  onCategorySelect?: (category: string) => void
  selectedCategory?: string
}

interface CategoryNodeProps {
  node: CategoryTreeType
  level: number
  onCategorySelect?: (category: string) => void
  selectedCategory?: string
}

function CategoryNode({ node, level, onCategorySelect, selectedCategory }: CategoryNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = node.children.length > 0
  const hasPosts = node.posts.length > 0
  const isSelected = selectedCategory === node.path

  // 재귀적으로 하위 폴더의 모든 포스트 개수 계산
  const getTotalPostCount = (node: CategoryTreeType): number => {
    let count = node.posts.length
    node.children.forEach((child) => {
      count += getTotalPostCount(child)
    })
    return count
  }

  const totalPostCount = getTotalPostCount(node)
  // 폴더에 하위 폴더나 포스트가 있으면 화살표 표시
  const hasContent = hasChildren || hasPosts

  const handleToggle = () => {
    if (hasContent) {
      setIsExpanded(!isExpanded)
    }
    if (onCategorySelect) {
      onCategorySelect(node.path)
    }
  }

  return (
    <div className="select-none">
      <div
        className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 ${isSelected ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : ''} `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleToggle}
      >
        {hasContent ? (
          isExpanded ? (
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          )
        ) : (
          <div className="w-4" />
        )}

        <FolderIcon className="h-4 w-4 text-orange-500" />

        <span className="text-sm font-medium">{node.name}</span>

        {totalPostCount > 0 && (
          <span className="ml-auto rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-gray-700">
            {totalPostCount}
          </span>
        )}
      </div>

      {/* 현재 폴더의 포스트들 - 펼쳐져 있을 때 표시 */}
      {hasPosts && isExpanded && (
        <div style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }}>
          {node.posts
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex items-center gap-2 rounded px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                <span className="truncate text-sm">{post.title}</span>
              </Link>
            ))}
        </div>
      )}

      {/* 하위 폴더들 */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <CategoryNode
              key={child.path}
              node={child}
              level={level + 1}
              onCategorySelect={onCategorySelect}
              selectedCategory={selectedCategory}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CategoryTree({
  tree,
  onCategorySelect,
  selectedCategory,
}: CategoryTreeProps) {
  return (
    <div className="space-y-1">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        <FolderIcon className="h-4 w-4" />
        카테고리
      </div>

      {tree.length === 0 ? (
        <p className="text-sm text-gray-500 italic">카테고리가 없습니다.</p>
      ) : (
        tree.map((node) => (
          <CategoryNode
            key={node.path}
            node={node}
            level={0}
            onCategorySelect={onCategorySelect}
            selectedCategory={selectedCategory}
          />
        ))
      )}
    </div>
  )
}
