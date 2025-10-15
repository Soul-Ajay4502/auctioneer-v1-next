'use client'

import { useMutation } from '@tanstack/react-query'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { AxiosError } from 'axios'
import { axiosErrorToast } from '@/utils/axios-error-toast.utils'
import { api } from '@/config/axios-config'
import { Loader } from 'lucide-react'
import { useState } from 'react'

interface DeleteWithAlertProps {
    title?: string
    description?: string
    triggerText?: string
    endpoint: string
    method?: 'DELETE' | 'POST' | 'PUT'
    onAfterSuccess?: (response: unknown) => void
    onError?: (error: unknown) => void
    cancelText?: string
    confirmText?: string
    children?: React.ReactNode
    isAlertOpen?: boolean
    setIsAlertOpen?: (state: boolean) => void
}

export function DeleteWithAlert({
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    endpoint,
    onAfterSuccess,
    cancelText = 'Cancel',
    confirmText = 'Delete',
    children,
    // isAlertOpen,
    // setIsAlertOpen,
}: DeleteWithAlertProps) {
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const mutation = useMutation({
        mutationFn: async () => {
            const response = await api.delete(endpoint)
            return response.data
        },
        onSuccess: (data) => {
            if (setIsAlertOpen) setIsAlertOpen(false)
            if (onAfterSuccess) onAfterSuccess(data)
        },
        onError: (error: AxiosError) => {
            axiosErrorToast(error, 'Failed to delete. Please try again.')
        },
    })

    const handleDeleteConfirm = (e: React.MouseEvent) => {
        e.preventDefault()
        mutation.mutate()
    }

    return (
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger className="cursor-pointer">{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={mutation.isPending}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} disabled={mutation.isPending} className="min-w-[80px]">
                        {mutation.isPending ? <Loader className="animate-spin w-2 h-2" /> : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
