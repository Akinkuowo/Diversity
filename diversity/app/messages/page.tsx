'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Send,
    Search,
    MessageSquare,
    ArrowLeft,
    MoreVertical,
    Check,
    CheckCheck,
    Smile,
    Paperclip,
    Users
} from 'lucide-react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Message {
    id: string
    content: string
    senderId: string
    createdAt: string
    readBy: string[]
    sender: { id: string; firstName: string; lastName: string }
}

interface Conversation {
    id: string
    participants: {
        id: string
        firstName: string
        lastName: string
        role: string
        profile: { avatar: string | null } | null
    }[]
    messages: Message[]
    lastMessageAt: string
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"/></div>}>
            <MessagesContent />
        </Suspense>
    )
}

function MessagesContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [user, setUser] = useState<any>(null)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await api.get('/me')
                setUser(userData)
            } catch {
                toast.error('Please log in to view messages')
                router.push('/login')
            }
        }
        fetchUser()
    }, [router])

    useEffect(() => {
        if (!user) return
        const fetchConvos = async () => {
            try {
                const data = await api.get('/community/conversations')
                setConversations(data || [])

                // If userId param is in query, start/find a conversation
                const recipientId = searchParams.get('userId')
                if (recipientId) {
                    const existing = data?.find((c: Conversation) =>
                        c.participants.some((p) => p.id === recipientId)
                    )
                    if (existing) {
                        handleSelectConversation(existing)
                    } else {
                        // Create by sending an empty placeholder — we'll handle on first send
                        const fakeName = 'New Chat'
                        setActiveConversation({ id: 'new', participants: [], messages: [], lastMessageAt: new Date().toISOString() })
                    }
                }
            } catch (err) {
                console.error(err)
            }
        }
        fetchConvos()
    }, [user, searchParams])

    const handleSelectConversation = async (convo: Conversation) => {
        setActiveConversation(convo)
        try {
            const msgs = await api.get(`/community/conversations/${convo.id}/messages`)
            setMessages(msgs || [])
        } catch {
            toast.error('Could not load messages')
        }
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
        setTimeout(() => inputRef.current?.focus(), 200)
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return
        const messageText = newMessage.trim()
        setNewMessage('')

        const recipientId = searchParams.get('userId')
        const isNewConvo = activeConversation?.id === 'new'

        try {
            const sent = await api.post('/community/messages', {
                content: messageText,
                conversationId: isNewConvo ? undefined : activeConversation?.id,
                recipientId: isNewConvo ? recipientId : undefined
            })

            setMessages((prev) => [...prev, sent])
            
            // If it was a new conversation, refresh to get real convo
            if (isNewConvo) {
                const updatedConvos = await api.get('/community/conversations')
                setConversations(updatedConvos)
                const newConvo = updatedConvos.find((c: Conversation) =>
                    c.participants.some((p: any) => p.id === recipientId)
                )
                if (newConvo) setActiveConversation(newConvo)
            } else {
                // Update last message in sidebar
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === activeConversation?.id
                            ? { ...c, messages: [sent], lastMessageAt: new Date().toISOString() }
                            : c
                    )
                )
            }
        } catch {
            toast.error('Failed to send message')
            setNewMessage(messageText)
        }

        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }

    const getOtherParticipant = (convo: Conversation) => {
        return convo.participants.find((p) => p.id !== user?.id) || convo.participants[0]
    }

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        if (diffDays === 1) return 'Yesterday'
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }

    const filteredConversations = conversations.filter((c) => {
        const other = getOtherParticipant(c)
        const name = `${other?.firstName} ${other?.lastName}`.toLowerCase()
        return name.includes(searchTerm.toLowerCase())
    })

    const role = user?.role || 'COMMUNITY_MEMBER'

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-80px)] gap-0 rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                
                {/* Sidebar */}
                <div className={cn(
                    "w-full md:w-[340px] lg:w-[380px] flex-shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-800",
                    activeConversation ? "hidden md:flex" : "flex"
                )}>
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search conversations..."
                                className="pl-11 h-11 bg-slate-50 dark:bg-slate-800/50 border-0 rounded-xl text-[14px] font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Conversation list */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <MessageSquare className="w-8 h-8 text-slate-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-700 dark:text-slate-200">No conversations yet</p>
                                    <p className="text-sm text-slate-500 mt-1">Visit the Network page to start connecting</p>
                                </div>
                                <Button variant="outline" className="rounded-xl" onClick={() => router.push('/community/network')}>
                                    <Users className="w-4 h-4 mr-2" /> Browse Network
                                </Button>
                            </div>
                        ) : (
                            filteredConversations.map((convo) => {
                                const other = getOtherParticipant(convo)
                                const lastMsg = convo.messages[0]
                                const isActive = activeConversation?.id === convo.id
                                return (
                                    <button
                                        key={convo.id}
                                        onClick={() => handleSelectConversation(convo)}
                                        className={cn(
                                            "w-full flex items-center gap-4 p-4 transition-all text-left",
                                            "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                                            isActive ? "bg-primary-50 dark:bg-primary-950/20 border-r-2 border-primary-500" : ""
                                        )}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                                {other?.profile?.avatar ? (
                                                    <img src={other.profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-primary-600 font-black">
                                                        {other?.firstName?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <span className="font-bold text-slate-900 dark:text-white text-[14px] truncate">
                                                    {other?.firstName} {other?.lastName}
                                                </span>
                                                {lastMsg && (
                                                    <span className="text-[11px] text-slate-400 ml-2 flex-shrink-0">
                                                        {formatTime(lastMsg.createdAt)}
                                                    </span>
                                                )}
                                            </div>
                                            {lastMsg ? (
                                                <p className="text-[13px] text-slate-500 dark:text-slate-400 truncate">
                                                    {lastMsg.senderId === user?.id ? 'You: ' : ''}{lastMsg.content}
                                                </p>
                                            ) : (
                                                <p className="text-[13px] italic text-slate-400">No messages yet</p>
                                            )}
                                        </div>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                {activeConversation ? (
                    <div className={cn("flex-1 flex flex-col", !activeConversation ? "hidden md:flex" : "flex")}>
                        {/* Chat Header */}
                        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="md:hidden rounded-xl" onClick={() => setActiveConversation(null)}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            {activeConversation.id !== 'new' && (() => {
                                const other = getOtherParticipant(activeConversation)
                                return (
                                    <>
                                        <div className="relative">
                                            <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                                {other?.profile?.avatar ? (
                                                    <img src={other.profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-primary-600 font-black">
                                                        {other?.firstName?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-slate-900 dark:text-white">{other?.firstName} {other?.lastName}</p>
                                            <p className="text-xs text-emerald-500 font-bold">Active now</p>
                                        </div>
                                    </>
                                )
                            })()}
                            <Button variant="ghost" size="icon" className="rounded-xl ml-auto">
                                <MoreVertical className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
                            <AnimatePresence>
                                {messages.map((msg, i) => {
                                    const isMe = msg.senderId === user?.id
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn("flex items-end gap-2", isMe ? "flex-row-reverse" : "flex-row")}
                                        >
                                            {!isMe && (
                                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[11px] font-black text-slate-500 flex-shrink-0">
                                                    {msg.sender.firstName[0]}
                                                </div>
                                            )}
                                            <div className={cn(
                                                "max-w-[70%] px-4 py-3 rounded-2xl text-[14px] font-medium",
                                                isMe
                                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-br-sm"
                                                    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm rounded-bl-sm"
                                            )}>
                                                <p>{msg.content}</p>
                                                <div className={cn("flex items-center gap-1 mt-1.5", isMe ? "justify-end" : "justify-start")}>
                                                    <span className={cn("text-[10px]", isMe ? "text-white/60 dark:text-slate-500" : "text-slate-400")}>
                                                        {formatTime(msg.createdAt)}
                                                    </span>
                                                    {isMe && (
                                                        msg.readBy.length > 1
                                                            ? <CheckCheck className="w-3 h-3 text-cyan-400" />
                                                            : <Check className="w-3 h-3 text-white/50" />
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-2">
                                <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-slate-600 flex-shrink-0">
                                    <Smile className="w-5 h-5" />
                                </Button>
                                <Input
                                    ref={inputRef}
                                    placeholder="Type a message..."
                                    className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-[15px] font-medium"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            handleSendMessage()
                                        }
                                    }}
                                />
                                <Button
                                    size="icon"
                                    className={cn(
                                        "rounded-xl transition-all flex-shrink-0",
                                        newMessage.trim()
                                            ? "bg-slate-900 dark:bg-white hover:bg-primary-600 text-white dark:text-slate-900 shadow-md"
                                            : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                                    )}
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-6 bg-slate-50/50 dark:bg-slate-950/20">
                        <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <MessageSquare className="w-12 h-12 text-slate-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Select a conversation</h3>
                            <p className="text-slate-500 mt-2 font-medium">Choose from your existing chats or start a new one from the Network page</p>
                        </div>
                        <Button variant="outline" className="rounded-xl" onClick={() => router.push('/community/network')}>
                            <Users className="w-4 h-4 mr-2" /> Browse Network
                        </Button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
