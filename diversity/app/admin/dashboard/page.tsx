'use client'

import { useState, useEffect } from 'react'
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
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { toast } from 'sonner'
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

// Icon mapping for stats
const IconMap: Record<string, any> = {
    Users,
    Building2,
    BookOpen,
    Calendar,
    Heart,
    DollarSign,
}

export default function AdminDashboard() {
    const [timeframe, setTimeframe] = useState('week')
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const response = await api.get('/admin/dashboard-stats')
            setData(response)
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
            toast.error('Failed to load dashboard statistics')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading || !data) {
        return (
            <DashboardLayout role="ADMIN">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="w-10 h-10 text-primary-600 animate-spin" />
                        <p className="text-gray-500 animate-pulse font-medium">Loading dashboard stats...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    const { stats, recentUsers, pendingApprovals, userGrowthData, userRoleDistribution, activityData } = data

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
                        <Button 
                            size="sm" 
                            className="bg-primary-600 text-white"
                            onClick={fetchDashboardData}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh Data
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {stats.map((stat: any, index: number) => {
                        const Icon = IconMap[stat.icon] || Activity
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
                                            {userRoleDistribution.map((entry: any, index: number) => (
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
                                {pendingApprovals.map((item: any) => (
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
                                {recentUsers.map((user: any) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback className="bg-secondary-100 text-secondary-600">
                                                    {user.name.split(' ').map((n: string) => n[0]).join('')}
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