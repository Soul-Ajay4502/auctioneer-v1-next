
'use client'

import { leaguesService } from "@/services/leagues.services";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation"
import { LeagueDashboard } from "./league-dashboard";
import { League } from "@/utils/common-types-utils";
import { useLeagueStore } from "@/store/league-details.store";
import { useEffect } from "react";

const Page = () => {

    const { leagueId } = useParams();


    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['leagues', leagueId],
        queryFn: () => leaguesService.getLeagueById(leagueId as string),
        enabled: !!leagueId
    })

    useEffect(() => {
        if (!data?.data) return
        useLeagueStore.getState().setLeagueDetails(data?.data)
    }, [data?.data])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }
    if (!data?.data) {
        return null
    }




    return (
        <div>
            <LeagueDashboard data={data?.data as League} />
        </div>
    )
}

export default Page