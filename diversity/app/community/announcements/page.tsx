'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bell,
    Info,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    User,
    Filter,
    ArrowRight,
    Megaphone,
    Sparkles,
    ShieldCheck,
    Clock
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedType, setSelectedType] = useState('all')
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const userData = await api.get('/me')
                setUser(userData)
            } catch (err) {
                console.error('Failed to fetch user data', err)
            }
        }
        fetchInitialData()
    }, [])

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setIsLoading(true)
            try {
                const query = selectedType !== 'all' ? `?type=${selectedType}` : ''
                const data = await api.get(`/community/announcements${query}`)
                setAnnouncements(data)
            } catch (err) {
                toast.error('Failed to load announcements')
            } finally {
                setIsLoading(false)
            }
        }
        fetchAnnouncements()
    }, [selectedType])

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'bg-red-500/10 text-red-500 border-red-500/20'
            case 'MEDIUM': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            case 'LOW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-500" />
            case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            case 'INFO':
            default: return <Info className="w-5 h-5 text-blue-500" />
        }
    }

    const role = user?.role || 'COMMUNITY_MEMBER'

    return (
        <DashboardLayout role={role}>
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Hero section */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] p-8 md:p-14 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl text-sm font-semibold border border-white/20 shadow-inner"
                        >
                            <Megaphone className="w-4 h-4 text-primary-300" />
                            Community Updates
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black leading-tight tracking-tight"
                        >
                            Stay <span className="text-secondary-300">Informed</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/70 text-lg md:text-xl font-medium max-w-2xl"
                        >
                            The latest news, updates, and important announcements from the Diversity Network community leads.
                        </motion.p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4 rounded-[2rem] border border-gray-100/50 dark:border-gray-800/50 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 font-bold text-sm px-4">
                        <Filter className="w-4 h-4" />
                        Filter:
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['all', 'INFO', 'WARNING', 'SUCCESS'].map((type) => (
                            <Button
                                key={type}
                                variant={selectedType === type ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedType(type)}
                                className={`rounded-xl px-6 h-10 font-bold transition-all ${selectedType === type
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                                        : 'text-gray-500 hover:bg-white dark:hover:bg-slate-800'
                                    }`}
                            >
                                {type === 'all' ? 'All Updates' : type}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Content List */}
                <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-48 rounded-[2.5rem] bg-gray-100 dark:bg-slate-800 animate-pulse" />
                        ))
                    ) : announcements.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            {announcements.map((ann, i) => (
                                <motion.div
                                    key={ann.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                >
                                    <Card className="group relative overflow-hidden rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900 border border-gray-100/50 dark:border-gray-800/50">
                                        <div className={`absolute top-0 left-0 w-2 h-full ${ann.type === 'WARNING' ? 'bg-amber-500' :
                                                ann.type === 'SUCCESS' ? 'bg-emerald-500' : 'bg-blue-500'
                                            }`} />

                                        <CardContent className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
                                            <div className={`p-5 rounded-3xl bg-gray-50 dark:bg-slate-800/50 group-hover:scale-110 transition-transform duration-500 flex-shrink-0`}>
                                                {getTypeIcon(ann.type)}
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <Badge className={`${getPriorityColor(ann.priority)} border font-black text-[10px] tracking-widest px-3 py-1`}>
                                                        {ann.priority} PRIORITY
                                                    </Badge>
                                                    <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(ann.publishedAt).toLocaleDateString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                </div>

                                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                                                    {ann.title}
                                                </h3>

                                                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed max-w-3xl">
                                                    {ann.content}
                                                </p>

                                                <div className="pt-6 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border-2 border-white dark:border-slate-800 shadow-sm">
                                                            {ann.author?.profile?.avatar ? (
                                                                <img src={ann.author.profile.avatar} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold text-sm">
                                                                    {ann.author?.firstName?.[0]}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-gray-900 dark:text-white">
                                                                {ann.author?.firstName} {ann.author?.lastName}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                                Community Lead
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <Button variant="ghost" className="rounded-xl font-black text-xs hover:bg-gray-50 dark:hover:bg-slate-800 gap-2">
                                                        ACKNOWLEDGE
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
                            <Megaphone className="w-20 h-20 mx-auto mb-6 text-gray-100" />
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">No updates at the moment</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mt-2">We'll notify you when there's something new to share with the community.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
