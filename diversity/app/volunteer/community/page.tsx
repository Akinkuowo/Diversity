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
    AtSign
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

export default function VolunteerCommunityPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [network, setNetwork] = useState<any[]>([])
    const [connections, setConnections] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('feed')
    const [newPost, setNewPost] = useState('')
    const [isPosting, setIsPosting] = useState(false)

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
                    return { ...p, _count: { ...p._count, likes: (p._count?.likes || 0) + 1 } }
                }
                return p
            }))
        } catch (err) {
            toast.error('Failed to like post')
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                            Volunteer Hub
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Engage, connect, and grow with the diversity-first network.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-2xl border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-slate-950">
                            <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                            Community Guidelines
                        </Button>
                    </div>
                </div>

                {/* Main Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-white/50 dark:bg-slate-900/50 p-1 rounded-2xl w-full md:w-fit border border-gray-100 dark:border-gray-800">
                        <TabsTrigger value="feed" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                            < Globe className="w-4 h-4 mr-2" />
                            Feed
                        </TabsTrigger>
                        <TabsTrigger value="network" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                            <Users2 className="w-4 h-4 mr-2" />
                            Explore Network
                        </TabsTrigger>
                        <TabsTrigger value="connections" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                            <UserCheck className="w-4 h-4 mr-2" />
                            Connections
                            {connections.length > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-2">
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
                                <Card className="rounded-[2rem] border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
                                    <form onSubmit={handleCreatePost} className="p-6 space-y-4">
                                        <div className="flex gap-4">
                                            <Avatar className="w-10 h-10 ring-2 ring-emerald-50 dark:ring-emerald-900/20">
                                                <AvatarImage src="" />
                                                <AvatarFallback className="bg-emerald-600 text-white font-bold">V</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <textarea
                                                    placeholder="Share a milestone, question, or impact update..."
                                                    className="w-full bg-transparent border-none resize-none focus:ring-0 text-lg placeholder:text-gray-400 dark:placeholder:text-gray-600 min-h-[100px]"
                                                    value={newPost}
                                                    onChange={(e) => setNewPost(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800/50">
                                            <div className="flex gap-2">
                                                <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-emerald-600 rounded-xl">
                                                    <ImageIcon className="w-5 h-5" />
                                                </Button>
                                                <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-emerald-600 rounded-xl">
                                                    <AtSign className="w-5 h-5" />
                                                </Button>
                                                <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-emerald-600 rounded-xl">
                                                    <Smile className="w-5 h-5" />
                                                </Button>
                                            </div>
                                            <Button 
                                                type="submit" 
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 font-bold shadow-lg shadow-emerald-100 dark:shadow-none"
                                                disabled={isPosting || !newPost.trim()}
                                            >
                                                {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Post</>}
                                            </Button>
                                        </div>
                                    </form>
                                </Card>

                                {/* Feed Items */}
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                                        <p className="mt-4 text-muted-foreground font-medium">Curating your feed...</p>
                                    </div>
                                ) : posts.map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="rounded-[2rem] border-gray-100 dark:border-gray-800 hover:shadow-md transition-all bg-white dark:bg-slate-900 overflow-hidden">
                                            <CardContent className="p-6 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex gap-3">
                                                        <Avatar className="w-10 h-10">
                                                            <AvatarImage src={post.user.profile?.avatar} />
                                                            <AvatarFallback className="bg-gray-100 text-gray-900 border border-gray-100">
                                                                {post.user.firstName[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                                {post.user.firstName} {post.user.lastName}
                                                                {post.user.role === 'VOLUNTEER' && <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] py-0 px-1.5 uppercase font-bold">Volunteer</Badge>}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()} • Global Feed</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="rounded-xl text-gray-400">
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                                <p className="text-[#1a1c1e] dark:text-gray-200 leading-relaxed">
                                                    {post.content}
                                                </p>
                                                <div className="flex items-center gap-6 pt-4 border-t border-gray-50 dark:border-gray-800/50">
                                                    <button 
                                                        onClick={() => handleLike(post.id)}
                                                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors group"
                                                    >
                                                        <div className="p-2 rounded-xl group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                                                            <Heart className="w-5 h-5" />
                                                        </div>
                                                        {post._count?.likes || 0}
                                                    </button>
                                                    <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group">
                                                        <div className="p-2 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                                            <MessageCircle className="w-5 h-5" />
                                                        </div>
                                                        {post._count?.comments || 0}
                                                    </button>
                                                    <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors group">
                                                        <div className="p-2 rounded-xl group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 transition-colors">
                                                            <Share2 className="w-5 h-5" />
                                                        </div>
                                                        Share
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </TabsContent>

                            <TabsContent value="network" className="m-0 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {network.map((profile, index) => (
                                        <motion.div
                                            key={profile.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card className="rounded-3xl border-gray-100 dark:border-gray-800 hover:shadow-sm transition-all bg-white dark:bg-slate-900">
                                                <CardContent className="p-5 flex items-center gap-4">
                                                    <Avatar className="w-14 h-14 ring-4 ring-gray-50 dark:ring-slate-800">
                                                        <AvatarImage src={profile.avatar} />
                                                        <AvatarFallback className="bg-indigo-600 text-white">
                                                            {profile.user.firstName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-gray-900 dark:text-white truncate">
                                                            {profile.user.firstName} {profile.user.lastName}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                                            {profile.title || (profile.user.role.toLowerCase().replace('_', ' '))}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Badge variant="outline" className="text-[10px] font-bold uppercase rounded-lg border-gray-200">
                                                                {profile.impactPoints} pts
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 h-10 w-10 shrink-0"
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
                                            const otherUser = conn.requester.id === 'current-user-id' ? conn.recipient : conn.requester // This logic might need adjustment based on actual user tracking
                                            return (
                                                <Card key={conn.id} className="rounded-3xl border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900">
                                                    <CardContent className="p-4 flex items-center gap-4">
                                                        <Avatar className="w-12 h-12">
                                                            <AvatarImage src={otherUser.profile?.avatar} />
                                                            <AvatarFallback className="bg-gray-100">{otherUser.firstName[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <p className="font-bold">{otherUser.firstName} {otherUser.lastName}</p>
                                                            <p className="text-xs text-muted-foreground">{otherUser.role.replace('_', ' ')}</p>
                                                        </div>
                                                        <Button variant="outline" size="sm" className="rounded-xl font-bold border-gray-200">
                                                            Message
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-gray-50/50 dark:bg-slate-800/30 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
                                        <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center mx-auto mb-6 shadow-sm">
                                            <UserCheck className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Build your network</h3>
                                        <p className="text-muted-foreground max-w-sm mx-auto mb-8 text-sm">
                                            Connect with other volunteers and professionals to collaborate on impact projects.
                                        </p>
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8" onClick={() => setActiveTab('network')}>
                                            Explore Professionals
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-6">
                            {/* Trending Column */}
                            <Card className="rounded-[2rem] border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                                <CardHeader className="pb-2 border-b border-gray-50 dark:border-gray-800/50">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-rose-500" />
                                        Trending Impact
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-5 space-y-5">
                                    {[
                                        { tag: '#DiversityWins', count: 1242, trend: 'up' },
                                        { tag: '#VolunteerLife', count: 850, trend: 'up' },
                                        { tag: '#InclusiveHiring', count: 420, trend: 'stable' },
                                        { tag: '#Mentorship', count: 310, trend: 'up' },
                                    ].map((hashtag) => (
                                        <div key={hashtag.tag} className="flex justify-between items-center group cursor-pointer">
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">{hashtag.tag}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{hashtag.count.toLocaleString()} engagement</p>
                                            </div>
                                            <div className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800 group-hover:bg-emerald-50 transition-colors">
                                                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="ghost" className="w-full rounded-xl text-xs font-bold text-emerald-600 hover:bg-emerald-50 mt-2">
                                        View more trends
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Suggested Forum */}
                            <Card className="rounded-[2rem] border-gray-100 dark:border-gray-800 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white overflow-hidden shadow-lg">
                                <CardContent className="p-6 space-y-4">
                                    <div className="p-3 bg-white/10 rounded-2xl w-fit">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Volunteer Forum</h3>
                                        <p className="text-sm text-indigo-100 mt-1">Join specialized discussions with peers from around the world.</p>
                                    </div>
                                    <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl font-bold h-12 shadow-xl shadow-indigo-900/20">
                                        Join Conversation
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Impact Stats */}
                            <Card className="rounded-[3rem] border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                                <CardContent className="p-6 text-center space-y-4">
                                    <div className="relative inline-block">
                                        <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 flex items-center justify-center">
                                            <Award className="w-10 h-10 text-emerald-600" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-1 shadow-sm">
                                            <div className="bg-emerald-600 text-white rounded-full p-1">
                                                <Sparkles className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl uppercase tracking-tighter">Community Elite</h4>
                                        <p className="text-xs text-muted-foreground">Top 5% of Volunteers this week</p>
                                    </div>
                                    <div className="pt-2">
                                        <Button variant="outline" className="w-full rounded-2xl text-xs font-bold border-gray-100">
                                            Daily Leaderboard
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
