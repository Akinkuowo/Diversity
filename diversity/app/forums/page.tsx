'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    MessageSquare,
    MessageCircle,
    Eye,
    ThumbsUp,
    Clock,
    Sparkles,
    ChevronRight,
    Plus,
    Filter,
    ArrowRight,
    TrendingUp
} from 'lucide-react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Link from 'next/link'
import { CreateThreadDialog } from '../components/dashboard/forum/create-thread-dialog'

export default function ForumsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ForumsContent />
        </Suspense>
    )
}

function ForumsContent() {
    const searchParams = useSearchParams()
    const [posts, setPosts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [user, setUser] = useState<any>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [userData, categoriesData] = await Promise.all([
                    api.get('/me'),
                    api.get('/forum/categories')
                ])
                setUser(userData)
                setCategories(categoriesData)
            } catch (err) {
                console.error('Failed to fetch initial data', err)
            }
        }
        fetchInitialData()

        if (searchParams.get('create') === 'true') {
            setIsCreateDialogOpen(true)
        }
    }, [searchParams])

    useEffect(() => {
        fetchPosts()
        const debounce = setTimeout(fetchPosts, 300)
        return () => clearTimeout(debounce)
    }, [selectedCategory, searchTerm])

    const fetchPosts = async () => {
        setIsLoading(true)
        try {
            const data = await api.get(`/forum/posts?category=${selectedCategory}&search=${searchTerm}`)
            setPosts(data)
        } catch (err) {
            toast.error('Failed to load forum posts')
        } finally {
            setIsLoading(false)
        }
    }

    const role = user?.role || 'COMMUNITY_MEMBER'

    return (
        <DashboardLayout role={role}>
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Hero / Header */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#134e4a] via-[#0d9488] to-[#0f172a] p-8 md:p-14 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />

                    <div className="relative z-10 max-w-3xl space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl text-sm font-semibold border border-white/20 shadow-inner"
                        >
                            <Sparkles className="w-4 h-4 text-primary-300" />
                            Community Knowledge Hub
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl font-black leading-tight tracking-tight"
                        >
                            The Center for <span className="text-primary-300">Dialogue</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/70 text-lg md:text-xl font-medium max-w-xl"
                        >
                            Join meaningful conversations, share your expertise, and connect with peers across the global Diversity Network.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-4 pt-4"
                        >
                            <Button
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="rounded-2xl h-12 px-8 bg-white text-[#0d9488] hover:bg-gray-100 font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                            >
                                Start a Discussion
                            </Button>
                            <Button variant="outline" className="rounded-2xl h-12 px-8 bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm font-bold">
                                View Guidelines
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Filters & Search Row */}
                <div className="sticky top-4 z-40 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-[2rem] shadow-xl border border-gray-100/50 dark:border-gray-800/50">
                    <div className="relative w-full md:w-[400px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search discussions, questions, tags..."
                            className="pl-12 h-14 bg-gray-50/50 dark:bg-slate-800/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary-500/50 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide max-w-full">
                        <Button
                            variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setSelectedCategory('all')}
                            className={`rounded-xl px-4 h-10 font-bold transition-all ${selectedCategory === 'all' ? 'bg-primary-600 text-white' : 'text-gray-500'}`}
                        >
                            All Topics
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={selectedCategory === cat.id ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`rounded-xl px-4 h-10 font-bold transition-all ${selectedCategory === cat.id ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:text-primary-600'}`}
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Posts List */}
                    <div className="lg:col-span-3 space-y-6">
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-48 rounded-3xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
                                ))}
                            </div>
                        ) : posts.length > 0 ? (
                            <AnimatePresence mode="popLayout">
                                {posts.map((post, i) => (
                                    <motion.div
                                        key={post.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4, delay: i * 0.05 }}
                                    >
                                        <Link href={`/forums/${post.id}`}>
                                            <Card className="group relative overflow-hidden rounded-[2rem] border-none shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                                                {post.isPinned && (
                                                    <div className="absolute top-0 right-0 p-1 bg-primary-500 text-white rounded-bl-2xl">
                                                        <TrendingUp className="w-4 h-4 p-0.5" />
                                                    </div>
                                                )}

                                                <CardContent className="p-8">
                                                    <div className="flex flex-col md:flex-row gap-6">
                                                        {/* Avatar & Info */}
                                                        <div className="flex md:flex-col items-center gap-3 shrink-0">
                                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 p-0.5 shadow-lg group-hover:rotate-6 transition-transform duration-500">
                                                                <div className="w-full h-full rounded-[0.875rem] bg-white dark:bg-slate-900 overflow-hidden">
                                                                    <img
                                                                        src={post.author?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.firstName || 'User'}`}
                                                                        alt={post.author?.firstName || 'User'}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex md:flex-col md:items-center text-center">
                                                                <span className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{post.author?.firstName || 'Anonymous'}</span>
                                                                <Badge variant="outline" className="mt-1 text-[10px] bg-gray-50 dark:bg-slate-800 uppercase tracking-widest border-none">Member</Badge>
                                                            </div>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 space-y-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <Badge className="bg-primary-50 dark:bg-primary-950/30 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 border-none font-bold text-[10px] uppercase tracking-wider">
                                                                        {categories.find(c => c.id === post.category)?.name || post.category}
                                                                    </Badge>
                                                                    <span className="text-gray-400 text-xs flex items-center gap-1 font-medium">
                                                                        <Clock className="w-3 h-3" />
                                                                        {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                                    </span>
                                                                </div>
                                                                <h2 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors tracking-tight leading-snug lg:line-clamp-2">
                                                                    {post.title}
                                                                </h2>
                                                                <p className="text-gray-500 dark:text-gray-400 font-medium line-clamp-2 leading-relaxed">
                                                                    {post.content}
                                                                </p>
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                                                                <div className="flex items-center gap-5">
                                                                    <div className="flex items-center gap-1.5 text-gray-500 hover:text-primary-500 transition-colors">
                                                                        <MessageCircle className="w-4 h-4" />
                                                                        <span className="text-sm font-bold">{post._count?.comments || 0}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors">
                                                                        <ThumbsUp className="w-4 h-4" />
                                                                        <span className="text-sm font-bold">{post._count?.likes || 0}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-gray-500">
                                                                        <Eye className="w-4 h-4" />
                                                                        <span className="text-sm font-bold">{post.views || 0}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="ml-auto flex gap-1">
                                                                    {post.tags.slice(0, 2).map((tag: string) => (
                                                                        <span key={tag} className="px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 text-[10px] font-bold">#{tag}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                                <MessageSquare className="w-20 h-20 mx-auto mb-6 text-gray-100" />
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">No discussions found</h3>
                                <p className="text-gray-500 max-w-xs mx-auto mt-2 font-medium">Be the first to start a conversation about {selectedCategory === 'all' ? 'everything' : selectedCategory}!</p>
                                <Button
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="mt-8 rounded-2xl h-12 px-8 bg-primary-600 hover:bg-primary-700 text-white font-bold transition-transform hover:scale-105 active:scale-95"
                                >
                                    Create New Thread
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Stats */}
                    <div className="space-y-8">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-primary-50 dark:bg-primary-950/20 p-5 rounded-3xl border border-primary-100/50 dark:border-primary-900/30">
                                <div className="text-3xl font-black text-primary-600">
                                    {posts.length}+
                                </div>
                                <div className="text-xs font-bold text-primary-600/60 uppercase tracking-widest mt-1">Discussions</div>
                            </div>
                            <div className="bg-secondary-50 dark:bg-secondary-950/20 p-5 rounded-3xl border border-secondary-100/50 dark:border-secondary-900/30">
                                <div className="text-3xl font-black text-secondary-600">
                                    {posts.reduce((acc, p) => acc + (p._count?.comments || 0), 0)}+
                                </div>
                                <div className="text-xs font-bold text-secondary-600/60 uppercase tracking-widest mt-1">Total replies</div>
                            </div>
                        </div>

                        {/* Top Channels/Categories */}
                        <Card className="rounded-[2rem] border-none bg-white dark:bg-slate-900 shadow-xl overflow-hidden shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
                            <CardHeader className="bg-gray-50/50 dark:bg-white/5 p-6 border-b border-gray-50 dark:border-gray-800">
                                <CardTitle className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Active Chapters</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-950/30 group transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-600 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                                                <Filter className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{cat.name}</div>
                                                <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{cat.description?.slice(0, 25)}...</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-transform group-hover:translate-x-1" />
                                    </button>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Community Spotlight */}
                        <div className="relative overflow-hidden group rounded-[2.5rem] bg-[#0f172a] text-white p-8 shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                <Sparkles className="w-20 h-20" />
                            </div>
                            <h4 className="text-xl font-black mb-4 leading-tight tracking-tight">Support Global <span className="text-primary-400">Diversity</span> Efforts</h4>
                            <p className="text-sm text-gray-400 font-medium mb-6">Contribute to open projects and earn community impact points.</p>
                            <Button className="w-full h-12 rounded-2xl bg-primary-600 hover:bg-primary-700 transition-all font-bold group-hover:shadow-[0_0_20px_-5px_rgba(13,148,136,0.6)]">
                                See Impact Missions
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <CreateThreadDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                categories={categories}
                onThreadCreated={(newThread) => {
                    setPosts([newThread, ...posts])
                }}
            />
        </DashboardLayout>
    )
}
