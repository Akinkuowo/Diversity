'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Languages,
    ArrowLeft,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Copy,
    RotateCcw,
    Zap,
    Info,
    Shield,
    Lightbulb,
    FileText,
    Search,
    Brain,
    MessageSquare,
    ThumbsUp
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Suggestion {
    id: string
    original: string
    suggested: string
    reason: string
    category: 'Gender' | 'Ability' | 'Age' | 'Culture'
}

export default function LanguageAssistantPage() {
    const router = useRouter()
    const [text, setText] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])

    const analyzeText = () => {
        if (!text.trim()) return
        setIsAnalyzing(true)
        
        // Simulated AI Analysis
        setTimeout(() => {
            const found: Suggestion[] = []
            const lowerText = text.toLowerCase()
            
            if (lowerText.includes('guys')) {
                found.push({
                    id: '1',
                    original: 'guys',
                    suggested: 'everyone / team / folks',
                    reason: 'Use gender-neutral terms to be more inclusive of all team members.',
                    category: 'Gender'
                })
            }
            if (lowerText.includes('chairman')) {
                found.push({
                    id: '2',
                    original: 'chairman',
                    suggested: 'chair / chairperson',
                    reason: 'Gender-neutral titles promote professional equality.',
                    category: 'Gender'
                })
            }
            if (lowerText.includes('disabled')) {
                found.push({
                    id: '3',
                    original: 'disabled people',
                    suggested: 'people with disabilities',
                    reason: 'Person-first language emphasizes the individual over the condition.',
                    category: 'Ability'
                })
            }
            
            setSuggestions(found)
            setIsAnalyzing(false)
            if (found.length > 0) {
                toast.info(`Found ${found.length} inclusive language suggestions`)
            } else {
                toast.success("Text looks great! No major biases detected.")
            }
        }, 1200)
    }

    const applySuggestion = (s: Suggestion) => {
        const newText = text.replace(new RegExp(s.original, 'gi'), s.suggested)
        setText(newText)
        setSuggestions(prev => prev.filter(item => item.id !== s.id))
        toast.success("Suggestion applied!")
    }

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
                            <div className="p-3 bg-amber-500/10 rounded-2xl">
                                <Languages className="w-8 h-8 text-amber-500" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Inclusive Language</h1>
                                <p className="text-slate-500 font-medium">Real-time inclusive communication assistant</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            className="rounded-xl border-white/5 bg-slate-100 dark:bg-slate-800 font-black h-12 px-6"
                            onClick={() => {
                                setText('')
                                setSuggestions([])
                            }}
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Clear
                        </Button>
                        <Button 
                            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black h-12 px-8 shadow-xl"
                            onClick={analyzeText}
                            disabled={isAnalyzing || !text.trim()}
                        >
                            {isAnalyzing ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> Analyzing...</>
                            ) : (
                                <><Zap className="w-4 h-4 mr-2" /> Analyze Text</>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 min-h-[600px]">
                    {/* Editor Area */}
                    <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden flex flex-col group">
                        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-amber-500" />
                                <span className="font-black uppercase tracking-widest text-xs text-slate-400">Drafting Editor</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                <span>{text.split(/\s+/).filter(x => x).length} words</span>
                                <span>{text.length} characters</span>
                            </div>
                        </div>
                        <CardContent className="p-0 flex-1 relative">
                            <Textarea 
                                className="w-full h-full min-h-[500px] p-12 text-xl font-medium border-none focus-visible:ring-0 resize-none bg-transparent placeholder:text-slate-300 leading-relaxed"
                                placeholder="Paste or type your content here... (e.g., 'Hey guys, I talked to the chairman about the disabled entrance.')"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-6 border border-slate-100 dark:border-slate-700">
                                        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                        <div className="text-center space-y-1">
                                            <p className="text-xl font-black italic">AI is Scanning...</p>
                                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Analyzing for inclusive patterns</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Suggestions Area */}
                    <div className="space-y-6 flex flex-col">
                        <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <div className="p-3 bg-amber-500/20 rounded-2xl w-fit mb-4">
                                    <Sparkles className="w-6 h-6 text-amber-500" />
                                </div>
                                <CardTitle className="text-2xl font-black">AI Insights</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between text-sm font-black uppercase tracking-widest">
                                        <span className="text-slate-400">Inclusivity Score</span>
                                        <span className="text-amber-500">{(100 - (suggestions.length * 15)).toString()}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${100 - (suggestions.length * 15)}%` }}
                                            className="h-full bg-amber-500 shadow-lg shadow-amber-500/50" 
                                        />
                                    </div>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
                                        "Every word matters. Inclusive language is about intent, impact, and empathy."
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                            <h3 className="font-black uppercase tracking-widest text-xs text-slate-400 px-4">Improvement Areas ({suggestions.length})</h3>
                            <AnimatePresence mode="popLayout">
                                {suggestions.length > 0 ? suggestions.map((s) => (
                                    <motion.div
                                        key={s.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <Card className="rounded-3xl border-none shadow-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden group">
                                            <CardHeader className="p-6 pb-2">
                                                <div className="flex items-center justify-between mb-4">
                                                    <Badge variant="secondary" className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-none font-black text-[9px] uppercase tracking-widest px-3">
                                                        {s.category}
                                                    </Badge>
                                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Original term</p>
                                                    <p className="text-lg font-black text-red-500 line-through decoration-2 opacity-50 italic">"{s.original}"</p>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-6 pt-2 space-y-4">
                                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                                                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Suggested</p>
                                                    <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 italic">"{s.suggested}"</p>
                                                </div>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.reason}</p>
                                                <Button 
                                                    className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs gap-3"
                                                    onClick={() => applySuggestion(s)}
                                                >
                                                    Apply Change
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )) : (
                                    <div className="py-20 text-center space-y-6">
                                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto ring-8 ring-slate-50 dark:ring-slate-800/50">
                                            <ThumbsUp className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-slate-900 dark:text-white">Analysis Ready</p>
                                            <p className="text-sm text-slate-500 font-medium max-w-[200px] mx-auto">No suggestions found yet. Type something to begin analysis.</p>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
