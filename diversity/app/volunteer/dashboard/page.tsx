'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Heart,
    Clock,
    Calendar,
    Award,
    Target,
    Users,
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
    Bell
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
    Legend
} from 'recharts'
import { cn } from '@/lib/utils'

const stats = [
    {
        title: 'Total Hours',
        value: '156',
        change: '+12 this month',
        icon: Clock,
        color: 'bg-blue-500',
    },
    {
        title: 'Tasks Completed',
        value: '48',
        change: '+8 this month',
        icon: CheckCircle,
        color: 'bg-green-500',
    },
    {
        title: 'Achievements',
        value: '12',
        change: '3 new',
        icon: Award,
        color: 'bg-purple-500',
    },
    {
        title: 'Impact Score',
        value: '85%',
        change: '+5.2%',
        icon: Target,
        color: 'bg-orange-500',
    },
]

const upcomingTasks = [
    {
        id: 1,
        title: 'Community Food Drive',
        organization: 'Local Food Bank',
        date: '2024-01-20',
        time: '09:00 AM',
        hours: 4,
        status: 'upcoming',
        location: 'Downtown Community Center',
        volunteers: 8,
    },
    {
        id: 2,
        title: 'Youth Mentoring Session',
        organization: 'Big Brothers Big Sisters',
        date: '2024-01-22',
        time: '03:00 PM',
        hours: 2,
        status: 'upcoming',
        location: 'Virtual',
        volunteers: 12,
    },
    {
        id: 3,
        title: 'Park Cleanup',
        organization: 'Parks Department',
        date: '2024-01-25',
        time: '10:00 AM',
        hours: 3,
        status: 'upcoming',
        location: 'Central Park',
        volunteers: 15,
    },
]

const achievements = [
    {
        id: 1,
        name: '100 Hours Club',
        description: 'Completed 100 volunteer hours',
        icon: Trophy,
        color: 'yellow',
        date: '2024-01-15',
    },
    {
        id: 2,
        name: 'Community Champion',
        description: 'Led 5 volunteer events',
        icon: Medal,
        color: 'purple',
        date: '2024-01-10',
    },
    {
        id: 3,
        name: 'First Responder',
        description: 'Completed first 10 tasks',
        icon: BadgeCheck,
        color: 'blue',
        date: '2024-01-05',
    },
    {
        id: 4,
        name: 'Team Player',
        description: 'Participated in group activities',
        icon: Users,
        color: 'green',
        date: '2023-12-28',
    },
]

const recentActivities = [
    {
        id: 1,
        activity: 'Completed Food Drive',
        organization: 'Local Food Bank',
        hours: 4,
        date: '2024-01-18',
        verified: true,
    },
    {
        id: 2,
        activity: 'Mentoring Session',
        organization: 'Youth Program',
        hours: 2,
        date: '2024-01-17',
        verified: true,
    },
    {
        id: 3,
        activity: 'Community Workshop',
        organization: 'Community Center',
        hours: 3,
        date: '2024-01-15',
        verified: false,
    },
]

const monthlyHours = [
    { month: 'Sep', hours: 24 },
    { month: 'Oct', hours: 32 },
    { month: 'Nov', hours: 28 },
    { month: 'Dec', hours: 36 },
    { month: 'Jan', hours: 42 },
]

const skillDistribution = [
    { name: 'Teaching', value: 35, color: '#8884d8' },
    { name: 'Mentoring', value: 25, color: '#82ca9d' },
    { name: 'Event Planning', value: 20, color: '#ffc658' },
    { name: 'Administration', value: 15, color: '#ff8042' },
    { name: 'Technical', value: 5, color: '#0088FE' },
]

