"use client"

import { useState } from "react"
import { Calendar, MapPin, DollarSign, Clock, Users, ChevronDown, ChevronUp, Heart, Share2, Bell, IndianRupee } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatDate } from "@/utils/format-date.utils"
import { RegistrationValidation, RegistrationValidationCompact } from "./registraion-validation"

interface LeagueDetails {
    league_full_name: string
    league_name: string
    league_start_date: string
    league_end_date: string
    registration_fee: string
    registration_end_date: string
    league_locations: string
    auction_start_date: string
}

interface LeagueDetailsCardProps {
    leagueDetails: LeagueDetails
}

export default function LeagueDetailsCard({ leagueDetails }: LeagueDetailsCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isNotified, setIsNotified] = useState(false)



    const daysUntilRegistration = Math.ceil(
        (new Date(leagueDetails?.registration_end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24),
    )
    const isUrgent = daysUntilRegistration <= 7

    return (
        <Card className="w-full mx-auto shadow-none transition-all duration-300 pb-0">
            <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                            {leagueDetails?.league_full_name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                                {leagueDetails?.league_name}
                            </Badge>
                            {isUrgent && (
                                <Badge variant="destructive" className="text-xs animate-pulse">
                                    Urgent
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50"
                            onClick={() => setIsLiked(!isLiked)}
                        >
                            <Heart
                                className={cn("h-4 w-4 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-slate-400")}
                            />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                            onClick={() => setIsNotified(!isNotified)}
                        >
                            <Bell
                                className={cn(
                                    "h-4 w-4 transition-colors",
                                    isNotified ? "fill-blue-500 text-blue-500" : "text-slate-400",
                                )}
                            />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-4 pb-4 space-y-3">
                {/* Registration Progress */}
                <div className="bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="flex items-center gap-1 text-slate-600">
                            <Clock className="h-3 w-3" />
                            Registration
                        </span>
                        <span className={cn("font-medium", isUrgent ? "text-red-600" : "text-slate-900")}>
                            {daysUntilRegistration > 0 ? `${daysUntilRegistration} days left` : "Expired"}
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                            className={cn("h-2 rounded-full transition-all duration-500", isUrgent ? "bg-red-500" : "bg-green-500")}
                            style={{ width: `${Math.max(10, Math.min(90, (30 - daysUntilRegistration) * 3))}%` }}
                        />
                    </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm hover:bg-slate-50 rounded px-2 py-1 transition-colors cursor-pointer">
                        <span className="flex items-center gap-1 text-slate-600">
                            <IndianRupee className="h-3 w-3" />
                            Fee
                        </span>
                        <span className="font-bold text-green-600">{leagueDetails?.registration_fee}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm hover:bg-slate-50 rounded px-2 py-1 transition-colors cursor-pointer">
                        <span className="flex items-center gap-1 text-slate-600">
                            <MapPin className="h-3 w-3" />
                            Location
                        </span>
                        <span className="font-medium text-slate-900 text-right">{leagueDetails?.league_locations}</span>
                    </div>
                </div>

                {/* Expandable Section */}
                <div className="border-t border-slate-100 pt-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center justify-between w-full text-sm text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <span>More Details</span>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    <div
                        className={cn(
                            "overflow-hidden transition-all duration-300 ease-in-out",
                            isExpanded ? " opacity-100 mt-2" : "max-h-0 opacity-0",
                        )}
                    >
                        <div className="space-y-2 px-4 pb-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1 text-slate-600">
                                    <Calendar className="h-3 w-3" />
                                    Duration
                                </span>
                                <span className="font-medium text-slate-900 text-xs">
                                    {formatDate(leagueDetails?.league_start_date, 'ddMonYYYY')} - {formatDate(leagueDetails?.league_end_date, 'ddMonYYYY')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1 text-slate-600">
                                    <Users className="h-3 w-3" />
                                    Auction
                                </span>
                                <span className="font-medium text-slate-900">{formatDate(leagueDetails?.auction_start_date, 'ddMonYYYY')}</span>
                            </div>
                        </div>
                        <RegistrationValidationCompact />
                    </div>
                </div>


            </CardContent>
        </Card>
    )
}
