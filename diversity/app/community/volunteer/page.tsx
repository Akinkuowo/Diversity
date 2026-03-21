'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Heart,
    Clock,
    Users,
    Calendar,
    ArrowRight,
    Target,
    Filter,
    Sparkles,
    CheckCircle2,
    Briefcase,
    Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function VolunteerPage() {
    const [tasks, setTasks] = useState<any[]>([])
    const [meta, setMeta] = useState<{ projects: string[], stats: any }>({
        projects: [],
        stats: { openOpportunities: 0, completedHours: 0, activeVolunteers: 0 }
    })
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedProject, setSelectedProject] = useState('all')
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [userData, metaData] = await Promise.all([
                    api.get('/me'),
                    api.get('/community/volunteer/meta')
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
        const fetchTasks = async () => {
            setIsLoading(true)
            try {
                const query = new URLSearchParams({
                    project: selectedProject,
                    search: searchTerm
                }).toString()
                const data = await api.get(`/community/volunteer/tasks?${query}`)
                setTasks(data)
            } catch (err) {
                toast.error('Failed to load opportunities')
            } finally {
                setIsLoading(false)
            }
        }
        const debounce = setTimeout(fetchTasks, 300)
        return () => clearTimeout(debounce)
    }, [selectedProject, searchTerm])

    const handleApply = async (taskId: string) => {
        try {
            await api.post(`/volunteer-tasks/${taskId}/interest`, {})
            // Optimistically update the local state so the button changes immediately
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isRegistered: true } : t))
            toast.success('Interest registered! The project lead will reach out to you soon.')
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to submit interest')
        }
    }

    const role = user?.role || 'COMMUNITY_MEMBER'

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Hero section */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#4c1d95] p-8 md:p-14 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />

                    <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                        <div className="max-w-2xl space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl text-sm font-semibold border border-white/20 shadow-inner"
                            >
                                <Heart className="w-4 h-4 text-pink-300" />
                                Community Impact
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-6xl font-black leading-tight tracking-tight"
                            >
                                Make a <span className="text-pink-300">Difference</span> Together
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-white/70 text-lg md:text-xl font-medium max-w-xl"
                            >
                                Join our community of dedicated volunteers and contribute to projects that drive real change.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full lg:w-auto">
                            {[
                                { label: 'Open Roles', value: meta.stats.openOpportunities, icon: Target, color: 'text-blue-300' },
                                { label: 'Total Hours', value: meta.stats.completedHours, icon: Clock, color: 'text-emerald-300' },
                                { label: 'Active Volunteers', value: meta.stats.activeVolunteers, icon: Users, color: 'text-amber-300' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 text-center"
                                >
                                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                                    <p className="text-3xl font-black">{stat.value}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="sticky top-4 z-40 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-[2rem] shadow-xl border border-gray-100/50 dark:border-gray-800/50">
                    <div className="relative w-full md:w-[400px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search opportunities..."
                            className="pl-12 h-14 bg-gray-50/50 dark:bg-slate-800/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary-500/50 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide max-w-full">
                        <Button
                            variant={selectedProject === 'all' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setSelectedProject('all')}
                            className={`rounded-xl px-4 h-10 font-bold transition-all ${selectedProject === 'all' ? 'bg-primary-600 text-white' : 'text-gray-500'}`}
                        >
                            All Projects
                        </Button>
                        {meta.projects.map((proj) => (
                            <Button
                                key={proj}
                                variant={selectedProject === proj ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedProject(proj)}
                                className={`rounded-xl px-4 h-10 font-bold transition-all ${selectedProject === proj ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-primary-50 dark:hover:bg-primary-950/20'}`}
                            >
                                {proj}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-80 rounded-[2.5rem] bg-gray-100 dark:bg-slate-800 animate-pulse" />
                        ))
                    ) : tasks.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            {tasks.map((task, i) => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                >
                                    <Card className="group h-full flex flex-col overflow-hidden rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                                        <CardContent className="p-8 flex-1 flex flex-col">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 group-hover:scale-110 transition-transform duration-500">
                                                    <Sparkles className="w-5 h-5" />
                                                </div>
                                                <Badge className="bg-gray-50 dark:bg-slate-800 text-gray-500 border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                                                    {task.project}
                                                </Badge>
                                            </div>

                                            <div className="space-y-4 flex-1">
                                                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">
                                                    {task.title}
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400 font-medium line-clamp-3 leading-relaxed">
                                                    {task.description}
                                                </p>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex flex-col gap-4">
                                                <div className="flex items-center justify-between text-gray-400 font-bold text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        {task.hours} Hours / Week
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        {task.startDate ? new Date(task.startDate).toLocaleDateString() : 'Immediate'}
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={() => handleApply(task.id)}
                                                    disabled={task.isRegistered}
                                                    className={cn(
                                                        "w-full h-12 rounded-xl font-bold transition-all",
                                                        task.isRegistered 
                                                            ? "bg-green-100 text-green-700 border border-green-200 cursor-default hover:bg-green-100" 
                                                            : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-[1.02] group-hover:bg-primary-600 group-hover:text-white"
                                                    )}
                                                >
                                                    {task.isRegistered ? (
                                                        <>
                                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                                            Interest Sent
                                                        </>
                                                    ) : (
                                                        <>
                                                            Interested
                                                            <ArrowRight className="w-4 h-4 ml-2" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
                            <Heart className="w-20 h-20 mx-auto mb-6 text-gray-100" />
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">No opportunities found</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mt-2">Try adjusting your filters or search terms to find a role that fits your interests.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
