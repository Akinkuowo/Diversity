'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    CreditCard,
    CheckCircle2,
    Star,
    Zap,
    Shield,
    Download,
    Clock,
    AlertCircle,
    ChevronRight,
    Sparkles,
    Crown,
    Lock,
    Package,
} from 'lucide-react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const PLANS = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        period: 'forever',
        description: 'Great for individuals just getting started.',
        icon: <Star className="w-5 h-5" />,
        color: 'border-gray-200',
        badgeColor: 'bg-gray-100 text-gray-600',
        features: [
            'Community forum access',
            'Basic profile',
            'Up to 3 posts/week',
            'View public events',
        ],
        missing: ['Advanced analytics', 'Priority support', 'Unlimited posts', 'Business directory'],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 9.99,
        period: 'month',
        description: 'For active community members who want more.',
        icon: <Zap className="w-5 h-5 text-primary-600" />,
        color: 'border-primary-500 ring-2 ring-primary-500/30',
        badgeColor: 'bg-primary-100 text-primary-700',
        badge: 'Most Popular',
        features: [
            'Everything in Free',
            'Unlimited posts',
            'Event creation & hosting',
            'Advanced analytics',
            'Priority support',
            'Early access to features',
        ],
        missing: ['Business directory', 'Custom branding'],
    },
    {
        id: 'business',
        name: 'Business',
        price: 29.99,
        period: 'month',
        description: 'For organisations driving meaningful impact.',
        icon: <Crown className="w-5 h-5 text-secondary-600" />,
        color: 'border-secondary-400 ring-2 ring-secondary-400/20',
        badgeColor: 'bg-secondary-100 text-secondary-700',
        features: [
            'Everything in Pro',
            'Business directory listing',
            'Custom branding & logo',
            'Team accounts (up to 10)',
            'Dedicated account manager',
            'API access',
            'CSR reporting dashboard',
        ],
        missing: [],
    },
]

const MOCK_INVOICES = [
    { id: 'INV-001', date: 'Mar 1, 2026', amount: '$9.99', status: 'Paid', plan: 'Pro' },
    { id: 'INV-002', date: 'Feb 1, 2026', amount: '$9.99', status: 'Paid', plan: 'Pro' },
    { id: 'INV-003', date: 'Jan 1, 2026', amount: '$9.99', status: 'Paid', plan: 'Pro' },
    { id: 'INV-004', date: 'Dec 1, 2025', amount: '$0.00', status: 'Free', plan: 'Free' },
]

