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
    Building2,
    Heart,
    GraduationCap,
    Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
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
    role: z.enum(['VOLUNTEER', 'BUSINESS', 'LEARNER', 'COMMUNITY_MEMBER']),
    gdprConsent: z.boolean().refine(val => val === true, {
        message: 'You must accept the terms and conditions',
    }),
    marketingConsent: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

const roleOptions = [
    {
        value: 'VOLUNTEER',
        label: 'Volunteer',
        icon: Heart,
        description: 'Find meaningful opportunities to give back',
        color: 'pink',
    },
    {
        value: 'BUSINESS',
        label: 'Business',
        icon: Building2,
        description: 'Showcase your commitment to diversity',
        color: 'purple',
    },
    {
        value: 'LEARNER',
        label: 'Learner',
        icon: GraduationCap,
        description: 'Access EDI courses and certifications',
        color: 'green',
    },
    {
        value: 'COMMUNITY_MEMBER',
        label: 'Community Member',
        icon: Users,
        description: 'Join events and connect with others',
        color: 'blue',
    },
]

const passwordRequirements = [
    { regex: /.{8,}/, label: 'At least 8 characters' },
    { regex: /[A-Z]/, label: 'One uppercase letter' },
    { regex: /[a-z]/, label: 'One lowercase letter' },
    { regex: /[0-9]/, label: 'One number' },
]

