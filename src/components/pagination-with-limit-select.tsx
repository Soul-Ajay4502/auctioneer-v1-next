import React from 'react'
import { Button } from '@/components/ui/button'

export interface PaginationProps {
    total: number
    totalPages: number
    currentPage: number
    limit: number
    hasNext: boolean
    hasPrevious: boolean
    onPageChange: (page: number) => void
    pageSizeOptions: number[]
    pageSize: number
    onPageSizeChange: (pageSize: number) => void
}

const PaginationWithLimitSelect = ({
    totalPages,
    currentPage,
    hasNext,
    hasPrevious,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions,
    pageSize,
}: PaginationProps) => {
    return (
        <div className="flex items-center gap-4 border p-4 justify-center w-fit mx-auto rounded-xl">
            <div className="flex items-center gap-2">
                <label htmlFor="pageSize" className="text-sm text-gray-600">
                    Show:
                </label>
                <select
                    id="pageSize"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    {pageSizeOptions.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevious}
                    className="px-3 py-1">
                    Previous
                </Button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current page
                        const showPage = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)

                        if (!showPage && page === 2 && currentPage > 4) {
                            return (
                                <span key={page} className="px-2 text-gray-400">
                                    ...
                                </span>
                            )
                        }
                        if (!showPage && page === totalPages - 1 && currentPage < totalPages - 3) {
                            return (
                                <span key={page} className="px-2 text-gray-400">
                                    ...
                                </span>
                            )
                        }
                        if (!showPage) {
                            return null
                        }

                        return (
                            <Button
                                key={page}
                                variant={page === currentPage ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className="w-8 h-8 p-0">
                                {page}
                            </Button>
                        )
                    })}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNext}
                    className="px-3 py-1">
                    Next
                </Button>
            </div>
        </div>
    )
}

export default PaginationWithLimitSelect
