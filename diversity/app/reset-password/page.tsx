'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import Navbar from '@/components/navbar'

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const { toast } = useToast()

    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        if (!token) {
            toast({
                title: 'Invalid Link',
                description: 'Password reset token is missing.',
                variant: 'destructive',
            })
            router.push('/login')
        }
    }, [token, router, toast])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    })

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true)
        try {
            await api.post('/reset-password', {
                token,
                password: data.password
            })
            setIsSuccess(true)
            toast({
                title: 'Success!',
                description: 'Your password has been reset successfully.',
            })
            setTimeout(() => router.push('/login'), 3000)
        } catch (error: any) {
            console.error('Reset password error:', error)
            toast({
                title: 'Reset Failed',
                description: error.response?.data?.message || 'Invalid or expired token.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (!token) return null

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
                            Secure your access.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-secondary-100/80 leading-relaxed"
                        >
                            Update your password to keep your account safe and continue building a more inclusive professional world.
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

            {/* Right Side: Reset Password Form */}
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
                    {!isSuccess ? (
                        <>
                            <div className="mb-10 text-center lg:text-left">
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                    Reset Password
                                </h1>
                                <p className="mt-3 text-gray-600">
                                    Set a unique password to protect your account.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-secondary-600">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                {...register('password')}
                                                className={`pl-11 pr-12 h-12 bg-white border-gray-200 focus:bg-white transition-all rounded-xl ${errors.password ? 'border-red-500 bg-red-50/30' : 'hover:border-gray-300'}`}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center">
                                                <span className="mr-1 inline-block w-1 h-1 bg-red-500 rounded-full" />
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-secondary-600">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                {...register('confirmPassword')}
                                                className={`pl-11 pr-12 h-12 bg-white border-gray-200 focus:bg-white transition-all rounded-xl ${errors.confirmPassword ? 'border-red-500 bg-red-50/30' : 'hover:border-gray-300'}`}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center">
                                                <span className="mr-1 inline-block w-1 h-1 bg-red-500 rounded-full" />
                                                {errors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-primary-600 text-white hover:from-secondary-700 hover:to-secondary-700 rounded-xl font-bold text-base shadow-lg shadow-secondary-200 transition-all hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                            Resetting...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            Set New Password
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Password updated!</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Your password has been successfully reset. Redirecting you to login...
                            </p>
                            <Link href="/login" className="w-full">
                                <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
                                    Go to Login now
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