export default function BillingPage() {
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [currentPlan, setCurrentPlan] = useState<string>('free')
    const [isYearly, setIsYearly] = useState(false)
    const [showCardForm, setShowCardForm] = useState(false)
    const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '', cvc: '' })
    const [savingCard, setSavingCard] = useState(false)
    const [upgrading, setUpgrading] = useState<string | null>(null)
    const router = useRouter()

    const [plans, setPlans] = useState<any[]>([])

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await api.get('/billing-packages')
                setPlans(data)
            } catch (error) {
                console.error('Failed to fetch plans:', error)
            }
        }
        fetchPlans()
    }, [])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const saved = localStorage.getItem('user')
                if (saved) setUser(JSON.parse(saved))
                const userData = await api.get('/me')
                setUser(userData)
                localStorage.setItem('user', JSON.stringify(userData))
            } catch {
                router.push('/login')
            } finally {
                setIsLoading(false)
            }
        }
        fetchUser()
    }, [router])

    const iconMap: Record<string, React.ReactNode> = {
        free: <Star className="w-5 h-5" />,
        pro: <Zap className="w-5 h-5 text-primary-600" />,
        business: <Crown className="w-5 h-5 text-secondary-600" />,
    }

    const colorMap: Record<string, string> = {
        free: 'border-gray-200',
        pro: 'border-primary-500 ring-2 ring-primary-500/30',
        business: 'border-secondary-400 ring-2 ring-secondary-400/20',
    }

    const badgeColorMap: Record<string, string> = {
        free: 'bg-gray-100 text-gray-600',
        pro: 'bg-primary-100 text-primary-700',
        business: 'bg-secondary-100 text-secondary-700',
    }

    const handleUpgrade = async (planId: string) => {
        if (planId === currentPlan) return
        setUpgrading(planId)
        // Simulate API call
        await new Promise(r => setTimeout(r, 1200))
        setCurrentPlan(planId)
        setUpgrading(null)
        toast.success(`Successfully ${planId === 'free' ? 'downgraded to Free' : `upgraded to ${planId.charAt(0).toUpperCase() + planId.slice(1)}`}!`)
    }

    const handleSaveCard = async () => {
        if (!cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvc) {
            return toast.error('Please fill in all card fields.')
        }
        setSavingCard(true)
        await new Promise(r => setTimeout(r, 1000))
        setSavingCard(false)
        setShowCardForm(false)
        setCardForm({ number: '', name: '', expiry: '', cvc: '' })
        toast.success('Payment method saved!')
    }

    const formatCardNumber = (val: string) =>
        val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

    const formatExpiry = (val: string) =>
        val.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/')

    if (isLoading && !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
        )
    }

    const role = user?.role || 'COMMUNITY_MEMBER'
    const currentPlanData = PLANS.find(p => p.id === currentPlan)!

    return (
        <DashboardLayout role={role}>
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Plans</h1>
                    <p className="text-gray-500 mt-1">Manage your subscription, payment methods, and invoices.</p>
                </div>

                {/* Current Plan Banner */}
                {plans.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="border-none shadow-md bg-gradient-to-br from-primary-600 to-[#006666] text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                            {iconMap[currentPlan] || <Zap className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="text-white/70 text-sm">Current Plan</p>
                                            <h2 className="text-2xl font-bold">
                                                {plans.find(p => p.id === currentPlan)?.name || 'Basic'}
                                            </h2>
                                            {currentPlan !== 'free' && (
                                                <p className="text-white/70 text-sm">
                                                    Next billing on <span className="text-white font-medium">April 1, 2026</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold">
                                            ${plans.find(p => p.id === currentPlan)?.price || 0}
                                            {currentPlan !== 'free' && <span className="text-lg font-normal text-white/70">/mo</span>}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Plans */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Choose a Plan</h2>
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-full p-1">
                            <button
                                onClick={() => setIsYearly(false)}
                                className={`text-sm font-medium px-4 py-1.5 rounded-full transition-all ${!isYearly ? 'bg-white dark:bg-slate-700 shadow text-gray-900 dark:text-white' : 'text-gray-500'}`}
                            >Monthly</button>
                            <button
                                onClick={() => setIsYearly(true)}
                                className={`text-sm font-medium px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${isYearly ? 'bg-white dark:bg-slate-700 shadow text-gray-900 dark:text-white' : 'text-gray-500'}`}
                            >
                                Yearly
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">-20%</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {plans.map((plan, i) => {
                            const price = isYearly && plan.price > 0 && plan.yearlyPrice
                                ? (plan.yearlyPrice / 12).toFixed(2)
                                : plan.price.toFixed(2)
                            const isCurrent = currentPlan === plan.id
                            const planIcon = iconMap[plan.name.toLowerCase()] || <Package className="w-5 h-5" />
                            const planColor = colorMap[plan.name.toLowerCase()] || 'border-gray-200'
                            const badgeColor = badgeColorMap[plan.name.toLowerCase()] || 'bg-gray-100 text-gray-600'

                            return (
                                <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.07 }}
                                >
                                    <Card className={`border-2 ${planColor} shadow-md h-full flex flex-col relative overflow-hidden`}>
                                        {plan.isPopular && (
                                            <div className="absolute top-4 right-4">
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-primary-100 text-primary-700`}>
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}
                                        {plan.badge && !plan.isPopular && (
                                            <div className="absolute top-4 right-4">
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>
                                                    {plan.badge}
                                                </span>
                                            </div>
                                        )}
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${badgeColor}`}>
                                                    {planIcon}
                                                </span>
                                                <CardTitle className="text-lg">{plan.name}</CardTitle>
                                            </div>
                                            <div className="mt-2">
                                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                                    ${price}
                                                </span>
                                                {plan.price > 0 && (
                                                    <span className="text-gray-400 text-sm ml-1">
                                                        /{isYearly ? 'mo, billed yearly' : plan.interval}
                                                    </span>
                                                )}
                                                {plan.price === 0 && (
                                                    <span className="text-gray-400 text-sm ml-1">/forever</span>
                                                )}
                                            </div>
                                            <CardDescription className="mt-1">{plan.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col gap-4">
                                            <ul className="space-y-2.5">
                                                {plan.features.map((f: string) => (
                                                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                        <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-auto pt-4">
                                                <Button
                                                    className={`w-full ${isCurrent
                                                        ? 'bg-gray-100 dark:bg-slate-800 text-gray-500 cursor-not-allowed'
                                                        : plan.name.toLowerCase() === 'business'
                                                            ? 'bg-secondary-600 hover:bg-secondary-700 text-white'
                                                            : 'bg-primary-600 hover:bg-primary-700 text-white'
                                                        }`}
                                                    disabled={isCurrent || upgrading === plan.id}
                                                    onClick={() => handleUpgrade(plan.id)}
                                                >
                                                    {upgrading === plan.id ? (
                                                        <span className="flex items-center gap-2">
                                                            <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                                            Processing...
                                                        </span>
                                                    ) : isCurrent ? (
                                                        'Current Plan'
                                                    ) : (
                                                        <span className="flex items-center gap-2">
                                                            <Sparkles className="w-4 h-4" />
                                                            Upgrade to {plan.name}
                                                        </span>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* Payment Method */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <CreditCard className="w-5 h-5 text-primary-500" />
                                        Payment Method
                                    </CardTitle>
                                    <CardDescription>Manage your saved payment methods.</CardDescription>
                                </div>
                                {!showCardForm && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowCardForm(true)}
                                    >
                                        + Add Card
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Existing placeholder card */}
                            {currentPlan !== 'free' && (
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">VISA</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">•••• •••• •••• 4242</p>
                                            <p className="text-xs text-gray-500">Expires 12/27</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Default</span>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs">Remove</Button>
                                    </div>
                                </div>
                            )}
                            {currentPlan === 'free' && !showCardForm && (
                                <div className="text-center py-8 text-gray-400">
                                    <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">No payment method saved.</p>
                                    <p className="text-xs mt-1">Add a card to upgrade your plan.</p>
                                </div>
                            )}

                            {/* Add Card Form */}
                            {showCardForm && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Lock className="w-4 h-4 text-gray-400" />
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Secure card details</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Cardholder Name</label>
                                        <Input
                                            placeholder="Name on card"
                                            value={cardForm.name}
                                            onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Card Number</label>
                                        <Input
                                            placeholder="1234 5678 9012 3456"
                                            value={cardForm.number}
                                            onChange={e => setCardForm(f => ({ ...f, number: formatCardNumber(e.target.value) }))}
                                            maxLength={19}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Expiry Date</label>
                                            <Input
                                                placeholder="MM/YY"
                                                value={cardForm.expiry}
                                                onChange={e => setCardForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                                                maxLength={5}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">CVC</label>
                                            <Input
                                                placeholder="•••"
                                                type="password"
                                                value={cardForm.cvc}
                                                onChange={e => setCardForm(f => ({ ...f, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                                                maxLength={4}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                                            onClick={handleSaveCard}
                                            disabled={savingCard}
                                        >
                                            {savingCard ? 'Saving...' : 'Save Card'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => { setShowCardForm(false); setCardForm({ number: '', name: '', expiry: '', cvc: '' }) }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Invoice History */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Clock className="w-5 h-5 text-primary-500" />
                                Invoice History
                            </CardTitle>
                            <CardDescription>Download past invoices for your records.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {MOCK_INVOICES.map((invoice, i) => (
                                    <motion.div
                                        key={invoice.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.05 }}
                                        className="flex items-center justify-between py-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${invoice.status === 'Paid' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-gray-100 dark:bg-slate-800'}`}>
                                                {invoice.status === 'Paid'
                                                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                    : <AlertCircle className="w-5 h-5 text-gray-400" />
                                                }
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-gray-900 dark:text-white">{invoice.id} — {invoice.plan} Plan</p>
                                                <p className="text-xs text-gray-500">{invoice.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-gray-900 dark:text-white">{invoice.amount}</span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {invoice.status}
                                            </span>
                                            {invoice.status === 'Paid' && (
                                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary-600">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Security Note */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800">
                        <Shield className="w-5 h-5 text-primary-500 shrink-0" />
                        <p className="text-sm text-gray-500">
                            Your payment information is encrypted and never stored on our servers. All transactions are secured with industry-standard SSL encryption.
                        </p>
                    </div>
                </motion.div>

            </div>
        </DashboardLayout>
    )
}
