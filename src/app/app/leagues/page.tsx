'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Users, Calendar, Plus, Loader2 } from 'lucide-react'
import { PaginationControls } from '@/components/pagination-controlls'
import { leaguesService } from '@/services/leagues.services'
import { League } from '@/utils/common-types-utils'
import { formatDate } from '@/utils/format-date.utils'

export default function LeaguesPage() {
    const [page, setPage] = useState(1)
    const pageSize = 9

    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['leagues', page, pageSize],
        queryFn: () => leaguesService.getLeagues({ page, pageSize }),
    })

    const leagues = data?.data || []
    const pagination = data?.pagination || { currentPage: 1, limit: pageSize, total: 0, totalPages: 1, hasNext: false, hasPrevious: false }
    const totalPages = pagination.total > pagination.limit ? Math.ceil(pagination.total / pagination.limit) : 1

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading leagues...</span>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="p-6 text-center text-red-500">
                <p>Error loading leagues: {error?.message || 'Unknown error'}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="p-2 max-w-8xl mx-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Leagues</h1>
                <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    <span>Create League</span>
                </Button>
            </div>

            {leagues.length === 0 ? (
                <div className="text-center p-10 border rounded-lg bg-muted/50">
                    <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Leagues Found</h3>
                    <p className="text-muted-foreground mb-4">Create your first league to get started</p>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create League
                    </Button>
                </div>
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {leagues.map((league: League) => (
                            <motion.div
                                key={league.league_id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card className="h-full">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Trophy className="h-5 w-5 text-amber-500" />
                                            {league.league_name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users className="h-4 w-4 text-gray-500" />
                                                <span>{league.total_players} members</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                {league.league_start_date && league.league_end_date && (
                                                    <>
                                                        <Calendar className="h-4 w-4 text-gray-500" />
                                                        <span>{formatDate(league.league_start_date, 'ddMonYYYY')} - {formatDate(league.league_end_date, 'ddMonYYYY')}</span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="mt-4">
                                                <Button variant="outline" className="w-full">View Details</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="mt-8 flex justify-center">
                        <PaginationControls
                            total={pagination.total}
                            totalPages={totalPages}
                            currentPage={page}
                            limit={pageSize}
                            hasNext={page < totalPages}
                            hasPrevious={page > 1}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            )}
        </div>
    )
}