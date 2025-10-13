'use client'

import playersService from '@/services/players.services'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import PlayerAccordion from './player-accordian-list'
import { Player } from '@/utils/common-types-utils'
import { useState } from 'react'
import PaginationWithLimitSelect from '@/components/pagination-with-limit-select'
import { toast } from 'sonner'
import { axiosErrorToast } from '@/utils/axios-error-toast.utils'
import { AxiosError } from 'axios'

const Page = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5)
    const { leagueId } = useParams()
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['players', leagueId, page, limit],
        queryFn: () => playersService.getPlayers(leagueId as string, page, limit),
        enabled: !!leagueId,
    })

    const editMutation = useMutation({
        mutationFn: ({ playerId, data }: { playerId: number; data: { isApproved?: boolean } }) =>
            playersService.editPlayer(playerId, data),
        onSuccess: () => {
            refetch()
            toast.success('Player updated successfully')
        },
        onError: (error: AxiosError) => {
            axiosErrorToast(error, 'Failed to update player')
        },
    })
    const deleteMutation = useMutation({
        mutationFn: (playerId: number) => playersService.deletePlayer(playerId),
        onSuccess: () => {
            refetch()
            toast.success('Player deleted successfully')
        },
        onError: (error: AxiosError) => {
            axiosErrorToast(error, 'Failed to delete player')
        },
    })

    if (!data?.data) {
        return null
    }

    const playersData = data?.data || []
    const pagination = data?.pagination || {
        currentPage: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
    }
    let paginationOptions = []
    for (let i = 0; i <= pagination?.total; i += 5) {
        if (i > 1) paginationOptions.push(i)
    }
    const handleEdit = (playerId: number, data?: { isApproved?: boolean }) => {
        if (!data) return
        editMutation.mutate({ playerId, data })
    }
    const handleDelete = (playerId: number) => {
        deleteMutation.mutate(playerId)
    }

    return (
        <div>
            <PlayerAccordion players={playersData as Player[]} onEdit={handleEdit} onDelete={handleDelete} />
            <PaginationWithLimitSelect
                total={pagination.total}
                totalPages={pagination.totalPages}
                currentPage={page}
                limit={limit}
                hasNext={pagination.hasNext}
                hasPrevious={pagination.hasPrevious}
                onPageChange={setPage}
                pageSizeOptions={paginationOptions}
                pageSize={limit}
                onPageSizeChange={(limit) => {
                    setPage(1)
                    setLimit(limit)
                }}
            />
        </div>
    )
}

export default Page
