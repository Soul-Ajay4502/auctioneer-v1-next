import { Calendar, Users, IndianRupee, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LeagueData {
    league_id: number
    league_name: string
    league_full_name: string
    league_locations: string
    total_players: number
    total_teams: number
    has_unsold: boolean
    league_start_date: string
    league_end_date: string
    registration_fee: string
    registration_end_date: string
    player_base_price: string
    bid_amount_per_team: string
    auction_start_date: string
    minimum_player_count: number
    join_link: string
    creator: {
        id: number
        display_name: string
        email: string
    }
}

interface LeagueCardProps {
    leagueData: LeagueData
    handleCopyLink: () => void
    handleViewDetails: () => void
    isCopying: boolean
}

export default function LeagueCard({ leagueData, handleCopyLink, handleViewDetails, isCopying }: LeagueCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const isRegistrationOpen = new Date(leagueData.registration_end_date) > new Date()

    return (
        <Card className="w-full max-w-md rounded-sm">
            <CardHeader className="border-b-4 border-b-neutral-300 rounded-full">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">{leagueData.league_name}</CardTitle>
                    <Badge variant={isRegistrationOpen ? 'default' : 'secondary'}>{isRegistrationOpen ? 'Open' : 'Closed'}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{leagueData.league_locations}</p>

                <div className="grid grid-cols-3 gap-4 py-1 pl-2 ">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                            <p className="font-medium">{leagueData.total_players}</p>
                            <p className="text-muted-foreground">Players</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                            <p className="font-medium">{leagueData.total_teams}</p>
                            <p className="text-muted-foreground">Teams</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                            <p className="font-medium">₹{leagueData.registration_fee}</p>
                            <p className="text-muted-foreground">Reg Fee</p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                            <p className="font-medium">League Duration</p>
                            <p className="text-muted-foreground">
                                {formatDate(leagueData.league_start_date)} - {formatDate(leagueData.league_end_date)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                            <p className="font-medium">Registration Ends</p>
                            <p className="text-muted-foreground">{formatDate(leagueData.registration_end_date)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-sm" onClick={() => handleViewDetails()}>
                    View Details
                </Button>
                <Button disabled={isCopying} onClick={() => handleCopyLink()} variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
