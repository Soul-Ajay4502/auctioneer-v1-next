import { api, ApiResponse } from '@/config/axios-config'
import endpoints from './api-endpoints'
import { Pagination, Player } from '@/utils/common-types-utils'

const playersService = {
    getPlayers: async (leagueId: string, page: number, limit: number): Promise<ApiResponse<Player[]>> => {
        const response = await api.get(endpoints.players.all, {
            params: {
                league_id: leagueId,
                page: page,
                limit: limit,
            },
        })
        return {
            data: response.data.data,
            pagination: response.data.pagination,
            message: response.data.message,
            status: response.data.status,
        }
    },
    getPlayerById: async (playerId: string): Promise<ApiResponse> => {
        const response = await api.get(endpoints.players.getById.replace(':id', playerId))
        return response.data
    },
    editPlayer: async (playerId: number, data: { isApproved?: boolean }): Promise<ApiResponse> => {
        const response = await api.patch(endpoints.players.getById.replace(':id', playerId.toString()), data)
        return response.data
    },
    deletePlayer: async (playerId: number): Promise<ApiResponse> => {
        const response = await api.delete(endpoints.players.getById.replace(':id', playerId.toString()))
        return response.data
    },
}

export default playersService
