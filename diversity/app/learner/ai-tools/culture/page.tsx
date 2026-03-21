'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Globe,
    ArrowLeft,
    ChevronRight,
    Users,
    MessageSquare,
    Zap,
    Target,
    Award,
    Shield,
    Star,
    Compass,
    MapPin,
    PlayCircle,
    Clock
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const simulations = [
    {
        id: 'global-team',
        title: 'Virtual Global Team Sync',
        description: 'Manage a high-stakes project meeting with team members from Tokyo, Berlin, and Rio de Janeiro. Build consensus while respecting diverse communication styles.',
        difficulty: 'Intermediate',
        duration: '15 mins',
        category: 'Communication',
        skills: ['Empathy', 'Cross-cultural Communication', 'Leadership']
    },
    {
        id: 'negotiation',
        title: 'Cross-Border Negotiation',
        description: 'Experience a virtual negotiation with a potential partner in Singapore. Learn the nuances of high-context vs. low-context communication.',
        difficulty: 'Advanced',
        duration: '20 mins',
        category: 'Business Strategy',
        skills: ['Negotiation', 'Strategic Thinking', 'Adaptability']
    },
    {
        id: 'empathy',
        title: 'Cultural Empathy Walkthrough',
        description: 'Step into the shoes of a colleague from a different background as they navigate common workplace interactions. Gain a first-person perspective on micro-inclusions.',
        difficulty: 'Beginner',
        duration: '10 mins',
        category: 'Inclusion',
        skills: ['Empathy', 'Awareness', 'Perspective-taking']
    }
]

export default function CultureSimulationPage() {
    const router = useRouter()
    const [selectedSim, setSelectedSim] = useState<string | null>(null)

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
                            <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                <Globe className="w-8 h-8 text-emerald-500" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">CQ Simulations</h1>
                                <p className="text-slate-500 font-medium">Immersive cross-cultural experiences powered by AI</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-3xl border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden group">
                        <CardContent className="p-8 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Target className="w-8 h-8 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Average CQ Score</p>
                                <p className="text-3xl font-black">74/100</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-3xl border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden group">
                        <CardContent className="p-8 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Simulations Done</p>
                                <p className="text-3xl font-black">12</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-3xl border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden group">
                        <CardContent className="p-8 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Award className="w-8 h-8 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Global Regions</p>
                                <p className="text-3xl font-black">5/7</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Simulations Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {simulations.map((sim, idx) => (
                        <motion.div
                            key={sim.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="h-full rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-emerald-500/5 transition-all duration-500 overflow-hidden">
                                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                                    <Globe className="w-24 h-24 text-emerald-100 dark:text-emerald-900/30 transition-transform group-hover:scale-110 duration-700" />
                                    <div className="absolute top-6 left-6 flex gap-2">
                                        <Badge className="bg-white/90 dark:bg-slate-800/90 text-emerald-600 border-none font-black px-4 py-1">
                                            {sim.category}
                                        </Badge>
                                        <Badge className="bg-emerald-500 text-white border-none font-black px-4 py-1 italic">
                                            {sim.difficulty}
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-6 right-6">
                                        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-bold">
                                            <Clock className="w-3 h-3" />
                                            {sim.duration}
                                        </div>
                                    </div>
                                </div>
                                <CardHeader className="p-8">
                                    <CardTitle className="text-2xl font-black group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{sim.title}</CardTitle>
                                    <CardDescription className="text-slate-500 font-medium leading-relaxed dark:text-slate-400 h-20">
                                        {sim.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="px-8 pb-8 space-y-6">
                                    <div className="flex flex-wrap gap-2">
                                        {sim.skills.map(skill => (
                                            <span key={skill} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-100 dark:border-slate-800">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <Button 
                                        onClick={() => setSelectedSim(sim.id)}
                                        className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-black text-lg gap-3 shadow-xl transition-all active:scale-95"
                                    >
                                        Enter Simulation
                                        <PlayCircle className="w-6 h-6" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Featured Roadmap */}
                <Card className="rounded-[3rem] bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <MapPin className="w-64 h-64" />
                    </div>
                    <CardContent className="p-12 md:p-20 relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="space-y-6 max-w-xl">
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-black px-4 py-1 uppercase tracking-widest">Global Path</Badge>
                            <h2 className="text-4xl md:text-5xl font-black leading-tight">Master <span className="text-emerald-400">Cultural Adaptability</span> in Virtual Teams.</h2>
                            <p className="text-slate-400 text-lg font-medium">Unlock exclusive simulations based on your progress. Our AI tracks your decision-making and provides a personalized CQ growth report after every session.</p>
                            <Button className="h-16 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg gap-3 shadow-2xl">
                                View My CQ Roadmap
                                <Compass className="w-6 h-6" />
                            </Button>
                        </div>
                        <div className="flex-1 w-full space-y-6">
                            {[
                                { label: 'Empathy Score', val: 78, color: 'bg-emerald-500' },
                                { label: 'Communicative Clarity', val: 62, color: 'bg-blue-500' },
                                { label: 'Strategic Influence', val: 45, color: 'bg-amber-500' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                        <span>{item.label}</span>
                                        <span>{item.val}%</span>
                                    </div>
                                    <Progress value={item.val} className="h-2 rounded-full bg-white/5" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
