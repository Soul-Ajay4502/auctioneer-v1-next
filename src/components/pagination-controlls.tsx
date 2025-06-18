import React from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

export interface PaginationProps {
    total: number
    totalPages: number
    currentPage: number
    limit: number
    hasNext: boolean
    hasPrevious: boolean
    onPageChange: (page: number) => void
}

export const PaginationControls: React.FC<PaginationProps> = ({
    totalPages,
    currentPage,
    hasNext,
    hasPrevious,
    onPageChange
}) => {
    // Don't render pagination if there's only one page
    if (totalPages <= 1) return null

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers: (number | 'ellipsis')[] = []

        if (totalPages <= 5) {
            // If 5 or fewer pages, show all
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            // Always show first page
            pageNumbers.push(1)

            if (currentPage <= 3) {
                // Near the start
                pageNumbers.push(2, 3)
                if (totalPages > 4) pageNumbers.push('ellipsis')
                pageNumbers.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                // Near the end
                pageNumbers.push('ellipsis')
                pageNumbers.push(totalPages - 2, totalPages - 1, totalPages)
            } else {
                // In the middle
                pageNumbers.push('ellipsis')
                pageNumbers.push(currentPage - 1, currentPage, currentPage + 1)
                pageNumbers.push('ellipsis')
                pageNumbers.push(totalPages)
            }
        }

        return pageNumbers
    }

    // Generate all page options for the select dropdown
    const getPageOptions = () => {
        const options = []
        for (let i = 1; i <= totalPages; i++) {
            options.push(i)
        }
        return options
    }

    return (
        <div className="flex w-full items-center gap-4">
            <Pagination className="my-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => hasPrevious && onPageChange(currentPage - 1)}
                            className={!hasPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>

                    {getPageNumbers().map((pageNumber, index) => (
                        <PaginationItem key={index}>
                            {pageNumber === 'ellipsis' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    onClick={() => onPageChange(pageNumber)}
                                    isActive={currentPage === pageNumber}
                                >
                                    {pageNumber}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => hasNext && onPageChange(currentPage + 1)}
                            className={!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            {totalPages > 5 && (
                <div className="flex  items-center gap-2 text-sm">
                    <Select
                        value={currentPage.toString()}
                        onValueChange={(value) => onPageChange(parseInt(value))}
                    >
                        <SelectTrigger className="w-fit h-8">
                            <SelectValue placeholder={currentPage} />
                        </SelectTrigger>
                        <SelectContent>
                            {getPageOptions().map((page) => (
                                <SelectItem key={page} value={page.toString()}>
                                    {page}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    of<p className="text-muted-foreground  "> {totalPages}</p>
                </div>
            )}
        </div>
    )
}