'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Map,
    Flag,
    Compass,
    Trophy,
    Target,
    Zap,
    BookOpen,
    CheckCircle2,
    Circle,
    ArrowRight,
    Star,
    Award,
    TrendingUp,
    Sparkles,
    Search,
    ChevronDown,
    Building2,
    Briefcase
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'

export default function LearningPathPage() {
    const [enrollments, setEnrollments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const data = await api.get('/learners/me/enrollments')
                setEnrollments(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('Failed to fetch enrollments:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchEnrollments()
    }, [])

    const pathMilestones = [
        {
            id: 'foundation',
            title: 'Diversity Foundation',
            description: 'Master the core principles of inclusive environments.',
            status: 'completed',
            points: 100,
            icon: BookOpen,
            color: 'blue'
        },
        {
            id: 'communication',
            title: 'Inclusive Communication',
            description: 'Learn language and behaviors that bridge differences.',
            status: 'in-progress',
            points: 150,
            icon: Zap,
            color: 'amber',
            courseId: enrollments[0]?.courseId // Just an example link
        },
        {
            id: 'leadership',
            title: 'Equitable Leadership',
            description: 'Develop strategies for building diverse high-performing teams.',
            status: 'locked',
            points: 250,
            icon: Target,
            color: 'purple'
        },
        {
            id: 'specialist',
            title: 'DEI Specialist',
            description: 'Advanced certification for organizational transformation.',
            status: 'locked',
            points: 500,
            icon: Trophy,
            color: 'emerald'
        }
    ]

    return (
        <DashboardLayout role="LEARNER">
            <div className="max-w-5xl mx-auto space-y-12 pb-24">
                {/* Header Section */}
                <div className="text-center space-y-4 pt-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                        <Compass className="w-4 h-4 animate-spin-slow" />
                        Career Roadmap
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                        Your Personalized <span className="text-blue-600">Learning Path</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                        A structured journey designed to help you master inclusive leadership and reach your career milestones.
                    </p>
                </div>

                {/* Path Visualization */}
                <div className="relative pt-12">
                    {/* The Path Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1.5 -translate-x-1/2 bg-slate-100 dark:bg-slate-800 rounded-full z-0 overflow-hidden">
                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: '45%' }}
                            className="w-full bg-gradient-to-b from-blue-500 to-amber-500"
                        />
                    </div>

                    <div className="space-y-32 relative z-10">
                        {pathMilestones.map((milestone, index) => {
                            const isOdd = index % 2 !== 0
                            const Icon = milestone.icon
                            
                            return (
                                <motion.div 
                                    key={milestone.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className={cn(
                                        "flex items-center w-full",
                                        isOdd ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    {/* Card */}
                                    <div className="w-[45%]">
                                        <Card className={cn(
                                            "rounded-[2.5rem] border-none shadow-2xl transition-all duration-500 group",
                                            milestone.status === 'completed' ? "bg-white dark:bg-slate-900" : 
                                            milestone.status === 'in-progress' ? "bg-white dark:bg-slate-900 ring-4 ring-amber-500/20 shadow-amber-500/10" :
                                            "bg-slate-50 dark:bg-slate-900/50 opacity-60 grayscale"
                                        )}>
                                            <CardContent className="p-8 space-y-6">
                                                <div className="flex items-start justify-between">
                                                    <div className={cn(
                                                        "w-16 h-16 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                                                        milestone.color === 'blue' ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" :
                                                        milestone.color === 'amber' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" :
                                                        milestone.color === 'purple' ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" :
                                                        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                                                    )}>
                                                        <Icon className="w-8 h-8" />
                                                    </div>
                                                    {milestone.status === 'completed' && (
                                                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-black uppercase text-[10px] tracking-widest border-none">
                                                            Completed
                                                        </Badge>
                                                    )}
                                                    {milestone.status === 'in-progress' && (
                                                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-black uppercase text-[10px] tracking-widest border-none animate-pulse">
                                                            Active
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                                                        {milestone.title}
                                                    </h3>
                                                    <p className="text-slate-500 font-medium leading-relaxed">
                                                        {milestone.description}
                                                    </p>
                                                </div>

                                                <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900">
                                                            <Sparkles className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-black text-sm">{milestone.points} pts</span>
                                                    </div>
                                                    <Button 
                                                        variant={milestone.status === 'locked' ? 'secondary' : 'default'} 
                                                        disabled={milestone.status === 'locked'}
                                                        className="rounded-xl font-bold gap-2"
                                                    >
                                                        {milestone.status === 'completed' ? 'Review' : milestone.status === 'in-progress' ? 'Continue' : 'Locked'}
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Path Connector Dot */}
                                    <div className="w-[10%] flex justify-center">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-500",
                                            milestone.status === 'completed' ? "bg-emerald-500 border-emerald-100 dark:border-emerald-900/50 scale-125 shadow-xl shadow-emerald-500/20" :
                                            milestone.status === 'in-progress' ? "bg-amber-500 border-amber-100 dark:border-amber-900/50 scale-150 shadow-2xl shadow-amber-500/40" :
                                            "bg-slate-100 border-white dark:bg-slate-800 dark:border-slate-900"
                                        )}>
                                            {milestone.status === 'completed' ? (
                                                <CheckCircle2 className="w-5 h-5 text-white" />
                                            ) : (
                                                <Circle className={cn("w-4 h-4", milestone.status === 'in-progress' ? "text-white fill-current" : "text-slate-300 dark:text-slate-600")} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Spacer for empty side */}
                                    <div className="w-[45%]" />
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Footer Engagement */}
                <Card className="rounded-[3rem] bg-slate-900 text-white overflow-hidden shadow-2xl">
                    <CardContent className="p-12 text-center space-y-8 relative">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
                        </div>
                        
                        <div className="space-y-4">
                            <Badge className="bg-blue-500 text-white font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-none">Next Goal</Badge>
                            <h2 className="text-4xl font-black">Ready to unlock <span className="text-blue-400">Advanced Leadership?</span></h2>
                            <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">Complete your current milestones to earn the Inclusive Champion badge and unlock premium networking opportunities.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Button className="h-16 px-10 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black text-lg gap-3">
                                <Search className="w-6 h-6" />
                                Explore Courses
                            </Button>
                            <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/20 text-white hover:bg-white/10 font-black text-lg">
                                View Leaderboard
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-white/10">
                            {[
                                { label: 'Total Points', value: '1,250', icon: Star, color: 'text-amber-400' },
                                { label: 'Skills Unlocked', value: '12', icon: Zap, color: 'text-blue-400' },
                                { label: 'Badges Earned', value: '3', icon: Award, color: 'text-purple-400' },
                                { label: 'Active Goals', value: '2', icon: Target, color: 'text-emerald-400' }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1 text-center">
                                    <div className={cn("inline-flex p-3 bg-white/5 rounded-2xl mb-2", stat.color)}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <p className="text-xs font-black uppercase text-slate-500 tracking-widest">{stat.label}</p>
                                    <p className="text-2xl font-black">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
