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
    ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { api } from '@/lib/api'

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function AdminLoginForm() {
    const router = useRouter()
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

            if (response.user.role !== 'ADMIN') {
                toast.error('Access Denied', {
                    description: 'This portal is restricted to administrators only.',
                })
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                return
            }

            toast.success('Admin Login successful!', {
                description: `Welcome back to the command center.`,
            })

            router.push('/admin/dashboard')
        } catch (error: any) {
            console.error('Login error:', error)
            toast.error('Login Failed', {
                description: error.response?.data?.message || 'Invalid email or password.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-white">
            {/* Left Side: Admin Hero */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 border-r border-slate-800">
                <div className="absolute inset-0 z-0 opacity-20">
                    <img
                        src="/images/diversity-hero.png"
                        alt="Diversity Admin"
                        className="w-full h-full object-cover grayscale"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-transparent z-10" />

                <div className="relative z-20 w-full flex flex-col justify-between p-12">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                            <ShieldCheck className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Diversity Admin</span>
                    </Link>

                    <div className="max-w-md">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-4xl font-extrabold leading-tight mb-4">
                                Control Center for <span className="text-primary-400">Diversity Network</span>
                            </h1>
                            <div className="h-1 w-12 bg-primary-500 rounded-full mb-6" />
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-slate-400 leading-relaxed"
                        >
                            Secure administrative portal for managing users, content, and organizational impact across the network.
                        </motion.p>
                    </div>

                    <div className="text-sm text-slate-500 font-medium">
                        © 2026 Diversity Network • Admin Portal v1.0
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 bg-slate-950">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10">
                        <div className="lg:hidden mb-6">
                           <ShieldCheck className="w-12 h-12 text-primary-500 mb-4" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            Admin Authentication
                        </h2>
                        <p className="mt-3 text-slate-400 font-medium">
                            Authorized personnel only. Please sign in.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                                    Email address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary-400 transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register('email')}
                                        className={`pl-11 h-12 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:ring-primary-500/20 focus:border-primary-500 transition-all rounded-xl ${errors.email ? 'border-red-500/50 bg-red-500/5' : ''}`}
                                        placeholder="admin@diversity.com"
                                    />
                                </div>
                                {errors.email && <p className="mt-1.5 text-xs font-bold text-red-400">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary-400 transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        className={`pl-11 pr-12 h-12 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:ring-primary-500/20 focus:border-primary-500 transition-all rounded-xl ${errors.password ? 'border-red-500/50 bg-red-500/5' : ''}`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1.5 text-xs font-bold text-red-400">{errors.password.message}</p>}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    {...register('rememberMe')}
                                    className="h-4 w-4 bg-slate-900 border-slate-800 text-primary-600 focus:ring-primary-500 rounded transition-all cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2.5 block text-sm text-slate-400 cursor-pointer select-none">
                                    Trust this device
                                </label>
                            </div>
                            <Link href="/forgot-password" title="Coming Soon" className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
                                Reset Password
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-base shadow-lg shadow-primary-950/20 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                    Verifying...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    Secure Login
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <p className="mt-12 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-loose">
                        Warning: Unauthorized access to this system is prohibited and may be subject to legal action. IP addresses are logged.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
