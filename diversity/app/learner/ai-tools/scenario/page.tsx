'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MessageSquare,
    Send,
    User,
    Bot,
    ArrowLeft,
    CheckCircle2,
    ShieldAlert,
    Lightbulb,
    Target,
    Trophy,
    ChevronRight,
    Play,
    Sparkles
} from 'lucide-react'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const scenarios = [
    {
        id: '1',
        title: 'Interview Inclusion',
        context: 'You are conducting an interview for a Senior Developer role. A candidate shares that they have a gap in their resume due to caregiving responsibilities.',
        objective: 'Demonstrate inclusive interviewing techniques while maintaining professional standards.',
        character: {
            name: 'Alex Rivera',
            role: 'Job Candidate',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
        }
    }
]

export default function ScenarioSimulationPage() {
    const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'SUMMARY'>('IDLE')
    const [currentScenario, setCurrentScenario] = useState(scenarios[0])
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant' | 'character', content: string }[]>([])
    const [input, setInput] = useState('')
    const [feedback, setFeedback] = useState<any>(null)

    const startScenario = () => {
        setGameState('PLAYING')
        setMessages([
            { role: 'character', content: "Thanks for having me. I wanted to be upfront about the gap in my resume from 2021 to 2023. I was the primary caregiver for a family member during that time. I'm excited to get back into technical work, though I know some teams might be concerned about the break." }
        ])
    }

    const handleSend = () => {
        if (!input.trim()) return
        
        const newMessages = [...messages, { role: 'user' as const, content: input }]
        setMessages(newMessages)
        setInput('')

        // Simulate AI feedback/response
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                role: 'character', 
                content: "I appreciate you listening to that. It was a challenging time but taught me a lot about resilience and time management. How does your team typically view non-traditional career paths?" 
            }])
            
            // Provide subtle AI guidance in the background
            setFeedback({
                score: 85,
                tips: [
                    "Great job acknowledging the candidate's disclosure without bias.",
                    "Consider asking how their experience during the gap translates to their professional skills."
                ]
            })
        }, 1000)
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-24">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" className="gap-2 font-bold" onClick={() => window.location.href='/learner/ai-tools'}>
                        <ArrowLeft className="w-4 h-4" />
                        Back to Hub
                    </Button>
                    <Badge className="bg-blue-600 text-white border-none font-black px-4 py-1.5 rounded-xl uppercase tracking-widest text-[10px]">
                        AI Simulation Active
                    </Badge>
                </div>

                {gameState === 'IDLE' ? (
                    <div className="max-w-2xl mx-auto py-12 space-y-8 text-center">
                        <div className="w-24 h-24 bg-blue-100 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-blue-200">
                            <MessageSquare className="w-12 h-12 text-blue-600" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Scenario Simulation</h1>
                            <p className="text-slate-500 text-lg font-medium">Practice difficult conversations and inclusive decision-making in a safe, AI-guided environment.</p>
                        </div>
                        
                        <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden text-left bg-white">
                            <CardHeader className="p-10 bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-2xl font-black">{currentScenario.title}</CardTitle>
                                <CardDescription className="text-slate-500 font-bold">{currentScenario.context}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-10 space-y-6">
                                <div className="space-y-3">
                                    <h4 className="text-xs font-black uppercase text-blue-600 tracking-[0.2em] flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        Primary Objective
                                    </h4>
                                    <p className="font-bold text-slate-700">{currentScenario.objective}</p>
                                </div>
                                <Button 
                                    className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xl gap-3 shadow-xl shadow-blue-200"
                                    onClick={startScenario}
                                >
                                    Start Simulation
                                    <Play className="w-6 h-6 fill-current" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[75vh]">
                        {/* Chat Area */}
                        <div className="lg:col-span-2 flex flex-col h-full bg-slate-50 rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
                            <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                                        <AvatarImage src={currentScenario.character.avatar} />
                                        <AvatarFallback>AR</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-black text-slate-900 leading-none">{currentScenario.character.name}</p>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{currentScenario.character.role}</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-emerald-600 border-emerald-100 bg-emerald-50">Online</Badge>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex gap-4 max-w-[85%]",
                                            m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md",
                                            m.role === 'user' ? "bg-slate-900" : m.role === 'character' ? "bg-white" : "bg-blue-600"
                                        )}>
                                            {m.role === 'user' ? <User className="w-5 h-5 text-white" /> : 
                                             m.role === 'character' ? <Avatar className="w-10 h-10"><AvatarImage src={currentScenario.character.avatar} /></Avatar> : 
                                             <Sparkles className="w-5 h-5 text-white" />}
                                        </div>
                                        <div className={cn(
                                            "p-5 rounded-[2rem]",
                                            m.role === 'user' ? "bg-slate-900 text-white rounded-tr-none" : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none"
                                        )}>
                                            <p className="font-medium text-lg leading-relaxed">{m.content}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="p-8 bg-white border-t border-slate-200">
                                <div className="relative flex items-center gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="Type your response..."
                                        className="flex-1 h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                    <Button className="h-14 w-14 rounded-2xl bg-blue-600 text-white shadow-lg" onClick={handleSend}>
                                        <Send className="w-6 h-6" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Feedback */}
                        <div className="space-y-6 flex flex-col h-full overflow-hidden">
                            <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden shrink-0">
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-500/20 rounded-xl">
                                            <ShieldAlert className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <CardTitle className="text-xl font-black">AI Feedback</CardTitle>
                                    </div>
                                    <CardDescription className="text-slate-400 font-bold">Real-time coaching analysis</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                                            <span>Inclusion Mastery</span>
                                            <span className="text-blue-400">{feedback?.score || 0}%</span>
                                        </div>
                                        <Progress value={feedback?.score || 0} className="h-2 bg-white/10" />
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {feedback?.tips?.map((tip: string, i: number) => (
                                            <motion.div 
                                                key={i}
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: i * 0.2 }}
                                                className="flex gap-3 p-4 bg-white/5 rounded-2xl border border-white/5"
                                            >
                                                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                                                <p className="text-sm font-medium text-slate-300">{tip}</p>
                                            </motion.div>
                                        )) || (
                                            <p className="text-slate-500 italic text-sm text-center py-4">Keep participating to get feedback...</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white flex-1 overflow-auto">
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-xl font-black flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-amber-500" />
                                        Milestones
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-4">
                                    {[
                                        { label: 'Acknowledge Disability/Gap', done: messages.length > 2 },
                                        { label: 'Empathy Statement', done: messages.length > 4 },
                                        { label: 'Professional Standard Guard', done: false },
                                        { label: 'Skill Translation Inquiry', done: false }
                                    ].map((m, i) => (
                                        <div key={i} className={cn(
                                            "flex items-center gap-3 p-4 rounded-2xl border transition-all",
                                            m.done ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 border-slate-100 text-slate-400"
                                        )}>
                                            {m.done ? <CheckCircle2 className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                            <span className="font-bold text-sm tracking-tight">{m.label}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
