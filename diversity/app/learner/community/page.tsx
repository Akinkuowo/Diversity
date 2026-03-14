'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users2,
    MessageSquare,
    Search,
    Filter,
    UserPlus,
    UserCheck,
    MessageCircle,
    Heart,
    Share2,
    TrendingUp,
    Globe,
    Award,
    Sparkles,
    Send,
    Loader2,
    MoreHorizontal,
    Image as ImageIcon,
    Smile,
    ArrowUpRight,
    AtSign,
    BookOpen,
    Trophy
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function LearnerCommunityPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [network, setNetwork] = useState<any[]>([])
    const [connections, setConnections] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('feed')
    const [newPost, setNewPost] = useState('')
    const [isPosting, setIsPosting] = useState(false)
    const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set())
    const [comments, setComments] = useState<{ [key: string]: any[] }>({})
    const [commentLoading, setCommentLoading] = useState<{ [key: string]: boolean }>({})
    const [newComments, setNewComments] = useState<{ [key: string]: string }>({})
    const [isCommenting, setIsCommenting] = useState<{ [key: string]: boolean }>({})

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [postsData, networkData, connectionsData] = await Promise.all([
                api.get('/posts'),
                api.get('/community/network'),
                api.get('/community/connections')
            ])
            setPosts(postsData)
            setNetwork(networkData.profiles || [])
            setConnections(connectionsData)
        } catch (err: any) {
            console.error('Failed to fetch community data:', err)
            toast.error('Failed to load community hub')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPost.trim()) return

        setIsPosting(true)
        try {
            const post = await api.post('/posts', { content: newPost })
            setPosts([post, ...posts])
            setNewPost('')
            toast.success('Post shared with the community!')
        } catch (err: any) {
            toast.error('Failed to share post')
        } finally {
            setIsPosting(false)
        }
    }

    const handleConnect = async (userId: string) => {
        try {
            await api.post('/community/network/connect', { recipientId: userId })
            toast.success('Connection request sent!')
            fetchData()
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to connect')
        }
    }

    const handleLike = async (postId: string) => {
        try {
            await api.post(`/posts/${postId}/like`, {})
            setPosts(posts.map(p => {
                if (p.id === postId) {
                    return { ...p, likes: (p.likes || 0) + 1 }
                }
                return p
            }))
        } catch (err) {
            toast.error('Failed to like post')
        }
    }

    const handleToggleComments = async (postId: string) => {
        const isExpanded = expandedPosts.has(postId)
        const newExpanded = new Set(expandedPosts)
        
        if (isExpanded) {
            newExpanded.delete(postId)
        } else {
            newExpanded.add(postId)
            if (!comments[postId]) {
                fetchComments(postId)
            }
        }
        setExpandedPosts(newExpanded)
    }

    const fetchComments = async (postId: string) => {
        setCommentLoading(prev => ({ ...prev, [postId]: true }))
        try {
            const data = await api.get(`/posts/${postId}/comments`)
            setComments(prev => ({ ...prev, [postId]: data }))
        } catch (err) {
            toast.error('Failed to load comments')
        } finally {
            setCommentLoading(prev => ({ ...prev, [postId]: false }))
        }
    }

    const handleAddComment = async (e: React.FormEvent, postId: string) => {
        e.preventDefault()
        const content = newComments[postId]
        if (!content?.trim()) return

        setIsCommenting(prev => ({ ...prev, [postId]: true }))
        try {
            const comment = await api.post(`/posts/${postId}/comments`, { content })
            setComments(prev => ({
                ...prev,
                [postId]: [comment, ...(prev[postId] || [])]
            }))
            setNewComments(prev => ({ ...prev, [postId]: '' }))
            setPosts(posts.map(p => {
                if (p.id === postId) {
                    return { ...p, commentCount: (p.commentCount || 0) + 1 }
                }
                return p
            }))
            toast.success('Comment posted!')
        } catch (err) {
            toast.error('Failed to post comment')
        } finally {
            setIsCommenting(prev => ({ ...prev, [postId]: false }))
        }
    }

    return (
        <DashboardLayout role="LEARNER">
            <div className="max-w-6xl mx-auto space-y-8 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                            Learner Community
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Connect with fellow learners and diversity-first professionals.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-2xl border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-slate-950 font-bold capitalize">
                            <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                            Community Guidelines
                        </Button>
                    </div>
                </div>

                {/* Main Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-[1.5rem] w-full md:w-fit border border-gray-100 dark:border-gray-800">
                        <TabsTrigger value="feed" className="rounded-xl px-8 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm font-black uppercase tracking-widest text-[10px]">
                            < Globe className="w-4 h-4 mr-2" />
                            Community Feed
                        </TabsTrigger>
                        <TabsTrigger value="network" className="rounded-xl px-8 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm font-black uppercase tracking-widest text-[10px]">
                            <Users2 className="w-4 h-4 mr-2" />
                            Discover Network
                        </TabsTrigger>
                        <TabsTrigger value="connections" className="rounded-xl px-8 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm font-black uppercase tracking-widest text-[10px]">
                            <UserCheck className="w-4 h-4 mr-2" />
                            My Connections
                            {connections.length > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-2">
                                    {connections.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Tab Content Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <TabsContent value="feed" className="m-0 space-y-6">
                                {/* Create Post Card */}
                                <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                                    <form onSubmit={handleCreatePost} className="p-8 space-y-6">
                                        <div className="flex gap-4">
                                            <Avatar className="w-12 h-12 ring-4 ring-blue-50 dark:ring-blue-900/20">
                                                <AvatarImage src="" />
                                                <AvatarFallback className="bg-blue-600 text-white font-black">L</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <textarea
                                                    placeholder="Share a learning milestone, ask a question, or spark a discussion..."
                                                    className="w-full bg-transparent border-none resize-none focus:ring-0 text-lg placeholder:text-gray-400 dark:placeholder:text-gray-600 min-h-[120px] font-medium"
                                                    value={newPost}
                                                    onChange={(e) => setNewPost(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800/50">
                                            <div className="flex gap-2">
                                                <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 rounded-2xl hover:bg-blue-50">
                                                    <ImageIcon className="w-5 h-5" />
                                                </Button>
                                                <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 rounded-2xl hover:bg-blue-50">
                                                    <AtSign className="w-5 h-5" />
                                                </Button>
                                                <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 rounded-2xl hover:bg-blue-50">
                                                    <Smile className="w-5 h-5" />
                                                </Button>
                                            </div>
                                            <Button 
                                                type="submit" 
                                                className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-8 h-14 font-black shadow-2xl shadow-slate-200 dark:shadow-none min-w-[140px]"
                                                disabled={isPosting || !newPost.trim()}
                                            >
                                                {isPosting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5 mr-3" /> Post</>}
                                            </Button>
                                        </div>
                                    </form>
                                </Card>

                                {/* Feed Items */}
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Synchronizing feed...</p>
                                    </div>
                                ) : posts.map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="rounded-[2.5rem] border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900 overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800 group">
                                            <CardContent className="p-8 space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex gap-4">
                                                        <Avatar className="w-12 h-12 ring-2 ring-slate-100">
                                                            <AvatarImage src={post.user.profile?.avatar} />
                                                            <AvatarFallback className="bg-slate-100 text-slate-900 font-bold">
                                                                {post.user.firstName[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-black text-slate-900 dark:text-white text-lg">
                                                                    {post.user.firstName} {post.user.lastName}
                                                                </p>
                                                                {post.user.role === 'LEARNER' && <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] py-0 px-2 uppercase font-black tracking-widest">Learner</Badge>}
                                                            </div>
                                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{new Date(post.createdAt).toLocaleDateString()} • Community Hub</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="rounded-2xl text-slate-300 hover:text-slate-900 hover:bg-slate-50">
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-200 text-lg font-medium leading-relaxed">
                                                    {post.content}
                                                </p>
                                                <div className="flex items-center gap-8 pt-6 border-t border-slate-50 dark:border-slate-800/50">
                                                    <button 
                                                        onClick={() => handleLike(post.id)}
                                                        className="flex items-center gap-3 text-sm font-black text-slate-400 hover:text-rose-500 transition-colors group/btn"
                                                    >
                                                        <div className="p-2.5 rounded-2xl group-hover/btn:bg-rose-50 dark:group-hover/btn:bg-rose-900/20 transition-colors bg-slate-50 dark:bg-slate-800">
                                                            <Heart className="w-5 h-5" />
                                                        </div>
                                                        <span>{post.likes || 0}</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleToggleComments(post.id)}
                                                        className={cn(
                                                            "flex items-center gap-3 text-sm font-black transition-colors group/btn",
                                                            expandedPosts.has(post.id) ? "text-blue-600" : "text-slate-400 hover:text-blue-600"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "p-2.5 rounded-2xl transition-colors",
                                                            expandedPosts.has(post.id) ? "bg-blue-50 dark:bg-blue-900/20" : "bg-slate-50 dark:bg-slate-800 group-hover/btn:bg-blue-50"
                                                        )}>
                                                            <MessageCircle className="w-5 h-5" />
                                                        </div>
                                                        <span>{post.commentCount || 0}</span>
                                                    </button>
                                                    <button className="flex items-center gap-3 text-sm font-black text-slate-400 hover:text-indigo-600 transition-colors group/btn">
                                                        <div className="p-2.5 rounded-2xl group-hover/btn:bg-indigo-50 dark:group-hover/btn:bg-indigo-900/20 transition-colors bg-slate-50 dark:bg-slate-800">
                                                            <Share2 className="w-5 h-5" />
                                                        </div>
                                                        <span className="hidden sm:inline">Share Impact</span>
                                                    </button>
                                                </div>

                                                {/* Comment Section */}
                                                <AnimatePresence>
                                                    {expandedPosts.has(post.id) && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="space-y-6 pt-6 overflow-hidden"
                                                        >
                                                            {/* New Comment Input */}
                                                            <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex gap-4">
                                                                <Avatar className="w-8 h-8 ring-2 ring-slate-100">
                                                                    <AvatarFallback className="bg-blue-600 text-white text-[10px] font-black">L</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 flex gap-2">
                                                                    <Input 
                                                                        placeholder="Write a comment..." 
                                                                        className="rounded-xl bg-slate-50 border-none focus-visible:ring-1 ring-blue-500 h-10 font-medium"
                                                                        value={newComments[post.id] || ''}
                                                                        onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                                    />
                                                                    <Button 
                                                                        type="submit" 
                                                                        size="icon" 
                                                                        className="bg-slate-900 text-white rounded-xl h-10 w-10 shrink-0"
                                                                        disabled={isCommenting[post.id] || !newComments[post.id]?.trim()}
                                                                    >
                                                                        {isCommenting[post.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                                    </Button>
                                                                </div>
                                                            </form>

                                                            {/* Comment List */}
                                                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                                {commentLoading[post.id] ? (
                                                                    <div className="flex justify-center py-4">
                                                                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                                                    </div>
                                                                ) : comments[post.id]?.length > 0 ? (
                                                                    comments[post.id].map((comment) => (
                                                                        <div key={comment.id} className="flex gap-3">
                                                                            <Avatar className="w-8 h-8">
                                                                                <AvatarImage src={comment.user.profile?.avatar} />
                                                                                <AvatarFallback className="bg-slate-100 text-slate-900 text-[10px] font-bold">
                                                                                    {comment.user.firstName[0]}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 flex-1">
                                                                                <div className="flex justify-between items-center mb-1">
                                                                                    <p className="font-bold text-xs">{comment.user.firstName} {comment.user.lastName}</p>
                                                                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(comment.createdAt).toLocaleDateString()}</p>
                                                                                </div>
                                                                                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                                                                    {comment.content}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest py-4">No comments yet. Start the conversation!</p>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </TabsContent>

                            <TabsContent value="network" className="m-0 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {network.map((profile, index) => (
                                        <motion.div
                                            key={profile.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card className="rounded-[2.5rem] border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                                                <CardContent className="p-6 flex items-center gap-5">
                                                    <Avatar className="w-16 h-16 ring-4 ring-slate-50 dark:ring-slate-800">
                                                        <AvatarImage src={profile.avatar} />
                                                        <AvatarFallback className="bg-blue-600 text-white font-black">
                                                            {profile.user.firstName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-black text-slate-900 dark:text-white truncate text-lg">
                                                            {profile.user.firstName} {profile.user.lastName}
                                                        </h4>
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider truncate">
                                                            {profile.title || (profile.user.role.toLowerCase().replace('_', ' '))}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-3">
                                                            <Badge variant="outline" className="text-[9px] font-black uppercase rounded-lg border-slate-200 text-slate-500 tracking-widest px-2 py-0.5">
                                                                <Award className="w-3 h-3 mr-1 text-amber-500" />
                                                                {profile.impactPoints} Impact Pts
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        size="icon" 
                                                        className="rounded-2xl bg-slate-900 text-white hover:bg-slate-800 h-12 w-12 shrink-0 shadow-lg shadow-slate-200"
                                                        onClick={() => handleConnect(profile.user.id)}
                                                    >
                                                        <UserPlus className="w-5 h-5" />
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="connections" className="m-0 space-y-6">
                                {connections.length > 0 ? (
                                    <div className="space-y-4">
                                        {connections.map((conn, index) => {
                                            const otherUser = conn.requester.id === 'current-user-id' ? conn.recipient : conn.requester
                                            return (
                                                <Card key={conn.id} className="rounded-[2rem] border-none bg-white dark:bg-slate-900 shadow-md ring-1 ring-slate-100">
                                                    <CardContent className="p-6 flex items-center gap-5">
                                                        <Avatar className="w-14 h-14 ring-2 ring-slate-50">
                                                            <AvatarImage src={otherUser.profile?.avatar} />
                                                            <AvatarFallback className="bg-slate-100 text-slate-900 font-black">{otherUser.firstName[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <p className="font-black text-lg">{otherUser.firstName} {otherUser.lastName}</p>
                                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{otherUser.role.replace('_', ' ')}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" className="rounded-xl font-black border-slate-200 h-10 px-5 text-xs uppercase tracking-widest">
                                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                                Chat
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-800/30 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800 space-y-8">
                                        <div className="w-24 h-24 rounded-[2rem] bg-white dark:bg-slate-900 flex items-center justify-center mx-auto shadow-xl">
                                            <UserCheck className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Expand Your Network</h3>
                                            <p className="text-slate-500 max-w-sm mx-auto font-medium">
                                                Collaborate with fellow learners and professionals to amplify your DEI industry knowledge.
                                            </p>
                                        </div>
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 px-10 font-black shadow-xl shadow-blue-200" onClick={() => setActiveTab('network')}>
                                            Find Mentors & Peers
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-8">
                            {/* Trending Column */}
                            <Card className="rounded-[2.5rem] border-none bg-slate-900 text-white overflow-hidden shadow-2xl relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[60px] -mr-16 -mt-16" />
                                <CardHeader className="p-8 pb-4 border-b border-white/5 relative z-10">
                                    <CardTitle className="text-lg font-black flex items-center gap-3 uppercase tracking-tighter">
                                        <div className="p-2 bg-rose-500/20 rounded-xl">
                                            <TrendingUp className="w-5 h-5 text-rose-500" />
                                        </div>
                                        Trending Skills
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6 relative z-10">
                                    {[
                                        { tag: '#InclusiveCulture', count: 2450, trend: 'up' },
                                        { tag: '#LearningMilestone', count: 1890, trend: 'up' },
                                        { tag: '#LeadershipUnleashed', count: 1240, trend: 'stable' },
                                        { tag: '#DEIExpert', count: 980, trend: 'up' },
                                    ].map((hashtag) => (
                                        <div key={hashtag.tag} className="flex justify-between items-center group cursor-pointer">
                                            <div>
                                                <p className="font-black text-slate-100 group-hover:text-blue-400 transition-colors text-lg tracking-tight">{hashtag.tag}</p>
                                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">{hashtag.count.toLocaleString()} engagement</p>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-blue-500/20 transition-colors">
                                                <ArrowUpRight className="w-4 h-4 text-blue-400" />
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="ghost" className="w-full rounded-2xl h-12 text-xs font-black text-slate-400 hover:text-white hover:bg-white/5 uppercase tracking-widest mt-2">
                                        Explored All Trends
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Learning Resources */}
                            <Card className="rounded-[2.5rem] border-none bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden shadow-2xl">
                                <CardContent className="p-8 space-y-6">
                                    <div className="p-4 bg-white/10 rounded-[1.5rem] w-fit">
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black leading-tight">Master Classes</h3>
                                        <p className="text-sm text-blue-100 font-medium">Exclusive workshops with industry leaders starting every Monday.</p>
                                    </div>
                                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-black h-14 shadow-xl shadow-blue-900/30 text-lg uppercase tracking-widest">
                                        View Schedule
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Leaderboard Glimpse */}
                            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden ring-1 ring-slate-100">
                                <CardContent className="p-8 text-center space-y-6">
                                    <div className="relative inline-block">
                                        <div className="w-24 h-24 rounded-[2rem] border-8 border-blue-50 flex items-center justify-center">
                                            <Trophy className="w-12 h-12 text-blue-600" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-xl ring-1 ring-slate-100">
                                            <div className="bg-amber-500 text-white rounded-xl p-1.5 flex items-center justify-center">
                                                <Sparkles className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-2xl uppercase tracking-tighter text-slate-900">Rising Star</h4>
                                        <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Global Ranking: #124</p>
                                    </div>
                                    <div className="pt-2">
                                        <Button variant="outline" className="w-full rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest border-slate-100 text-slate-500">
                                            Full Leaderboard
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
