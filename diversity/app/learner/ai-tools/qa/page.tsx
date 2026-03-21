'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sparkles,
    Search,
    Send,
    Bot,
    User,
    ArrowLeft,
    RotateCcw,
    ThumbsUp,
    ThumbsDown,
    Copy,
    Share2,
    MessageSquare,
    Brain,
    Globe,
    Shield,
    Info,
    ChevronDown,
    Zap,
    Lightbulb,
    AlertCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

const suggestedQuestions = [
    "What is unconscious bias?",
    "How can I foster an inclusive remote team?",
    "Explain the concept of equity vs equality.",
    "Best practices for inclusive language in recruitment.",
    "What are the benefits of a diverse leadership team?"
]

export default function AIQAPage() {
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm your AI Diversity Assistant. I'm here to provide evidence-based answers to your questions about Diversity, Equity, and Inclusion (DEI). How can I help you today?",
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleSend = async (content: string = input) => {
        if (!content.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        // Simulated AI Response
        setTimeout(() => {
            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: generateAIResponse(content),
                timestamp: new Date()
            }
            setMessages(prev => [...prev, assistantMsg])
            setIsTyping(false)
        }, 1500)
    }

    const generateAIResponse = (query: string) => {
        const q = query.toLowerCase()
        if (q.includes('bias')) return "Unconscious biases are social stereotypes about certain groups of people that individuals form outside their own conscious awareness. Everyone holds unconscious beliefs about various social and identity groups, and these biases stem from one's tendency to organize social worlds by categorizing."
        if (q.includes('remote')) return "Fostering an inclusive remote team involves clear communication guidelines, virtual bonding activities, and ensuring equitable access to opportunities. It's important to provide multiple channels for feedback and to be mindful of different time zones and personal circumstances."
        if (q.includes('equity')) return "While equality means providing everyone with the same tools and resources, equity involves recognizing that each person has different circumstances and allocating the exact resources and opportunities needed to reach an equal outcome."
        return "That's a complex and important question! In a professional context, addressing this involves a multi-faceted approach including education, system-level adjustments, and consistent behavioral modelling from leadership. Would you like to dive deeper into any specific aspect of this?"
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
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
                            <div className="p-3 bg-red-500/10 rounded-2xl">
                                <Search className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">AI Diversity Q&A</h1>
                                <p className="text-slate-500 font-medium">Instant, evidence-based DEI insights</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            className="rounded-xl border-slate-200 dark:border-slate-800 font-black h-12 px-6 hover:bg-slate-50 dark:hover:bg-slate-800"
                            onClick={() => setMessages([messages[0]])}
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset Chat
                        </Button>
                        <Button className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black h-12 px-6 shadow-xl">
                            <Share2 className="w-4 h-4 mr-2" />
                            Export Transcript
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
                    {/* Main Chat Area */}
                    <Card className="flex-1 flex flex-col rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white dark:bg-slate-900">
                        {/* Messages Scroll Area */}
                        <CardContent className="flex-1 overflow-y-auto p-8 space-y-8 min-h-0">
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex gap-4 max-w-[85%]",
                                            msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                            msg.role === 'user' ? "bg-slate-900 text-white" : "bg-red-500 text-white"
                                        )}>
                                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
                                        </div>
                                        <div className="space-y-2">
                                            <div className={cn(
                                                "p-6 rounded-3xl text-[15px] font-medium leading-relaxed shadow-sm",
                                                msg.role === 'user' 
                                                    ? "bg-slate-900 text-white rounded-tr-none" 
                                                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700"
                                            )}>
                                                {msg.content}
                                            </div>
                                            <div className={cn(
                                                "flex items-center gap-4 text-[10px] text-slate-400 font-black uppercase tracking-widest",
                                                msg.role === 'user' && "justify-end"
                                            )}>
                                                <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                {msg.role === 'assistant' && (
                                                    <div className="flex items-center gap-2">
                                                        <button className="hover:text-red-500 transition-colors"><ThumbsUp className="w-3 h-3" /></button>
                                                        <button className="hover:text-red-500 transition-colors"><ThumbsDown className="w-3 h-3" /></button>
                                                        <button 
                                                            className="hover:text-red-500 transition-colors"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(msg.content)
                                                                toast.success("Copied to clipboard")
                                                            }}
                                                        ><Copy className="w-3 h-3" /></button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isTyping && (
                                <div className="flex gap-4 mr-auto max-w-[85%]">
                                    <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-lg animate-pulse">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-3xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </CardContent>

                        {/* Input Area */}
                        <CardFooter className="p-8 pt-0 bg-white dark:bg-slate-900">
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSend()
                                }}
                                className="relative w-full group"
                            >
                                <Input 
                                    className="h-16 pl-6 pr-16 rounded-2xl border-none bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-red-500/50 transition-all font-bold placeholder:text-slate-400 text-lg shadow-inner"
                                    placeholder="Ask about diversity, inclusion, empathy..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <Button 
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-700 text-white shadow-xl flex items-center justify-center p-0 transition-transform active:scale-95 disabled:opacity-50"
                                >
                                    <Send className="w-6 h-6" />
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>

                    {/* Sidebar: Tips & Suggestions */}
                    <div className="w-full lg:w-80 flex flex-col gap-6">
                        <Card className="rounded-[2rem] border-none shadow-xl bg-gradient-to-br from-red-500 to-rose-600 text-white overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <div className="p-3 bg-white/20 rounded-2xl w-fit mb-4 backdrop-blur-md">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-xl font-black">AI Capability</CardTitle>
                                <CardDescription className="text-red-100 font-medium">I can help with training, terminology, and policy advice.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 space-y-4">
                                <div className="flex items-center gap-3 text-sm font-bold bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                    <Shield className="w-4 h-4" /> Confidential Chat
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                    <Globe className="w-4 h-4" /> Global DEI Standards
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="flex-1 rounded-[2rem] border-none shadow-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <CardHeader className="p-8 pb-4 border-b border-slate-50 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-black uppercase tracking-widest text-xs text-slate-400">Try these:</h3>
                                    <Lightbulb className="w-4 h-4 text-amber-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-2">
                                {suggestedQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(q)}
                                        className="w-full p-4 text-left text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-500 rounded-2xl transition-all group border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-[2rem] flex gap-4 border border-amber-100 dark:border-amber-900/30">
                            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                            <p className="text-xs text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
                                Avoid sharing personally identifiable information or specific employee data in this Q&A tool.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
