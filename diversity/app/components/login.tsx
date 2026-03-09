'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
    const router = useRouter()
    const { toast } = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        try {
            const response = await api.post('/login', {
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe
            })

            // Store token
            localStorage.setItem('token', response.token)
            localStorage.setItem('user', JSON.stringify(response.user))

            const roleRedirects: Record<string, string> = {
                ADMIN: '/admin/dashboard',
                VOLUNTEER: '/volunteer/dashboard',
                BUSINESS: '/business/dashboard',
                LEARNER: '/learner/dashboard',
                COMMUNITY_MEMBER: '/community/dashboard',
            }

            const redirectPath = roleRedirects[response.user.role as keyof typeof roleRedirects] || '/'

            toast({
                title: 'Login successful!',
                description: `Redirecting to your ${response.user.role.toLowerCase().replace('_', ' ')} dashboard...`,
            })

            router.push(redirectPath)
        } catch (error: any) {
            console.error('Login error:', error)
            toast({
                title: 'Login Failed',
                description: error.response?.data?.message || 'Invalid credentials',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50">
            {/* Left Side: Hero Section (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-900">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/diversity-hero.png"
                        alt="Diversity and Inclusion"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-900/40 to-transparent" />
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
                            Empowering every voice, everywhere.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-indigo-100/80 leading-relaxed"
                        >
                            Join a community dedicated to fostering inclusion, diversity, and equity across all professional landscapes.
                        </motion.p>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-indigo-200/60">
                        <span>© 2026 Diversity Network</span>
                        <span>•</span>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <span>•</span>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-y-auto">
                {/* Mobile Logo (Visible only on mobile) */}
                <div className="lg:hidden mb-8 text-center">
                    <Link href="/" className="inline-flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
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
                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-3 text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-600">
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

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                        Password
                                    </label>
                                    <Link href="/forgot-password" className="text-sm font-medium text-purple-600 hover:text-purple-500">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-600">
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
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 transition-colors" />
                                        ) : (
                                            <Eye className="h-5 w-5 transition-colors" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center">
                                        <span className="mr-1 inline-block w-1 h-1 bg-red-500 rounded-full" />
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                {...register('rememberMe')}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded-md transition-all cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2.5 block text-sm text-gray-600 cursor-pointer select-none">
                                Keep me signed in
                            </label>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 rounded-xl font-bold text-base shadow-lg shadow-purple-200 transition-all hover:scale-[1.01] active:scale-[0.99]"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                    Signing in...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    Sign In
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </div>
                            )}
                        </Button>
                    </form>

                    {/* Additional info/footer for mobile */}
                    <p className="mt-10 text-center text-xs text-gray-400 lg:hidden font-medium">
                        © 2026 Diversity Network. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}