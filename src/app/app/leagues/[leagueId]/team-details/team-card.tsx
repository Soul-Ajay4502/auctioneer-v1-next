'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Phone, User, Palette, Calendar, Trash2, Edit } from 'lucide-react'
import { DeleteWithAlert } from '@/components/delete-with-alert'
import { toast } from 'sonner'
import CreateTeamsModal from '@/components/modals/create-teams-modal'
import { Teams } from '@/utils/common-types-utils'

const getJerseyColorClass = (color?: string) => {
    const colorMap: Record<string, string> = {
        red: 'bg-red-500',
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        orange: 'bg-orange-500',
        purple: 'bg-purple-500',
        indigo: 'bg-indigo-500',
        violet: 'bg-violet-500',
        pink: 'bg-pink-500',
        black: 'bg-black',
    }
    return colorMap[color ?? ''] || 'bg-gray-300'
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

interface TeamCardProps {
    team: Teams
    refetchTeams: () => void
}

const TeamCard = ({ team, refetchTeams }: TeamCardProps) => (
    <Card
        key={team.id}
        className="relative rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white/70 backdrop-blur-sm">
        <div className="absolute top-1 right-2 w-fit">
            <DeleteWithAlert
                title={`Are you sure you want to delete the team ${team.team_name}?`}
                description="This action cannot be undone."
                endpoint={`/teams/${team.id}`}
                onAfterSuccess={() => {
                    toast.success(`Team ${team.team_name} deleted successfully!`)
                    refetchTeams()
                }}>
                <Trash2 className="w-4 h-4 text-gray-500" />
            </DeleteWithAlert>

            <CreateTeamsModal leagueId={team.league_id} defaultValues={team} onAfterSuccess={refetchTeams}>
                <button
                    // onClick={handleEdit}
                    className=" p-1 rounded-full hover:bg-gray-100">
                    <Edit className="w-4 h-4 text-gray-500" />
                </button>
            </CreateTeamsModal>
        </div>
        <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border border-gray-200 shadow-sm">
                        <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={team.team_name} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                            {team.team_name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">{team.team_name}</CardTitle>
                    </div>
                </div>
                <div
                    className={`w-3.5 h-3.5 rounded-full ring-2 ring-white ${getJerseyColorClass(
                        team.jersey_color.toLowerCase(),
                    )}`}
                    aria-label={`Jersey color: ${team.jersey_color.toLowerCase()}`}
                />
            </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
            {/* Owner */}
            <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-800">{team.team_owner}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{team.team_owner_phone}</span>
                </div>
            </div>

            {/* Jersey */}
            <div className="flex items-center gap-2 text-sm">
                <Palette className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Jersey</span>
                <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                    {team.jersey_color}
                </Badge>
            </div>

            {/* Budget */}
            <div className="rounded-xl bg-gray-50/60 p-3 space-y-2 border border-gray-100">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Budget</span>
                    <span className="font-semibold text-green-600">{formatCurrency(team.max_amount_for_bid)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Balance</span>
                    <span className="font-semibold">{formatCurrency(team.balance_amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Max / Player</span>
                    <span className="font-semibold text-orange-600">{formatCurrency(team.max_amount_per_player)}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t pt-3">
                <Badge variant={team.is_auction_started ? 'default' : 'secondary'} className="text-xs px-2 py-0.5 rounded-full">
                    {team.is_auction_started ? 'Active' : 'Pending'}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(team.created_date)}</span>
                </div>
            </div>
        </CardContent>
    </Card>
)

export default TeamCard
