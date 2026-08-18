import { Box, ButtonGroup, Flex } from '@chakra-ui/react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import Button from './Button'

const FALLBACK_PAGER_HEIGHT = 56

const Pagination = <T,>({
  items,
  renderItem,
  getItemKey,
}: {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  getItemKey: (item: T) => string | number
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRef = useRef<HTMLDivElement>(null)
  const pagerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef(items)
  itemsRef.current = items

  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(1)

  const recompute = useCallback(() => {
    const container = containerRef.current
    const firstItem = itemRef.current
    if (!container || !firstItem) {
      return
    }

    const itemHeight =
      firstItem.getBoundingClientRect().height
    if (itemHeight <= 0) {
      return
    }

    const availableHeight = container.clientHeight
    const pagerHeight =
      pagerRef.current?.getBoundingClientRect().height ||
      FALLBACK_PAGER_HEIGHT
    const currentItems = itemsRef.current
    const fitsWithoutPager = Math.floor(
      availableHeight / itemHeight
    )

    // Prefer a pager-free layout when every item fits.
    // Checking that first avoids oscillating at the fit boundary.
    const nextItemsPerPage =
      currentItems.length <= fitsWithoutPager
        ? Math.max(currentItems.length, 1)
        : Math.max(
            1,
            Math.floor(
              (availableHeight - pagerHeight) / itemHeight
            )
          )

    setItemsPerPage(previous =>
      previous === nextItemsPerPage
        ? previous
        : nextItemsPerPage
    )

    const pageCount = Math.max(
      1,
      Math.ceil(currentItems.length / nextItemsPerPage)
    )
    setCurrentPage(previous => {
      const nextPage = Math.min(previous, pageCount - 1)
      return nextPage === previous ? previous : nextPage
    })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const observer = new ResizeObserver(() => {
      recompute()
    })
    observer.observe(container)
    if (itemRef.current) {
      observer.observe(itemRef.current)
    }
    recompute()
    return () => observer.disconnect()
  }, [recompute, items.length])

  const pageCount =
    items.length === 0
      ? 0
      : Math.ceil(items.length / itemsPerPage)
  const showPager = pageCount > 1
  const startingIndex = currentPage * itemsPerPage
  const visibleItems = items.slice(
    startingIndex,
    startingIndex + itemsPerPage
  )

  return (
    <Flex
      ref={containerRef}
      h='full'
      minH={0}
      direction='column'
      overflow='hidden'
    >
      <Box>
        {visibleItems.map((item, index) => (
          <Box
            w='100%'
            key={getItemKey(item)}
            ref={index === 0 ? itemRef : undefined}
          >
            {renderItem(item)}
          </Box>
        ))}
      </Box>
      {showPager ? (
        <Flex
          ref={pagerRef}
          pt={3}
          justifyContent='flex-end'
          flexShrink={0}
          role='navigation'
          aria-label='Pagination'
        >
          <ButtonGroup alignItems='center' gap={5}>
            <Button
              disabled={currentPage === 0}
              onClick={() =>
                setCurrentPage(page => page - 1)
              }
            >
              {'<'}
            </Button>
            <Box>
              {currentPage + 1} / {pageCount}
            </Box>
            <Button
              disabled={currentPage === pageCount - 1}
              onClick={() =>
                setCurrentPage(page => page + 1)
              }
            >
              {'>'}
            </Button>
          </ButtonGroup>
        </Flex>
      ) : null}
    </Flex>
  )
}

export default Pagination
