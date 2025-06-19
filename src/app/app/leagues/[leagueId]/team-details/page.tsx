"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, User, Palette, Calendar, AlertCircle } from "lucide-react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { teamsService } from "@/services/team.service"



const getJerseyColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
        Red: "bg-red-500",
        Blue: "bg-blue-500",
        Green: "bg-green-500",
        Yellow: "bg-yellow-500",
        Orange: "bg-orange-500",
        Purple: "bg-purple-500",
        Indigo: "bg-indigo-500",
        Violet: "bg-violet-500",
        Pink: "bg-pink-500",
        Black: "bg-black",
    }
    return colorMap[color] || "bg-gray-500"
}

const formatCurrency = (amount: string) => {
    return `₹${Number.parseFloat(amount).toLocaleString()}`
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

export default function Page() {
    const { leagueId } = useParams();
    const { data } = useQuery({
        queryKey: ['teams', leagueId],
        queryFn: () => teamsService.getTeams(leagueId as string),
        enabled: !!leagueId
    })
    if (!data?.data) {
        return null
    }

    const teamsData = data?.data || []
    const leagueName = teamsData[0]?.league?.league_full_name || "Cricket League"

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{leagueName}</h1>
                    <p className="text-lg text-gray-600 mb-4">Cricket Auction Teams</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <AlertCircle className="w-4 h-4" />
                        <span>Auction Status: Not Started</span>
                    </div>
                </div>

                {/* Teams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {teamsData?.map((team) => (
                        <Card
                            key={team.id}
                            className="hover:shadow-lg rounded-sm transition-shadow duration-300 border-2 hover:border-gray-300"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={team.team_name} />
                                            <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                                                {team.team_name.charAt(team.team_name.length - 1)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg font-bold text-gray-900">{team.team_name}</CardTitle>
                                            <p className="text-sm text-gray-500">ID: {team.id}</p>
                                        </div>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full ${getJerseyColorClass(team.jersey_color)}`} />
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Owner Info */}
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="font-medium">{team.team_owner}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span>{team.team_owner_phone}</span>
                                </div>

                                {/* Jersey Color */}
                                <div className="flex items-center gap-2 text-sm">
                                    <Palette className="w-4 h-4 text-gray-500" />
                                    <span>Jersey: </span>
                                    <Badge variant="outline" className="text-xs">
                                        {team.jersey_color}
                                    </Badge>
                                </div>

                                {/* Budget Information */}
                                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Total Budget:</span>
                                        <span className="font-semibold text-green-600">{formatCurrency(team.max_amount_for_bid)}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Balance:</span>
                                        <span className="font-semibold">{formatCurrency(team.balance_amount)}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Max per Player:</span>
                                        <span className="font-semibold text-orange-600">{formatCurrency(team.max_amount_per_player)}</span>
                                    </div>
                                </div>

                                {/* Status and Date */}
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <Badge variant={team.is_auction_started ? "default" : "secondary"} className="text-xs">
                                        {team.is_auction_started ? "Active" : "Pending"}
                                    </Badge>

                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatDate(team.created_date)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
