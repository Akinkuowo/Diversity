'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Activity,
    TrendingUp,
    Award,
    BookOpen,
    Clock,
    Target,
    Zap,
    Brain,
    Trophy,
    Star,
    Sparkles,
    BarChart3,
    PieChart,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    CheckCircle2,
    GraduationCap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { toast } from 'sonner'

export default function LearnerProgressPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await api.get('/learners/me/progress')
                setData(response)
            } catch (err) {
                console.error('Failed to fetch progress:', err)
                toast.error('Failed to load progress analytics')
            } finally {
                setLoading(false)
            }
        }
        fetchProgress()
    }, [])

    if (loading) {
        return (
            <DashboardLayout>
                <div className="py-24 flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-black animate-pulse uppercase tracking-widest">Generating your impact report...</p>
                </div>
            </DashboardLayout>
        )
    }

    const { stats, categoryStats, recentActivity } = data || { stats: {}, categoryStats: [], recentActivity: [] }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12 pb-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-10">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl font-black uppercase tracking-widest text-xs"
                        >
                            <TrendingUp className="w-4 h-4" />
                            Performance Analytics
                        </motion.div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                            Learning <span className="text-blue-600">Progress</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium max-w-xl">
                            A data-driven view of your training journey, skill acquisitions, and professional growth milestones.
                        </p>
                    </div>
                    <Button className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black gap-2 shadow-xl shadow-slate-200">
                        Export Impact Report
                        <BarChart3 className="w-5 h-5" />
                    </Button>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Completed Courses', value: stats.completedCourses, total: stats.totalCourses, icon: BookOpen, color: 'blue' },
                        { label: 'Avg Quiz Score', value: `${stats.avgQuizScore}%`, icon: Brain, color: 'purple' },
                        { label: 'Certificates', value: stats.certificatesEarned, icon: Award, color: 'amber' },
                        { label: 'CPD Hours', value: stats.totalCpdHours, icon: Clock, color: 'emerald' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden group">
                                <CardContent className="p-8 space-y-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                        stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                                        stat.color === 'purple' ? "bg-purple-50 text-purple-600" :
                                        stat.color === 'amber' ? "bg-amber-50 text-amber-600" :
                                        "bg-emerald-50 text-emerald-600"
                                    )}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
                                        <div className="flex items-end gap-2">
                                            <span className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</span>
                                            {stat.total && <span className="text-slate-400 font-bold mb-1">/ {stat.total}</span>}
                                        </div>
                                    </div>
                                    {stat.total && (
                                        <Progress value={(stat.value / stat.total) * 100} className="h-1.5" />
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Chart Mockup */}
                    <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="p-10 pb-0">
                            <CardTitle className="text-2xl font-black">Learning Activity</CardTitle>
                            <CardDescription className="text-slate-500 font-medium font-bold">Training hours invested over time</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-6">
                            <div className="h-64 w-full flex items-end gap-2">
                                {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 100].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        className={cn(
                                            "flex-1 rounded-t-xl transition-all duration-500",
                                            i === 11 ? "bg-blue-600 shadow-lg shadow-blue-200" : "bg-slate-100 group-hover:bg-slate-200"
                                        )}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">
                                <span>Jan</span>
                                <span>Mar</span>
                                <span>May</span>
                                <span>Jul</span>
                                <span>Sep</span>
                                <span>Dec</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skill Distribution */}
                    <Card className="rounded-[3rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                        <CardHeader className="p-10 relative z-10">
                            <CardTitle className="text-2xl font-black">Skill Distribution</CardTitle>
                            <CardDescription className="text-slate-400 font-medium font-bold">Proficiency across categories</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 space-y-6 relative z-10">
                            {categoryStats.length > 0 ? categoryStats.map((cat: any, i: number) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-slate-300">{cat.name}</span>
                                        <span className="font-black text-blue-400">{Math.round((cat.value / stats.totalCourses) * 100)}%</span>
                                    </div>
                                    <Progress value={(cat.value / stats.totalCourses) * 100} className="h-2 bg-white/10" />
                                </div>
                            )) : (
                                <div className="text-center py-12 space-y-4">
                                    <Sparkles className="w-12 h-12 text-slate-700 mx-auto" />
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No data yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Achievements */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recent <span className="text-blue-600">Assessments</span></h2>
                        <Button variant="ghost" className="font-bold gap-2 text-slate-500" onClick={() => window.location.href='/learner/quizzes'}>
                            View All History
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentActivity.length > 0 ? recentActivity.map((activity: any, i: number) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="rounded-[2.5rem] border-none shadow-lg bg-white overflow-hidden group hover:shadow-2xl transition-all">
                                    <CardContent className="p-8 flex items-center gap-6">
                                        <div className={cn(
                                            "w-16 h-16 rounded-3xl flex items-center justify-center shrink-0",
                                            activity.passed ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                        )}>
                                            {activity.passed ? <Trophy className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                                {new Date(activity.completedAt).toLocaleDateString()}
                                            </p>
                                            <h4 className="font-black text-slate-900 text-lg leading-tight">Quiz Assessment</h4>
                                            <div className="flex items-center gap-2">
                                                <Badge className={cn(
                                                    "font-black uppercase tracking-widest text-[10px]",
                                                    activity.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                                )}>
                                                    Score: {activity.score}%
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-12 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No recent activity detected</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Engagement Card */}
                <Card className="rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden shadow-2xl relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <CardContent className="p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="space-y-6 max-w-xl text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-black leading-tight">Take your expertise to the <span className="text-blue-200">next level.</span></h2>
                            <p className="text-blue-100 text-lg font-medium">Your progress places you in the <span className="font-black text-white">top 15%</span> of learners this month. Keep up the momentum to unlock the Senior DEI Specialist badge.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Button className="h-16 px-10 rounded-2xl bg-white text-blue-600 hover:bg-slate-100 font-black text-lg gap-2 shadow-xl">
                                    Personalized Goals
                                    <Target className="w-6 h-6" />
                                </Button>
                                <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/30 text-white hover:bg-white/10 font-black text-lg">
                                    Consult Mentor
                                </Button>
                            </div>
                        </div>
                        <div className="w-64 h-64 relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-white/10 rounded-full animate-ping" />
                            <div className="w-48 h-48 bg-white/20 rounded-[3rem] rotate-12 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-2xl">
                                <GraduationCap className="w-24 h-24 text-white -rotate-12" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
