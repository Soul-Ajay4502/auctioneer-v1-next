import { Calendar, Users, IndianRupee, ExternalLink, Clock, MapPin, ChevronDown, ChevronUp, Trophy, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

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
    const [isExpanded, setIsExpanded] = useState(false)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })
    }

    const formatCurrency = (amount: string) => {
        return `₹${new Intl.NumberFormat('en-IN').format(parseInt(amount))}`
    }

    const isRegistrationOpen = new Date(leagueData.registration_end_date) > new Date()
    const daysUntilRegistrationEnds = Math.ceil(
        (new Date(leagueData.registration_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )

    // Sample data for demo
    const demoData = {
        league_id: 1,
        league_name: 'Mumbai Premier League',
        league_full_name: 'Mumbai Premier Cricket League 2024',
        league_locations: 'Mumbai, Maharashtra',
        total_players: 156,
        total_teams: 8,
        has_unsold: true,
        league_start_date: '2024-10-15',
        league_end_date: '2024-11-30',
        registration_fee: '2500',
        registration_end_date: '2024-10-01',
        player_base_price: '50000',
        bid_amount_per_team: '500000',
        auction_start_date: '2024-10-10',
        minimum_player_count: 15,
        join_link: 'https://example.com/join/123',
        creator: {
            id: 1,
            display_name: 'Rahul Sharma',
            email: 'rahul@example.com',
        },
    }

    const data = leagueData || demoData

    return (
        <Card className="w-full max-w-xs bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            {/* Compact Header */}
            <CardHeader className="pb-3 px-4 pt-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold text-gray-900 leading-tight truncate">
                            {data.league_name}
                        </CardTitle>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{data.league_locations}</span>
                        </div>
                    </div>
                    <Badge
                        className={`ml-2 text-xs px-2 py-0.5 ${
                            isRegistrationOpen
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-gray-50 text-gray-600 border border-gray-200'
                        }`}>
                        {isRegistrationOpen ? 'Open' : 'Closed'}
                    </Badge>
                </div>

                {/* Compact Stats */}
                <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-lg p-2">
                    <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900">{data.total_players}</div>
                        <div className="text-xs text-gray-500">Players</div>
                    </div>
                    <div className="text-center border-x border-gray-200">
                        <div className="text-sm font-semibold text-gray-900">{data.total_teams}</div>
                        <div className="text-xs text-gray-500">Teams</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900">{formatCurrency(data.registration_fee)}</div>
                        <div className="text-xs text-gray-500">Entry</div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-4 pt-0 pb-3">
                {/* Essential Info */}
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg mb-3">
                    <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                        <div>
                            <div className="text-xs font-medium text-gray-900">Reg. Ends</div>
                            <div className="text-xs text-blue-700 font-medium">{formatDate(data.registration_end_date)}</div>
                        </div>
                    </div>
                    {isRegistrationOpen && daysUntilRegistrationEnds <= 7 && (
                        <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                            {daysUntilRegistrationEnds}d
                        </span>
                    )}
                </div>

                {/* Collapsible Section */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-1.5 hover:bg-gray-50 rounded text-xs text-gray-600 transition-colors">
                    <span>{isExpanded ? 'Less info' : 'More info'}</span>
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>

                {isExpanded && (
                    <div className="mt-2 space-y-2 animate-in slide-in-from-top-1 duration-200">
                        <div className="text-xs space-y-2">
                            <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                <span className="text-gray-500">Duration:</span>
                                <span className="text-gray-700 font-medium">
                                    {formatDate(data.league_start_date)} - {formatDate(data.league_end_date)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                <span className="text-gray-500">Auction:</span>
                                <span className="text-gray-700 font-medium">{formatDate(data.auction_start_date)}</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                <span className="text-gray-500">Organizer:</span>
                                <span className="text-gray-700 font-medium truncate ml-2">{data.creator.display_name}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-gray-500">Team Budget:</span>
                                <span className="text-gray-700 font-medium">{formatCurrency(data.bid_amount_per_team)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="px-4 pb-4 pt-0 flex gap-2">
                <Button
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium h-8"
                    onClick={handleViewDetails}>
                    Details
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    disabled={isCopying}
                    onClick={handleCopyLink}
                    className="h-8 w-8 border-gray-200 hover:bg-gray-50">
                    <ExternalLink className="h-3 w-3" />
                </Button>
            </CardFooter>
        </Card>
    )
}
