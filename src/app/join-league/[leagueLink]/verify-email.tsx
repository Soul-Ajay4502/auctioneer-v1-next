"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Mail, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const emailSchema = z.object({
    email: z.string().email({ message: "Enter a valid email." }).trim(),
})

const otpSchema = z.object({
    otp: z
        .string()
        .length(6, { message: "OTP must be 6 digits." })
        .regex(/^\d+$/, { message: "OTP must contain only numbers." }),
})

type EmailFormValues = z.infer<typeof emailSchema>
type OTPFormValues = z.infer<typeof otpSchema>

export default function EmailVerification({
    onAfterEmailVerification,
}: {
    onAfterEmailVerification: () => void
}) {
    const [step, setStep] = useState<"email" | "otp" | "success">("email")
    const [email, setEmail] = useState("")
    const [otpError, setOtpError] = useState<string | null>(null)

    const emailForm = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: "" },
    })

    const otpForm = useForm<OTPFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    })

    const handleSendOTP = async (values: EmailFormValues) => {
        setEmail(values.email)
        // Simulate sending OTP
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setStep("otp")
    }

    const handleVerifyOTP = async (values: OTPFormValues) => {
        setOtpError(null)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (values.otp === "123456") {
            setStep("success")
            onAfterEmailVerification()
        } else {
            setOtpError("Invalid OTP. Please try again.")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
                    <CardDescription>
                        {step === "email"
                            ? "Enter your email to receive a verification code"
                            : step === "otp"
                                ? `We’ve sent a 6-digit OTP to ${email}`
                                : "Your email has been successfully verified!"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {step === "email" && (
                        <Form {...emailForm}>
                            <form
                                onSubmit={emailForm.handleSubmit(handleSendOTP)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={emailForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                Email Address
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your email"
                                                    disabled={emailForm.formState.isSubmitting}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={emailForm.formState.isSubmitting}
                                >
                                    {emailForm.formState.isSubmitting ? "Sending OTP..." : "Send OTP"}
                                </Button>
                            </form>
                        </Form>
                    )}

                    {step === "otp" && (
                        <Form {...otpForm}>
                            <form
                                onSubmit={otpForm.handleSubmit(handleVerifyOTP)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={otpForm.control}
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Shield className="h-4 w-4" />
                                                Verification Code
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex justify-center">
                                                    <InputOTP maxLength={6} {...field}>
                                                        <InputOTPGroup>
                                                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                                                <InputOTPSlot key={i} index={i} />
                                                            ))}
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-center" />
                                            {otpError && (
                                                <Alert className="mt-2 border-red-500 bg-red-50">
                                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                                    <AlertDescription className="text-red-800">
                                                        {otpError}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                            <p className="text-xs text-gray-500 text-center mt-2">
                                                Didn’t receive the code?{" "}
                                                <button
                                                    type="button"
                                                    className="text-blue-600 hover:text-blue-800 underline"
                                                    onClick={() => setStep("email")}
                                                >
                                                    Try again
                                                </button>
                                            </p>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={otpForm.formState.isSubmitting}
                                >
                                    {otpForm.formState.isSubmitting ? "Verifying..." : "Verify Email"}
                                </Button>
                            </form>
                            <p className="mt-4 text-center text-xs text-gray-500">
                                For demo, use OTP: <span className="font-mono font-semibold">123456</span>
                            </p>
                        </Form>
                    )}

                    {step === "success" && (
                        <div className="text-center py-4">
                            <Alert className="border-green-500 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    {`Email ${email} has been successfully verified!`}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
