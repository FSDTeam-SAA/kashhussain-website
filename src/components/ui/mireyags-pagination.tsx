import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from './pagination'

interface PaginationProps {
  totalPages: number // Total number of pages
  currentPage: number // Current active page
  onPageChange: (page: number) => void // Callback for page change
}

const MireyagsPagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Helper to generate an array of page numbers
  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = []
    const maxVisible = isMobile ? 3 : 7

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (isMobile) {
        if (currentPage <= 2) {
          pages.push(1, 2, '...', totalPages)
        } else if (currentPage >= totalPages - 1) {
          pages.push(1, '...', totalPages - 1, totalPages)
        } else {
          pages.push(1, '...', currentPage, '...', totalPages)
        }
      } else {
        if (currentPage <= 4) {
          pages.push(1, 2, 3, 4, 5, '...', totalPages)
        } else if (currentPage >= totalPages - 3) {
          pages.push(
            1,
            '...',
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages
          )
        } else {
          pages.push(
            1,
            '...',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '...',
            totalPages
          )
        }
      }
    }
    return pages
  }

  const handlePageClick = (page: number | '...') => {
    if (page === '...' || page === currentPage) return
    onPageChange(page as number)
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 sm:gap-2">
        <PaginationItem>
          <PaginationLink
            onClick={() => {
              if (currentPage === 1) {
                return
              } else handlePageClick(currentPage - 1)
            }}
            className={cn(
              'border border-primary hover:bg-primary cursor-pointer hover:text-white rounded-[4px] h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center',
              currentPage === 1 &&
                'cursor-not-allowed bg-[#E3E3E3] border-0 pointer-events-none'
            )}
          >
            <ChevronLeft
              className={cn('h-4 w-4', currentPage === 1 && 'text-[#B0B0B0]')}
            />
          </PaginationLink>
        </PaginationItem>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              onClick={() => handlePageClick(page)}
              className={cn(
                'border cursor-pointer border-primary hover:text-white rounded-[4px] h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center transition-all duration-200',
                page === currentPage
                  ? 'bg-primary text-white hover:bg-primary hover:text-white'
                  : 'hover:bg-primary hover:text-white'
              )}
            >
              {page === '...' ? '...' : page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationLink
            onClick={() => {
              if (totalPages === currentPage) {
                return
              } else {
                handlePageClick(currentPage + 1)
              }
            }}
            className={cn(
              'border border-primary hover:bg-primary cursor-pointer hover:text-white rounded-[4px] h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center',
              currentPage === totalPages &&
                'cursor-not-allowed bg-[#E3E3E3] border-0 pointer-events-none'
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default MireyagsPagination
