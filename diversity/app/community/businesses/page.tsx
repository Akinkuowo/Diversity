'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Building2,
    MapPin,
    Globe,
    Award,
    ArrowRight,
    Users,
    Briefcase,
    ShieldCheck,
    Star,
    Sparkles,
    X,
    Medal,
    BadgeCheck
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function BusinessDirectoryPage() {
    const [businesses, setBusinesses] = useState<any[]>([])
    const [meta, setMeta] = useState<{ industries: string[], badgeLevels: string[] }>({ industries: [], badgeLevels: [] })
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedIndustry, setSelectedIndustry] = useState('all')
    const [selectedBadge, setSelectedBadge] = useState('all')
    const [user, setUser] = useState<any>(null)
    const [selectedBusiness, setSelectedBusiness] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [applyingFor, setApplyingFor] = useState<any>(null)
    const [applicationForm, setApplicationForm] = useState({
        resumeUrl: '',
        coverLetter: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [userData, metaData] = await Promise.all([
                    api.get('/me'),
                    api.get('/businesses/meta')
                ])
                setUser(userData)
                setMeta(metaData)
            } catch (err) {
                console.error('Failed to fetch initial data', err)
            }
        }
        fetchInitialData()
    }, [])

    useEffect(() => {
        const fetchBusinesses = async () => {
            setIsLoading(true)
            try {
                const query = new URLSearchParams({
                    industry: selectedIndustry,
                    badgeLevel: selectedBadge,
                    search: searchTerm
                }).toString()
                const data = await api.get(`/businesses?${query}`)
                setBusinesses(data)
            } catch (err) {
                toast.error('Failed to load businesses')
            } finally {
                setIsLoading(false)
            }
        }
        const debounce = setTimeout(fetchBusinesses, 300)
        return () => clearTimeout(debounce)
    }, [selectedIndustry, selectedBadge, searchTerm])

    const fetchBusinessDetails = async (id: string) => {
        try {
            const data = await api.get(`/businesses/${id}`)
            setSelectedBusiness(data)
            setIsModalOpen(true)
        } catch (err) {
            toast.error('Failed to load business details')
        }
    }

    const handleApply = async () => {
        if (!applyingFor) return
        setIsSubmitting(true)
        try {
            await api.post(`/employment-notices/${applyingFor.id}/apply`, applicationForm)
            toast.success('Your application has been submitted!')
            setApplyingFor(null)
            setApplicationForm({ resumeUrl: '', coverLetter: '' })
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to submit application')
        } finally {
            setIsSubmitting(false)
        }
    }

    const getBadgeStyle = (level: string) => {
        switch (level) {
            case 'CHAMPION':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
            case 'INCLUSION_PARTNER':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
            case 'SUPPORTER':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
        }
    }

    const role = user?.role || 'COMMUNITY_MEMBER'

    return (
        <DashboardLayout role={role}>
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Hero section */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 md:p-14 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />

                    <div className="relative z-10 max-w-3xl space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl text-sm font-semibold border border-white/20 shadow-inner"
                        >
                            <Building2 className="w-4 h-4 text-primary-300" />
                            Business Directory
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl font-black leading-tight tracking-tight"
                        >
                            Connect with <span className="text-primary-300">Inclusive</span> Businesses
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/70 text-lg md:text-xl font-medium max-w-xl"
                        >
                            Discover organizations that are actively committed to diversity, equity, and inclusion in our community.
                        </motion.p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="sticky top-4 z-40 flex flex-col lg:flex-row gap-4 items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-[2rem] shadow-xl border border-gray-100/50 dark:border-gray-800/50">
                    <div className="relative w-full lg:w-[350px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search businesses..."
                            className="pl-12 h-14 bg-gray-50/50 dark:bg-slate-800/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary-500/50 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
                            <Button
                                variant={selectedIndustry === 'all' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedIndustry('all')}
                                className={`rounded-xl px-4 h-10 font-bold transition-all ${selectedIndustry === 'all' ? 'bg-primary-600 text-white' : 'text-gray-500'}`}
                            >
                                All Industries
                            </Button>
                            {meta.industries.map((industry) => (
                                <Button
                                    key={industry}
                                    variant={selectedIndustry === industry ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setSelectedIndustry(industry)}
                                    className={`rounded-xl px-4 h-10 font-bold transition-all ${selectedIndustry === industry ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-primary-50 dark:hover:bg-primary-950/20'}`}
                                >
                                    {industry}
                                </Button>
                            ))}
                        </div>

                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 hidden lg:block" />

                        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
                            <Button
                                variant={selectedBadge === 'all' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedBadge('all')}
                                className={`rounded-xl px-4 h-10 font-bold transition-all ${selectedBadge === 'all' ? 'bg-secondary-600 text-white shadow-lg shadow-secondary-500/20' : 'text-gray-500'}`}
                            >
                                All Levels
                            </Button>
                            {meta.badgeLevels.map((level) => (
                                <Button
                                    key={level}
                                    variant={selectedBadge === level ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setSelectedBadge(level)}
                                    className={`rounded-xl px-4 h-10 font-bold transition-all ${selectedBadge === level ? 'bg-secondary-600 text-white shadow-lg shadow-secondary-500/20' : 'text-gray-500 hover:bg-secondary-50 dark:hover:bg-secondary-950/20'}`}
                                >
                                    {level.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-96 rounded-[2.5rem] bg-gray-100 dark:bg-slate-800 animate-pulse" />
                        ))
                    ) : businesses.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            {businesses.map((biz, i) => (
                                <motion.div
                                    key={biz.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                >
                                    <Card className="group h-full flex flex-col overflow-hidden rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                                        <CardContent className="p-8 flex-1 flex flex-col">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-8">
                                                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center p-3 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                                                    {biz.logo ? (
                                                        <img src={biz.logo} alt={biz.companyName} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <Building2 className="w-8 h-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <Badge className={`border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg ${getBadgeStyle(biz.badgeLevel)}`}>
                                                    {biz.badgeLevel.split('_').join(' ')}
                                                </Badge>
                                            </div>

                                            {/* Info */}
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
                                                    <Briefcase className="w-3.5 h-3.5" />
                                                    {biz.industry}
                                                </div>
                                                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                                                    {biz.companyName}
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400 font-medium line-clamp-3 leading-relaxed">
                                                    {biz.description}
                                                </p>
                                            </div>

                                            {/* Meta Info */}
                                            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-gray-400">
                                                    <div className="flex items-center gap-1.5 font-bold text-xs">
                                                        <MapPin className="w-4 h-4" />
                                                        {biz.city}, {biz.country}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
                                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">New</span>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => fetchBusinessDetails(biz.id)}
                                                className="w-full mt-6 h-12 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:scale-[1.02] transition-all group-hover:bg-primary-600 group-hover:text-white"
                                            >
                                                View Profile
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
                            <Building2 className="w-20 h-20 mx-auto mb-6 text-gray-100" />
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">No businesses found</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mt-2">Try adjusting your filters or search terms to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Business Details Modal */}
            <AnimatePresence>
                {isModalOpen && selectedBusiness && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh] scrollbar-hide"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 z-10 rounded-full bg-gray-100/50 dark:bg-slate-800/50 hover:bg-gray-200 dark:hover:bg-slate-700"
                            >
                                <X className="w-5 h-5" />
                            </Button>

                            <div className="relative h-48 bg-gradient-to-r from-primary-600 to-secondary-600">
                                <div className="absolute inset-0 bg-black/20" />
                                <div className="absolute -bottom-12 left-12 w-32 h-32 rounded-3xl bg-white dark:bg-slate-900 p-4 shadow-xl flex items-center justify-center">
                                    {selectedBusiness.logo ? (
                                        <img src={selectedBusiness.logo} alt={selectedBusiness.companyName} className="w-full h-full object-contain" />
                                    ) : (
                                        <Building2 className="w-16 h-16 text-gray-300" />
                                    )}
                                </div>
                            </div>

                            <div className="p-12 pt-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
                                <div className="lg:col-span-2 space-y-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge className={`px-4 py-1.5 rounded-full font-bold ${getBadgeStyle(selectedBusiness.badgeLevel)}`}>
                                                {selectedBusiness.badgeLevel.split('_').join(' ')}
                                            </Badge>
                                            <span className="text-gray-400 font-bold text-sm">• {selectedBusiness.industry}</span>
                                        </div>
                                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6">
                                            {selectedBusiness.companyName}
                                        </h2>
                                        <div className="prose dark:prose-invert max-w-none">
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                                <Sparkles className="w-5 h-5 text-primary-500" />
                                                About the Company
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                                {selectedBusiness.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-[2rem] bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30">
                                        <h4 className="text-lg font-bold text-primary-900 dark:text-primary-100 flex items-center gap-2 mb-4">
                                            <ShieldCheck className="w-5 h-5 text-primary-600" />
                                            Diversity Commitment
                                        </h4>
                                        <p className="text-primary-800/80 dark:text-primary-200/80 font-medium leading-relaxed italic">
                                            "{selectedBusiness.diversityCommitment || 'Committed to fostering an inclusive work environment.'}"
                                        </p>
                                    </div>

                                    {/* Open Positions Section */}
                                    <div className="space-y-6">
                                        <h4 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                            <Briefcase className="w-6 h-6 text-primary-600" />
                                            Open Positions
                                        </h4>
                                        <div className="space-y-4">
                                            {selectedBusiness.employmentNotices && selectedBusiness.employmentNotices.length > 0 ? (
                                                selectedBusiness.employmentNotices.map((notice: any) => (
                                                    <div key={notice.id} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-900 transition-all shadow-sm">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div className="space-y-2">
                                                                <h5 className="text-lg font-bold text-gray-900 dark:text-white">{notice.title}</h5>
                                                                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin className="w-4 h-4" />
                                                                        {notice.location || 'Remote'}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <Briefcase className="w-4 h-4" />
                                                                        {notice.type}
                                                                    </span>
                                                                    {notice.salary && (
                                                                        <span className="font-semibold text-primary-600">{notice.salary}</span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                                                    {notice.description}
                                                                </p>
                                                            </div>
                                                            <Button 
                                                                onClick={() => setApplyingFor(notice)}
                                                                className="bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl whitespace-nowrap"
                                                            >
                                                                Apply Now
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                                                    <p className="text-gray-500 italic">No open positions at the moment.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Earned Badges Section */}
                                    <div className="space-y-6">
                                        <h4 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                            <Award className="w-6 h-6 text-secondary-600" />
                                            Earned Diversity Badges
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { title: 'Diversity Champion', icon: Medal, earned: selectedBusiness.summary?.isChampion, color: 'text-purple-600', bg: 'bg-purple-50' },
                                                { title: 'Inclusion Partner', icon: Award, earned: selectedBusiness.summary?.isPartner, color: 'text-blue-600', bg: 'bg-blue-50' },
                                                { title: 'Diversity Supporter', icon: BadgeCheck, earned: selectedBusiness.summary?.isSupporter, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                            ].filter(b => b.earned).map((badge) => {
                                                const Icon = badge.icon
                                                return (
                                                    <div key={badge.title} className={`flex items-center gap-4 p-4 rounded-2xl ${badge.bg} dark:bg-slate-800 border border-transparent hover:border-gray-200 transition-all`}>
                                                        <div className={`w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm ${badge.color}`}>
                                                            <Icon className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white">{badge.title}</p>
                                                            <p className="text-xs font-medium text-gray-500">Verified Achievement</p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            {(!selectedBusiness.summary?.isSupporter) && (
                                                <p className="text-gray-500 italic text-sm col-span-full py-4">This business is currently working towards its first diversity badge.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-slate-800/50 space-y-6 border border-gray-100 dark:border-gray-800">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Company Intelligence</h4>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400">Headquarters</p>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedBusiness.city}, {selectedBusiness.country}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400">
                                                    <Users className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400">Team Size</p>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedBusiness.size} Employees</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400">
                                                    <Globe className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400">Website</p>
                                                    <a href={selectedBusiness.website} target="_blank" className="text-sm font-bold text-primary-600 hover:underline">
                                                        Visit Official Site
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm">
                                                    <p className="text-2xl font-black text-primary-600">{selectedBusiness._count?.corporateVolunteering || 0}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Impact Events</p>
                                                </div>
                                                <div className="text-center p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm">
                                                    <p className="text-2xl font-black text-secondary-600">{selectedBusiness._count?.testimonials || 0}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Success Stories</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="w-full h-14 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-lg shadow-primary-500/20 text-lg">
                                        Send Message
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Application Modal */}
            <AnimatePresence>
                {applyingFor && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setApplyingFor(null)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-10 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">Apply for {applyingFor.title}</h3>
                                    <p className="text-gray-500 text-sm font-medium">{selectedBusiness?.companyName}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Resume URL</label>
                                        <Input 
                                            placeholder="https://dropbox.com/s/your-resume.pdf"
                                            className="rounded-2xl h-12 bg-gray-50 dark:bg-slate-800 border-none"
                                            value={applicationForm.resumeUrl}
                                            onChange={(e) => setApplicationForm({...applicationForm, resumeUrl: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Cover Letter</label>
                                        <textarea 
                                            placeholder="Tell them why you're a great fit..."
                                            className="w-full min-h-[150px] p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                                            value={applicationForm.coverLetter}
                                            onChange={(e) => setApplicationForm({...applicationForm, coverLetter: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setApplyingFor(null)}
                                        className="flex-1 h-14 rounded-2xl font-bold border-gray-200"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleApply}
                                        disabled={isSubmitting || !applicationForm.resumeUrl}
                                        className="flex-[2] h-14 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-lg shadow-primary-500/20"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    )
}
