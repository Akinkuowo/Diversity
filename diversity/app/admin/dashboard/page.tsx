'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    Building2,
    BookOpen,
    Calendar,
    Heart,
    TrendingUp,
    DollarSign,
    Activity,
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
    Shield,
    Award,
    BarChart3,
    PieChart,
    LineChart,
    RefreshCw
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

const stats = [
    {
        title: 'Total Users',
        value: '24,567',
        change: '+12.3%',
        icon: Users,
        color: 'bg-blue-500',
    },
    {
        title: 'Businesses',
        value: '1,234',
        change: '+8.2%',
        icon: Building2,
        color: 'bg-secondary-500',
    },
    {
        title: 'Courses',
        value: '156',
        change: '+23.1%',
        icon: BookOpen,
        color: 'bg-green-500',
    },
    {
        title: 'Events',
        value: '89',
        change: '+15.7%',
        icon: Calendar,
        color: 'bg-primary-500',
    },
    {
        title: 'Volunteers',
        value: '5,678',
        change: '+18.4%',
        icon: Heart,
        color: 'bg-pink-500',
    },
    {
        title: 'Revenue',
        value: '$45,678',
        change: '+32.1%',
        icon: DollarSign,
        color: 'bg-secondary-500',
    },
]

const recentUsers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Business',
        status: 'active',
        joined: '2024-01-15',
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Volunteer',
        status: 'active',
        joined: '2024-01-14',
    },
    {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'Learner',
        status: 'pending',
        joined: '2024-01-13',
    },
    {
        id: 4,
        name: 'Alice Brown',
        email: 'alice@example.com',
        role: 'Community',
        status: 'active',
        joined: '2024-01-12',
    },
    {
        id: 5,
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'Business',
        status: 'suspended',
        joined: '2024-01-11',
    },
]

const pendingApprovals = [
    {
        id: 1,
        type: 'Business Verification',
        name: 'Tech Corp Inc.',
        requestor: 'John Smith',
        date: '2024-01-15',
        priority: 'high',
    },
    {
        id: 2,
        type: 'Course Review',
        name: 'Inclusive Leadership',
        requestor: 'Dr. Sarah Johnson',
        date: '2024-01-14',
        priority: 'medium',
    },
    {
        id: 3,
        type: 'Event Approval',
        name: 'Diversity Summit 2024',
        requestor: 'Mike Brown',
        date: '2024-01-13',
        priority: 'low',
    },
    {
        id: 4,
        type: 'Badge Request',
        name: 'Diversity Champion',
        requestor: 'ABC Company',
        date: '2024-01-12',
        priority: 'medium',
    },
]

const userGrowthData = [
    { month: 'Jan', users: 12000, businesses: 800, volunteers: 5000 },
    { month: 'Feb', users: 13500, businesses: 850, volunteers: 5800 },
    { month: 'Mar', users: 15000, businesses: 920, volunteers: 6500 },
    { month: 'Apr', users: 16800, businesses: 1000, volunteers: 7200 },
    { month: 'May', users: 18500, businesses: 1100, volunteers: 8000 },
    { month: 'Jun', users: 20500, businesses: 1180, volunteers: 8900 },
    { month: 'Jul', users: 22500, businesses: 1250, volunteers: 9800 },
    { month: 'Aug', users: 24567, businesses: 1234, volunteers: 5678 },
]

const userRoleDistribution = [
    { name: 'Business', value: 1234, color: '#8884d8' },
    { name: 'Volunteer', value: 5678, color: '#82ca9d' },
    { name: 'Learner', value: 8923, color: '#ffc658' },
    { name: 'Community', value: 8732, color: '#ff8042' },
]

const activityData = [
    { day: 'Mon', courses: 45, events: 23, volunteers: 67 },
    { day: 'Tue', courses: 52, events: 28, volunteers: 72 },
    { day: 'Wed', courses: 48, events: 31, volunteers: 85 },
    { day: 'Thu', courses: 61, events: 35, volunteers: 78 },
    { day: 'Fri', courses: 55, events: 42, volunteers: 92 },
    { day: 'Sat', courses: 38, events: 55, volunteers: 110 },
    { day: 'Sun', courses: 25, events: 48, volunteers: 95 },
]

export default function AdminDashboard() {
    const [timeframe, setTimeframe] = useState('week')

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Welcome back, Admin. Here's what's happening with your platform.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                        <Button size="sm" className="bg-primary-600 text-white">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh Data
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
                                            <Badge variant={stat.change.startsWith('+') ? 'default' : 'destructive'}>
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

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Growth Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>User Growth</CardTitle>
                                    <CardDescription>Platform growth over time</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={timeframe === 'week' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setTimeframe('week')}
                                    >
                                        Week
                                    </Button>
                                    <Button
                                        variant={timeframe === 'month' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setTimeframe('month')}
                                    >
                                        Month
                                    </Button>
                                    <Button
                                        variant={timeframe === 'year' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setTimeframe('year')}
                                    >
                                        Year
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={userGrowthData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" />
                                        <Area type="monotone" dataKey="businesses" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                                        <Area type="monotone" dataKey="volunteers" stackId="1" stroke="#ffc658" fill="#ffc658" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Distribution</CardTitle>
                            <CardDescription>Breakdown by role</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={userRoleDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label
                                        >
                                            {userRoleDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Activity Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Platform Activity</CardTitle>
                        <CardDescription>Daily activity metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="courses" fill="#8884d8" />
                                    <Bar dataKey="events" fill="#82ca9d" />
                                    <Bar dataKey="volunteers" fill="#ffc658" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Approvals & Recent Users */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pending Approvals */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Pending Approvals</CardTitle>
                                    <CardDescription>Items awaiting your review</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm">View All</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pendingApprovals.map((item) => (
                                    <div key={item.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.priority === 'high' ? 'bg-red-100' :
                                                    item.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                                                }`}>
                                                {item.type === 'Business Verification' && <Building2 className={`w-5 h-5 ${item.priority === 'high' ? 'text-red-600' :
                                                        item.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                                                    }`} />}
                                                {item.type === 'Course Review' && <BookOpen className={`w-5 h-5 ${item.priority === 'high' ? 'text-red-600' :
                                                        item.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                                                    }`} />}
                                                {item.type === 'Event Approval' && <Calendar className={`w-5 h-5 ${item.priority === 'high' ? 'text-red-600' :
                                                        item.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                                                    }`} />}
                                                {item.type === 'Badge Request' && <Award className={`w-5 h-5 ${item.priority === 'high' ? 'text-red-600' :
                                                        item.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                                                    }`} />}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {item.type} • {item.requestor}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600">
                                                <CheckCircle className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600">
                                                <AlertCircle className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Users */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Users</CardTitle>
                                    <CardDescription>Latest platform registrations</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm">View All</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback className="bg-secondary-100 text-secondary-600">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">{user.name}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline">{user.role}</Badge>
                                                    <Badge variant={
                                                        user.status === 'active' ? 'default' :
                                                            user.status === 'pending' ? 'secondary' : 'destructive'
                                                    }>
                                                        {user.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Mail className="w-4 h-4 mr-2" />
                                                    Send Message
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Suspend User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                                <UserPlus className="w-6 h-6" />
                                <span>Add User</span>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                                <Building2 className="w-6 h-6" />
                                <span>Verify Business</span>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                                <BookOpen className="w-6 h-6" />
                                <span>Create Course</span>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                                <Calendar className="w-6 h-6" />
                                <span>Create Event</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}