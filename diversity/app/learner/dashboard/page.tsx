'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
    BookOpen, 
    CheckCircle, 
    Award, 
    Clock, 
    Star, 
    GraduationCap, 
    Bookmark, 
    Activity, 
    Users, 
    BarChart3, 
    Calendar, 
    ChevronRight,
    Play,
    Search,
    MessageCircle,
    Bell
} from 'lucide-react'
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

interface SkillArea {
    name: string
    progress: number
    color: string
}

export default function LearnerDashboard() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [dashboardStats, setDashboardStats] = useState<any>(null)
    const [enrollments, setEnrollments] = useState<any[]>([])
    const [certificatesList, setCertificatesList] = useState<any[]>([])
    const [recommended, setRecommended] = useState<any[]>([])
    const [selectedCategory, setSelectedCategory] = useState('all')

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true)
            try {
                // Initial user from localStorage
                const savedUser = localStorage.getItem('user')
                if (savedUser) setUser(JSON.parse(savedUser))

                const [statsRes, enrollRes, certRes, coursesRes] = await Promise.allSettled([
                    api.get('/learners/me/progress'),
                    api.get('/learners/me/enrollments'),
                    api.get('/learners/me/certificates'),
                    api.get('/courses')
                ])

                if (statsRes.status === 'fulfilled') setDashboardStats(statsRes.value.stats)
                if (enrollRes.status === 'fulfilled') setEnrollments(enrollRes.value || [])
                if (certRes.status === 'fulfilled') setCertificatesList(certRes.value || [])
                if (coursesRes.status === 'fulfilled') {
                    // Filter out already enrolled courses for recommendations
                    const enrolledIds = new Set((enrollRes.status === 'fulfilled' ? enrollRes.value : []).map((e: any) => e.courseId))
                    const available = (coursesRes.value || []).filter((c: any) => !enrolledIds.has(c.id))
                    setRecommended(available.slice(0, 3))
                }

                // Refresh user data
                const freshUser = await api.get('/me')
                setUser(freshUser)
                localStorage.setItem('user', JSON.stringify(freshUser))

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
                toast.error('Failed to load dashboard statistics')
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const inProgress = enrollments.filter(e => e.progress < 100)
    
    // Map backend stats to the UI format
    const displayStats = [
        {
            title: 'Enrolled Courses',
            value: dashboardStats?.totalCourses || enrollments.length || '0',
            change: '+0 this month',
            icon: BookOpen,
            color: 'bg-blue-500',
        },
        {
            title: 'Completed',
            value: dashboardStats?.completedCourses || '0',
            change: `${dashboardStats?.totalCourses ? Math.round((dashboardStats.completedCourses / dashboardStats.totalCourses) * 100) : 0}%`,
            icon: CheckCircle,
            color: 'bg-green-500',
        },
        {
            title: 'Certificates',
            value: dashboardStats?.certificatesEarned || certificatesList.length || '0',
            change: '+0 new',
            icon: Award,
            color: 'bg-secondary-500',
        },
        {
            title: 'CPD Hours',
            value: dashboardStats?.totalCpdHours || '0',
            change: '+0 this month',
            icon: Clock,
            color: 'bg-primary-500',
        },
    ]
    const skillAreas: SkillArea[] = dashboardStats?.categoryStats?.map((s: any) => ({
        name: s.name,
        progress: Math.min(100, Math.round((s.value / (dashboardStats.totalCourses || 1)) * 100)),
        color: '#3b82f6'
    })) || [
        { name: 'Leadership', progress: 75, color: '#8884d8' },
        { name: 'Communication', progress: 85, color: '#82ca9d' },
        { name: 'Cultural Awareness', progress: 70, color: '#ffc658' },
        { name: 'Bias Recognition', progress: 90, color: '#ff8042' },
        { name: 'Inclusive Practices', progress: 65, color: '#0088FE' },
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

    return (
        <DashboardLayout>
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
                                <h3 className="text-xl font-semibold mb-2">Continue Learning, {user?.firstName || 'Learner'}! 📚</h3>
                                <p className="text-white/90 mb-4">
                                    {dashboardStats?.completedCourses < dashboardStats?.totalCourses 
                                        ? `You're making great progress. Keep going to earn your next certificate!`
                                        : `Amazing work! You've completed all your enrolled courses.`}
                                </p>
                                <div className="flex gap-4">
                                    <div className="bg-white/20 rounded-lg px-4 py-2">
                                        <p className="text-sm opacity-90">Learning Streak</p>
                                        <p className="text-2xl font-bold">{user?.streakDayCount || 0} days</p>
                                    </div>
                                    <div className="bg-white/20 rounded-lg px-4 py-2">
                                        <p className="text-sm opacity-90">Average Score</p>
                                        <p className="text-2xl font-bold">{dashboardStats?.avgQuizScore || 0}%</p>
                                    </div>
                                </div>
                            </div>
                            <Button variant="secondary" onClick={() => router.push('/learner/path')} className="bg-white text-blue-600 hover:bg-gray-100">
                                View Learning Path
                            </Button>
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
                                    {inProgress.length > 0 ? inProgress.map((enrollment: any) => (
                                        <div key={enrollment.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="flex items-start gap-4">
                                                <div className="w-16 h-16 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden">
                                                    {enrollment.course.thumbnail ? (
                                                        <img src={enrollment.course.thumbnail} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        enrollment.course.title.split(' ').map((w: any) => w[0]).join('')
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-white">{enrollment.course.title}</h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">{enrollment.course.authorBusiness?.companyName || 'Diversity Network'}</p>
                                                        </div>
                                                        <Badge>{enrollment.progress}%</Badge>
                                                    </div>
                                                    <Progress value={enrollment.progress} className="mt-3" />
                                                    <div className="flex items-center justify-between mt-3">
                                                        <div>
                                                            <p className="text-xs text-gray-500">Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <Button 
                                                            size="sm" 
                                                            onClick={() => router.push(`/learner/courses/${enrollment.courseId}`)}
                                                            className="bg-blue-600 text-white hover:bg-blue-700"
                                                        >
                                                            <Play className="w-4 h-4 mr-2" />
                                                            Continue
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8 text-gray-500 italic">
                                            No courses in progress. Start a new one today!
                                        </div>
                                    )}
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
                                    {skillAreas.map((skill: SkillArea) => (
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
                                    {certificatesList.length > 0 ? certificatesList.slice(0, 3).map((cert) => (
                                        <div key={cert.id} className="p-3 border rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <Award className="w-8 h-8 text-yellow-500" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{cert.course?.title || 'Course Certificate'}</p>
                                                    <p className="text-xs text-gray-600">Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                                                    <Badge variant="secondary" className="mt-2">{cert.course?.cpdHours || 0} CPD hours</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-4 text-gray-400 text-sm">
                                            No certificates earned yet.
                                        </div>
                                    )}
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
                                    {recommended.map((course) => (
                                        <div 
                                            key={course.id} 
                                            onClick={() => router.push(`/learner/courses/${course.id}`)}
                                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                        >
                                            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                                                {course.thumbnail ? (
                                                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    course.title[0]
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm line-clamp-1">{course.title}</p>
                                                <p className="text-xs text-gray-600">{course.authorBusiness?.companyName || 'Diversity Network'}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex items-center">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                        <span className="text-xs ml-1">4.9</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">• {course._count?.enrollments || 0} students</span>
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