import { api, ApiResponse } from '@/config/axios-config'
import endpoints from './api-endpoints'
import { Teams } from '@/utils/common-types-utils'

export const teamsService = {
    getTeams: async (leagueId: string): Promise<ApiResponse<Teams[]>> => {
        const response = await api.get(endpoints.teams.all, {
            params: {
                league_id: leagueId,
            },
        })
        return response.data
    },
    getTeamById: async (teamId: string): Promise<ApiResponse> => {
        const response = await api.get(endpoints.teams.getById.replace(':id', teamId))
        return response.data
    },
    deleteTeam: async (teamId: number): Promise<ApiResponse> => {
        const response = await api.delete(endpoints.teams.getById.replace(':id', teamId.toString()))
        return response.data
    },
}
