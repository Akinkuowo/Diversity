'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import Navbar from '@/components/navbar'

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true)
        try {
            await api.post('/forgot-password', data)
            setIsSubmitted(true)
            toast({
                title: 'Email Sent',
                description: 'If an account exists, you will receive a reset link shortly.',
            })
        } catch (error: any) {
            console.error('Forgot password error:', error)
            toast({
                title: 'Request Failed',
                description: error.response?.data?.message || 'Something went wrong. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50">
            <Navbar />

            {/* Left Side: Hero Section (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-secondary-900">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/diversity-hero.png"
                        alt="Diversity and Inclusion"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-primary-950" />
                </div>

                <div className="relative z-10 w-full flex flex-col justify-between p-12 text-white">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                            <span className="text-white font-bold text-xl">DN</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">Diversity Network</span>
                    </Link>

                    <div className="max-w-md">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl font-bold leading-tight mb-6"
                        >
                            Reconnect with your community.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-secondary-100/80 leading-relaxed"
                        >
                            Reset your password to continue your journey in fostering inclusion and equity everywhere.
                        </motion.p>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-secondary-200/60">
                        <span>© 2026 Diversity Network</span>
                        <span>•</span>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <span>•</span>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 -right-20 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl" />
            </div>

            {/* Right Side: Forgot Password Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-y-auto">
                {/* Mobile Logo (Visible only on mobile) */}
                <div className="lg:hidden mb-8 text-center pt-20">
                    <Link href="/" className="inline-flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-2xl">DN</span>
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Diversity Network</h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {!isSubmitted ? (
                        <>
                            <div className="mb-10">
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                    Forgot Password?
                                </h2>
                                <p className="mt-3 text-gray-600">
                                    No worries, we'll send you reset instructions to your email address.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-secondary-600">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register('email')}
                                            className={`pl-11 h-12 bg-white border-gray-200 focus:bg-white transition-all rounded-xl ${errors.email ? 'border-red-500 bg-red-50/30' : 'hover:border-gray-300'}`}
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center">
                                            <span className="mr-1 inline-block w-1 h-1 bg-red-500 rounded-full" />
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-primary-600 text-white hover:from-secondary-700 hover:to-secondary-700 rounded-xl font-bold text-base shadow-lg shadow-secondary-200 transition-all hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                            Sending...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            Reset Password
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </div>
                                    )}
                                </Button>

                                <div className="text-center">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-secondary-600 transition-colors"
                                    >
                                        <ArrowLeft className="mr-2 w-4 h-4" />
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                            </p>
                            <Link href="/login" className="w-full">
                                <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
                                    Return to Login
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Additional info/footer for mobile */}
                    <p className="mt-10 text-center text-xs text-gray-400 lg:hidden font-medium">
                        © 2026 Diversity Network. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
