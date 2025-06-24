"use client"

import { Calendar, Users, MapPin, IndianRupee, Trophy, Clock, LinkIcon, Settings, UserPlus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { useState } from "react"
import NavigationButtons from "../league-components/navigation-buttons"

export interface LeagueData {
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
    created_by: number
    registration_end_date: string
    player_base_price: string
    bid_amount_per_team: string
    auction_start_date: string
    break_points: string
    increments: string
    minimum_player_count: number
    created_at: string
    updated_at: string | null
    deleted_at: string | null
    join_link: string
    createdAt: string
    updatedAt: string | null
    deletedAt: string | null
    creator: {
        id: number
        display_name: string
        email: string
    }
    registered_teams_count: number
    registered_players_count: number
}

interface LeagueDashboardProps {
    data: LeagueData
}

export function LeagueDashboard({ data }: LeagueDashboardProps) {
    const [isCopying, setIsCopying] = useState(false)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatCurrency = (amount: string) => {
        return `₹${Number.parseFloat(amount).toLocaleString()}`
    }

    const getRegistrationProgress = () => {
        return (data.registered_teams_count / data.total_teams) * 100
    }

    const getPlayerProgress = () => {
        return (data.registered_players_count / data.total_players) * 100
    }

    const parseBreakPoints = () => {
        return data.break_points?.split(",")?.map((point) => Number.parseInt(point))
    }

    const parseIncrements = () => {
        return data.increments?.split(",")?.map((inc) => Number.parseInt(inc))
    }

    const isRegistrationOpen = () => {
        const now = new Date()
        const regEndDate = new Date(data.registration_end_date)
        return now < regEndDate
    }

    const isAuctionStarted = () => {
        const now = new Date()
        const auctionDate = new Date(data.auction_start_date)
        return now >= auctionDate
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(data.join_link)
        setIsCopying(true)
        setTimeout(() => {
            setIsCopying(false)
        }, 4000)
        toast.success("Join link copied to clipboard")
    }

    return (
        <div className="min-h-[78vh] p-2 md:p-4">
            <div className="max-w-7xl mx-auto ">
                {/* Header Section */}
                <div className="block md:flex   gap-2">
                    <div className="w-full mb-2 md:mb-0 md:w-2/3 bg-white rounded-sm border shadow-lg p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <Trophy className="h-8 w-8 text-yellow-500" />
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">{data.league_name}</h1>
                                        <p className="text-lg text-gray-600">{data.league_full_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <MapPin className="h-4 w-4" />
                                    <span>{data.league_locations}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <span>
                                        Created by: <strong>{data.creator?.display_name}</strong>
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button disabled={isCopying} onClick={handleCopyLink} className="bg-green-600 hover:bg-green-700">
                                    <LinkIcon className="h-4 w-4 mr-2" />
                                    Copy Join Link
                                </Button>
                                <Button variant="outline">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Manage League
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Card className="w-full md:w-1/3 rounded-sm">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <NavigationButtons />

                        </CardContent>
                    </Card>

                </div>
                <ScrollArea className="h-105" type="scroll">
                    {/* Status Cards */}
                    <div className="my-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="rounded-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Teams Registered</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {data.registered_teams_count}/{data.total_teams}
                                </div>
                                <Progress value={getRegistrationProgress()} className="mt-2" />
                                <p className="text-xs text-muted-foreground mt-1">{getRegistrationProgress().toFixed(1)}% capacity</p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Players Registered</CardTitle>
                                <UserPlus className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {data.registered_players_count}/{data.total_players}
                                </div>
                                <Progress value={getPlayerProgress()} className="mt-2" />
                                <p className="text-xs text-muted-foreground mt-1">{getPlayerProgress().toFixed(1)}% capacity</p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Registration Fee</CardTitle>
                                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(data.registration_fee)}</div>
                                <p className="text-xs text-muted-foreground">Per team registration</p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Registration Status</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {isRegistrationOpen() ? (
                                        <Badge className="bg-green-100 text-green-800">Open</Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-800">Closed</Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Ends: {formatDate(data.registration_end_date)}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Grid */}
                    <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* League Timeline */}
                        <Card className="rounded-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    League Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">League Start</p>
                                            <p className="text-sm text-gray-600">{formatDate(data.league_start_date)}</p>
                                        </div>
                                        <Badge variant="outline">Upcoming</Badge>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">Auction Date</p>
                                            <p className="text-sm text-gray-600">{formatDate(data.auction_start_date)}</p>
                                        </div>
                                        <Badge
                                            className={isAuctionStarted() ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                                        >
                                            {isAuctionStarted() ? "Live" : "Scheduled"}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">League End</p>
                                            <p className="text-sm text-gray-600">{formatDate(data.league_end_date)}</p>
                                        </div>
                                        <Badge variant="outline">Future</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Financial Details */}
                        <Card className="rounded-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <IndianRupee className="h-5 w-5" />
                                    Financial Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Player Base Price</p>
                                        <p className="text-xl font-bold text-green-700">{formatCurrency(data.player_base_price)}</p>
                                    </div>

                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Team Budget</p>
                                        <p className="text-xl font-bold text-blue-700">{formatCurrency(data.bid_amount_per_team)}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <p className="font-medium mb-2">Total Revenue Potential</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency((Number.parseFloat(data.registration_fee) * data.total_players).toString())}
                                    </p>
                                    <p className="text-sm text-gray-600">From Player registration fees</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Auction Configuration */}
                    <Card className="my-2 rounded-sm">
                        <CardHeader>
                            <CardTitle>Auction Configuration</CardTitle>
                            <CardDescription>Bidding rules and increment structure for the auction</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium mb-3">Break Points</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {parseBreakPoints()?.map((point, index) => (
                                            <Badge key={index} variant="outline">
                                                {formatCurrency(point.toString())}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-3">Bid Increments</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {parseIncrements()?.map((increment, index) => (
                                            <Badge key={index} variant="secondary">
                                                +{formatCurrency(increment.toString())}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Minimum Players per Team</p>
                                    <p className="text-sm text-gray-600">Required squad size</p>
                                </div>
                                <Badge className="bg-purple-100 text-purple-800 text-lg px-3 py-1">{data.minimum_player_count}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="mb-2 rounded-sm">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <NavigationButtons buttonContainerClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" />
                        </CardContent>
                    </Card>

                    {/* Join Link Section */}
                    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Invite Teams to Join</h3>
                                    <p className="opacity-90">Share this link with public to join your league</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="bg-white/20 rounded-lg p-3 font-mono text-sm break-all">{data.join_link}</div>
                                    <Button disabled={isCopying} onClick={handleCopyLink} variant="secondary" className="whitespace-nowrap">
                                        Copy Link
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </ScrollArea>
            </div>
        </div>
    )
}
