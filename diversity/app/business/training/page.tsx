'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    BookOpen, 
    Award, 
    Clock, 
    Search, 
    Layout, 
    Filter,
    PlayCircle,
    CheckCircle2,
    Users,
    ShieldCheck,
    BarChart3,
    UserPlus,
    Download
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Course {
    id: string
    title: string
    description: string
    duration: number
    level: string
    category: string
    thumbnail?: string
    cpdHours?: number
    certificates?: { id: string }[]
}

interface Enrollment {
    id: string
    courseId: string
    progress: number
    status: string
    course: Course
    user?: {
        id: string
        firstName: string
        lastName: string
        email: string
    }
}

export default function BusinessTrainingPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('my-learning')
    const [searchTerm, setSearchTerm] = useState('')
    const [enrollingId, setEnrollingId] = useState<string | null>(null)
    const [enrollments, setEnrollments] = useState<Enrollment[]>([])
    const [availableCourses, setAvailableCourses] = useState<Course[]>([])
    const [teamEnrollments, setTeamEnrollments] = useState<Enrollment[]>([])
    const [employees, setEmployees] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
    const [selectedCourseForBulk, setSelectedCourseForBulk] = useState<string>('')

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // Fetch independently to prevent one failure from blocking everything
                const fetchEnrollments = async () => {
                    try {
                        const res = await api.get('/learners/me/enrollments')
                        setEnrollments(res || [])
                    } catch (e) {
                        console.error('Failed to fetch enrollments:', e)
                    }
                }

                const fetchCourses = async () => {
                    try {
                        const res = await api.get('/courses')
                        const courses = res || []
                        
                        const requestedTopics = [
                            { id: 'topic-1', title: 'Cultural Awareness', description: 'Deepen your understanding of different cultures in the workplace.', duration: 60, level: 'Beginner', category: 'Culture', cpdHours: 1 },
                            { id: 'topic-2', title: 'Workplace Inclusion', description: 'Strategies for creating a truly inclusive environment.', duration: 90, level: 'Intermediate', category: 'Inclusion', cpdHours: 1.5 },
                            { id: 'topic-3', title: 'Community Cohesion', description: 'Building stronger, more unified communities.', duration: 120, level: 'Advanced', category: 'Community', cpdHours: 2 },
                            { id: 'topic-4', title: 'Anti-racism Awareness', description: 'Recognizing and dismantling systemic racism.', duration: 75, level: 'Intermediate', category: 'Diversity', cpdHours: 1 },
                            { id: 'topic-5', title: 'Bias Awareness', description: 'Identifying and mitigating unconscious biases.', duration: 45, level: 'Beginner', category: 'Psychology', cpdHours: 0.5 },
                            { id: 'topic-6', title: 'Inclusive Leadership', description: 'Leading with empathy and inclusivity.', duration: 150, level: 'Advanced', category: 'Leadership', cpdHours: 2.5 }
                        ]

                        setAvailableCourses(courses.length > 0 ? courses : requestedTopics)
                    } catch (e) {
                        console.error('Failed to fetch courses:', e)
                        // Fallback on error too
                        setAvailableCourses([
                            { id: 'topic-1', title: 'Cultural Awareness', description: 'Deepen your understanding of different cultures in the workplace.', duration: 60, level: 'Beginner', category: 'Culture', cpdHours: 1 },
                            { id: 'topic-2', title: 'Workplace Inclusion', description: 'Strategies for creating a truly inclusive environment.', duration: 90, level: 'Intermediate', category: 'Inclusion', cpdHours: 1.5 },
                            { id: 'topic-3', title: 'Community Cohesion', description: 'Building stronger, more unified communities.', duration: 120, level: 'Advanced', category: 'Community', cpdHours: 2 },
                            { id: 'topic-4', title: 'Anti-racism Awareness', description: 'Recognizing and dismantling systemic racism.', duration: 75, level: 'Intermediate', category: 'Diversity', cpdHours: 1 },
                            { id: 'topic-5', title: 'Bias Awareness', description: 'Identifying and mitigating unconscious biases.', duration: 45, level: 'Beginner', category: 'Psychology', cpdHours: 0.5 },
                            { id: 'topic-6', title: 'Inclusive Leadership', description: 'Leading with empathy and inclusivity.', duration: 150, level: 'Advanced', category: 'Leadership', cpdHours: 2.5 }
                        ])
                    }
                }

                const fetchEmployees = async () => {
                    try {
                        const res = await api.get('/businesses/me/employees')
                        setEmployees(res || [])
                    } catch (e) {
                        console.error('Failed to fetch employees:', e)
                    }
                }

                await Promise.allSettled([
                    fetchEnrollments(),
                    fetchCourses(),
                    fetchEmployees()
                ])
                
                // Simulated Business Data (keeping the progress stats for now)
                setTeamEnrollments([
                    {
                        id: 'te-1',
                        courseId: 'c1',
                        progress: 85,
                        status: 'IN_PROGRESS',
                        course: { title: 'Inclusive Leadership', cpdHours: 4 } as any,
                        user: { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@company.com' } as any
                    },
                    {
                        id: 'te-2',
                        courseId: 'c2',
                        progress: 100,
                        status: 'COMPLETED',
                        course: { title: 'Unconscious Bias Training', cpdHours: 2 } as any,
                        user: { firstName: 'Michael', lastName: 'Chen', email: 'm.chen@company.com' } as any
                    }
                ])
            } catch (error) {
                console.error('Unexpected error in fetchData:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleEnroll = async (courseId: string) => {
        setEnrollingId(courseId)
        try {
            await api.post(`/learners/me/enroll/${courseId}`, {})
            toast.success("Enrolled successfully!")
            const enrRes = await api.get('/learners/me/enrollments')
            setEnrollments(enrRes || [])
            setActiveTab('my-learning')
        } catch (error) {
            toast.error("Failed to enroll")
        } finally {
            setEnrollingId(null)
        }
    }

    const handleBulkEnroll = async () => {
        if (!selectedCourseForBulk) {
            toast.error("Please select a module")
            return
        }
        if (selectedEmployees.length === 0) {
            toast.error("Please select at least one employee")
            return
        }
        
        setIsLoading(true)
        try {
            await api.post(`/businesses/me/courses/${selectedCourseForBulk}/enroll`, {
                userIds: selectedEmployees
            })
            toast.success(`Successfully enrolled ${selectedEmployees.length} employees!`)
            setIsBulkModalOpen(false)
            setSelectedEmployees([])
            setSelectedCourseForBulk('')
            
            // Refresh data
            const [enrRes, employeesRes] = await Promise.all([
                api.get('/learners/me/enrollments'),
                api.get('/businesses/me/employees')
            ])
            setEnrollments(enrRes || [])
            setEmployees(employeesRes || [])
        } catch (error) {
            toast.error("Failed to bulk enroll employees")
        } finally {
            setIsLoading(false)
        }
    }

    const filteredCourses = availableCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const stats = [
        { label: 'Completed Courses', value: enrollments.filter(e => e.progress === 100).length, icon: CheckCircle2, color: 'text-emerald-500' },
        { label: 'Hours of Learning', value: '12.5', icon: Clock, color: 'text-blue-500' },
        { label: 'CPD Hours', value: '8.0', icon: Award, color: 'text-amber-500' },
        { label: 'Team Progress', value: '78%', icon: BarChart3, color: 'text-primary-500' },
    ]

    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 lg:p-20 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/20 to-transparent pointer-events-none" />
                    <div className="relative z-10 space-y-6 max-w-2xl">
                        <Badge className="bg-primary-500/20 text-primary-400 border-primary-500/30 px-4 py-1.5 text-sm font-black uppercase tracking-widest">
                            Learning Academy
                        </Badge>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                            Master <span className="text-primary-400">Diversity</span> & Inclusion
                        </h1>
                        <p className="text-xl text-slate-300 font-medium leading-relaxed">
                            Empower your organization with world-class training modules designed to foster an inclusive workplace culture.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-slate-900 group hover:scale-[1.02] transition-all duration-300">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-4xl font-black text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">{stat.value}</p>
                                    </div>
                                    <div className={cn("p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 transition-transform group-hover:rotate-12", stat.color)}>
                                        <stat.icon className="w-8 h-8" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Navigation Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-[2rem] w-fit">
                        {[
                            { id: 'my-learning', label: 'My Training', icon: BookOpen },
                            { id: 'team-training', label: 'Team Training', icon: Users },
                            { id: 'explore', label: 'Explore Catalog', icon: Layout },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-black transition-all duration-300",
                                    activeTab === tab.id 
                                        ? "bg-white dark:bg-slate-900 text-primary-600 shadow-md scale-105" 
                                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80 lg:w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <Input 
                            className="h-14 pl-14 pr-6 rounded-[2rem] border-none bg-white dark:bg-slate-900 shadow-xl focus:ring-2 focus:ring-primary-500/50 transition-all font-bold placeholder:text-slate-400"
                            placeholder="Search courses, categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 rounded-[2rem] bg-gray-100 dark:bg-slate-900 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="pb-12 pt-6">
                        <AnimatePresence mode="wait">
                            {activeTab === 'my-learning' ? (
                                <motion.div
                                    key="my-learning"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    {enrollments.length > 0 ? enrollments.map((enr) => (
                                        <Card key={enr.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] flex flex-col bg-white dark:bg-slate-900">
                                            <div className="relative h-48 overflow-hidden bg-primary-50 dark:bg-slate-800 flex items-center justify-center">
                                                <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-5 transition-opacity" />
                                                <BookOpen className="w-16 h-16 text-primary-200 transition-transform group-hover:scale-110 duration-500" />
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-primary-600 border-none font-bold">
                                                        {enr.progress === 100 ? 'Completed' : 'In Progress'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardHeader className="p-8 pb-4">
                                                <CardTitle className="text-2xl font-black group-hover:text-primary-500 transition-colors line-clamp-1">{enr.course.title}</CardTitle>
                                                <CardDescription className="line-clamp-2 text-slate-500 font-medium">{enr.course.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-8 pt-0 space-y-6 flex-1">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-xs font-black uppercase text-slate-400 tracking-widest">
                                                        <span>Progress</span>
                                                        <span className="text-slate-900 dark:text-white">{Math.round(enr.progress)}%</span>
                                                    </div>
                                                    <Progress value={enr.progress} className="h-2 rounded-full bg-slate-100 dark:bg-slate-800" />
                                                </div>
                                                <div className="flex items-center gap-6 text-sm text-slate-500">
                                                    <div className="flex items-center gap-2 font-bold">
                                                        <Layout className="w-4.5 h-4.5 text-primary-500" />
                                                        {enr.course.level}
                                                    </div>
                                                    <div className="flex items-center gap-2 font-bold">
                                                        <Clock className="w-4.5 h-4.5 text-slate-400" />
                                                        {enr.course.duration} mins
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="p-8 pt-0">
                                                <Button 
                                                    onClick={() => router.push(`/learner/courses/${enr.course.id}`)}
                                                    className={cn(
                                                        "w-full rounded-2xl h-14 font-black uppercase tracking-widest text-sm transition-all shadow-lg",
                                                        enr.progress === 100 
                                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                                                            : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-primary-600 dark:hover:bg-primary-700"
                                                    )}
                                                >
                                                    {enr.progress === 100 ? (
                                                        <><Award className="w-5 h-5 mr-3" /> View Certificate</>
                                                    ) : (
                                                        <><PlayCircle className="w-5 h-5 mr-3" /> Continue Academy</>
                                                    )}
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    )) : (
                                        <div className="col-span-full py-24 text-center space-y-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border-none">
                                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto ring-8 ring-slate-50 dark:ring-slate-800/50">
                                                <BookOpen className="w-12 h-12 text-slate-300" />
                                            </div>
                                            <div className="max-w-md mx-auto">
                                                <h3 className="text-3xl font-black text-slate-900 dark:text-white">Start Your Learning Journey</h3>
                                                <p className="text-slate-500 mt-4 text-lg font-medium">You haven't enrolled in any training modules yet. Discover our premium curriculum today.</p>
                                            </div>
                                            <Button 
                                                className="bg-primary-600 hover:bg-primary-700 text-white rounded-2xl px-12 h-14 font-black uppercase tracking-widest shadow-xl shadow-primary-500/20"
                                                onClick={() => setActiveTab('explore')}
                                            >
                                                Browse Academy
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            ) : activeTab === 'team-training' ? (
                                <motion.div
                                    key="team-training"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    className="space-y-10"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="space-y-1">
                                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Organizational Training Oversight</h2>
                                            <p className="text-slate-500 font-medium">Monitor your team's progress and manage group enrolments.</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <Button 
                                                variant="outline"
                                                className="h-14 rounded-2xl px-6 border-slate-200 dark:border-slate-800 font-black text-slate-600"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Report
                                            </Button>
                                            <Button 
                                                onClick={() => setIsBulkModalOpen(true)}
                                                className="bg-primary-600 hover:bg-primary-700 text-white rounded-2xl px-8 h-14 font-black uppercase tracking-widest text-sm shadow-xl shadow-primary-500/20"
                                            >
                                                <UserPlus className="w-5 h-5 mr-3" />
                                                Bulk Enrolment
                                            </Button>
                                        </div>
                                    </div>

                                    <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white dark:bg-slate-900">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                                        <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Employee Profile</th>
                                                        <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Current Academy Module</th>
                                                        <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Completion Path</th>
                                                        <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">CPD</th>
                                                        <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                                    {teamEnrollments.length > 0 ? teamEnrollments.map((enr) => (
                                                        <tr key={enr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                                                            <td className="p-8">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-black text-primary-600 shadow-sm border border-primary-200/50">
                                                                        {enr.user?.firstName?.[0]}{enr.user?.lastName?.[0]}
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <p className="font-black text-slate-900 dark:text-white text-lg">{enr.user?.firstName} {enr.user?.lastName}</p>
                                                                        <p className="text-sm text-slate-400 font-bold">{enr.user?.email}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-8">
                                                                <span className="font-black text-slate-700 dark:text-slate-300 group-hover:text-primary-600 transition-colors">{enr.course?.title}</span>
                                                            </td>
                                                            <td className="p-8">
                                                                <div className="flex items-center gap-4 w-44">
                                                                    <Progress value={enr.progress} className="h-2 rounded-full" />
                                                                    <span className="text-xs font-black tracking-tighter">{Math.round(enr.progress)}%</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-8 text-center">
                                                                <Badge variant="outline" className="font-black border-slate-200 dark:border-slate-800 px-3 py-1">
                                                                    {enr.course?.cpdHours || 0}h
                                                                </Badge>
                                                            </td>
                                                            <td className="p-8">
                                                                <Badge className={cn(
                                                                    "font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border-none",
                                                                    enr.progress === 100 
                                                                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" 
                                                                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                                                )}>
                                                                    {enr.progress === 100 ? 'Certified' : 'Learning'}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan={5} className="p-20 text-center">
                                                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active team training data</p>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card>

                                    {/* Bulk Enrolment Modal */}
                                    {isBulkModalOpen && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6">
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                className="w-full max-w-2xl"
                                            >
                                                <Card className="rounded-[3rem] shadow-2xl bg-white dark:bg-slate-900 border-none overflow-hidden">
                                                    <CardHeader className="p-12 pb-6 flex flex-row items-center justify-between">
                                                        <div className="space-y-2">
                                                            <CardTitle className="text-4xl font-black tracking-tight">Bulk Enrolment</CardTitle>
                                                            <CardDescription className="text-slate-500 text-lg font-medium">Deploy academy modules to your workforce.</CardDescription>
                                                        </div>
                                                        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-[2rem]">
                                                            <Users className="w-8 h-8 text-primary-600" />
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="p-12 pt-0 space-y-10">
                                                        <div className="space-y-4">
                                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">1. Choose Academy Module</label>
                                                            <select 
                                                                className="w-full h-16 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] px-8 border-none font-black text-slate-700 dark:text-white outline-none ring-2 ring-transparent focus:ring-primary-500/50 transition-all appearance-none cursor-pointer"
                                                                value={selectedCourseForBulk}
                                                                onChange={(e) => setSelectedCourseForBulk(e.target.value)}
                                                            >
                                                                <option value="" disabled>Select Module...</option>
                                                                {availableCourses.map(c => (
                                                                    <option key={c.id} value={c.id}>{c.title}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between px-1">
                                                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">2. Select Personnel</label>
                                                                <span className="text-[11px] font-black text-primary-600">{selectedEmployees.length} Selected</span>
                                                            </div>
                                                            <div className="max-h-56 overflow-y-auto space-y-2 p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 scrollbar-hide">
                                                                {employees.length > 0 ? employees.map(emp => (
                                                                    <label key={emp.id} className="flex items-center gap-4 p-4 hover:bg-white dark:hover:bg-slate-700 rounded-2xl transition-all cursor-pointer group shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-600">
                                                                        <div className="relative flex items-center">
                                                                            <input 
                                                                                type="checkbox" 
                                                                                className="peer w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-slate-600 text-primary-600 focus:ring-primary-500/50 transition-all cursor-pointer opacity-0 absolute"
                                                                                onChange={(e) => {
                                                                                    if (e.target.checked) setSelectedEmployees([...selectedEmployees, emp.id])
                                                                                    else setSelectedEmployees(selectedEmployees.filter(id => id !== emp.id))
                                                                                }}
                                                                            />
                                                                            <div className="w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-slate-600 peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all flex items-center justify-center">
                                                                                <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p className="font-black text-slate-800 dark:text-slate-100">{emp.firstName} {emp.lastName}</p>
                                                                            <p className="text-xs text-slate-400 font-bold">{emp.email}</p>
                                                                        </div>
                                                                    </label>
                                                                )) : (
                                                                    <p className="text-center text-slate-400 py-8 font-black uppercase tracking-widest text-xs">No personnel records found</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-6 pt-6">
                                                            <Button 
                                                                variant="ghost" 
                                                                className="flex-1 h-16 rounded-[1.5rem] font-black text-slate-500 uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                                                                onClick={() => setIsBulkModalOpen(false)}
                                                            >
                                                                Dismiss
                                                            </Button>
                                                            <Button 
                                                                className="flex-3 h-16 rounded-[1.5rem] bg-primary-600 hover:bg-primary-700 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary-500/40"
                                                                onClick={handleBulkEnroll}
                                                                disabled={isLoading || selectedEmployees.length === 0 || !selectedCourseForBulk}
                                                            >
                                                                {isLoading ? "Executing..." : "Execute Enrolment"}
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="explore"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    {filteredCourses.length > 0 ? filteredCourses.map((course) => {
                                        const isEnrolled = enrollments.some(e => e.courseId === course.id)
                                        return (
                                            <Card key={course.id} className="group overflow-hidden rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900 flex flex-col">
                                                <div className="relative h-56 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                                    <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-10 transition-opacity z-10" />
                                                    {course.thumbnail ? (
                                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                                                            <ShieldCheck className="w-20 h-20 text-primary-200" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-6 left-6 z-20">
                                                        <Badge className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary-700 dark:text-primary-400 border-none font-black text-xs uppercase tracking-widest px-4 py-1.5">
                                                            {course.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <CardHeader className="p-8 pb-4">
                                                    <CardTitle className="text-2xl font-black group-hover:text-primary-600 transition-colors line-clamp-1 leading-tight">{course.title}</CardTitle>
                                                    <CardDescription className="line-clamp-2 min-h-[48px] text-slate-500 font-medium leading-relaxed">{course.description}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-8 pt-0 space-y-6 flex-1">
                                                    <div className="flex items-center gap-6 text-sm">
                                                        <div className="flex items-center gap-2 font-black text-slate-700 dark:text-slate-300">
                                                            <Layout className="w-4.5 h-4.5 text-primary-500" />
                                                            {course.level ? (course.level.charAt(0).toUpperCase() + course.level.slice(1).toLowerCase()) : 'Beginner'}
                                                        </div>
                                                        <div className="flex items-center gap-2 font-black text-slate-500">
                                                            <Clock className="w-4.5 h-4.5 text-slate-400" />
                                                            {course.duration} mins
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="p-8 pt-6 border-t border-slate-50 dark:border-slate-800/50">
                                                    {isEnrolled ? (
                                                        <Button 
                                                            variant="outline"
                                                            className="w-full rounded-2xl h-14 border-primary-200 text-primary-600 font-black uppercase tracking-widest text-xs"
                                                            onClick={() => setActiveTab('my-learning')}
                                                        >
                                                            Resume Learning
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            className="w-full rounded-2xl h-14 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-500/20"
                                                            onClick={() => handleEnroll(course.id)}
                                                            disabled={enrollingId === course.id}
                                                        >
                                                            {enrollingId === course.id ? "Preparing..." : "Enrol Now"}
                                                        </Button>
                                                    )}
                                                </CardFooter>
                                            </Card>
                                        )
                                    }) : (
                                        <div className="col-span-full py-32 text-center space-y-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl">
                                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Search className="w-12 h-12 text-slate-300" />
                                            </div>
                                            <div className="max-w-md mx-auto">
                                                <h3 className="text-3xl font-black text-slate-900 dark:text-white">Academy Search Empty</h3>
                                                <p className="text-slate-500 mt-4 text-lg font-medium">Refine your search parameters to discover our advanced diversity and inclusion modules.</p>
                                            </div>
                                            <Button 
                                                variant="outline"
                                                className="rounded-2xl px-12 h-14 font-black uppercase tracking-widest text-xs border-slate-200"
                                                onClick={() => setSearchTerm('')}
                                            >
                                                Reset Search
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
