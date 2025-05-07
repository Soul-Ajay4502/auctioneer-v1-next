'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField } from '@/components/ui/form'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/config/axios-config'
import endpoints from '@/services/api-endpoints'
import { Loader } from 'lucide-react'
import { FormInputField } from '@/components/form-fields'
import { AxiosError } from 'axios'

const formSchema = z.object({
    email: z.string().min(1, 'Required').email('Invalid email'),
})

const ForgotPassword = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    })

    // React Query mutation for submitting the email
    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const response = await api.post(endpoints.authentication.forgotPassword, values) // Replace with your API endpoint
            return response.data
        },
        onSuccess: (data) => {
            if (data.email) {
                toast.success('Password reset instructions sent to your email!')
                router.push('verify-otp') // Redirect to the verify OTP page
                return
            }
            toast.success(data.message)
        },
        onError: (error: AxiosError) => {
            toast.error(error.message || 'Failed to send instructions. Please try again.')
            console.error('Error submitting email:', error)
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const toastId = toast.loading('sending email...') // Show loading toast
        mutation.mutate(values, {
            onSettled: () => {
                toast.dismiss(toastId) // Dismiss the loading toast when the mutation is settled
            },
        })
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div>
                <Card className="w-full min-w-[384px] border-none shadow-none">
                    <CardHeader>
                        <CardTitle className=" text-2xl py-2">Forgot Password</CardTitle>
                        <CardDescription>
                            Don&apos;t worry! It happens. Please enter the email associated with your account.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormInputField
                                            field={field}
                                            label="Email"
                                            placeholder="Your email"
                                            itemClassName="w-full"
                                            labelClassName="text-[14px] text-[#414651]"
                                            inputClassName="bg-white rounded-sm"
                                        />
                                    )}
                                />

                                <Button type="submit" className="w-full rounded-sm" disabled={mutation.isPending}>
                                    {mutation.isPending ? <Loader className="animate-spin" /> : 'Send Instructions'}
                                </Button>
                            </form>
                        </Form>
                        <Link href="/sign-in" className=" text-[14px] flex justify-left mt-4">
                            Back to <p className="underline ml-1">Login</p>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ForgotPassword
