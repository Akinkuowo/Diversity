'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Brain,
    Sparkles,
    ShieldAlert,
    Lightbulb,
    Target,
    Zap,
    ArrowLeft,
    CheckCircle2,
    BarChart3,
    History,
    Search,
    MessageCircle
} from 'lucide-react'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const biasCategories = [
    { title: 'Affinity Bias', level: 25, color: 'bg-blue-500' },
    { title: 'Confirmation Bias', level: 15, color: 'bg-purple-500' },
    { title: 'Halo Effect', level: 10, color: 'bg-emerald-500' },
    { title: 'Similarity Bias', level: 30, color: 'bg-amber-500' }
]

export default function BiasAssistantPage() {
    const [query, setQuery] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<any>(null)

    const handleAnalyze = () => {
        if (!query.trim()) return
        setIsAnalyzing(true)
        
        // Simulate AI analysis
        setTimeout(() => {
            setAnalysisResult({
                biases: [
                    { type: 'Affinity Bias', description: 'Your language suggests a preference for candidates with similar background to your own.', impact: 'Medium' },
                    { type: 'Recency Bias', description: 'You are giving more weight to the most recent information provided.', impact: 'Low' }
                ],
                suggestions: [
                    'Try focusing on objective skills-based criteria rather than institutional pedigree.',
                    'Review all candidates together rather than one by one to avoid recency effects.'
                ]
            })
            setIsAnalyzing(false)
        }, 1500)
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-10 pb-24">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" className="gap-2 font-bold" onClick={() => window.location.href='/learner/ai-tools'}>
                        <ArrowLeft className="w-4 h-4" />
                        Back to Hub
                    </Button>
                    <Badge className="bg-purple-600 text-white border-none font-black px-4 py-1.5 rounded-xl uppercase tracking-widest text-[10px]">
                        AI Bias Analysis Active
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Input & Interaction */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-purple-100 rounded-3xl shadow-xl shadow-purple-200">
                                    <Brain className="w-10 h-10 text-purple-600" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bias Awareness Assistant</h1>
                                    <p className="text-slate-500 text-lg font-medium">Uncover subtle biases in your decision-making and communication.</p>
                                </div>
                            </div>
                            
                            <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden p-8 md:p-12">
                                <CardHeader className="p-0 mb-8">
                                    <CardTitle className="text-2xl font-black">AI Decision Review</CardTitle>
                                    <CardDescription className="text-slate-500 font-bold">Paste a description of a decision, an email, or a candidate review below for AI-powered bias analysis.</CardDescription>
                                </CardHeader>
                                <div className="space-y-6">
                                    <div className="relative group">
                                        <textarea 
                                            placeholder="Example: 'I'm leaning towards hiring Sarah because she attended the same university as I did and has a very similar working style. She seems like a great cultural fit...'"
                                            className="w-full min-h-[250px] p-8 rounded-[2rem] bg-slate-50 border-none font-medium text-lg leading-relaxed focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                        />
                                        <div className="absolute top-4 right-4 animate-pulse">
                                            <Sparkles className="w-6 h-6 text-purple-300" />
                                        </div>
                                    </div>
                                    <Button 
                                        className="w-full h-16 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xl gap-3 shadow-xl shadow-purple-100 active:scale-[0.98] transition-transform"
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing}
                                    >
                                        {isAnalyzing ? "Analyzing Patterns..." : "Run AI Analysis"}
                                        <Zap className="w-6 h-6 fill-current" />
                                    </Button>
                                </div>
                            </Card> Section
                        </section>

                        <AnimatePresence>
                            {analysisResult && (
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                        <BarChart3 className="w-6 h-6 text-purple-600" />
                                        Analysis Findings
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {analysisResult.biases.map((bias: any, i: number) => (
                                            <Card key={i} className="rounded-[2rem] border-none shadow-xl bg-white p-8 group hover:bg-purple-50 transition-colors duration-500">
                                                <Badge className={cn(
                                                    "mb-4 px-3 py-1 font-black text-[9px] uppercase tracking-widest",
                                                    bias.impact === 'High' ? "bg-red-100 text-red-600" : bias.impact === 'Medium' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                                                )}>
                                                    {bias.impact} Impact
                                                </Badge>
                                                <h3 className="text-xl font-black text-slate-900 mb-2">{bias.type}</h3>
                                                <p className="text-slate-600 font-medium leading-relaxed">{bias.description}</p>
                                            </Card>
                                        ))}
                                    </div>
                                    
                                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-emerald-600 text-white p-8 md:p-12 overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20" />
                                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center shrink-0">
                                                <Lightbulb className="w-10 h-10 text-white" />
                                            </div>
                                            <div className="space-y-6">
                                                <h3 className="text-2xl font-black">AI Recommendations</h3>
                                                <div className="space-y-4">
                                                    {analysisResult.suggestions.map((s: string, i: number) => (
                                                        <div key={i} className="flex gap-4 items-start bg-white/10 p-5 rounded-2xl border border-white/10">
                                                            <CheckCircle2 className="w-6 h-6 text-white shrink-0 mt-0.5" />
                                                            <p className="font-bold text-lg leading-snug">{s}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.section>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: Insights & Progress */}
                    <aside className="space-y-8">
                        <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white p-8">
                            <CardHeader className="p-0 mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-purple-500/20 rounded-xl">
                                        <ShieldAlert className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <CardTitle className="text-xl font-black">Bias Tracker</CardTitle>
                                </div>
                                <CardDescription className="text-slate-400 font-bold">Personal awareness journey</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 space-y-8">
                                <p className="text-sm font-medium text-slate-300">Based on your last 10 sessions, here is your awareness trend across common bias categories.</p>
                                <div className="space-y-6">
                                    {biasCategories.map((c) => (
                                        <div key={c.title} className="space-y-2">
                                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                                                <span>{c.title}</span>
                                                <span className="text-purple-400">{c.level}%</span>
                                            </div>
                                            <Progress value={c.level} className="h-2 bg-white/5" />
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest mt-4">
                                    <History className="w-4 h-4 mr-2" />
                                    View Full History
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-6">
                            <h3 className="font-black text-xl text-slate-900 flex items-center gap-3">
                                <Target className="w-6 h-6 text-blue-500" />
                                Daily Challenge
                            </h3>
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-4">
                                <p className="font-bold text-slate-700">"Identify one instance today where someone expressed a 'Halo Effect' bias (assuming someone is good at everything because they excel at one thing) and note it down."</p>
                                <Badge className="bg-blue-600 text-white border-none font-black text-[9px] uppercase px-3 py-1">20 Points</Badge>
                            </div>
                            <Button className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black uppercase text-[10px] tracking-widest">
                                Complete Challenge
                            </Button>
                        </Card>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    )
}
