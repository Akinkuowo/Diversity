'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    BookOpen,
    GraduationCap,
    Award,
    Clock,
    CheckCircle,
    Target,
    TrendingUp,
    Download,
    Filter,
    MoreVertical,
    Eye,
    Play,
    Star,
    Users,
    Calendar,
    FileText,
    Video,
    BookMarked,
    Library,
    Pen,
    Brain,
    Sparkles,
    Medal,
    Trophy,
    BadgeCheck,
    Share2,
    Bookmark,
    Bell,
    ChevronRight
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
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
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
    LineChart,
    Line
} from 'recharts'

const stats = [
    {
        title: 'Enrolled Courses',
        value: '8',
        change: '+2 this month',
        icon: BookOpen,
        color: 'bg-blue-500',
    },
    {
        title: 'Completed',
        value: '5',
        change: '62.5%',
        icon: CheckCircle,
        color: 'bg-green-500',
    },
    {
        title: 'Certificates',
        value: '4',
        change: '+1 new',
        icon: Award,
        color: 'bg-secondary-500',
    },
    {
        title: 'CPD Hours',
        value: '42',
        change: '+8 this month',
        icon: Clock,
        color: 'bg-primary-500',
    },
]

const inProgressCourses = [
    {
        id: 1,
        title: 'Inclusive Leadership',
        instructor: 'Dr. Sarah Johnson',
        progress: 75,
        nextLesson: 'Leading Diverse Teams',
        dueDate: '2024-01-25',
        thumbnail: '/courses/leadership.jpg',
    },
    {
        id: 2,
        title: 'Cultural Awareness',
        instructor: 'Prof. Michael Chen',
        progress: 45,
        nextLesson: 'Cross-Cultural Communication',
        dueDate: '2024-01-28',
        thumbnail: '/courses/cultural.jpg',
    },
    {
        id: 3,
        title: 'Bias in the Workplace',
        instructor: 'Dr. Emily Rodriguez',
        progress: 90,
        nextLesson: 'Final Assessment',
        dueDate: '2024-01-22',
        thumbnail: '/courses/bias.jpg',
    },
]

const recommendedCourses = [
    {
        id: 1,
        title: 'Anti-Racism Awareness',
        instructor: 'Dr. James Wilson',
        duration: '4 hours',
        level: 'Intermediate',
        rating: 4.8,
        students: 1234,
        image: '/courses/antiracism.jpg',
    },
    {
        id: 2,
        title: 'Community Cohesion',
        instructor: 'Prof. Lisa Thompson',
        duration: '3 hours',
        level: 'Beginner',
        rating: 4.7,
        students: 892,
        image: '/courses/community.jpg',
    },
    {
        id: 3,
        title: 'Inclusive Communication',
        instructor: 'Dr. Maria Garcia',
        duration: '5 hours',
        level: 'Advanced',
        rating: 4.9,
        students: 567,
        image: '/courses/communication.jpg',
    },
]

const certificates = [
    {
        id: 1,
        name: 'Diversity & Inclusion Fundamentals',
        issueDate: '2024-01-15',
        expiryDate: '2026-01-15',
        credential: 'DIF-2024-001',
        cpdHours: 10,
    },
    {
        id: 2,
        name: 'Unconscious Bias Training',
        issueDate: '2023-12-10',
        expiryDate: '2025-12-10',
        credential: 'UBT-2023-089',
        cpdHours: 8,
    },
    {
        id: 3,
        name: 'Inclusive Leadership',
        issueDate: '2023-11-20',
        expiryDate: '2025-11-20',
        credential: 'IL-2023-234',
        cpdHours: 15,
    },
]

const weeklyProgress = [
    { day: 'Mon', hours: 2.5, topics: 3 },
    { day: 'Tue', hours: 1.5, topics: 2 },
    { day: 'Wed', hours: 3, topics: 4 },
    { day: 'Thu', hours: 2, topics: 3 },
    { day: 'Fri', hours: 4, topics: 5 },
    { day: 'Sat', hours: 5, topics: 6 },
    { day: 'Sun', hours: 3.5, topics: 4 },
]

