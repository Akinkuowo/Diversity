import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { Loader2, Users, Building2, BookOpen, Calendar, Clock, BarChart3, Target, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'

export function AdminReports() {
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.get('/admin/reports/overview')
                setStats(data)
            } catch (error) {
                console.error('Failed to fetch stats:', error)
                toast.error('Failed to load report data')
            } finally {
                setIsLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!stats) return null

    const totalUsers = stats.users.total

    const roleCards = [
        { label: 'Administrators', count: stats.users.distribution.ADMIN || 0, color: 'bg-red-500', bgColor: 'bg-red-100', icon: Target },
        { label: 'Businesses', count: stats.users.distribution.BUSINESS || 0, color: 'bg-indigo-500', bgColor: 'bg-indigo-100', icon: Building2 },
        { label: 'Community', count: stats.users.distribution.COMMUNITY_MEMBER || 0, color: 'bg-emerald-500', bgColor: 'bg-emerald-100', icon: Users },
        { label: 'Learners', count: stats.users.distribution.LEARNER || 0, color: 'bg-blue-500', bgColor: 'bg-blue-100', icon: BookOpen },
        { label: 'Volunteers', count: stats.users.distribution.VOLUNTEER || 0, color: 'bg-amber-500', bgColor: 'bg-amber-100', icon: Award }
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Platform Reports</h2>
                    <p className="text-muted-foreground">High-level overview of the Diversity Network's performance and engagement.</p>
                </div>
            </div>

            {/* Top Level KPIs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users.total.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">Across all role types</p>
                        </CardContent>
                    </Card>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Verified Businesses</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.businesses.total.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">Registered business profiles</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Course Enrollments</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.courses.enrollments.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">Across {stats.courses.total} published courses</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Volunteer Impact</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.volunteering.totalHours.toLocaleString()} <span className="text-lg text-muted-foreground font-normal">hrs</span></div>
                            <p className="text-xs text-muted-foreground mt-1">Total logged community hours</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Secondary KPIs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>User Role Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {roleCards.map(role => (
                                <div key={role.label} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-md ${role.bgColor}`}>
                                                <role.icon className={`h-4 w-4 ${role.color.replace('bg-', 'text-')}`} />
                                            </div>
                                            <span className="font-medium text-gray-700">{role.label}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold">{role.count.toLocaleString()}</span>
                                            <span className="text-muted-foreground w-12 text-right">
                                                {totalUsers > 0 ? ((role.count / totalUsers) * 100).toFixed(1) : 0}%
                                            </span>
                                        </div>
                                    </div>
                                    <Progress 
                                        value={totalUsers > 0 ? (role.count / totalUsers) * 100 : 0} 
                                        className={`h-2 [&>div]:${role.color}`}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <Card className="h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Event Engagement
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-6">
                                <div>
                                    <div className="text-4xl font-bold text-primary">{stats.events.registrations.toLocaleString()}</div>
                                    <div className="text-sm font-medium text-primary/80 mt-1 uppercase tracking-wider">Total Tickets Issued</div>
                                </div>
                                
                                <div className="h-px bg-primary/20 w-full" />
                                
                                <div>
                                    <div className="text-3xl font-bold text-gray-700">{stats.events.total.toLocaleString()}</div>
                                    <div className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">Events Hosted</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
