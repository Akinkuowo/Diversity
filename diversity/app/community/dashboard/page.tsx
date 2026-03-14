'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users,
  Calendar,
  MessageCircle,
  Heart,
  Award,
  Globe,
  MapPin,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Map,
  BookOpen,
  Gift,
  Trophy,
  Users2,
  CalendarCheck,
  Video,
  FileSpreadsheet,
  Activity,
  Settings2,
  BadgeCheck,
  Medal,
  Sparkles,
  Share2,
  Bookmark,
  Bell,
  Coffee,
  Music,
  Palmtree,
  Utensils,
  Newspaper,
  Mic,
  Camera,
  Briefcase,
  MessageSquare,
  ThumbsUp,
  Send,
  Clock,
  Eye,
  Plus,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { CreatePostDialog } from '../../components/dashboard/community/create-post-dialog'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// We will dynamically build the stats array inside the component now

// Forum topics are now fetched from the backend
const forumCategories = [
  { id: 'all', name: 'All Topics' },
  { id: 'inclusion', name: 'Inclusion & Belonging' },
  { id: 'mentorship', name: 'Mentorship' },
  { id: 'career', name: 'Career Growth' },
  { id: 'news', name: 'Community News' },
]

const nearbyBusinesses = [
  {
    id: 1,
    name: 'TechCorp Inc.',
    category: 'Technology',
    distance: '0.5 miles',
    badge: 'Diversity Champion',
    rating: 4.8,
    image: '/businesses/techcorp.jpg',
  },
  {
    id: 2,
    name: 'Community Health',
    category: 'Healthcare',
    distance: '1.2 miles',
    badge: 'Inclusion Partner',
    rating: 4.6,
    image: '/businesses/health.jpg',
  },
  {
    id: 3,
    name: 'Green Market',
    category: 'Retail',
    distance: '0.8 miles',
    badge: 'Diversity Supporter',
    rating: 4.5,
    image: '/businesses/market.jpg',
  },
]

const communityHighlights = [
  {
    id: 1,
    title: 'Food Drive Success',
    description: 'Collected 500+ meals for local families',
    image: '/highlights/food.jpg',
    likes: 234,
    comments: 45,
  },
  {
    id: 2,
    title: 'Cultural Day Celebration',
    description: 'Over 200 people attended',
    image: '/highlights/cultural.jpg',
    likes: 189,
    comments: 32,
  },
  {
    id: 3,
    title: 'New Community Garden',
    description: 'Volunteers planted 50 trees',
    image: '/highlights/garden.jpg',
    likes: 156,
    comments: 28,
  },
]

