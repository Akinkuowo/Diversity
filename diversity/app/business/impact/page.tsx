'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart3,
    TrendingUp,
    Users,
    Heart,
    CircleDollarSign,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Zap,
    Globe,
    Award,
    ShieldCheck,
    ChevronRight,
    Info,
    LayoutDashboard,
    Briefcase,
    BookOpen
} from 'lucide-react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from 'recharts'
import { api } from '@/lib/api'
import { toast } from 'sonner'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#ef4444', '#f59e0b']

export default function BusinessImpactReportPage() {
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchImpactData = async () => {
            try {
                const report = await api.get('/businesses/me/impact-report')
                setData(report)
            } catch (error) {
                console.error('Failed to fetch impact report:', error)
                toast.error('Failed to load impact report')
            } finally {
                setIsLoading(false)
            }
        }
        fetchImpactData()
    }, [])

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-pulse text-gray-400 font-medium">Generating your impact report...</div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-primary-600 font-bold mb-2">
                            <Target className="w-5 h-5" />
                            <span>Social Responsibility Report</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Environmental & Social Impact</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
                            A comprehensive overview of your business&apos;s contributions to social progress, community well-being, and environmental sustainability.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-2xl border-gray-200 font-bold h-12 px-6 hover:bg-gray-50">
                            <Download className="w-4 h-4 mr-2" />
                            Export PDF
                        </Button>
                        <Button className="rounded-2xl bg-gray-900 hover:bg-black text-white dark:bg-primary-600 dark:hover:bg-primary-700 font-bold h-12 px-6">
                            Share Report
                        </Button>
                    </div>
                </div>

                {/* Executive Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-indigo-500/5 bg-gradient-to-br from-indigo-500 to-blue-600 text-white overflow-hidden relative group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <CardContent className="p-8 relative">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit mb-6">
                                <CircleDollarSign className="w-6 h-6" />
                            </div>
                            <h3 className="text-4xl font-black mb-1">${data?.summary?.totalInvestment?.toLocaleString()}</h3>
                            <p className="text-indigo-100 font-bold text-sm uppercase tracking-wider">Total Social Investment</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-violet-500/5 bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white overflow-hidden relative group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <CardContent className="p-8 relative">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit mb-6">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h3 className="text-4xl font-black mb-1">{data?.summary?.impactReach?.toLocaleString()}</h3>
                            <p className="text-violet-100 font-bold text-sm uppercase tracking-wider">Estimated Social Reach</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-emerald-500/5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <CardContent className="p-8 relative">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit mb-6">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-4xl font-black mb-1">{data?.summary?.totalHours}</h3>
                            <p className="text-emerald-100 font-bold text-sm uppercase tracking-wider">Community Service Hours</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-amber-500/5 bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <CardContent className="p-8 relative">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit mb-6">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-4xl font-black mb-1">{data?.summary?.totalLearners}</h3>
                            <p className="text-amber-100 font-bold text-sm uppercase tracking-wider">Employees Empowered</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Impact Trend */}
                    <Card className="lg:col-span-2 rounded-[2rem] border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <CardHeader className="p-8 pb-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-black">Impact Trajectory</CardTitle>
                                    <CardDescription>Growth of social contributions over time.</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                        Training
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        Volunteer
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data?.charts?.trend}>
                                        <defs>
                                            <linearGradient id="colorTraining" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorVolunteer" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis 
                                            dataKey="month" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94A3B8', fontWeight: 600, fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94A3B8', fontWeight: 600, fontSize: 12 }}
                                        />
                                        <RechartsTooltip 
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="training" 
                                            stroke="#6366f1" 
                                            strokeWidth={4}
                                            fillOpacity={1} 
                                            fill="url(#colorTraining)" 
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="volunteering" 
                                            stroke="#10b981" 
                                            strokeWidth={4}
                                            fillOpacity={1} 
                                            fill="url(#colorVolunteer)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contribution Breakdown */}
                    <Card className="rounded-[2rem] border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <CardHeader className="p-8 pb-0 text-center">
                            <CardTitle className="text-2xl font-black">Impact Diversity</CardTitle>
                            <CardDescription>Allocation of social resources.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 flex flex-col items-center">
                            <div className="h-[250px] w-full mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data?.charts?.breakdown}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {data?.charts?.breakdown.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-3 w-full">
                                {data?.charts?.breakdown.map((entry: any, index: number) => (
                                    <div key={entry.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900/50 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="font-bold text-gray-700 dark:text-gray-300">{entry.name}</span>
                                        </div>
                                        <span className="font-black text-gray-900 dark:text-white">
                                            {Math.round((entry.value / data.summary.totalInvestment) * 100)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sector Radar Chart */}
                    <Card className="rounded-[2rem] border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden bg-slate-900 text-white">
                        <CardHeader className="p-8 pb-0">
                            <CardTitle className="text-2xl font-black">Thematic Impact</CardTitle>
                            <CardDescription className="text-slate-400">Alignment with UN Sustainable Development Goals.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data?.charts?.sectorImpact}>
                                        <PolarGrid stroke="#334155" />
                                        <PolarAngleAxis dataKey="sector" tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} />
                                        <PolarRadiusAxis axisLine={false} tick={false} />
                                        <Radar
                                            name="Impact Score"
                                            dataKey="value"
                                            stroke="#6366f1"
                                            fill="#6366f1"
                                            fillOpacity={0.6}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Impact Highlights */}
                    <Card className="lg:col-span-2 rounded-[2rem] border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <CardHeader className="p-8 pb-0">
                            <CardTitle className="text-2xl font-black">Impact Highlights</CardTitle>
                            <CardDescription>Key achievements and milestones from the past quarter.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100/50 flex gap-4">
                                    <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-indigo-600 h-fit">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 dark:text-white text-lg">Training Excellence</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {data?.training?.completions} certifications issued. Engagement rate is at {data?.training?.engagementRate.toFixed(1)}%.
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100/50 flex gap-4">
                                    <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-emerald-600 h-fit">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 dark:text-white text-lg">Community Champion</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Supported {data?.sponsorship?.projectCount} community initiatives across {data?.volunteering?.uniqueVolunteers} employee volunteers.
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-amber-50 dark:bg-amber-900/10 border border-amber-100/50 flex gap-4">
                                    <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-amber-600 h-fit">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 dark:text-white text-lg">Reach Expansion</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Social impact footprint has expanded to {data?.sponsorship?.reach.toLocaleString()} people this quarter.
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-fuchsia-50 dark:bg-fuchsia-900/10 border border-fuchsia-100/50 flex gap-4 text-left group cursor-pointer hover:bg-fuchsia-100/50 transition-colors">
                                    <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-fuchsia-600 h-fit">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 dark:text-white text-lg">Next Milestone</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            On track to reach 1,000 community service hours by the end of next month.
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 ml-auto self-center text-fuchsia-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
