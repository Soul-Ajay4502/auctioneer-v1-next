'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { AxiosError } from 'axios'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Plus, Users, User, Phone, Palette, Image, CircleX, CircleCheck } from 'lucide-react'
import { api } from '@/config/axios-config'
import { axiosErrorToast } from '@/utils/axios-error-toast.utils'
import endpoints from '@/services/api-endpoints'
import { Teams } from '@/utils/common-types-utils'
import { Spinner } from '../ui/spinner'

const createTeamSchema = z.object({
    team_name: z.string().min(2, 'Team name must be at least 2 characters'),
    team_owner: z.string().min(2, 'Team owner name is required'),
    team_owner_phone: z
        .string()
        .min(10, 'Phone number must be at least 10 digits')
        .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format'),
    jersey_color: z.string().min(1, 'Jersey color is required'),
    logo_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
})

type CreateTeamFormValues = z.infer<typeof createTeamSchema>

interface CreateTeamsModalProps {
    leagueId: number
    children?: React.ReactNode
    defaultValues?: Teams
    onAfterSuccess?: () => void
}

export default function CreateTeamsModal({ leagueId, defaultValues, onAfterSuccess, children }: CreateTeamsModalProps) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    const form = useForm<CreateTeamFormValues>({
        resolver: zodResolver(createTeamSchema),
        defaultValues: {
            team_name: defaultValues?.team_name || '',
            team_owner: defaultValues?.team_owner || '',
            team_owner_phone: defaultValues?.team_owner_phone || '',
            jersey_color: defaultValues?.jersey_color || '',
            logo_url: defaultValues?.logo_url || '',
        },
    })

    const createTeamMutation = useMutation({
        mutationFn: (values: CreateTeamFormValues) => {
            const body = { ...values, league_id: leagueId }
            if (defaultValues) {
                return api.patch(endpoints.teams.getById.replace(':id', defaultValues.id.toString()), body)
            }
            return api.post(endpoints.teams.create, body)
        },
        onSuccess: () => {
            toast.success('Team created successfully! 🎉')
            form.reset()
            setOpen(false)
            if (onAfterSuccess) {
                onAfterSuccess()
            }
        },
        onError: (error: AxiosError) => {
            axiosErrorToast(error, 'Failed to create team')
        },
    })

    const onSubmit = (values: CreateTeamFormValues) => {
        createTeamMutation.mutate(values)
    }

    const onClose = () => {
        if (open) {
            form.reset()
            setOpen(false)
        } else {
            setOpen(true)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Team
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {defaultValues ? `Edit Team ${defaultValues.team_name}` : 'Create New Team'}
                    </DialogTitle>
                    <DialogDescription>
                        {defaultValues
                            ? 'Edit the team details below.'
                            : 'Add a new team to your League. Fill in the team details below.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="team_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Team Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter team name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="team_owner"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Team Owner
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter team owner name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="team_owner_phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Owner Phone
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="+1 234 567 8900" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="jersey_color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Palette className="h-4 w-4" />
                                        Jersey Color
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Red, Blue, Green" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="logo_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Image className="h-4 w-4" />
                                        Logo URL (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/logo.png" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                disabled={createTeamMutation.isPending}
                                className="rounded-full">
                                <CircleX className="h-6 w-6" color="red" />
                            </Button>
                            <Button type="submit" variant="outline" disabled={createTeamMutation.isPending} className="gap-2">
                                {createTeamMutation.isPending ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <CircleCheck color="green" className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
