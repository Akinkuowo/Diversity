'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    Search,
    MessageSquare,
    MapPin,
    Award,
    Filter,
    ChevronDown,
    Loader2,
    Briefcase,
    Heart,
    GraduationCap,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const roleColors = {
    ADMIN: 'from-rose-500 to-rose-600',
    BUSINESS: 'from-indigo-500 to-indigo-600',
    VOLUNTEER: 'from-emerald-500 to-emerald-600',
    LEARNER: 'from-blue-500 to-blue-600',
    COMMUNITY_MEMBER: 'from-amber-500 to-amber-600',
}

export default function MyConnectionsPage() {
    const router = useRouter()
    const [connections, setConnections] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchConnections()
    }, [])

    const fetchConnections = async () => {
        setIsLoading(true)
        try {
            const data = await api.get('/community/connections')
            setConnections(data)
        } catch (error) {
            console.error('Failed to fetch connections:', error)
            toast.error('Failed to load connections')
        } finally {
            setIsLoading(false)
        }
    }

    const filteredConnections = connections.filter(conn => {
        const fullName = `${conn.user.firstName} ${conn.user.lastName}`.toLowerCase()
        return fullName.includes(searchQuery.toLowerCase())
    })

    const handleMessage = (userId: string) => {
        router.push(`/messages?userId=${userId}`)
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/community/dashboard">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Network</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                                You have {connections.length} professional connections
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search connections..."
                                className="pl-11 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 h-12 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-48 rounded-[2rem] bg-slate-100 dark:bg-slate-800 animate-pulse" />
                        ))}
                    </div>
                ) : filteredConnections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredConnections.map((conn, i) => (
                                <motion.div
                                    key={conn.user.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                >
                                    <Card className="group h-full flex flex-col overflow-hidden rounded-[2rem] border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                                        <CardContent className="p-6 flex flex-col h-full">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="relative">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shadow-md">
                                                        {conn.avatar ? (
                                                            <img src={conn.avatar} alt={conn.user.firstName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-600 font-black text-xl">
                                                                {conn.user.firstName?.[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-900 dark:text-white truncate text-lg">
                                                        {conn.user.firstName} {conn.user.lastName}
                                                    </h3>
                                                    <p className="text-xs font-bold text-primary-600 dark:text-primary-400 tracking-wider uppercase">
                                                        {conn.user.role.replace('_', ' ')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-6 flex-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                {(conn.city || conn.country) && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="truncate">{conn.city}{conn.city && conn.country ? ', ' : ''}{conn.country}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Award className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{conn.impactPoints} Impact Points</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    className="flex-1 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-lg shadow-primary-500/25"
                                                    onClick={() => handleMessage(conn.user.id)}
                                                >
                                                    <MessageSquare className="w-4 h-4 mr-2" />
                                                    Message
                                                </Button>
                                                <Link href={`/community/network`}>
                                                    <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                                                        Profile
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-6">
                            <Users className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No connections yet</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium">
                            {searchQuery ? "We couldn't find any connections matching your search." : "Start building your network by exploring the community member directory!"}
                        </p>
                        {!searchQuery && (
                            <Link href="/community/network" className="mt-8">
                                <Button className="rounded-2xl h-12 px-8 bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-xl shadow-primary-500/25 transition-all">
                                    Explore Network
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
