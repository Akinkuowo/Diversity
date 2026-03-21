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
    Briefcase,
    Globe,
    Loader2,
    CheckCircle2
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function VolunteerOpportunitiesPage() {
    const [tasks, setTasks] = useState<any[]>([])
    const [meta, setMeta] = useState<{ projects: string[], stats: any }>({
        projects: [],
        stats: { openOpportunities: 0, completedHours: 0, activeVolunteers: 0 }
    })
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedProject, setSelectedProject] = useState('all')

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const metaData = await api.get('/community/volunteer/meta')
                setMeta(metaData)
            } catch (err) {
                console.error('Failed to fetch volunteer metadata', err)
            }
        }
        fetchMeta()
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
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isRegistered: true } : t))
            toast.success('Interest registered! The project lead will reach out to you soon.')
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to submit interest')
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Volunteer Opportunities</h1>
                        <p className="text-muted-foreground mt-1">
                            Discover new ways to contribute and make an impact in your community.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Available Roles', value: meta.stats.openOpportunities, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                        { label: 'Community Hours', value: meta.stats.completedHours, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                        { label: 'Active Volunteers', value: meta.stats.activeVolunteers, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' }
                    ].map((stat) => (
                        <Card key={stat.label} className="border-none shadow-sm overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-3 rounded-2xl", stat.bg)}>
                                        <stat.icon className={cn("w-6 h-6", stat.color)} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters & Search */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardContent className="p-4 md:p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                            <div className="relative w-full lg:w-[450px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by title, organization, or skill..."
                                    className="pl-12 h-12 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500/50 transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                                <Button
                                    variant={selectedProject === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedProject('all')}
                                    className={cn(
                                        "rounded-xl px-5 h-10 font-bold transition-all",
                                        selectedProject === 'all' ? "bg-primary-600 text-white border-primary-600" : "text-muted-foreground border-gray-200 dark:border-gray-800"
                                    )}
                                >
                                    All Projects
                                </Button>
                                {meta.projects.map((proj) => (
                                    <Button
                                        key={proj}
                                        variant={selectedProject === proj ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedProject(proj)}
                                        className={cn(
                                            "rounded-xl px-5 h-10 font-bold transition-all",
                                            selectedProject === proj ? "bg-primary-600 text-white border-primary-600" : "text-muted-foreground border-gray-200 dark:border-gray-800 hover:bg-primary-50 dark:hover:bg-primary-950/20"
                                        )}
                                    >
                                        {proj}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Opportunities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i} className="h-96 rounded-[2rem] bg-gray-100 dark:bg-slate-800 border-none animate-pulse" />
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
                                    <Card className="group h-full flex flex-col overflow-hidden rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white dark:bg-slate-900 ring-1 ring-gray-100 dark:ring-gray-800">
                                        <CardContent className="p-8 flex-1 flex flex-col">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 group-hover:scale-110 transition-transform duration-500">
                                                    <Sparkles className="w-5 h-5" />
                                                </div>
                                                <Badge className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                                                    {task.project || 'General'}
                                                </Badge>
                                            </div>

                                            <div className="space-y-4 flex-1">
                                                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">
                                                    {task.title}
                                                </h3>
                                                <p className="text-muted-foreground font-medium line-clamp-3 leading-relaxed">
                                                    {task.description}
                                                </p>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-5">
                                                <div className="flex items-center justify-between text-muted-foreground font-bold text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-primary-500" />
                                                        {task.hours} Hours / Week
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-primary-500" />
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
                                                            : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-[1.02] group-hover:bg-primary-600 group-hover:text-white border-none"
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
                        <Card className="col-span-full border-none shadow-sm overflow-hidden py-24 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                            <CardContent className="flex flex-col items-center justify-center text-center">
                                <div className="p-6 rounded-full bg-gray-50 dark:bg-slate-800 mb-6">
                                    <Heart className="w-16 h-16 text-gray-200" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">No opportunities found</h3>
                                <p className="text-muted-foreground max-w-sm mt-3">
                                    {searchTerm 
                                        ? `We couldn't find any roles matching "${searchTerm}". Try a different search term.` 
                                        : "There are currently no open volunteer roles available. Check back soon for new opportunities!"}
                                </p>
                                {searchTerm && (
                                    <Button variant="link" className="mt-4 text-primary-600 font-bold" onClick={() => setSearchTerm('')}>
                                        Clear search
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
