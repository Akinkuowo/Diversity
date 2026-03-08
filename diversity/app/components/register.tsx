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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center space-x-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">DN</span>
                        </div>
                    </Link>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-4">
                        <div className={`flex items-center ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                1
                            </div>
                            <span className="ml-2 text-sm font-medium">Account</span>
                        </div>
                        <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`} />
                        <div className={`flex items-center ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                2
                            </div>
                            <span className="ml-2 text-sm font-medium">Role</span>
                        </div>
                        <div className={`w-12 h-0.5 ${currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`} />
                        <div className={`flex items-center ${currentStep >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                3
                            </div>
                            <span className="ml-2 text-sm font-medium">Consent</span>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {registrationError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600">{registrationError}</p>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <AnimatePresence mode="wait">
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Input
                                                id="firstName"
                                                {...register('firstName')}
                                                className={`pl-10 ${errors.firstName ? 'border-red-300' : ''}`}
                                                placeholder="John"
                                            />
                                        </div>
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Input
                                                id="lastName"
                                                {...register('lastName')}
                                                className={`pl-10 ${errors.lastName ? 'border-red-300' : ''}`}
                                                placeholder="Doe"
                                            />
                                        </div>
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register('email')}
                                            className={`pl-10 ${errors.email ? 'border-red-300' : ''}`}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            {...register('password')}
                                            className={`pl-10 pr-10 ${errors.password ? 'border-red-300' : ''}`}
                                            placeholder="••••••••"
                                            onFocus={() => setPasswordFocused(true)}
                                            onBlur={() => setPasswordFocused(false)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password Requirements */}
                                    {(passwordFocused || touchedFields.password) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-2 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <p className="text-xs font-medium text-gray-700 mb-2">Password requirements:</p>
                                            <ul className="space-y-1">
                                                {passwordRequirements.map((req, index) => (
                                                    <li key={index} className="flex items-center text-xs">
                                                        {req.regex.test(password) ? (
                                                            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                                        ) : (
                                                            <div className="w-3 h-3 rounded-full border border-gray-300 mr-2" />
                                                        )}
                                                        <span className={req.regex.test(password) ? 'text-green-600' : 'text-gray-500'}>
                                                            {req.label}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            {...register('confirmPassword')}
                                            className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-300' : ''}`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 mt-6"
                                >
                                    Continue
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </motion.div>
                        )}

                        {/* Step 2: Choose Role */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <p className="text-sm text-gray-600 text-center mb-4">
                                    Select how you want to participate in our community
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {roleOptions.map((role) => {
                                        const Icon = role.icon
                                        const isSelected = watch('role') === role.value

                                        return (
                                            <button
                                                key={role.value}
                                                type="button"
                                                onClick={() => setValue('role', role.value as any)}
                                                className={`p-4 rounded-xl border-2 transition-all ${isSelected
                                                    ? `border-${role.color}-500 bg-${role.color}-50`
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-lg bg-${role.color}-100 flex items-center justify-center mb-3 mx-auto`}>
                                                    <Icon className={`w-6 h-6 text-${role.color}-600`} />
                                                </div>
                                                <h3 className={`font-semibold text-gray-900 ${isSelected ? `text-${role.color}-700` : ''}`}>
                                                    {role.label}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                                            </button>
                                        )
                                    })}
                                </div>

                                {errors.role && (
                                    <p className="text-sm text-red-600 text-center">{errors.role.message}</p>
                                )}

                                <div className="flex space-x-3 mt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={prevStep}
                                        className="flex-1"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setCurrentStep(3)}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                                    >
                                        Continue
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Consent & Submit */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <h3 className="font-medium text-purple-900 mb-2">Review Your Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Name:</span> {watch('firstName')} {watch('lastName')}</p>
                                        <p><span className="font-medium">Email:</span> {watch('email')}</p>
                                        <p><span className="font-medium">Role:</span> {roleOptions.find(r => r.value === watch('role'))?.label}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <Checkbox
                                            id="gdpr"
                                            {...register('gdprConsent')}
                                        />
                                        <label htmlFor="gdpr" className="text-sm text-gray-600">
                                            I agree to the{' '}
                                            <Link href="/terms" className="text-purple-600 hover:underline">
                                                Terms of Service
                                            </Link>{' '}
                                            and{' '}
                                            <Link href="/privacy" className="text-purple-600 hover:underline">
                                                Privacy Policy
                                            </Link>
                                            . I consent to the processing of my personal data in accordance with GDPR.
                                        </label>
                                    </div>
                                    {errors.gdprConsent && (
                                        <p className="text-sm text-red-600">{errors.gdprConsent.message}</p>
                                    )}

                                    <div className="flex items-start space-x-3">
                                        <Checkbox
                                            id="marketing"
                                            {...register('marketingConsent')}
                                        />
                                        <label htmlFor="marketing" className="text-sm text-gray-600">
                                            I'd like to receive occasional updates about events, courses, and community news.
                                            You can unsubscribe at any time.
                                        </label>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <span className="font-medium">Note:</span> After registration, you'll receive a verification email.
                                        Please check your inbox and verify your email address to activate your account.
                                    </p>
                                </div>

                                <div className="flex space-x-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={prevStep}
                                        className="flex-1"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                                Creating account...
                                            </div>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
        </div>
    )
}