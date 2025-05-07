'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Form, FormField } from '@/components/ui/form'

import { useAuthStore } from '@/store/auth.store'
import FormOverlayWrapper from '@/components/form-overlay-wrapper'
import { FormInputField, PasswordInputField } from '@/components/form-fields'

const formSchema = z.object({
    email: z.string().min(1, 'Required').email('Invalid email'),
    password: z.string().min(1, 'Password required'),
})

const SignInPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const login = useAuthStore((state) => state.login)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const toastId = toast.loading('Logging in...')
        setIsSubmitting(true)
        try {
            const result = await login(values)
            if (result.success) {
                toast.success('Login successful!', { id: toastId })
                router.push('/app')
            } else {
                toast.error(result.message || 'Login failed.', { id: toastId })
            }
        } catch (error) {
            console.error('Login failed:', error)
            toast.error('Unexpected error occurred.', { id: toastId })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <FormOverlayWrapper isSubmitting={isSubmitting}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-[360px] mx-auto"
            >
                <Card className="">
                    <CardHeader>
                        <CardTitle className="text-2xl">Welcome back.</CardTitle>
                        <CardDescription>Enter your email to login to your account.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormInputField
                                            label="Email *"
                                            placeholder="Your email"
                                            type="email"
                                            field={field}
                                            inputClassName="bg-white rounded-sm"
                                        />
                                    )}
                                />

                                {/* Password */}
                                <div className="relative">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <PasswordInputField
                                                label="Password *"
                                                placeholder="Your password"
                                                field={field}
                                                inputClassName="rounded-sm"
                                            />
                                        )}
                                    />
                                    <Link href="/forgot-password" className="absolute top-0 right-0 text-sm underline">
                                        Forgot?
                                    </Link>
                                </div>

                                {/* Submit */}
                                <Button type="submit" className="w-full mt-2 rounded-sm" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader className="animate-spin" size={20} /> : 'Login'}
                                </Button>
                            </form>
                        </Form>

                        {/* Separator */}

                        <div className="flex items-center w-full my-4">
                            <div className='w-1/2'><Separator className=" bg-muted" /></div>
                            <span className="mx-2 text-xs text-muted-foreground">OR</span>
                            <div className='w-1/2'><Separator className=" bg-muted" /></div>
                        </div>


                        {/* Footer */}
                        <div className="text-center mt-4 text-sm">
                            Don&apos;t have an account?{' '}
                            <Link href="/sign-up" className="underline">
                                Sign Up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </FormOverlayWrapper>
    )
}

export default SignInPage
