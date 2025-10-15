'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Player } from '@/utils/common-types-utils'
import { Edit, Trash2, User, MapPin, Users, Activity, Phone, Mail, Trophy, CircleCheck, CircleX } from 'lucide-react'

interface PlayerAccordionProps {
    players: Player[]
    onEdit: (playerId: number, data?: { isApproved?: boolean }) => void
    onDelete: (playerId: number) => void
}

export default function PlayerAccordion({ players, onEdit, onDelete }: PlayerAccordionProps) {
    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Player List</h2>
                <p className="text-gray-600">Manage your cricket team players</p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
                {players.map((player) => (
                    <AccordionItem
                        key={player.player_id}
                        value={player.player_id.toString()}
                        className="border rounded-lg shadow-sm bg-white">
                        <AccordionTrigger className="p-5 hover:no-underline hover:bg-gray-50 rounded-t-lg relative">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-900">{player.player_name}</h3>
                                        <p className="text-sm text-gray-500">{player.player_role}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 mr-4 h-fit justify-center">
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onEdit(player.player_id)
                                        }}
                                        className="h-8 w-8 p-0 hover:bg-blue-100 flex items-center justify-center cursor-pointer">
                                        <Edit className="w-4 h-4 text-blue-600" />
                                    </div>

                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onEdit(player.player_id, { isApproved: false })
                                        }}
                                        className="h-8 w-8 p-0 hover:bg-blue-100 flex items-center justify-center cursor-pointer"
                                        title="reject player">
                                        <CircleX className="w-4 h-4 text-black" />
                                    </div>

                                    <div
                                        onClick={(e) => {
                                            if (player.is_admin_approved) return
                                            e.stopPropagation()
                                            onEdit(player.player_id, { isApproved: true })
                                        }}
                                        className="h-8 w-8 p-0 hover:bg-blue-100 flex items-center justify-center cursor-pointer">
                                        <CircleCheck
                                            className={cn('w-4 h-4', {
                                                'text-green-600': !player.is_admin_approved,
                                                'text-gray-400': player.is_admin_approved,
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -right-4 -top-4 cursor-pointer">
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onDelete(player.player_id)
                                    }}
                                    className="h-8 w-8 p-0 rounded-full hover:bg-red-100 flex items-center justify-center">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </div>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-4 pb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Place</p>
                                            <p className="text-sm text-gray-600">{player.place}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Users className="w-4 h-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Team</p>
                                            <p className="text-sm text-gray-600">{player.current_team || 'Not assigned'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Activity className="w-4 h-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Batting Style</p>
                                            <p className="text-sm text-gray-600">{player.batting_style}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Activity className="w-4 h-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Bowling Style</p>
                                            <p className="text-sm text-gray-600">{player.bowling_style}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">WhatsApp</p>
                                            <p className="text-sm text-gray-600">{player.whatsapp_no}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Email</p>
                                            <p className="text-sm text-gray-600 break-all">{player.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Trophy className="w-4 h-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">League</p>
                                            <p className="text-sm text-gray-600">{player.league.league_name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 flex items-center justify-center">
                                            <div
                                                className={`w-2 h-2 rounded-full ${player.is_admin_approved ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Status</p>
                                            <p className="text-sm text-gray-600">
                                                {player.is_admin_approved ? 'Approved' : 'Pending Approval'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {players.length === 0 && (
                <div className="text-center py-12">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No players found</h3>
                    <p className="text-gray-500">Add some players to get started.</p>
                </div>
            )}
        </div>
    )
}
