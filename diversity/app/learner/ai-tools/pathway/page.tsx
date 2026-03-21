'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Compass,
    ArrowLeft,
    Sparkles,
    Target,
    Zap,
    TrendingUp,
    Award,
    Shield,
    CheckCircle2,
    ChevronRight,
    MapPin,
    GraduationCap,
    Clock,
    BarChart3,
    Search,
    Brain,
    Lightbulb,
    Lock,
    Star,
    BookOpen
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const milestones = [
    {
        id: '1',
        title: 'Foundations of Inclusion',
        description: 'Master the core concepts of unconscious bias and cultural awareness.',
        status: 'COMPLETED',
        progress: 100,
        courses: ['Diversity 101', 'Bias Awareness']
    },
    {
        id: '2',
        title: 'Inclusive Leadership',
        description: 'Develop strategies for building and leading diverse, high-performing teams.',
        status: 'IN_PROGRESS',
        progress: 45,
        courses: ['Empathetic Leadership', 'Conflict Resolution']
    },
    {
        id: '3',
        title: 'Global Cultural Intelligence',
        description: 'Advanced cross-cultural communication and global collaboration skills.',
        status: 'LOCKED',
        progress: 0,
        courses: ['Global EQ', 'Cross-Border Teams']
    }
]

export default function PathwayPage() {
    const router = useRouter()
    const [isGenerating, setIsGenerating] = useState(false)

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12 pb-24">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-0 hover:bg-transparent text-slate-500 font-bold gap-2"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to AI Tools
                        </Button>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/10 rounded-2xl">
                                <Compass className="w-8 h-8 text-indigo-500" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">AI Learning Pathways</h1>
                                <p className="text-slate-500 font-medium">Personalized curriculum guided by artificial intelligence</p>
                            </div>
                        </div>
                    </div>
                    <Button 
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black h-14 px-8 shadow-xl shadow-indigo-500/20"
                        onClick={() => {
                            setIsGenerating(true)
                            setTimeout(() => setIsGenerating(false), 2000)
                        }}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <><Zap className="w-4 h-4 mr-2 animate-bounce" /> Recalculating...</>
                        ) : (
                            <><Sparkles className="w-4 h-4 mr-2" /> Refresh My Path</>
                        )}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Progress & Milestones */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Current Roadmap Visual */}
                        <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
                            <CardHeader className="p-10 pb-4">
                                <CardTitle className="text-3xl font-black">Your Growth Map</CardTitle>
                                <CardDescription className="text-lg font-medium">AI-predicted trajectory based on your 2026 goals.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-10 pt-4 space-y-12">
                                <div className="relative">
                                    {/* Connection Line */}
                                    <div className="absolute left-8 top-8 bottom-8 w-1 bg-slate-100 dark:bg-slate-800" />
                                    
                                    <div className="space-y-12">
                                        {milestones.map((milestone, idx) => (
                                            <div key={milestone.id} className="relative pl-20 group">
                                                {/* Milestone Marker */}
                                                <div className={cn(
                                                    "absolute left-4 top-2 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 z-10",
                                                    milestone.status === 'COMPLETED' ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                                                    milestone.status === 'IN_PROGRESS' ? "bg-indigo-600 text-white shadow-indigo-500/20" :
                                                    "bg-slate-200 dark:bg-slate-800 text-slate-400"
                                                )}>
                                                    {milestone.status === 'COMPLETED' ? <CheckCircle2 className="w-6 h-6" /> :
                                                     milestone.status === 'IN_PROGRESS' ? <div className="w-2 h-2 bg-white rounded-full animate-ping" /> :
                                                     <Lock className="w-5 h-5" />}
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <h3 className={cn(
                                                            "text-2xl font-black transition-colors",
                                                            milestone.status === 'LOCKED' ? "text-slate-400" : "text-slate-900 dark:text-white"
                                                        )}>
                                                            {milestone.title}
                                                        </h3>
                                                        {milestone.status === 'IN_PROGRESS' && (
                                                            <Badge className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 border-none font-black italic">Next Priority</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-500 font-medium max-w-xl">{milestone.description}</p>
                                                    
                                                    {milestone.status !== 'LOCKED' && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {milestone.courses.map(course => (
                                                                <span key={course} className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-500 border border-slate-100 dark:border-slate-800">
                                                                    <BookOpen className="w-3 h-3 text-indigo-500" />
                                                                    {course}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: AI Analysis */}
                    <div className="space-y-8">
                        <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <div className="p-3 bg-indigo-500/20 rounded-2xl w-fit mb-4">
                                    <Brain className="w-6 h-6 text-indigo-400" />
                                </div>
                                <CardTitle className="text-2xl font-black text-indigo-100">AI Progress Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 space-y-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                                        <span>Current Level</span>
                                        <span className="text-white font-black underline">Intermediate II</span>
                                    </div>
                                    <Progress value={45} className="h-2 rounded-full bg-white/10" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center space-y-2">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global Rank</p>
                                        <p className="text-3xl font-black text-indigo-400">Top 5%</p>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center space-y-2">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Consistency</p>
                                        <p className="text-3xl font-black text-emerald-400">Streak</p>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-400 italic leading-relaxed font-medium">
                                    "Your recent completion of 'Cultural Awareness' has unlocked advanced leadership modules. Focus on 'Strategic Influence' next to maximize ROI."
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-black uppercase tracking-widest text-xs text-slate-400">Unlock Achievements</h3>
                                    <Award className="w-5 h-5 text-amber-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 space-y-4">
                                {[
                                    { label: 'Empathy Champion', status: 'UNLOCKED', date: '2 days ago' },
                                    { label: 'Global Explorer', status: 'IN_PROGRESS', date: '80%' },
                                    { label: 'Strategic Leader', status: 'LOCKED', date: '---' },
                                ].map((badge, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 grayscale transition-all hover:grayscale-0 cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                                                <Star className={cn("w-4 h-4", badge.status === 'UNLOCKED' ? "text-amber-500" : "text-slate-300")} />
                                            </div>
                                            <span className="text-sm font-black text-slate-600 dark:text-slate-300">{badge.label}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{badge.date}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