export default function RegisterPage() {
    const router = useRouter()
    const { toast } = useToast()
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
            role: 'COMMUNITY_MEMBER',
            gdprConsent: false,
            marketingConsent: false,
        },
    })

    const password = watch('password')

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)
        setRegistrationError(null)

        try {
            const response = await api.post('/register', {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                role: data.role,
            })

            toast({
                title: 'Registration successful!',
                description: 'Please check your email to verify your account.',
                duration: 6000,
            })

            // Redirect to verification page
            router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
        } catch (error: any) {
            console.error('Registration error:', error)

            if (error.response?.status === 400 && error.response?.data?.message === 'User already exists') {
                setRegistrationError('An account with this email already exists')
            } else {
                setRegistrationError('An error occurred during registration. Please try again.')
            }

            toast({
                title: 'Registration Failed',
                description: error.response?.data?.message || 'Something went wrong',
                variant: 'destructive',
                duration: 5000,
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
                toast({
                    title: 'Please fill in all fields',
                    description: 'Complete the required information to continue.',
                    variant: 'destructive',
                })
            }
        }
    }

    const prevStep = () => {
        setCurrentStep(1)
    }

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50">
            {/* Left Side: Hero Section (Fixed/Sticky on large screens) */}
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
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-5xl font-bold leading-tight mb-6">
                                Shape a more inclusive world.
                            </h1>
                            <div className="h-1 w-20 bg-gradient-to-r from-purple-400 to-indigo-400 mb-8 rounded-full" />
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-indigo-100/80 leading-relaxed mb-10"
                        >
                            Join thousands of organizations and individuals building equitable spaces where everyone belongs.
                        </motion.p>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-indigo-200/60 font-medium">
                        <p>© 2026 Diversity Network</p>
                        <div className="flex space-x-4">
                            <Link href="#" className="hover:text-white transition-colors">Facebook</Link>
                            <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
                            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
                        </div>
                    </div>
                </div>

                <div className="absolute top-1/4 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
            </div>

            {/* Right Side: Registration Form */}
            <div className="flex-1 flex flex-col items-center py-12 lg:py-20 px-6 lg:px-12 relative overflow-y-auto min-h-screen">
                {/* Mobile Logo */}
                <div className="lg:hidden mb-12 text-center w-full">
                    <Link href="/" className="inline-flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-2xl">DN</span>
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Diversity Network</h1>
                </div>

                <div className="w-full max-w-xl">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                            Create your account
                        </h2>
                        <p className="text-gray-600">
                            Already a member?{' '}
                            <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors">
                                Sign in instead
                            </Link>
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between px-2">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex flex-col items-center relative flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all z-10 shadow-sm ${currentStep >= step
                                        ? 'bg-purple-600 text-white ring-4 ring-purple-100'
                                        : 'bg-white text-gray-400 border border-gray-200'
                                        }`}>
                                        {step}
                                    </div>
                                    <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${currentStep >= step ? 'text-purple-600' : 'text-gray-400'
                                        }`}>
                                        {step === 1 ? 'Details' : step === 2 ? 'Role' : 'Consent'}
                                    </span>
                                    {step < 3 && (
                                        <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-0 ${currentStep > step ? 'bg-purple-600' : 'bg-gray-100'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Error Alert */}
                    {registrationError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 flex items-start space-x-3 shadow-sm"
                        >
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-red-700">{registrationError}</p>
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
                                            <label className="text-sm font-semibold text-gray-700">First Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                                <Input
                                                    {...register('firstName')}
                                                    className="pl-11 h-12 bg-white rounded-xl border-gray-200 focus:ring-purple-500 transition-all font-medium"
                                                    placeholder="First name"
                                                />
                                            </div>
                                            {errors.firstName && <p className="text-xs font-bold text-red-500 pl-1">{errors.firstName.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                                <Input
                                                    {...register('lastName')}
                                                    className="pl-11 h-12 bg-white rounded-xl border-gray-200 focus:ring-purple-500 transition-all font-medium"
                                                    placeholder="Last name"
                                                />
                                            </div>
                                            {errors.lastName && <p className="text-xs font-bold text-red-500 pl-1">{errors.lastName.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                            <Input
                                                type="email"
                                                {...register('email')}
                                                className="pl-11 h-12 bg-white rounded-xl border-gray-200 focus:ring-purple-500 transition-all font-medium"
                                                placeholder="example@email.com"
                                            />
                                        </div>
                                        {errors.email && <p className="text-xs font-bold text-red-500 pl-1">{errors.email.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                {...register('password')}
                                                className="pl-11 pr-12 h-12 bg-white rounded-xl border-gray-200 focus:ring-purple-500 transition-all font-medium"
                                                placeholder="Create password"
                                                onFocus={() => setPasswordFocused(true)}
                                                onBlur={() => setPasswordFocused(false)}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>

                                        {/* Password requirements inline help */}
                                        <AnimatePresence>
                                            {(passwordFocused || (password && touchedFields.password)) && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl grid grid-cols-2 gap-2 mt-2">
                                                        {passwordRequirements.map((req, index) => {
                                                            const isMet = req.regex.test(password || '')
                                                            return (
                                                                <div key={index} className="flex items-center space-x-2">
                                                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${isMet ? 'bg-green-500' : 'bg-slate-200'
                                                                        }`}>
                                                                        <CheckCircle className={`w-2.5 h-2.5 text-white ${isMet ? 'opacity-100' : 'opacity-0'}`} />
                                                                    </div>
                                                                    <span className={`text-[11px] font-bold ${isMet ? 'text-green-700' : 'text-slate-500'}`}>
                                                                        {req.label}
                                                                    </span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        {errors.password && <p className="text-xs font-bold text-red-500 pl-1">{errors.password.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                            <Input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                {...register('confirmPassword')}
                                                className="pl-11 pr-12 h-12 bg-white rounded-xl border-gray-200 focus:ring-purple-500 transition-all font-medium"
                                                placeholder="Confirm password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="text-xs font-bold text-red-500 pl-1">{errors.confirmPassword.message}</p>}
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] font-bold text-base mt-6"
                                    >
                                        Continue to Next Step
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
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {roleOptions.map((role) => {
                                            const Icon = role.icon
                                            const isSelected = watch('role') === role.value
                                            return (
                                                <button
                                                    key={role.value}
                                                    type="button"
                                                    onClick={() => setValue('role', role.value as any)}
                                                    className={`p-5 rounded-2xl border-2 transition-all text-left flex flex-col h-full ring-offset-2 ring-purple-500 ${isSelected
                                                        ? 'border-purple-600 bg-purple-50/50 ring-2'
                                                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm ${isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <h3 className={`font-bold text-base mb-1 ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                                                        {role.label}
                                                    </h3>
                                                    <p className={`text-xs font-medium leading-relaxed ${isSelected ? 'text-purple-600' : 'text-slate-500'}`}>
                                                        {role.description}
                                                    </p>
                                                </button>
                                            )
                                        })}
                                    </div>

                                    <div className="flex space-x-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={prevStep}
                                            className="flex-1 h-12 rounded-xl font-bold bg-slate-100 hover:bg-slate-200"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setCurrentStep(3)}
                                            className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg ring-offset-2 ring-purple-600 transition-all active:scale-95 font-bold"
                                        >
                                            Final Step
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
                                    <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 shadow-sm">
                                        <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                            Summary Review
                                        </h3>
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                            <div>
                                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-0.5">Full Name</p>
                                                <p className="text-slate-900 font-bold">{watch('firstName')} {watch('lastName')}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-0.5">Role Selected</p>
                                                <p className="text-slate-900 font-bold">{roleOptions.find(r => r.value === watch('role'))?.label}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-0.5">Email Address</p>
                                                <p className="text-slate-900 font-bold">{watch('email')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-5 px-1 py-1">
                                        <div className="flex items-start bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-white transition-colors cursor-pointer group">
                                            <Checkbox
                                                id="gdpr"
                                                checked={watch('gdprConsent')}
                                                onCheckedChange={(checked) => setValue('gdprConsent', checked === true)}
                                                className="mt-1 transition-all group-hover:scale-110"
                                            />
                                            <label htmlFor="gdpr" className="ml-4 text-[13px] text-slate-600 font-medium leading-relaxed select-none cursor-pointer">
                                                I confirm that I have read and agree to the {' '}
                                                <Link href="/terms" className="text-purple-600 font-bold underline-offset-4 hover:underline">Terms of Service</Link>
                                                {' '} and {' '}
                                                <Link href="/privacy" className="text-purple-600 font-bold underline-offset-4 hover:underline">Privacy Policy</Link>.
                                            </label>
                                        </div>
                                        {errors.gdprConsent && <p className="text-xs font-bold text-red-500 pl-1">{errors.gdprConsent.message}</p>}

                                        <div className="flex items-start group cursor-pointer p-4 hover:bg-slate-50 rounded-xl transition-colors">
                                            <Checkbox
                                                id="marketing"
                                                checked={watch('marketingConsent')}
                                                onCheckedChange={(checked) => setValue('marketingConsent', checked === true)}
                                                className="mt-1 transition-all group-hover:scale-110 border-slate-300"
                                            />
                                            <label htmlFor="marketing" className="ml-4 text-[13px] text-slate-500 font-medium leading-relaxed select-none cursor-pointer">
                                                I'd love to stay informed! Sign me up for community updates, inclusive events, and EDI resources.
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex space-x-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={prevStep}
                                            className="flex-1 h-12 rounded-xl font-bold bg-slate-100"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-[2] h-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-purple-200 font-bold"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                                    Processing...
                                                </div>
                                            ) : (
                                                'Create My Account'
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <p className="mt-8 text-center text-xs text-gray-400 font-medium">
                        By registering, you support a more diverse professional world.
                        <br />© 2026 Diversity Network.
                    </p>
                </div>
            </div>
        </div>
    )
}
