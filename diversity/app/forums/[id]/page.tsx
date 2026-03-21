'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    MessageCircle,
    ThumbsUp,
    Eye,
    Clock,
    Share2,
    MoreVertical,
    Send,
    CornerDownRight,
    Award,
    ShieldCheck
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ForumThreadPage() {
    const params = useParams()
    const router = useRouter()
    const [post, setPost] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [commentText, setCommentText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const userData = await api.get('/me')
                setUser(userData)
            } catch (err) {
                console.error('Failed to fetch user', err)
            }
        }
        fetchInitialData()
    }, [])

    useEffect(() => {
        const fetchPost = async () => {
            if (!params.id) return
            setIsLoading(true)
            try {
                const data = await api.get(`/forum/posts/${params.id}`)
                setPost(data)
            } catch (err) {
                toast.error('Failed to load thread')
                router.push('/forums')
            } finally {
                setIsLoading(false)
            }
        }
        fetchPost()
    }, [params.id])

    const handleLike = async () => {
        try {
            const result = await api.post(`/forum/posts/${params.id}/like`, {})
            setLiked(result.liked)
            setPost((prev: any) => ({
                ...prev,
                _count: {
                    ...prev._count,
                    likes: result.liked ? prev._count.likes + 1 : prev._count.likes - 1
                }
            }))
            toast.success(result.liked ? 'Thread liked!' : 'Like removed')
        } catch (err) {
            toast.error('Failed to toggle like')
        }
    }

    const handleSubmitComment = async () => {
        if (!commentText.trim()) return
        setIsSubmitting(true)
        try {
            const newComment = await api.post(`/forum/posts/${params.id}/comments`, {
                content: commentText
            })
            setPost((prev: any) => ({
                ...prev,
                comments: [...prev.comments, newComment]
            }))
            setCommentText('')
            toast.success('Comment added!')
        } catch (err) {
            toast.error('Failed to add comment')
        } finally {
            setIsSubmitting(false)
        }
    }

    const role = user?.role || 'COMMUNITY_MEMBER'

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="h-10 w-24 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                    <div className="h-64 bg-gray-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
                    <div className="h-96 bg-gray-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
                </div>
            </DashboardLayout>
        )
    }

    if (!post) return null

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                {/* Navigation */}
                <Link href="/forums">
                    <Button variant="ghost" className="rounded-xl group text-gray-500 hover:text-primary-600 font-bold transition-all">
                        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Back to Forum
                    </Button>
                </Link>

                {/* Main Thread Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                        {/* Thread Header Decor */}
                        <div className="h-3 bg-gradient-to-r from-primary-400 via-primary-600 to-secondary-500" />

                        <CardHeader className="p-8 md:p-12 pb-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Badge className="bg-primary-50 dark:bg-primary-950/40 text-primary-600 hover:bg-primary-50 border-none px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">
                                    {post.category}
                                </Badge>
                                <span className="text-gray-400 text-sm font-medium flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    Posted on {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>

                            <CardTitle className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-8">
                                {post.title}
                            </CardTitle>

                            <div className="flex items-center justify-between py-6 border-y border-gray-50 dark:border-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 p-0.5 shadow-lg">
                                        <div className="w-full h-full rounded-[0.875rem] bg-white dark:bg-slate-900 overflow-hidden">
                                            <img
                                                src={post.author.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.firstName}`}
                                                alt={post.author.firstName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-black text-gray-900 dark:text-white">{post.author.firstName} {post.author.lastName}</h3>
                                            <ShieldCheck className="w-4 h-4 text-primary-500" />
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium">Verified Expert • Engagement Level 5</p>
                                    </div>
                                </div>

                                <div className="hidden md:flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="rounded-xl bg-gray-50 dark:bg-slate-800 border-none text-gray-500 hover:text-primary-600">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-xl bg-gray-50 dark:bg-slate-800 border-none text-gray-500 hover:text-primary-600">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 md:p-12 pt-0">
                            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 font-medium leading-[1.8] space-y-4">
                                {post.content.split('\n').map((para: string, i: number) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-12">
                                {post.tags.map((tag: string) => (
                                    <span key={tag} className="px-4 py-1.5 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-500 text-xs font-bold transition-all hover:bg-primary-50 hover:text-primary-600">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </CardContent>

                        <CardFooter className="p-8 md:px-12 bg-gray-50/50 dark:bg-white/5 border-t border-gray-50 dark:border-gray-800">
                            <div className="flex items-center gap-8">
                                <Button
                                    variant="ghost"
                                    onClick={handleLike}
                                    className={`group rounded-2xl px-6 h-12 flex items-center gap-2 font-bold transition-all ${liked ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-primary-50 hover:text-primary-600'}`}
                                >
                                    <ThumbsUp className={`w-5 h-5 transition-transform group-hover:-translate-y-1 ${liked ? 'fill-current' : ''}`} />
                                    {post._count.likes} Likes
                                </Button>
                                <div className="flex items-center gap-2 text-gray-500 font-bold">
                                    <MessageCircle className="w-5 h-5" />
                                    {post.comments.length} Comments
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 font-bold">
                                    <Eye className="w-5 h-5" />
                                    {post.views} Views
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>

                {/* Comment Section Header */}
                <div className="flex items-center justify-between pt-8 px-4">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        Discussion <span className="text-gray-400 font-bold ml-2">({post.comments.length})</span>
                    </h2>
                    <div className="text-sm font-bold text-primary-600 bg-primary-50 dark:bg-primary-950/40 px-3 py-1 rounded-lg">
                        Jump to latest
                    </div>
                </div>

                {/* Comment Input */}
                <Card className="rounded-[2rem] border-none shadow-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800 shadow-inner">
                                <img
                                    src={user?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <Textarea
                                    placeholder="Share your thoughts with the community..."
                                    className="min-h-[140px] bg-gray-50/50 dark:bg-slate-800/50 border-none rounded-[1.5rem] p-6 focus-visible:ring-2 focus-visible:ring-primary-500/50 transition-all font-medium resize-none shadow-inner text-lg"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-gray-400 font-medium"> Markdown supported for rich text 📚</div>
                                    <Button
                                        onClick={handleSubmitComment}
                                        disabled={isSubmitting || !commentText.trim()}
                                        className="rounded-2xl h-14 px-10 bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-lg shadow-primary-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                    >
                                        Post Comment
                                        <Send className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Comments List */}
                <div className="space-y-6">
                    {post.comments.map((comment: any, i: number) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="rounded-[2.25rem] border-none shadow-sm bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
                                <CardContent className="p-8">
                                    <div className="flex gap-6">
                                        <div className="flex flex-col items-center gap-4 shrink-0">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-800 overflow-hidden border border-gray-100 dark:border-gray-800">
                                                <img
                                                    src={comment.author.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.firstName}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="h-full w-0.5 bg-gray-50 dark:bg-slate-800 rounded-full" />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-black text-gray-900 dark:text-white">{comment.author.firstName}</h4>
                                                        <Award className="w-3.5 h-3.5 text-yellow-500" />
                                                    </div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Contributor</p>
                                                </div>
                                                <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed text-[1.05rem]">
                                                {comment.content}
                                            </div>
                                            <div className="flex items-center gap-6 pt-2">
                                                <Button variant="ghost" size="sm" className="h-auto p-0 text-primary-600 font-black flex items-center gap-1.5 hover:bg-transparent">
                                                    <CornerDownRight className="w-4 h-4" />
                                                    Reply
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-auto p-0 text-gray-500 font-black flex items-center gap-1.5 hover:bg-transparent">
                                                    <ThumbsUp className="w-4 h-4" />
                                                    Helpful
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}
