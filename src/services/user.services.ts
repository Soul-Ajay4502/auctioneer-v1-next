import { api } from '@/config/axios-config'
import endpoints from '@/services/api-endpoints'

export interface UserStatsResponse {
    status: string
    data: {
        leaguesCount: number
        totalRevenue: number
        uniquePlayersCount: number
        chartData: {
            labels: string[]
            values: number[]
        }
    }
}

export const userService = {
    getUserStats: async (): Promise<UserStatsResponse> => {
        const response = await api.get(endpoints.user.statistics)
        return response.data
    }
}