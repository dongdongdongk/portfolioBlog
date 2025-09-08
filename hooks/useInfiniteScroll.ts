import { useState, useEffect, useCallback, useRef } from 'react'

interface UseInfiniteScrollProps<T> {
  items: T[]
  itemsPerPage?: number
  threshold?: number
  rootMargin?: string
}

interface UseInfiniteScrollReturn<T> {
  displayedItems: T[]
  hasMore: boolean
  isLoading: boolean
  loadMore: () => void
  reset: () => void
  observerRef: React.RefObject<HTMLDivElement | null>
}

export function useInfiniteScroll<T>({
  items,
  itemsPerPage = 6,
  threshold = 0.1,
  rootMargin = '100px',
}: UseInfiniteScrollProps<T>): UseInfiniteScrollReturn<T> {
  const [displayedItems, setDisplayedItems] = useState<T[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)
  const observerInstanceRef = useRef<IntersectionObserver | null>(null)

  const hasMore = displayedItems.length < items.length

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // 실제 로딩을 시뮬레이션하기 위한 약간의 지연
    setTimeout(() => {
      const startIndex = currentPage * itemsPerPage
      const endIndex = (currentPage + 1) * itemsPerPage
      const newItems = items.slice(startIndex, endIndex)

      setDisplayedItems((prev) => [...prev, ...newItems])
      setCurrentPage((prev) => prev + 1)
      setIsLoading(false)
    }, 300)
  }, [items, currentPage, itemsPerPage, isLoading, hasMore])

  const reset = useCallback(() => {
    setCurrentPage(1)
    setDisplayedItems(items.slice(0, itemsPerPage))
    setIsLoading(false)
  }, [items, itemsPerPage])

  // items가 변경되면 리셋
  useEffect(() => {
    reset()
  }, [reset])

  // Intersection Observer 설정
  useEffect(() => {
    if (!observerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observerInstanceRef.current = observer
    observer.observe(observerRef.current)

    return () => {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect()
      }
    }
  }, [loadMore, hasMore, isLoading, threshold, rootMargin])

  return {
    displayedItems,
    hasMore,
    isLoading,
    loadMore,
    reset,
    observerRef,
  }
}