export default function VolunteerDashboard() {
    const [selectedView, setSelectedView] = useState('upcoming')
    const [userName, setUserName] = useState('Volunteer')

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) {
            try {
                const parsedUser = JSON.parse(user)
                if (parsedUser.firstName) {
                    setUserName(parsedUser.firstName)
                }
            } catch (e) {
                console.error('Failed to parse user from localStorage', e)
            }
        }
    }, [])

    return (
        <DashboardLayout role="VOLUNTEER">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Volunteer Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Track your impact and find new opportunities.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Profile
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            <Bell className="w-4 h-4 mr-2" />
                            Find Opportunities
                        </Button>
                    </div>
                </div>

                {/* Welcome Banner */}
                <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Welcome back, {userName}! 👋</h3>
                                <p className="text-white/90 mb-4">
                                    You're making a real difference in your community. Keep up the great work!
                                </p>
                                <div className="flex gap-4">
                                    <div className="bg-white/20 rounded-lg px-4 py-2">
                                        <p className="text-sm opacity-90">Current Streak</p>
                                        <p className="text-2xl font-bold">15 days</p>
                                    </div>
                                    <div className="bg-white/20 rounded-lg px-4 py-2">
                                        <p className="text-sm opacity-90">Next Milestone</p>
                                        <p className="text-2xl font-bold">200 hours</p>
                                    </div>
                                </div>
                            </div>
                            <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                                View Progress
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
                    {/* Left Column - Tasks & Activities */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upcoming Tasks */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Upcoming Tasks</CardTitle>
                                        <CardDescription>Your scheduled volunteer activities</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm">View Calendar</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {upcomingTasks.map((task) => (
                                        <div key={task.id} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="flex gap-3">
                                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <Calendar className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.organization}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                        <span className="flex items-center">
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                            {new Date(task.date).toLocaleDateString()} at {task.time}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {task.hours} hours
                                                        </span>
                                                        <span className="flex items-center">
                                                            <MapPin className="w-3 h-3 mr-1" />
                                                            {task.location}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge variant="secondary">{task.volunteers} volunteers</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline">View Details</Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Recent Activity</CardTitle>
                                        <CardDescription>Your completed volunteer work</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm">Log Hours</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Activity</TableHead>
                                            <TableHead>Organization</TableHead>
                                            <TableHead>Hours</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentActivities.map((activity) => (
                                            <TableRow key={activity.id}>
                                                <TableCell className="font-medium">{activity.activity}</TableCell>
                                                <TableCell>{activity.organization}</TableCell>
                                                <TableCell>{activity.hours}</TableCell>
                                                <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    {activity.verified ? (
                                                        <Badge className="bg-green-100 text-green-600">Verified</Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Pending</Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Achievements & Stats */}
                    <div className="space-y-6">
                        {/* Monthly Hours Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Hours</CardTitle>
                                <CardDescription>Last 5 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyHours}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="hours" fill="#10b981" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skill Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Skills & Interests</CardTitle>
                                <CardDescription>Your volunteer skills</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={skillDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={60}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {skillDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 space-y-2">
                                    {skillDistribution.map((skill) => (
                                        <div key={skill.name} className="flex items-center justify-between text-sm">
                                            <span>{skill.name}</span>
                                            <span className="font-medium">{skill.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Achievements */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Achievements</CardTitle>
                                        <CardDescription>Your earned badges</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm">View All</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {achievements.map((achievement) => {
                                        const Icon = achievement.icon
                                        const achievementColors: Record<string, { bg: string, text: string }> = {
                                            yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
                                            purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
                                            blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
                                            green: { bg: 'bg-green-100', text: 'text-green-600' },
                                        }
                                        const colors = achievementColors[achievement.color] || achievementColors.blue

                                        return (
                                            <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", colors.bg)}>
                                                    <Icon className={cn("w-5 h-5", colors.text)} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{achievement.name}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                                                </div>
                                                <Badge variant="secondary">{achievement.date}</Badge>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommended Opportunities */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recommended for You</CardTitle>
                                <CardDescription>Based on your interests</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <p className="font-medium">Tutoring Program</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Local School District</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <Badge variant="secondary">2 hours/week</Badge>
                                            <Button size="sm" variant="ghost" className="text-purple-600">Apply</Button>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <p className="font-medium">Environmental Cleanup</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Parks Department</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <Badge variant="secondary">This weekend</Badge>
                                            <Button size="sm" variant="ghost" className="text-green-600">Apply</Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}