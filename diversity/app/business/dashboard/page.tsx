'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Building2,
    Users,
    BookOpen,
    Calendar,
    Heart,
    TrendingUp,
    TrendingDown,
    Award,
    Target,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle,
    Download,
    Filter,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    UserPlus,
    Mail,
    Phone,
    MapPin,
    Globe,
    BarChart3,
    PieChart,
    LineChart,
    RefreshCw,
    Sparkles,
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
    Star,
    Loader2,
    ChevronRight,
    Search,
    Bell
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { api } from '@/lib/api'
import { useEffect, useCallback } from 'react'
import { exportToCSV } from '@/lib/exportUtils'
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

const stats = [
    {
        title: 'Total Employees',
        value: '247',
        change: '+12',
        icon: Users,
        color: 'bg-blue-500',
    },
    {
        title: 'Training Hours',
        value: '1,456',
        change: '+234',
        icon: BookOpen,
        color: 'bg-secondary-500',
    },
    {
        title: 'Volunteer Hours',
        value: '892',
        change: '+156',
        icon: Heart,
        color: 'bg-green-500',
    },
    {
        title: 'Diversity Score',
        value: '85%',
        change: '+5.2%',
        icon: Target,
        color: 'bg-primary-500',
    },
]

const badgeLevels = [
    { level: 'Diversity Champion', progress: 85, icon: Medal, color: 'purple' },
    { level: 'Inclusion Partner', progress: 70, icon: Award, color: 'blue' },
    { level: 'Diversity Supporter', progress: 100, icon: BadgeCheck, color: 'green' },
]

const recentActivities = [
    {
        id: 1,
        type: 'course',
        title: 'Employee completed Inclusive Leadership',
        user: 'Sarah Johnson',
        time: '2 hours ago',
    },
    {
        id: 2,
        type: 'volunteer',
        title: 'Team volunteered at Community Center',
        user: '12 employees',
        time: '5 hours ago',
    },
    {
        id: 3,
        type: 'event',
        title: 'Registered for Diversity Summit',
        user: 'Marketing Team',
        time: '1 day ago',
    },
    {
        id: 4,
        type: 'badge',
        title: 'Achieved Diversity Champion badge',
        user: 'HR Department',
        time: '2 days ago',
    },
]

const employeeTrainingData = [
    { department: 'Engineering', completed: 45, enrolled: 60 },
    { department: 'Sales', completed: 32, enrolled: 45 },
    { department: 'Marketing', completed: 28, enrolled: 35 },
    { department: 'HR', completed: 15, enrolled: 18 },
    { department: 'Operations', completed: 22, enrolled: 30 },
]

const impactMetrics = [
    { month: 'Jan', volunteer: 120, training: 450, events: 8 },
    { month: 'Feb', volunteer: 145, training: 520, events: 10 },
    { month: 'Mar', volunteer: 168, training: 580, events: 12 },
    { month: 'Apr', volunteer: 192, training: 610, events: 15 },
    { month: 'May', volunteer: 215, training: 650, events: 18 },
    { month: 'Jun', volunteer: 245, training: 700, events: 20 },
]

