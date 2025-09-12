'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Form, FormField } from '@/components/ui/form'

import { Loader } from 'lucide-react'
import endpoints from '@/services/api-endpoints'
import { toast } from 'sonner'
import { api } from '@/config/axios-config'
import { useRouter } from 'next/navigation'
import FormOverlayWrapper from '@/components/form-overlay-wrapper'
import { FormInputField, PasswordInputField } from '@/components/form-fields'
import { useAuthStore } from '@/store/auth.store'
import { splitFullName } from '@/utils/split-full-name.utils'
import { AxiosError } from 'axios'

// Extend the schema to include confirmPassword validation
const formSchema = z
    .object({
        fullName: z
            .string()
            .min(1, 'Full name is required')
            .refine((val) => {
                const parts = val.trim().split(/\s+/)
                if (parts.length < 2)
                    throw new z.ZodError([
                        { message: 'Please enter both first and last name', path: ['fullName'], code: 'custom' },
                    ])
                if (parts.length > 2)
                    throw new z.ZodError([
                        { message: 'Only first and last name allowed (no middle names)', path: ['fullName'], code: 'custom' },
                    ])
                return true
            }),
        email: z.string().email('Invalid email'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'], // This will show the error on the confirmPassword field
    })

const SignUpForm = () => {
    const router = useRouter()
    const setPendingVerificationEmail = useAuthStore((state) => state.setPendingVerificationEmail)
    // React Hook Form setup
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        },
    })
    const watchPassword = form.watch('password') // Watch the password field

    // React Query mutation for form submission
    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const { firstName, lastName } = splitFullName(values.fullName)
            const body = { firstName: firstName, lastName: lastName, userType: 1, ...values }
            const response = await api.post(endpoints.authentication.signUp, body)
            return response.data
        },
        onSuccess: (data) => {
            console.log('Sign up successful:', data.email)
            toast.success('Verification email sent successfully.')
            setPendingVerificationEmail(data.email)
            router.push('/verify-otp')
        },
        onError: (error: AxiosError) => {
            if (error.response) {
                toast.error(error.message || 'An error occurred during sign up.')
            } else {
                console.error('Error:', error.message)
                toast.error('An error occurred. Please try again.')
            }
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const toastId = toast.loading('Sending otp...') // Show loading toast
        mutation.mutate(values, {
            onSettled: () => {
                toast.dismiss(toastId) // Dismiss the loading toast when the mutation is settled
            },
        })
    }

    return (
        <div>
            <div className="flex mx-auto">
                <FormOverlayWrapper isSubmitting={mutation.isPending}>
                    <Card className="w-[360px]">
                        <CardHeader>
                            <CardTitle className="text-2xl py-1">Let&apos;s get started..</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    {/* <div className="flex space-x-4"> */}
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormInputField label="Full Name *" placeholder="Full name" field={field} />
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormInputField label="Email *" placeholder="Your email" type="email" field={field} />
                                        )}
                                    />

                                    {/* Password Field */}

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <PasswordInputField label="Password *" placeholder="Your password" field={field} />
                                        )}
                                    />

                                    {/* Confirm Password Field with Animation */}
                                    {watchPassword && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.4 }}>
                                            <FormField
                                                control={form.control}
                                                name="confirmPassword"
                                                render={({ field }) => (
                                                    <PasswordInputField
                                                        label="Confirm password *"
                                                        placeholder="Confirm your password"
                                                        field={field}
                                                    />
                                                )}
                                            />
                                        </motion.div>
                                    )}

                                    <Button type="submit" className="w-full rounded-sm mt-2" disabled={mutation.isPending}>
                                        {mutation.isPending ? <Loader className="animate-spin" /> : 'Create an account'}
                                    </Button>
                                </form>
                            </Form>

                            {/* OR separator and social logins */}
                            <div className="text-center space-y-4 mt-6">
                                <div className="my-4 flex items-center">
                                    <Separator style={{ width: '45%', backgroundColor: '#E9EAEB' }} />
                                    <span className="mx-2 text-xs text-gray-500">OR</span>
                                    <Separator style={{ width: '45%', backgroundColor: '#E9EAEB' }} />
                                </div>

                                <div className="text-[14px] tex-[#0B0B0B]">
                                    Already have an account?{' '}
                                    <Link href="/sign-in" className="underline">
                                        Log In
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </FormOverlayWrapper>
            </div>
        </div>
    )
}

export default SignUpForm
