import { api, apiAuth, ApiResponse } from "@/config/axios-config"
import { League, Pagination } from "../utils/common-types-utils"
import endpoints from "./api-endpoints"

export const leaguesService = {
    getLeagues: async ({ page, pageSize }: { page: number, pageSize: number }): Promise<ApiResponse<League[]> & { pagination: Pagination }> => {
        const response = await api.get(endpoints.leagues.all, {
            params: {
                page,
                limit: pageSize,
            },
        })
        return response.data
    },
    getLeagueById: async (leagueId: string): Promise<ApiResponse<League>> => {
        const response = await api.get(endpoints.leagues.getById.replace(':id', leagueId))
        return response.data
    },
    getLeagueByUuid: async (uuid: string): Promise<ApiResponse<League>> => {
        const response = await apiAuth.get(endpoints.meta.getLeagueByUuid.replace(':uuid', uuid))
        return response.data
    }

}