const skillAreas = [
    { name: 'Leadership', progress: 75, color: '#8884d8' },
    { name: 'Communication', progress: 85, color: '#82ca9d' },
    { name: 'Cultural Awareness', progress: 70, color: '#ffc658' },
    { name: 'Bias Recognition', progress: 90, color: '#ff8042' },
    { name: 'Inclusive Practices', progress: 65, color: '#0088FE' },
]

export default function LearnerDashboard() {
    const [selectedCategory, setSelectedCategory] = useState('all')

    return (
        <DashboardLayout role="LEARNER">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Continue your EDI learning journey.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                            <Bookmark className="w-4 h-4 mr-2" />
                            Saved
                        </Button>
                        <Button size="sm" className="bg-primary-500 text-white">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Browse Courses
                        </Button>
                    </div>
                </div>

                {/* Welcome Banner */}
                <Card className="bg-primary-500 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Continue Learning, Alex! 📚</h3>
                                <p className="text-white/90 mb-4">
                                    You're making great progress. Only 2 more courses to complete your certificate.
                                </p>
                                <div className="flex gap-4">
                                    <div className="bg-white/20 rounded-lg px-4 py-2">
                                        <p className="text-sm opacity-90">Learning Streak</p>
                                        <p className="text-2xl font-bold">12 days</p>
                                    </div>
                                    <div className="bg-white/20 rounded-lg px-4 py-2">
                                        <p className="text-sm opacity-90">Next Certificate</p>
                                        <p className="text-2xl font-bold">Inclusive Leadership</p>
                                    </div>
                                </div>
                            </div>
                            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                                View Learning Path
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

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - In Progress Courses */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current Courses */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>In Progress</CardTitle>
                                        <CardDescription>Continue where you left off</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm">View All</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {inProgressCourses.map((course) => (
                                        <div key={course.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="flex items-start gap-4">
                                                <div className="w-16 h-16 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">
                                                    {course.title.split(' ').map(w => w[0]).join('')}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-white">{course.title}</h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">{course.instructor}</p>
                                                        </div>
                                                        <Badge>{course.progress}%</Badge>
                                                    </div>
                                                    <Progress value={course.progress} className="mt-3" />
                                                    <div className="flex items-center justify-between mt-3">
                                                        <div>
                                                            <p className="text-xs text-gray-500">Next: {course.nextLesson}</p>
                                                            <p className="text-xs text-gray-500">Due: {new Date(course.dueDate).toLocaleDateString()}</p>
                                                        </div>
                                                        <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                                                            <Play className="w-4 h-4 mr-2" />
                                                            Continue
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Weekly Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Weekly Learning Activity</CardTitle>
                                <CardDescription>Hours spent learning this week</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={weeklyProgress}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="hours" stroke="#3b82f6" fill="#93c5fd" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Progress & Certificates */}
                    <div className="space-y-6">
                        {/* Skill Progress */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Skills Progress</CardTitle>
                                <CardDescription>Your competency areas</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {skillAreas.map((skill) => (
                                        <div key={skill.name}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium">{skill.name}</span>
                                                <span className="text-sm text-gray-600">{skill.progress}%</span>
                                            </div>
                                            <Progress value={skill.progress} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Certificates */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Certificates</CardTitle>
                                        <CardDescription>Recently earned</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm">View All</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {certificates.slice(0, 2).map((cert) => (
                                        <div key={cert.id} className="p-3 border rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <Award className="w-8 h-8 text-yellow-500" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{cert.name}</p>
                                                    <p className="text-xs text-gray-600">Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                                                    <Badge variant="secondary" className="mt-2">{cert.cpdHours} CPD hours</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommended Courses */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recommended for You</CardTitle>
                                <CardDescription>Based on your interests</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recommendedCourses.map((course) => (
                                        <div key={course.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                                {course.level[0]}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{course.title}</p>
                                                <p className="text-xs text-gray-600">{course.instructor}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex items-center">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                        <span className="text-xs ml-1">{course.rating}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">• {course.students} students</span>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}