export default function CommunityDashboard() {
  const [userName, setUserName] = useState('Community Member')
  const [user, setUser] = useState<any>(null)
  // Dashboard State
  const [posts, setPosts] = useState<any[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [events, setEvents] = useState<any[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [forumPosts, setForumPosts] = useState<any[]>([])
  const [isLoadingForum, setIsLoadingForum] = useState(true)
  const [selectedForumCategory, setSelectedForumCategory] = useState('all')
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [postComments, setPostComments] = useState<Record<string, any[]>>({})
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({})

  // Edit & Delete State
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  // Dynamic Community Stats State
  const [communityStats, setCommunityStats] = useState({
    eventsAttended: 0,
    forumPosts: 0,
    connections: 0,
    impactPoints: 0,
    contributions: 0,
    communityRanking: 'New Member'
  })

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        if (parsedUser.firstName) {
          setUserName(parsedUser.firstName)
        }
      } catch (e) {
        console.error('Failed to parse user from localStorage', e)
      }
    }
    fetchPosts()
    fetchEvents()
    fetchForumPosts()
    fetchCommunityStats()
  }, [])

  const fetchEvents = async () => {
    setIsLoadingEvents(true)
    try {
      const data = await api.get('/events')
      setEvents(data)
    } catch (err) {
      console.error('Failed to fetch events:', err)
    } finally {
      setIsLoadingEvents(false)
    }
  }

  const fetchForumPosts = async () => {
    setIsLoadingForum(true)
    try {
      const data = await api.get(`/forum/posts?category=${selectedForumCategory}`)
      setForumPosts(data)
    } catch (err) {
      console.error('Failed to fetch forum posts:', err)
    } finally {
      setIsLoadingForum(false)
    }
  }

  const fetchCommunityStats = async () => {
    try {
      const statsData = await api.get('/users/me/community-stats');
      setCommunityStats(statsData);
    } catch (error) {
      console.error('Failed to fetch community stats:', error);
    }
  }

  const fetchPosts = async () => {
    setIsLoadingPosts(true)
    try {
      const data = await api.get('/posts')
      setPosts(data)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsLoadingPosts(false)
    }
  }

  const handlePostCreated = (newPost: any) => {
    setPosts(prev => [{ ...newPost, likes: 0, commentCount: 0, likedByMe: false }, ...prev])
  }

  const handleLike = async (postId: string) => {
    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likedByMe: !p.likedByMe,
          likes: p.likedByMe ? (p.likes || 1) - 1 : (p.likes || 0) + 1
        }
      }
      return p
    }))

    try {
      const result = await api.post(`/posts/${postId}/like`, {})
      // Sync with server response
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, likedByMe: result.liked, likes: result.likes }
        }
        return p
      }))
    } catch (error) {
      console.error('Failed to toggle like:', error)
      // Revert on error
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likedByMe: !p.likedByMe,
            likes: p.likedByMe ? (p.likes || 1) - 1 : (p.likes || 0) + 1
          }
        }
        return p
      }))
    }
  }

  const toggleComments = async (postId: string) => {
    const isExpanded = expandedComments[postId]
    setExpandedComments(prev => ({ ...prev, [postId]: !isExpanded }))

    if (!isExpanded && !postComments[postId]) {
      setLoadingComments(prev => ({ ...prev, [postId]: true }))
      try {
        const comments = await api.get(`/posts/${postId}/comments`)
        setPostComments(prev => ({ ...prev, [postId]: comments }))
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      } finally {
        setLoadingComments(prev => ({ ...prev, [postId]: false }))
      }
    }
  }

  const handleAddComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim()
    if (!content) return

    try {
      const comment = await api.post(`/posts/${postId}/comments`, { content })
      setPostComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }))
      setCommentInputs(prev => ({ ...prev, [postId]: '' }))
      // Update comment count
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, commentCount: (p.commentCount || 0) + 1 }
        }
        return p
      }))
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  const handleShare = async (post: any) => {
    const shareData = {
      title: `Post by ${post.user?.firstName} ${post.user?.lastName}`,
      text: post.content?.slice(0, 100) + (post.content?.length > 100 ? '...' : ''),
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled or share failed, ignore
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
        toast.success('Link copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy:', err)
        toast.error('Failed to copy link')
      }
    }
  }

  const handleDelete = (postId: string) => {
    setPostToDelete(postId);
  }

  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      await api.delete(`/posts/${postToDelete}`);
      setPosts(prev => prev.filter(p => p.id !== postToDelete));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post. Please try again.');
    } finally {
      setPostToDelete(null);
    }
  }

  const handleSaveEdit = async (postId: string) => {
    if (!editContent.trim()) return;

    try {
      const updatedPost = await api.put(`/posts/${postId}`, {
        content: editContent.trim()
      });

      setPosts(prev => prev.map(p =>
        p.id === postId
          ? { ...p, content: updatedPost.content, updatedAt: updatedPost.updatedAt }
          : p
      ));
      setEditingPost(null);
      toast.success('Post updated successfully');
    } catch (error) {
      console.error('Failed to update post:', error);
      toast.error('Failed to update post. Please try again.');
    }
  }

  // Build the dynamic stats array to render in the UI
  const displayStats = [
    {
      title: 'Events Attended',
      value: communityStats.eventsAttended.toString(),
      change: 'Lifetime',
      icon: Calendar,
      color: 'bg-primary-500',
    },
    {
      title: 'Forum Posts',
      value: communityStats.forumPosts.toString(),
      change: 'Lifetime',
      icon: MessageCircle,
      color: 'bg-blue-500',
    },
    {
      title: 'Connections',
      value: communityStats.connections.toString(),
      change: 'Network',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Impact Points',
      value: communityStats.impactPoints.toLocaleString(),
      change: 'Total Score',
      icon: Trophy,
      color: 'bg-secondary-500',
    },
  ];

  return (
    <DashboardLayout role="COMMUNITY_MEMBER">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Connect, engage, and grow with your community.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <CreatePostDialog user={user} onPostCreated={handlePostCreated} />
          </div>
        </div>

        {/* Welcome Banner */}
        <Card className="bg-primary-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Welcome back, {userName}! 🌟</h3>
                <p className="text-white/90 mb-4">
                  You're an active part of our community. Check out what's happening nearby.
                </p>
                <div className="flex gap-4">
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <p className="text-sm opacity-90">Community Rank</p>
                    <p className="text-2xl font-bold">{communityStats.communityRanking}</p>
                  </div>
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <p className="text-sm opacity-90">Contributions</p>
                    <p className="text-2xl font-bold">{communityStats.contributions}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                {...(stat.title === 'Connections' ? { 
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 }
                } : {})}
              >
                {stat.title === 'Connections' ? (
                  <Link href="/community/connections" className="block cursor-pointer">
                    <Card className="hover:border-primary-500/50 transition-colors bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-600 border-none px-2 py-0">
                            {stat.change}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.title}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ) : (
                  <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-2 py-0">
                          {stat.change}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.title}</p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="feed" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="feed">Community Feed</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="forum">Forum</TabsTrigger>
            <TabsTrigger value="businesses">Local Businesses</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            <div className="max-w-2xl mx-auto space-y-5">
              {/* Create Post Area */}
              <Card className="overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10 ring-2 ring-primary-100">
                      <AvatarImage src={user?.profile?.avatar} />
                      <AvatarFallback className="bg-primary-100 text-primary-600">{user?.firstName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CreatePostDialog user={user} onPostCreated={handlePostCreated} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Feed / Posts */}
              <div className="space-y-5">
                {isLoadingPosts ? (
                  <div className="p-12 text-center bg-white/50 rounded-2xl border border-dashed border-gray-200">
                    <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" />
                    <p className="text-gray-500 mt-4">Loading community feed...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="p-12 text-center bg-white/50 rounded-2xl border border-dashed border-gray-200">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No posts yet</h3>
                    <p className="text-gray-500">Be the first to share something with the community!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl bg-white dark:bg-slate-900">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 ring-2 ring-gray-100 dark:ring-slate-700">
                              <AvatarImage src={post.user?.profile?.avatar} />
                              <AvatarFallback className="bg-primary-400 text-white font-semibold">
                                {post.user?.firstName?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{post.user?.firstName} {post.user?.lastName}</h4>
                              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                {post.location && (
                                  <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full font-medium">
                                    <MapPin className="w-3 h-3" />
                                    {post.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {user?.id === post.userId && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800">
                                  <MoreVertical className="w-4 h-4 text-gray-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingPost(post.id);
                                    setEditContent(post.content);
                                  }}
                                  className="gap-2 cursor-pointer"
                                >
                                  <Edit2 className="w-4 h-4 text-gray-500" />
                                  <span>Edit Post</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(post.id)}
                                  className="gap-2 focus:bg-red-50 focus:text-red-500 cursor-pointer text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete Post</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>

                        <div className="space-y-3">
                          {editingPost === post.id ? (
                            <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                              <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="min-h-[100px] border-primary-200 focus-visible:ring-primary-500 rounded-xl resize-none text-[15px] leading-relaxed"
                                placeholder="Edit your post..."
                                autoFocus
                              />
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingPost(null)}
                                  className="h-8 rounded-full text-gray-500 hover:text-gray-700"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEdit(post.id)}
                                  disabled={!editContent.trim()}
                                  className="h-8 rounded-full bg-primary-500 hover:bg-primary-600 text-white"
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px]">
                              {post.content}
                            </p>
                          )}

                          {post.images && post.images.length > 0 && (
                            <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-slate-800">
                              <img
                                src={post.images[0]}
                                alt="Post content"
                                className="w-full h-auto max-h-[400px] object-cover"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-slate-800">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleLike(post.id)}
                              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-all ${post.likedByMe
                                ? 'text-primary-500 bg-primary-50 dark:bg-primary-500/10 font-medium'
                                : 'text-gray-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10'
                                }`}
                            >
                              <ThumbsUp className={`w-4 h-4 ${post.likedByMe ? 'fill-current' : ''}`} />
                              <span>{post.likes || 0}</span>
                            </button>
                            <button
                              onClick={() => toggleComments(post.id)}
                              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-all ${expandedComments[post.id]
                                ? 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 font-medium'
                                : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10'
                                }`}
                            >
                              <MessageSquare className={`w-4 h-4 ${expandedComments[post.id] ? 'fill-current' : ''}`} />
                              <span>{post.commentCount || 0}</span>
                            </button>
                          </div>
                          <button
                            onClick={() => handleShare(post)}
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 px-3 py-1.5 rounded-full transition-all"
                          >
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                        </div>

                        {/* Comment Section */}
                        {expandedComments[post.id] && (
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
                            {/* Comment Input */}
                            <div className="flex items-center gap-2">
                              <Avatar className="w-7 h-7">
                                <AvatarFallback className="bg-primary-100 text-primary-600 text-xs">
                                  {user?.firstName?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 flex gap-2">
                                <Input
                                  placeholder="Write a comment..."
                                  value={commentInputs[post.id] || ''}
                                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id) }}
                                  className="h-8 text-sm bg-gray-50 dark:bg-slate-800 border-gray-200"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleAddComment(post.id)}
                                  disabled={!commentInputs[post.id]?.trim()}
                                  className="h-8 px-3 bg-primary-500 hover:bg-primary-600 text-white"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>

                            {/* Comments List */}
                            {loadingComments[post.id] ? (
                              <div className="text-center py-3">
                                <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
                              </div>
                            ) : (
                              (postComments[post.id] || []).map((comment: any) => (
                                <div key={comment.id} className="flex gap-2 pl-1">
                                  <Avatar className="w-6 h-6 mt-0.5">
                                    <AvatarImage src={comment.user?.profile?.avatar} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-[10px]">
                                      {comment.user?.firstName?.[0] || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 bg-gray-50 dark:bg-slate-800 rounded-lg px-3 py-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                                        {comment.user?.firstName} {comment.user?.lastName}
                                      </span>
                                      <span className="text-[10px] text-gray-400">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{comment.content}</p>
                                  </div>
                                </div>
                              ))
                            )}

                            {!loadingComments[post.id] && (postComments[post.id] || []).length === 0 && (
                              <p className="text-xs text-gray-400 text-center py-1">No comments yet. Be the first!</p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Events in Your Community</h3>
                <p className="text-sm text-gray-500">Discover and join upcoming gatherings.</p>
              </div>
              <Link href="/events">
                <Button variant="outline" className="rounded-xl border-primary-200 text-primary-600 hover:bg-primary-50">
                  Explore All Events
                </Button>
              </Link>
            </div>

            {isLoadingEvents ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-[300px] rounded-3xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.slice(0, 3).map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={`/events/${event.id}`}>
                      <Card className="group overflow-hidden rounded-3xl border-none shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 cursor-pointer">
                        <div className="relative h-40 w-full overflow-hidden">
                          <img
                            src={event.image || 'https://images.unsplash.com/photo-1540575861501-7ad05823c23d?auto=format&fit=crop&q=80&w=1000'}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-white/90 backdrop-blur-sm text-primary-600 border-none text-[10px] font-bold">
                              {event.type}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-center gap-1.5 text-primary-600 font-semibold mb-1 text-[10px] uppercase tracking-wider">
                            <Calendar className="w-3 h-3" />
                            {new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </div>
                          <CardTitle className="text-base group-hover:text-primary-600 transition-colors line-clamp-1">{event.title}</CardTitle>
                        </CardHeader>

                        <CardContent className="p-4 pt-0 space-y-3 flex-1">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="line-clamp-1">{event.location || 'Remote'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event._count?.registrations || 0}
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-gray-50 dark:border-slate-800 mt-auto bg-gray-50/50 dark:bg-white/5">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {event.price === 0 ? 'Free' : `£${event.price}`}
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary-600 p-0 h-auto font-bold text-xs">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 rounded-3xl">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="font-bold">No upcoming events</h4>
                <p className="text-sm text-gray-500 mt-1">Check back later for new community gatherings.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="forum" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
              <div className="flex flex-wrap gap-2">
                {forumCategories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedForumCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedForumCategory(cat.id);
                      // fetchForumPosts will be triggered by re-render or explicit call
                      setTimeout(fetchForumPosts, 0);
                    }}
                    className={`rounded-xl px-4 h-9 font-bold transition-all ${selectedForumCategory === cat.id ? 'bg-primary-600 text-white' : 'text-gray-500'}`}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
              <Link href="/forums?create=true">
                <Button className="rounded-2xl h-11 px-6 bg-[#0d9488] hover:bg-[#0c4f4a] text-white font-bold shadow-lg transition-transform hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Discussion
                </Button>
              </Link>
            </div>

            {isLoadingForum ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 rounded-3xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : forumPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {forumPosts.slice(0, 5).map((post, i) => (
                  <Link key={post.id} href={`/forums/${post.id}`}>
                    <Card className="group relative overflow-hidden rounded-[1.5rem] border-none shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="shrink-0">
                            <Avatar className="w-12 h-12 rounded-xl ring-2 ring-primary-500/20 group-hover:rotate-6 transition-transform">
                              <AvatarImage src={post.author?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.firstName || 'User'}`} />
                              <AvatarFallback>{post.author?.firstName?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-primary-50 dark:bg-primary-950/30 text-primary-600 border-none font-bold text-[10px] uppercase tracking-wider">
                                {post.category}
                              </Badge>
                              <span className="text-gray-400 text-xs flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3" />
                                {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <h4 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors leading-tight line-clamp-1">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-4 text-gray-500">
                              <div className="flex items-center gap-1 text-xs font-bold">
                                <MessageCircle className="w-3.5 h-3.5" />
                                {post._count?.comments || 0}
                              </div>
                              <div className="flex items-center gap-1 text-xs font-bold">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                {post._count?.likes || 0}
                              </div>
                              <div className="flex items-center gap-1 text-xs font-bold">
                                <Eye className="w-3.5 h-3.5" />
                                {post.views || 0}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-5 h-5 text-primary-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                <div className="text-center pt-2">
                  <Link href="/forums">
                    <Button variant="ghost" className="text-primary-600 font-bold hover:bg-primary-50">
                      View all discussions
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                <h4 className="font-bold text-gray-900 dark:text-white">No discussions yet</h4>
                <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">Be the first to start a conversation in the community.</p>
                <Link href="/forums" className="inline-block mt-4">
                  <Button className="rounded-xl bg-primary-600 text-white font-bold h-10 px-6">
                    Join the Forum
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="businesses">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Local Businesses</CardTitle>
                    <CardDescription>Diversity-committed businesses near you</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Map View</Button>
                    <Button variant="outline" size="sm">Filter</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {nearbyBusinesses.map((business) => (
                    <Card key={business.id} className="overflow-hidden">
                      <div className="h-24 bg-primary-400"></div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold">{business.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{business.category}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="bg-secondary-100 text-secondary-600">
                            {business.badge}
                          </Badge>
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1">{business.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">{business.distance}</p>
                        <Button variant="outline" size="sm" className="w-full mt-3">View Profile</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="ghost"
              onClick={() => setPostToDelete(null)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="rounded-full bg-red-500 hover:bg-red-600"
            >
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout >
  )
}