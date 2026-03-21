'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Users,
    MapPin,
    Briefcase,
    Zap,
    Heart,
    MessageSquare,
    Link as LinkIcon,
    Filter,
    Globe,
    Award,
    UserPlus,
    Check,
    Clock,
    ChevronDown,
    ArrowRight,
    Loader2
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function NetworkPage() {

    const [profiles, setProfiles] = useState<any[]>([])
    const [meta, setMeta] = useState<{ skills: string[], roles: string[] }>({
        skills: [],
        roles: []
    })
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRole, setSelectedRole] = useState('all')
    const [selectedSkill, setSelectedSkill] = useState('all')
    const [user, setUser] = useState<any>(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [userData, metaData] = await Promise.all([
                    api.get('/me'),
                    api.get('/community/network/meta')
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
        setPage(1)
        setProfiles([])
        setHasMore(true)
    }, [selectedRole, selectedSkill, searchTerm])

    useEffect(() => {
        const fetchNetwork = async () => {
            setIsLoading(true)
            try {
                const query = new URLSearchParams({
                    role: selectedRole,
                    skill: selectedSkill,
                    search: searchTerm,
                    page: page.toString(),
                    limit: '12'
                }).toString()
                
                const data = await api.get(`/community/network?${query}`)
                const newProfiles = data.profiles || []
                
                setProfiles(prev => page === 1 ? newProfiles : [...prev, ...newProfiles])
                setHasMore(newProfiles.length === 12)
            } catch (err) {
                toast.error('Failed to load network directory')
            } finally {
                setIsLoading(false)
            }
        }
        
        const debounce = setTimeout(fetchNetwork, page === 1 ? 300 : 0)
        return () => clearTimeout(debounce)
    }, [selectedRole, selectedSkill, searchTerm, page])

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            setPage(prev => prev + 1)
        }
    }

    const handleConnect = async (requesterId: string, profileName: string) => {
        try {
            await api.post('/community/network/connect', { recipientId: requesterId })
            toast.success(`Connection request sent to ${profileName}!`)
            // Optionally, update the profile's connectionStatus in the state
            setProfiles(prevProfiles => 
                prevProfiles.map(p => 
                    p.user.id === requesterId ? { ...p, connectionStatus: 'PENDING', isRequester: true } : p
                )
            )
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send request')
        }
    }

    const handleMessage = (userId: string) => {
        router.push(`/messages?userId=${userId}`)
    }

    const formatRole = (role: string) => {
        return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    const role = user?.role || 'COMMUNITY_MEMBER'

    return (
        <DashboardLayout>
            <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
                {/* Hero section */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 p-8 md:p-14 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-bold backdrop-blur-md"
                            >
                                <Globe className="w-4 h-4 text-cyan-300" />
                                Global Directory
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-7xl font-black leading-tight tracking-tight"
                            >
                                Find Your <span className="text-cyan-400">People</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl leading-relaxed"
                            >
                                Connect, collaborate, and grow with a diverse network of professionals, mentors, and community leaders.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Link href="/community/connections">
                                <Button className="rounded-2xl h-16 px-8 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-black text-lg transition-all shadow-2xl group">
                                    <Users className="w-6 h-6 mr-3 text-cyan-400 group-hover:scale-110 transition-transform" />
                                    My Network
                                    <ArrowRight className="w-5 h-5 ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="sticky top-4 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-4 md:p-6 rounded-[2rem] shadow-xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-[400px] flex-shrink-0">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Search by name..."
                            className="pl-14 h-14 bg-slate-50 dark:bg-slate-800/50 border-0 rounded-2xl text-[15px] font-medium shadow-inner focus-visible:ring-2 focus-visible:ring-primary-500/30"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                        <div className="flex items-center gap-3 w-full sm:w-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl">
                            <Briefcase className="w-4 h-4 ml-3 text-slate-400" />
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger className="w-full sm:w-[180px] border-0 bg-transparent shadow-none focus:ring-0 font-bold text-slate-700 dark:text-slate-200">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-xl">
                                    <SelectItem value="all" className="font-bold">All Roles</SelectItem>
                                    {meta.roles.map(r => (
                                        <SelectItem key={r} value={r} className="font-medium">{formatRole(r)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl">
                            <Zap className="w-4 h-4 ml-3 text-slate-400" />
                            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                                <SelectTrigger className="w-full sm:w-[180px] border-0 bg-transparent shadow-none focus:ring-0 font-bold text-slate-700 dark:text-slate-200">
                                    <SelectValue placeholder="Skill" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-xl max-h-[300px]">
                                    <SelectItem value="all" className="font-bold">All Skills</SelectItem>
                                    {meta.skills.map(s => (
                                        <SelectItem key={s} value={s} className="font-medium">{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Network Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-[420px] rounded-[2rem] bg-slate-100 dark:bg-slate-800 animate-pulse" />
                        ))
                    ) : profiles.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            {profiles.map((profile, i) => (
                                <motion.div
                                    key={profile.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                >
                                    <Card className="group h-full flex flex-col overflow-hidden rounded-[2rem] border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                                        <CardContent className="p-0 flex flex-col h-full relative">
                                            {/* Top Banner Context/Decor */}
                                            <div className="h-24 bg-gradient-to-r from-primary-100/50 to-cyan-100/50 dark:from-primary-900/20 dark:to-cyan-900/20" />
                                            
                                            {/* Avatar & Header */}
                                            <div className="px-6 flex-1 flex flex-col">
                                                <div className="flex justify-between items-end -mt-12 mb-4">
                                                    <div className="relative">
                                                        <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-100 shadow-lg">
                                                            {profile.avatar ? (
                                                                <img src={profile.avatar} alt={profile.user?.firstName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-600 font-black text-2xl">
                                                                    {profile.user?.firstName?.[0]}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                                                    </div>
                                                    
                                                    <Badge variant="secondary" className="mb-2 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 font-bold border-0 px-3 py-1 shadow-sm">
                                                        <Award className="w-3.5 h-3.5 mr-1 inline-block" />
                                                        {profile.impactPoints} pts
                                                    </Badge>
                                                </div>

                                                <div className="mb-4">
                                                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                                        {profile.user?.firstName} {profile.user?.lastName}
                                                    </h3>
                                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-0.5 tracking-wide text-primary-600/80 dark:text-primary-400/80">
                                                        {formatRole(profile.user?.role || '')}
                                                    </p>
                                                </div>
                                                
                                                {/* Details */}
                                                <div className="space-y-3 mb-6 flex-1 text-[13px] font-medium text-slate-600 dark:text-slate-300">
                                                    {(profile.city || profile.country) && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-slate-400" />
                                                            {profile.city}{profile.city && profile.country ? ', ' : ''}{profile.country}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-slate-400" />
                                                        {profile.connections} Connections
                                                    </div>
                                                </div>

                                                {/* Tags (Skills & Interests combined/truncated) */}
                                                <div className="flex flex-wrap gap-1.5 mb-6">
                                                    {[...(profile.skills || []), ...(profile.interests || [])].slice(0, 4).map((tag, idx) => (
                                                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {((profile.skills?.length || 0) + (profile.interests?.length || 0) > 4) && (
                                                        <span className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[11px] font-bold">
                                                            +{(profile.skills?.length || 0) + (profile.interests?.length || 0) - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Bar */}
                                            <div className="p-4 bg-slate-50/80 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800/50 flex gap-3">
                                                {profile.connectionStatus === 'ACCEPTED' ? (
                                                    <Button 
                                                        className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all shadow-lg shadow-emerald-500/25 cursor-default"
                                                    >
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Connected
                                                    </Button>
                                                ) : profile.connectionStatus === 'PENDING' ? (
                                                    <Button 
                                                        className="flex-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold transition-all cursor-default"
                                                        disabled
                                                    >
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        {profile.isRequester ? 'Pending...' : 'Review Request'}
                                                    </Button>
                                                ) : (
                                                    <Button 
                                                        className="flex-1 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-lg shadow-primary-500/25"
                                                        onClick={() => handleConnect(profile.user?.id, profile.user?.firstName)}
                                                        disabled={profile.user?.id === user?.id}
                                                    >
                                                        <UserPlus className="w-4 h-4 mr-2" />
                                                        Connect
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant="outline" 
                                                    className="w-12 h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group/msg"
                                                    onClick={() => handleMessage(profile.user?.id)}
                                                >
                                                    <MessageSquare className="w-5 h-5 text-slate-400 group-hover/msg:text-primary-500 transition-colors" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="col-span-full py-20 px-4 text-center">
                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">No members found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mt-3 font-medium text-lg leading-relaxed">
                                We couldn't find anyone matching your current filters. Try adjusting your search criteria.
                            </p>
                        </div>
                    )}
                </div>
                {/* Load More */}
                {hasMore && profiles.length > 0 && (
                    <div className="flex justify-center mt-12 pb-12">
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-12 h-14 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
                            onClick={handleLoadMore}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                'Load More Connections'
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
