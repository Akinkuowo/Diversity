'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { api } from '@/lib/api'

const registerSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    gdprConsent: z.boolean().refine(val => val === true, {
        message: 'You must accept the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

const passwordRequirements = [
    { regex: /.{8,}/, label: 'At least 8 characters' },
    { regex: /[A-Z]/, label: 'One uppercase letter' },
    { regex: /[a-z]/, label: 'One lowercase letter' },
    { regex: /[0-9]/, label: 'One number' },
]

export default function AdminRegisterForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [registrationError, setRegistrationError] = useState<string | null>(null)
    const [currentStep, setCurrentStep] = useState(1)
    const [passwordFocused, setPasswordFocused] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, touchedFields },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            gdprConsent: false,
        },
    })

    const password = watch('password')

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)
        setRegistrationError(null)

        try {
            await api.post('/register', {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                role: 'ADMIN', // Force role to ADMIN
            })

            toast.success('Admin account created!', {
                description: 'Please check your email to verify your account.',
            })

            router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
        } catch (error: any) {
            console.error('Registration error:', error)
            const message = error.response?.data?.message || 'Something went wrong during registration.'
            setRegistrationError(message)
            toast.error('Registration Failed', {
                description: message,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const nextStep = () => {
        if (currentStep === 1) {
            if (watch('firstName') && watch('lastName') && watch('email')) {
                setCurrentStep(2)
            } else {
                toast.error('Required Details Missing', {
                    description: 'Please fill in your name and email to proceed.',
                })
            }
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
                                Join the <span className="text-primary-400">Admin</span> Elite.
                            </h1>
                            <div className="h-1 w-12 bg-primary-500 rounded-full mb-6" />
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-slate-400 leading-relaxed"
                        >
                            Establish your administrative credentials to start managing the Diversity Network ecosystem.
                        </motion.p>
                    </div>

                    <div className="text-sm text-slate-500 font-medium">
                        © 2026 Diversity Network • Admin Portal v1.0
                    </div>
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="flex-1 flex flex-col items-center py-12 lg:py-20 px-6 lg:px-12 bg-slate-950 overflow-y-auto min-h-screen">
                <div className="w-full max-w-xl">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="lg:hidden mb-6 flex justify-center">
                           <ShieldCheck className="w-12 h-12 text-primary-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                            Create Admin Credentials
                        </h2>
                        <p className="text-slate-400 font-medium">
                            Already have an admin account?{' '}
                            <Link href="/admin/login" className="font-bold text-primary-400 hover:text-primary-300 transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between px-2">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex flex-col items-center relative flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all z-10 shadow-sm ${currentStep >= step
                                        ? 'bg-primary-600 text-white ring-4 ring-primary-950'
                                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                                        }`}>
                                        {step}
                                    </div>
                                    <span className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${currentStep >= step ? 'text-primary-400' : 'text-slate-600'
                                        }`}>
                                        {step === 1 ? 'Personal' : step === 2 ? 'Security' : 'Confirm'}
                                    </span>
                                    {step < 3 && (
                                        <div className={`absolute top-5 left-1/2 w-full h-[1px] -z-0 ${currentStep > step ? 'bg-primary-600' : 'bg-slate-800'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {registrationError && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start space-x-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-red-400">{registrationError}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="pb-10">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-300">First Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                                <Input
                                                    {...register('firstName')}
                                                    className="pl-11 h-12 bg-slate-900 border-slate-800 focus:border-primary-500 text-white rounded-xl placeholder:text-slate-600"
                                                    placeholder="First name"
                                                />
                                            </div>
                                            {errors.firstName && <p className="text-xs font-bold text-red-400">{errors.firstName.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-300">Last Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                                <Input
                                                    {...register('lastName')}
                                                    className="pl-11 h-12 bg-slate-900 border-slate-800 focus:border-primary-500 text-white rounded-xl placeholder:text-slate-600"
                                                    placeholder="Last name"
                                                />
                                            </div>
                                            {errors.lastName && <p className="text-xs font-bold text-red-400">{errors.lastName.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                            <Input
                                                type="email"
                                                {...register('email')}
                                                className="pl-11 h-12 bg-slate-900 border-slate-800 focus:border-primary-500 text-white rounded-xl placeholder:text-slate-600"
                                                placeholder="admin@diversity.com"
                                            />
                                        </div>
                                        {errors.email && <p className="text-xs font-bold text-red-400">{errors.email.message}</p>}
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="w-full h-12 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-base mt-6 shadow-lg shadow-primary-950/40"
                                    >
                                        Security Setup
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Admin Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                {...register('password')}
                                                className="pl-11 pr-12 h-12 bg-slate-900 border-slate-800 focus:border-primary-500 text-white rounded-xl placeholder:text-slate-600"
                                                placeholder="Enter secure password"
                                                onFocus={() => setPasswordFocused(true)}
                                                onBlur={() => setPasswordFocused(false)}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {(passwordFocused || (password && touchedFields.password)) && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl grid grid-cols-2 gap-2 mt-2">
                                                        {passwordRequirements.map((req, index) => {
                                                            const isMet = req.regex.test(password || '')
                                                            return (
                                                                <div key={index} className="flex items-center space-x-2">
                                                                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${isMet ? 'bg-green-500' : 'bg-slate-800'
                                                                        }`}>
                                                                        <CheckCircle className={`w-2 h-2 text-white ${isMet ? 'opacity-100' : 'opacity-0'}`} />
                                                                    </div>
                                                                    <span className={`text-[10px] font-bold ${isMet ? 'text-green-500' : 'text-slate-500'}`}>
                                                                        {req.label}
                                                                    </span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        {errors.password && <p className="text-xs font-bold text-red-400">{errors.password.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Confirm Admin Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                            <Input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                {...register('confirmPassword')}
                                                className="pl-11 pr-12 h-12 bg-slate-900 border-slate-800 focus:border-primary-500 text-white rounded-xl placeholder:text-slate-600"
                                                placeholder="Repeat matching password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="text-xs font-bold text-red-400">{errors.confirmPassword.message}</p>}
                                    </div>

                                    <div className="flex space-x-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setCurrentStep(1)}
                                            className="flex-1 h-12 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-slate-300"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setCurrentStep(3)}
                                            className="flex-1 h-12 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary-950/40"
                                        >
                                            Final Confirmation
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                                        <h3 className="font-bold text-white mb-4 flex items-center uppercase tracking-widest text-xs">
                                            <ShieldCheck className="w-5 h-5 text-primary-400 mr-2" />
                                            Administrative Credentials
                                        </h3>
                                        <div className="grid grid-cols-1 gap-y-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mb-1">Full Name</p>
                                                <p className="text-white font-bold">{watch('firstName')} {watch('lastName')}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mb-1">Assigned Role</p>
                                                <p className="text-primary-400 font-bold">SYSTEM ADMINISTRATOR</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mb-1">Admin Email</p>
                                                <p className="text-white font-bold">{watch('email')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 px-1">
                                        <div className="flex items-start bg-slate-900/40 p-4 rounded-xl border border-slate-800 hover:bg-slate-900/60 transition-colors cursor-pointer group">
                                            <Checkbox
                                                id="gdpr"
                                                checked={watch('gdprConsent')}
                                                onCheckedChange={(checked) => setValue('gdprConsent', checked === true)}
                                                className="mt-1 border-slate-700 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
                                            />
                                            <label htmlFor="gdpr" className="ml-4 text-[12px] text-slate-400 font-medium leading-relaxed select-none cursor-pointer">
                                                I certify that I am authorized to perform administrative actions on this platform and agree to the {' '}
                                                <Link href="/terms" className="text-primary-400 font-bold hover:underline">Compliance & Terms</Link>.
                                            </label>
                                        </div>
                                        {errors.gdprConsent && <p className="text-xs font-bold text-red-400">{errors.gdprConsent.message}</p>}
                                    </div>

                                    <div className="flex space-x-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setCurrentStep(2)}
                                            className="flex-1 h-12 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-slate-300"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-[2] h-12 bg-primary-600 text-white hover:bg-primary-500 rounded-xl font-bold shadow-lg shadow-primary-950/40"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                                    Provisioning...
                                                </div>
                                            ) : (
                                                'Initialize Admin Account'
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-tighter mt-4">
                        System Identity Management Service • SECURED
                    </p>
                </div>
            </div>
        </div>
    )
}
