'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Phone, User, Palette, Calendar, AlertCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { teamsService } from '@/services/team.service'
import TeamCard from './team-card'

// --- Utilities ---
const getJerseyColorClass = (color?: string) => {
  const colorMap: Record<string, string> = {
    Red: 'bg-red-500',
    Blue: 'bg-blue-500',
    Green: 'bg-green-500',
    Yellow: 'bg-yellow-500',
    Orange: 'bg-orange-500',
    Purple: 'bg-purple-500',
    Indigo: 'bg-indigo-500',
    Violet: 'bg-violet-500',
    Pink: 'bg-pink-500',
    Black: 'bg-black',
  }
  return colorMap[color ?? ''] || 'bg-gray-400'
}

const formatCurrency = (amount?: string | number) => {
  if (!amount) return '₹0'
  return `₹${Number(amount).toLocaleString('en-IN')}`
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// --- TeamCard Component ---
interface TeamCardProps {
  team: any
}



// --- Page Component ---
export default function Page() {
  const { leagueId } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['teams', leagueId],
    queryFn: () => teamsService.getTeams(leagueId as string),
    enabled: !!leagueId,
  })

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
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </section>
    </main>
  )
}
