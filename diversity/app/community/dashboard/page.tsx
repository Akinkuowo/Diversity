'use client'

import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/layout'
import { CreatePostDialog } from '../../components/dashboard/community/create-post-dialog'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

const stats = [
  {
    title: 'Events Attended',
    value: '24',
    change: '+4 this month',
    icon: Calendar,
    color: 'bg-orange-500',
  },
  {
    title: 'Forum Posts',
    value: '156',
    change: '+32',
    icon: MessageCircle,
    color: 'bg-blue-500',
  },
  {
    title: 'Connections',
    value: '89',
    change: '+12',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    title: 'Impact Points',
    value: '2,450',
    change: '+450',
    icon: Trophy,
    color: 'bg-purple-500',
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: 'Community Meet & Greet',
    date: '2024-01-20',
    time: '18:00',
    location: 'Community Center',
    attendees: 45,
    image: '/events/meetup.jpg',
    category: 'Social',
  },
  {
    id: 2,
    title: 'Cultural Food Festival',
    date: '2024-01-22',
    time: '12:00',
    location: 'City Park',
    attendees: 120,
    image: '/events/food.jpg',
    category: 'Cultural',
  },
  {
    id: 3,
    title: 'Diversity Workshop',
    date: '2024-01-25',
    time: '14:00',
    location: 'Virtual',
    attendees: 89,
    image: '/events/workshop.jpg',
    category: 'Education',
  },
]

const forumTopics = [
  {
    id: 1,
    title: 'Building Inclusive Communities',
    author: 'Sarah Chen',
    replies: 45,
    views: 234,
    lastActive: '5 min ago',
    category: 'Discussion',
  },
  {
    id: 2,
    title: 'Cultural Celebration Ideas',
    author: 'Maria Garcia',
    replies: 32,
    views: 189,
    lastActive: '1 hour ago',
    category: 'Ideas',
  },
  {
    id: 3,
    title: 'Volunteer Opportunities',
    author: 'John Smith',
    replies: 28,
    views: 156,
    lastActive: '3 hours ago',
    category: 'Opportunities',
  },
  {
    id: 4,
    title: 'Diversity in Workplace',
    author: 'David Kim',
    replies: 56,
    views: 312,
    lastActive: '5 hours ago',
    category: 'Discussion',
  },
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
  const [posts, setPosts] = useState<any[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [postComments, setPostComments] = useState<Record<string, any[]>>({})
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({})

  // Edit State
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

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
  }, [])

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
        alert('Link copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
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
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post. Please try again.');
    }
  }

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
        <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
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
                    <p className="text-2xl font-bold">#42</p>
                  </div>
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <p className="text-sm opacity-90">Contributions</p>
                    <p className="text-2xl font-bold">156</p>
                  </div>
                </div>
              </div>
              <Button variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-600">
                        {stat.change}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  </CardContent>
                </Card>
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
                    <Avatar className="w-10 h-10 ring-2 ring-orange-100">
                      <AvatarImage src={user?.profile?.avatar} />
                      <AvatarFallback className="bg-orange-100 text-orange-600">{user?.firstName?.[0] || 'U'}</AvatarFallback>
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
                    <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" />
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
                              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white font-semibold">
                                {post.user?.firstName?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{post.user?.firstName} {post.user?.lastName}</h4>
                              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                {post.location && (
                                  <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">
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
                                className="min-h-[100px] border-orange-200 focus-visible:ring-orange-500 rounded-xl resize-none text-[15px] leading-relaxed"
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
                                  className="h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
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
                                ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10 font-medium'
                                : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10'
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
                                <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">
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
                                  className="h-8 px-3 bg-orange-500 hover:bg-orange-600 text-white"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>

                            {/* Comments List */}
                            {loadingComments[post.id] ? (
                              <div className="text-center py-3">
                                <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full mx-auto" />
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

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Events in your community</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">View Calendar</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-400 rounded-lg flex items-center justify-center text-white font-bold">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{event.category}</p>
                          </div>
                          <Badge>{event.attendees} attending</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </span>
                        </div>
                        <Button size="sm" className="mt-3 bg-orange-500 text-white hover:bg-orange-600">
                          RSVP
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forum">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Community Forum</CardTitle>
                    <CardDescription>Discussions and topics</CardDescription>
                  </div>
                  <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
                    New Topic
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {forumTopics.map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{topic.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>By {topic.author}</span>
                          <span>💬 {topic.replies} replies</span>
                          <span>👁️ {topic.views} views</span>
                          <Badge variant="secondary">{topic.category}</Badge>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{topic.lastActive}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                      <div className="h-24 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold">{business.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{business.category}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-600">
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
    </DashboardLayout>
  )
}