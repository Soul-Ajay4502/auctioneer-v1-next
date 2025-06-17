'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trophy, Loader2, DollarSign, UserCheck } from 'lucide-react'
import { userService } from '@/services/user.services'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAuthStore } from '@/store/auth.store'

export default function LeaguesPage() {

    const fetchMyDetails = useAuthStore((state) => state.fetchMyDetails)

    useEffect(() => {
        async function fetchData() {
            try {
                await fetchMyDetails()
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
            }
        }

        fetchData()
    }, [fetchMyDetails])

    // Fetch user stats
    const {
        data: statsResponse,
        isLoading: isLoadingStats
    } = useQuery({
        queryKey: ['userStats'],
        queryFn: userService.getUserStats,
    })

    const userStats = statsResponse?.data || {
        leaguesCount: 0,
        totalRevenue: 0,
        uniquePlayersCount: 0,
        chartData: { labels: [], values: [] }
    }

    // Transform chart data for Recharts
    const chartData = userStats.chartData.labels.map((label, index) => ({
        month: label,
        count: userStats.chartData.values[index]
    }))



    return (
        <div className="p-6 max-w-8xl ">
            {/* Stats Cards */}
            <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leagues</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">
                                    {isLoadingStats ? <Loader2 className="h-4 w-4 animate-spin" /> : userStats.leaguesCount}
                                </div>
                                <Trophy className="h-5 w-5 text-amber-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">
                                    {isLoadingStats ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        `₹${userStats.totalRevenue.toLocaleString()}`
                                    )}
                                </div>
                                <DollarSign className="h-5 w-5 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Players</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">
                                    {isLoadingStats ? <Loader2 className="h-4 w-4 animate-spin" /> : userStats.uniquePlayersCount}
                                </div>
                                <UserCheck className="h-5 w-5 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Chart */}
            <div className="mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>League Creation Trend</CardTitle>
                        <CardDescription>Number of leagues created over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            {isLoadingStats ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#8884d8" name="Leagues Created" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    No league creation data available for the last 6 months
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}