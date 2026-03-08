'use client'

import { useState } from 'react'
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
  Eye,
  Edit,
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
  Briefcase
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/layout'
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
            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <Bell className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>

        {/* Welcome Banner */}
        <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Welcome back, Community Member! 🌟</h3>
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
            {/* Create Post */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <input
                    type="text"
                    placeholder="Share something with your community..."
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {communityHighlights.map((highlight) => (
                <Card key={highlight.id} className="overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-orange-400 to-amber-400"></div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-1">{highlight.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{highlight.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>❤️ {highlight.likes}</span>
                      <span>💬 {highlight.comments}</span>
                      <Button variant="ghost" size="sm">Read More</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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