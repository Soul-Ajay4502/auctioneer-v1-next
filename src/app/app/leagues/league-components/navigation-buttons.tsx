'use client'

import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { Users, UserPlus, Trophy, Settings } from "lucide-react"

const NavigationButtons = ({ buttonContainerClassName = "grid grid-cols-2 gap-4" }: { buttonContainerClassName?: string }) => {
    const router = useRouter()
    const { leagueId } = useParams()
    const goToTeams = () => {
        router.push(`/app/leagues/${leagueId}/team-details`)
    }
    const goToPlayers = () => {
        router.push(`/app/leagues/${leagueId}/players`)
    }
    const goToAuction = () => {
        router.push(`/app/leagues/${leagueId}/auction`)
    }
    const goToSettings = () => {
        router.push(`/app/leagues/${leagueId}/settings`)
    }

    return (
        <div className={buttonContainerClassName}>
            <Button onClick={goToTeams} className="h-12" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                View Teams
            </Button>
            <Button onClick={goToPlayers} className="h-12" variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                View Players
            </Button>
            <Button onClick={goToAuction} className="h-12" variant="outline">
                <Trophy className="h-4 w-4 mr-2" />
                Start Auction
            </Button>
            <Button onClick={goToSettings} className="h-12" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                League Settings
            </Button>
        </div>
    )
}

export default NavigationButtons