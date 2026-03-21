'use client'

import { motion } from 'framer-motion'
import {
    Sparkles,
    MessageSquare,
    Brain,
    Globe,
    Languages,
    Search,
    Compass,
    ArrowRight,
    Zap,
    Target,
    Activity,
    Users,
    Lightbulb,
    Shield
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const aiTools = [
    {
        id: 'scenario',
        title: 'AI Scenario Simulation',
        description: 'Practice real-world workplace scenarios with interactive AI characters to build empathy and decision-making skills.',
        icon: MessageSquare,
        color: 'bg-blue-500',
        lightColor: 'bg-blue-50 text-blue-600',
        badge: 'Interactive',
        href: '/learner/ai-tools/scenario'
    },
    {
        id: 'bias',
        title: 'Bias Awareness Assistant',
        description: 'An AI companion that helps identify subtle unconscious biases in decision-making and provides objective perspectives.',
        icon: Brain,
        color: 'bg-purple-500',
        lightColor: 'bg-purple-50 text-purple-600',
        badge: 'Personalized',
        href: '/learner/ai-tools/bias-assistant'
    },
    {
        id: 'culture',
        title: 'Cultural Intelligence (CQ) Simulations',
        description: 'Immerse yourself in virtual global team environments to develop your cultural adaptability and awareness.',
        icon: Globe,
        color: 'bg-emerald-500',
        lightColor: 'bg-emerald-50 text-emerald-600',
        badge: 'Immersive',
        href: '/learner/ai-tools/culture'
    },
    {
        id: 'language',
        title: 'Inclusive Language Assistant',
        description: 'Real-time suggestions to make your communication more inclusive, welcoming, and free from traditional biases.',
        icon: Languages,
        color: 'bg-amber-500',
        lightColor: 'bg-amber-50 text-amber-600',
        badge: 'Utility',
        href: '/learner/ai-tools/language'
    },
    {
        id: 'qa',
        title: 'AI Q&A for Diversity',
        description: 'Instant, evidence-based answers to complex diversity, equity, and inclusion questions from our trained AI.',
        icon: Search,
        color: 'bg-red-500',
        lightColor: 'bg-red-50 text-red-600',
        badge: 'Instant',
        href: '/learner/ai-tools/qa'
    },
    {
        id: 'pathway',
        title: 'Personal Learning Pathways',
        description: 'AI-generated course recommendations based on your goals, role, and current knowledge gaps.',
        icon: Compass,
        color: 'bg-indigo-500',
        lightColor: 'bg-indigo-50 text-indigo-600',
        badge: 'AI Recommended',
        href: '/learner/ai-tools/pathway'
    }
]

export default function AIToolsPage() {
    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12 pb-24">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-8 md:p-16 text-white shadow-2xl">
                    <div className="relative z-10 space-y-8 max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="p-2 bg-blue-500/20 rounded-xl backdrop-blur-md border border-blue-500/30">
                                <Sparkles className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-blue-400 font-black uppercase tracking-[0.2em] text-[10px]">AI-Powered Learning</span>
                        </motion.div>
                        
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                                Smart Tools for <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Inclusive Growth</span>
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                                Experience the future of diversity education with our AI-driven simulations and assistants designed to build real-world empathy and intelligence.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-6 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                                    <Target className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Simulated Scenarios</p>
                                    <p className="text-xl font-black">50+</p>
                                </div>
                            </div>
                            <div className="h-12 w-px bg-slate-800 hidden sm:block" />
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Real-time Analysis</p>
                                    <p className="text-xl font-black">Instant</p>
                                </div>
                            </div>
                            <div className="h-12 w-px bg-slate-800 hidden sm:block" />
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">CQ Improvement</p>
                                    <p className="text-xl font-black">+24%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Visual Elements */}
                    <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-0 mr-24 mb-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
                    
                    {/* Floating Decorative Icons */}
                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute top-20 right-40 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hidden xl:block"
                    >
                        <Shield className="w-8 h-8 text-blue-400" />
                    </motion.div>
                </div>

                {/* Grid of Tools */}
                <div id="tools-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {aiTools.map((tool, index) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group"
                        >
                            <Card className="h-full rounded-[2.5rem] border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col">
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 duration-500 shadow-lg shadow-current/10", tool.lightColor)}>
                                            <tool.icon className="w-8 h-8" />
                                        </div>
                                        <Badge className="bg-slate-50 text-slate-500 border-none font-black uppercase tracking-widest text-[9px] px-3">
                                            {tool.badge}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-2xl font-black group-hover:text-blue-600 transition-colors">{tool.title}</CardTitle>
                                    <CardDescription className="text-slate-500 font-medium leading-relaxed dark:text-slate-400">
                                        {tool.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 mt-auto">
                                    <Button 
                                        onClick={() => window.location.href = tool.href}
                                        className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg gap-3 shadow-xl transition-all active:scale-[0.98]"
                                    >
                                        Launch Tool
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Feature Highlight: Recommendations */}
                <Card className="rounded-[3rem] bg-gradient-to-br from-indigo-600 to-purple-800 text-white overflow-hidden shadow-2xl relative border-none">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <CardContent className="p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="space-y-8 max-w-2xl text-center md:text-left">
                            <div className="space-y-4">
                                <Badge className="bg-white/20 text-white border-none font-black uppercase tracking-[0.2em] text-[10px] py-1 px-4 mb-2">Exclusive Feature</Badge>
                                <h2 className="text-4xl md:text-5xl font-black leading-tight">Master Diversity with <span className="text-indigo-200 underline decoration-indigo-200/30">AI Guidance.</span></h2>
                                <p className="text-indigo-100 text-lg font-medium">Our AI analyzes your performance in simulations and quizzes to build a custom learning path that targets your specific growth areas.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Button 
                                    onClick={() => window.location.href = '/learner/ai-tools/pathway'}
                                    className="h-16 px-10 rounded-2xl bg-white text-indigo-700 hover:bg-slate-100 font-black text-lg gap-3 shadow-2xl"
                                >
                                    Start My Custom Path
                                    <Compass className="w-6 h-6" />
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="h-16 px-10 rounded-2xl border-white/30 text-white hover:bg-white/10 font-black text-lg"
                                    onClick={() => document.getElementById('tools-grid')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    Explore More
                                </Button>
                            </div>
                        </div>
                        <div className="hidden lg:flex w-72 h-72 relative items-center justify-center">
                            <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse" />
                            <div className="w-56 h-56 bg-white/20 rounded-[3rem] rotate-12 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-2xl">
                                <Lightbulb className="w-24 h-24 text-white -rotate-12" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
