'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { useEffect } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Form, FormField } from '@/components/ui/form'
import { PasswordInputField } from '@/components/form-fields'
import { api } from '@/config/axios-config'
import endpoints from '@/services/api-endpoints'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

// Type definitions
type ResetPasswordParams = {
    token: string
}

type FormData = {
    password: string
    confirmPassword: string
}

// Validation schema
const formSchema = z
    .object({
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export default function ResetPassword() {
    const router = useRouter()
    const params = useParams<ResetPasswordParams>()
    const token = params.token

    // Form initialization
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    // Validate token on mount
    useEffect(() => {
        if (!token || typeof token !== 'string') {
            toast.error('Invalid reset token')
            router.replace('/sign-in')
        }
    }, [token, router])

    // Reset password mutation
    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: async (values: FormData) => {
            // try {
            const response = await api.post(endpoints.authentication.resetPassword, {
                password: values.password,
                token: token || '',
            })
            return response.data
            // } catch (error: AxiosError) {
            //     if (error.response?.status === 401) {
            //         throw new Error('Reset token has expired')
            //     }
            //     throw new Error(error.response?.data?.message || 'Failed to reset password')
            // }
        },
        onSuccess: () => {
            toast.success('Password reset successful! Please sign in with your new password.')
            setTimeout(() => router.push('/sign-in'), 2000)
        },
        onError: (error: AxiosError) => {
            toast.error(error.message)
            if (error.message === 'Reset token has expired') {
                setTimeout(() => router.push('/forgot-password'), 2000)
            }
        },
    })

    // Form submission handler
    const onSubmit = (values: FormData) => {
        if (!token) return
        mutate(values)
    }

    // Prevent further interactions if successful
    if (isSuccess) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Card className="w-full max-w-[360px] border-none shadow-none">
                    <CardContent className="text-center">
                        <p className="text-green-600">Password reset successful!</p>
                        <p className="text-sm text-muted-foreground mt-2">Redirecting to sign in page...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center min-h-screen w-full">
            <Card className="w-full max-w-[360px] border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-2xl py-2">Reset Password</CardTitle>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <PasswordInputField
                                        label="New Password"
                                        placeholder="Enter new password"
                                        field={field}
                                        itemClassName="w-full"
                                        labelClassName="text-[14px] text-[#414651]"
                                        inputClassName="bg-white rounded-sm"
                                    />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <PasswordInputField
                                        label="Confirm Password"
                                        placeholder="Confirm new password"
                                        field={field}
                                        itemClassName="w-full"
                                        labelClassName="text-[14px] text-[#414651]"
                                        inputClassName="bg-white rounded-sm"
                                    />
                                )}
                            />

                            <Button type="submit" className="w-full rounded-sm" disabled={isPending || isSuccess}>
                                {isPending ? <Loader className="animate-spin mr-2" /> : 'Reset Password'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-primary">
                        Back to Sign In
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
