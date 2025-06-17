import { api, ApiResponse } from "@/config/axios-config"
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
    }
}