export default function BusinessDashboard() {
    const [selectedBadge, setSelectedBadge] = useState('champion')
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchDashboardData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.get('/businesses/me')
            setData(res)
        } catch (err: any) {
            console.error('Error fetching dashboard data:', err)
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDashboardData()
    }, [fetchDashboardData])

    const handleRefresh = () => {
        fetchDashboardData()
    }

    const handleExport = () => {
        if (!data) return;

        const exportData = [
            {
                'Report Date': new Date().toLocaleDateString(),
                'Total Employees': data.stats?.totalEmployees || 0,
                'Training Hours': data.stats?.trainingHours || 0,
                'Volunteer Hours': data.stats?.volunteerHours || 0,
                'Diversity Score': data.stats?.diversityScore || '0%',
                'Badges Earned': (data.milestones || []).filter((m: any) => m.completed).length,
                'Total Sponsorship ($)': (data.impactMetrics || []).reduce((sum: number, m: any) => sum + (m.sponsorship || 0), 0)
            }
        ];

        exportToCSV(exportData, 'business_impact_report');
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </DashboardLayout>
        )
    }

    if (error || !data) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Failed to load dashboard</h2>
                        <p className="text-gray-500 mt-1 max-w-xs">{error || 'Please try refreshing the page.'}</p>
                    </div>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </DashboardLayout>
        )
    }

    const dashboardStats = [
        {
            title: 'Total Employees',
            value: data.stats?.totalEmployees || 0,
            change: '+0',
            icon: Users,
            color: 'bg-blue-500',
        },
        {
            title: 'Training Hours',
            value: data.stats?.trainingHours?.toLocaleString() || 0,
            change: '+0',
            icon: BookOpen,
            color: 'bg-secondary-500',
        },
        {
            title: 'Volunteer Hours',
            value: data.stats?.volunteerHours?.toLocaleString() || 0,
            change: '+0',
            icon: Heart,
            color: 'bg-green-500',
        },
        {
            title: 'Diversity Score',
            value: data.stats?.diversityScore || '0%',
            change: '+0%',
            icon: Target,
            color: 'bg-primary-500',
        },
    ]

    const earnedBadges = [
        { level: 'Diversity Champion', progress: 100, icon: Medal, color: 'purple', earned: data.summary?.isChampion },
        { level: 'Inclusion Partner', progress: 100, icon: Award, color: 'blue', earned: data.summary?.isPartner },
        { level: 'Diversity Supporter', progress: 100, icon: BadgeCheck, color: 'green', earned: data.summary?.isSupporter },
    ].filter(b => b.earned)

    const nextBadge = data.milestones?.find((m: any) => !m.completed)

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Track your diversity initiatives and impact.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                        <Button size="sm" className="bg-primary-600 text-white" onClick={handleRefresh}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Badge Status */}
                <Card className="bg-primary-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Award className="w-6 h-6" />
                                    <h3 className="text-lg font-semibold">Your Diversity Badge</h3>
                                </div>
                                <p className="text-white/90 mb-4">
                                    {nextBadge 
                                        ? `You're on track to achieve ${nextBadge.title} status. Keep up the great work!` 
                                        : "Congratulations! You've achieved all diversity milestones!"}
                                </p>
                                <div className="flex gap-4">
                                    {earnedBadges.length > 0 ? earnedBadges.map((badge) => {
                                        const Icon = badge.icon
                                        return (
                                            <div key={badge.level} className="flex items-center gap-2">
                                                <div className={`w-10 h-10 rounded-full bg-white/20 flex items-center justify-center`}>
                                                    <Icon className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{badge.level}</p>
                                                    <span className="text-xs bg-white text-primary-600 px-2 py-0.5 rounded-full">Earned</span>
                                                </div>
                                            </div>
                                        )
                                    }) : (
                                        <p className="text-sm text-white/70 italic">Start completing milestones to earn badges!</p>
                                    )}
                                </div>
                            </div>
                            <Button variant="secondary" className="bg-white text-secondary-600 hover:bg-gray-100">
                                View All Badges
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dashboardStats.map((stat, index) => {
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
                                            {stat.change !== '+0' && (
                                                <Badge variant="default" className="bg-green-100 text-green-600">
                                                    {stat.change}
                                                </Badge>
                                            )}
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
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="employees">Employees</TabsTrigger>
                        <TabsTrigger value="training">Training</TabsTrigger>
                        <TabsTrigger value="volunteering">Volunteering</TabsTrigger>
                        <TabsTrigger value="impact">Impact</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        {/* Impact Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Impact Metrics</CardTitle>
                                <CardDescription>Monthly tracking of your diversity initiatives</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.impactMetrics}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Area type="monotone" dataKey="volunteer" stackId="1" stroke="#8884d8" fill="#8884d8" name="Volunteer Hours" />
                                            <Area type="monotone" dataKey="training" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Training Progress" />
                                            <Area type="monotone" dataKey="sponsorship" stackId="1" stroke="#ffc658" fill="#ffc658" name="Sponsorship ($)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity & Employee Training */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Recent Activity</CardTitle>
                                            <CardDescription>Latest updates from your team</CardDescription>
                                        </div>
                                        <Button variant="ghost" size="sm">View All</Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {(data.recentActivities || []).map((activity: any) => (
                                            <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.type === 'course' ? 'bg-blue-100' :
                                                        activity.type === 'volunteer' ? 'bg-green-100' :
                                                            activity.type === 'event' ? 'bg-primary-100' : 'bg-secondary-100'
                                                    }`}>
                                                    {activity.type === 'course' && <BookOpen className="w-5 h-5 text-blue-600" />}
                                                    {activity.type === 'volunteer' && <Heart className="w-5 h-5 text-green-600" />}
                                                    {activity.type === 'event' && <Calendar className="w-5 h-5 text-primary-600" />}
                                                    {activity.type === 'badge' && <Award className="w-5 h-5 text-secondary-600" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        {activity.user} • {activity.time}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {!data.recentActivities?.length && (
                                            <p className="text-center text-gray-500 py-4">No recent activity found.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Employee Training Progress */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Training Progress</CardTitle>
                                            <CardDescription>By department</CardDescription>
                                        </div>
                                        <Button variant="ghost" size="sm">View Details</Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {(data.trainingProgress || []).map((dept: any) => (
                                            <div key={dept.department}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium">{dept.department}</span>
                                                    <span className="text-sm text-gray-600">
                                                        {dept.completed}/{dept.enrolled}
                                                    </span>
                                                </div>
                                                <Progress value={dept.enrolled > 0 ? (dept.completed / dept.enrolled) * 100 : 0} />
                                            </div>
                                        ))}
                                        {!data.trainingProgress?.length && (
                                            <p className="text-center text-gray-500 py-4">No training progress data yet.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="employees">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Employee Directory</CardTitle>
                                        <CardDescription>Manage your team members</CardDescription>
                                    </div>
                                    <Button size="sm">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Add Employee
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Training Status</TableHead>
                                            <TableHead>Volunteer Hours</TableHead>
                                            <TableHead>Achievements</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarFallback>JD</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">John Doe</p>
                                                            <p className="text-sm text-gray-600">john@company.com</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>Engineering</TableCell>
                                                <TableCell>
                                                    <div className="w-24">
                                                        <Progress value={75} />
                                                    </div>
                                                </TableCell>
                                                <TableCell>45 hours</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1">
                                                        <Award className="w-4 h-4 text-yellow-500" />
                                                        <Award className="w-4 h-4 text-gray-300" />
                                                        <Award className="w-4 h-4 text-gray-300" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm">View</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}