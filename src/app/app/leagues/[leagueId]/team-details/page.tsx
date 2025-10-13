'use client'

import { AlertCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { teamsService } from '@/services/team.service'
import TeamCard from './team-card'
import { toast } from 'sonner'
import { useCallback } from 'react'



// --- Page Component ---
export default function Page() {
  const { leagueId } = useParams()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['teams', leagueId],
    queryFn: () => teamsService.getTeams(leagueId as string),
    enabled: !!leagueId,
  })

  const deleteMutation = useMutation({
    mutationFn: (teamId: number) => teamsService.deleteTeam(teamId),
    onSuccess: () => {
      refetch()
      toast.success('Team deleted successfully')
    },
  })

  const handleDelete = useCallback((teamId: number) => {
    deleteMutation.mutate(teamId)
  }, [deleteMutation])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading teams...</p>
      </div>
    )
  }

  const teamsData = data?.data ?? []
  if (!teamsData.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No teams found.</p>
      </div>
    )
  }

  const leagueName = teamsData[0]?.league?.league_full_name ?? 'Cricket League'

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8">
      <section className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            {leagueName}
          </h1>
          <p className="text-lg text-gray-600 mb-4">Cricket Auction Teams</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <AlertCircle className="w-4 h-4" />
            <span>Auction Status: Not Started</span>
          </div>
        </header>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamsData.map((team) => (
            <TeamCard key={team.id} team={team} handleDelete={handleDelete} />
          ))}
        </div>
      </section>
    </main>
  )
}
