'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useAuthStore } from '@/store/auth.store'
import { api, apiAuth } from '@/config/axios-config'
import { toast } from 'sonner'

import endpoints from '@/services/api-endpoints'
import { AxiosError } from 'axios'

// Constants
const INITIAL_TIMER = 30
const OTP_LENGTH = 6

// Validation Schema
const formSchema = z.object({
    code: z.string().length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`),
})

type FormValues = z.infer<typeof formSchema>

const VerifyOtp = () => {
    const [resendTimer, setResendTimer] = useState(INITIAL_TIMER)
    const [isResendDisabled, setIsResendDisabled] = useState(true)
    const router = useRouter()
    const [hasChecked, setHasChecked] = useState(false)

    // Correctly access Zustand store
    const email = useAuthStore((state) => state.pendingVerificationEmail)
    const setAccessToken = useAuthStore((state) => state.setAccessToken)

    // Form initialization
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: '',
        },
    })

    // Redirect if no email in store
    useEffect(() => {
        if (!hasChecked) {
            // Skip first render where value might be null due to hydration
            setHasChecked(true)
            return
        }
        if (!email) {
            router.replace('/sign-up')
            return
        }
    }, [email, router, hasChecked])

    // Timer logic
    useEffect(() => {
        if (!isResendDisabled || resendTimer <= 0) {
            setIsResendDisabled(false)
            return
        }

        const timer = setInterval(() => {
            setResendTimer((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [resendTimer, isResendDisabled])

    // Mutations
    const resendMutation = useMutation({
        mutationFn: async () => {
            if (!email) throw new Error('Email is required')
            const response = await api.post(endpoints.authentication.resendOtp, { email })
            return response.data
        },
        onSuccess: () => {
            toast.success('OTP resent successfully')
            setResendTimer(INITIAL_TIMER)
            setIsResendDisabled(true)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to resend OTP')
            setIsResendDisabled(false)
        },
    })

    const verifyMutation = useMutation({
        mutationFn: async (values: FormValues) => {
            if (!email) throw new Error('Email is required')
            const response = await apiAuth.post(endpoints.authentication.verifyOtp, {
                email,
                code: values.code,
            })
            useAuthStore.getState().setAccessToken(response?.data?.accessToken)
            return response.data
        },
        onSuccess: (data) => {
            document.cookie = 'auth_session=true; path=/; max-age=86400; samesite=strict; secure'
            setAccessToken(data.accessToken)
            toast.success('Email verified successfully')
            router.push('/app')
        },
        onError: (error) => {
            toast.error((error as AxiosError)?.message || 'Invalid verification code')
            form.reset()
        },
    })

    // Handlers
    const handleResendCode = () => {
        if (!email || resendMutation.isPending) return
        resendMutation.mutate()
    }

    const onSubmit = (values: FormValues) => {
        if (verifyMutation.isPending) return
        verifyMutation.mutate(values)
    }

    // If no email, don't render the form
    if (!email) return null

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md px-4">
                <Card className=" shadow-md">
                    <CardHeader className="space-y-3">
                        <div className="flex items-center py-2">
                            <p className="ml-2 text-[15px] font-medium">Auctioneer</p>
                        </div>
                        <CardTitle className="text-2xl">Verify your email</CardTitle>
                        <CardDescription>
                            Enter the verification code sent to <span className="font-medium">{email}</span>
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InputOTP
                                                    maxLength={OTP_LENGTH}
                                                    pattern={REGEXP_ONLY_DIGITS}
                                                    {...field}
                                                    className="bg-white border-none">
                                                    <InputOTPGroup className="flex gap-2">
                                                        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                                                            <InputOTPSlot
                                                                key={index}
                                                                index={index}
                                                                className="w-12 h-12 text-center bg-white rounded-md border-2 shadow-sm focus:ring-2 focus:ring-primary"
                                                            />
                                                        ))}
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex flex-col gap-4">
                                    <Button
                                        variant="link"
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={isResendDisabled || resendMutation.isPending}
                                        className="text-sm text-gray-500 hover:text-gray-700">
                                        {resendMutation.isPending
                                            ? 'Sending...'
                                            : `Resend code ${isResendDisabled ? `(${resendTimer}s)` : ''}`}
                                    </Button>

                                    <Button type="submit" className="w-full" disabled={verifyMutation.isPending}>
                                        {verifyMutation.isPending ? <Loader className="w-4 h-4 animate-spin" /> : 'Verify Email'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default VerifyOtp
