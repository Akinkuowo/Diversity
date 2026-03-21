'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BookOpen,
    Search,
    Filter,
    Clock,
    Award,
    ChevronRight,
    Star,
    PlayCircle,
    CheckCircle2,
    Calendar,
    Users,
    TrendingUp,
    GraduationCap,
    Lightbulb,
    Target,
    Loader2
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function VolunteerTrainingPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [enrollments, setEnrollments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('explore')
    const [searchQuery, setSearchQuery] = useState('')
    const [enrollingId, setEnrollingId] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [coursesData, enrollmentsData] = await Promise.all([
                api.get('/volunteers/me/courses'),
                api.get('/volunteers/me/enrollments')
            ])
            setCourses(coursesData)
            setEnrollments(enrollmentsData)
        } catch (err: any) {
            console.error('Failed to fetch training data:', err)
            toast.error('Failed to load training materials')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleEnroll = async (courseId: string) => {
        setEnrollingId(courseId)
        try {
            await api.post(`/volunteers/me/enroll/${courseId}`, {})
            toast.success('Successfully enrolled in the course!')
            fetchData()
            setActiveTab('my-learning')
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to enroll')
        } finally {
            setEnrollingId(null)
        }
    }

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const myEnrollments = enrollments.filter(e => 
        e.course.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            Volunteer Academy
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Sharpen your skills and maximize your community impact.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search courses, skills..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Training Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Courses Active', value: enrollments.filter(e => e.progress < 100).length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
                        { label: 'Certificates Earned', value: enrollments.filter(e => e.progress === 100).length, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
                        { label: 'Learning Points', value: enrollments.reduce((acc, curr) => acc + (curr.progress * 10), 0).toLocaleString(), icon: Target, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/10' },
                        { label: 'Available Courses', value: courses.length, icon: GraduationCap, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/10' },
                    ].map((stat, i) => (
                        <div key={i} className={cn("p-4 rounded-3xl flex items-center gap-4 transition-transform hover:scale-[1.02]", stat.bg)}>
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                                <stat.icon className={cn("w-6 h-6", stat.color)} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs & Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-gray-100/50 dark:bg-slate-800/50 p-1 rounded-2xl w-fit">
                        <TabsTrigger value="explore" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Explore Courses
                        </TabsTrigger>
                        <TabsTrigger value="my-learning" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                            <Target className="w-4 h-4 mr-2" />
                            My Learning
                            {enrollments.length > 0 && (
                                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold">
                                    {enrollments.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="explore" className="m-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                                <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
                                <p className="text-muted-foreground font-medium">Curating training materials...</p>
                            </div>
                        ) : filteredCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course, index) => {
                                    const isEnrolled = enrollments.some(e => e.courseId === course.id)
                                    return (
                                        <motion.div
                                            key={course.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card className="group overflow-hidden rounded-3xl border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-primary-100/20 transition-all duration-300">
                                                <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-slate-800">
                                                    {course.thumbnail ? (
                                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <BookOpen className="w-12 h-12 text-gray-300" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-3 left-3 flex gap-2">
                                                        <Badge className="bg-white/90 dark:bg-slate-900/90 text-primary-600 border-none shadow-sm backdrop-blur-sm rounded-lg px-2 py-0.5 text-[10px] uppercase font-bold">
                                                            {course.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <CardHeader className="p-5 pb-2">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {course.duration} mins
                                                        </div>
                                                        <Badge variant="outline" className="text-[10px] font-bold rounded-lg px-2 border-gray-200">
                                                            {course.level}
                                                        </Badge>
                                                    </div>
                                                    <CardTitle className="text-lg line-clamp-1 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                                                        {course.title}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-5 pt-0 space-y-4">
                                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
                                                        {course.description}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground py-2 border-y border-gray-50 dark:border-gray-800/50">
                                                        <div className="flex items-center gap-1">
                                                            <Users className="w-3.5 h-3.5" />
                                                            {course._count?.enrollments || 0} Learners
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <PlayCircle className="w-3.5 h-3.5" />
                                                            {course._count?.modules || 0} Modules
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        className={cn(
                                                            "w-full rounded-2xl transition-all duration-300 font-bold tracking-tight shadow-md h-12",
                                                            isEnrolled ? "bg-green-50 text-green-600 dark:bg-green-950/20 hover:bg-green-100" : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200"
                                                        )}
                                                        onClick={() => !isEnrolled && handleEnroll(course.id)}
                                                        disabled={isEnrolled || enrollingId === course.id}
                                                    >
                                                        {isEnrolled ? (
                                                            <><CheckCircle2 className="w-4 h-4 mr-2" /> In Learning</>
                                                        ) : enrollingId === course.id ? (
                                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enrolling...</>
                                                        ) : (
                                                            <><Target className="w-4 h-4 mr-2" /> Start Course</>
                                                        )}
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 text-center px-4">
                                <div className="w-20 h-20 rounded-[2rem] bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-6">
                                    <Lightbulb className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">No results for "{searchQuery}"</h3>
                                <p className="text-muted-foreground max-w-sm mb-6">
                                    Try adjusting your search keywords to find the perfect training for your goals.
                                </p>
                                <Button variant="outline" className="rounded-2xl" onClick={() => setSearchQuery('')}>Clear Search</Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="my-learning" className="m-0">
                        {myEnrollments.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {myEnrollments.map((enrollment, index) => (
                                    <motion.div
                                        key={enrollment.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="overflow-hidden rounded-3xl border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                                            <div className="flex flex-col lg:flex-row items-center p-4 lg:p-6 gap-6">
                                                <div className="w-full lg:w-48 aspect-video rounded-2xl overflow-hidden shrink-0 bg-gray-100 dark:bg-slate-800">
                                                    {enrollment.course.thumbnail ? (
                                                        <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <BookOpen className="w-8 h-8 text-gray-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-4 w-full">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Badge className="bg-primary-50 text-primary-600 border-none rounded-lg px-2 text-[10px] font-bold">
                                                                {enrollment.course.category}
                                                            </Badge>
                                                            {enrollment.progress === 100 && (
                                                                <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-lg px-2 text-[10px] font-bold">
                                                                    <Award className="w-3 h-3 mr-1" /> COMPLETED
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1">
                                                            {enrollment.course.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{enrollment.course.duration} mins</span>
                                                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{enrollment.course._count?.modules || 0} Modules</span>
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                                                            <span className="text-muted-foreground">Course Progress</span>
                                                            <span className="text-primary-600">{Math.round(enrollment.progress)}%</span>
                                                        </div>
                                                        <Progress value={enrollment.progress} className="h-2 rounded-full bg-gray-100 dark:bg-slate-800">
                                                            <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-1000" style={{ width: `${enrollment.progress}%` }} />
                                                        </Progress>
                                                    </div>
                                                </div>
                                                <div className="shrink-0 w-full lg:w-auto">
                                                    <Button className="w-full lg:w-auto px-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-2xl font-bold shadow-lg h-12">
                                                        {enrollment.progress === 100 ? 'Review Course' : 'Continue Learning'}
                                                        <ChevronRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 text-center px-4">
                                <div className="w-24 h-24 rounded-[2rem] bg-primary-50 dark:bg-primary-900/10 flex items-center justify-center mb-6">
                                    <Target className="w-12 h-12 text-primary-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">No courses in progress</h3>
                                <p className="text-muted-foreground max-w-sm mb-6">
                                    Start your learning journey by exploring our collection of impact-focused courses.
                                </p>
                                <Button className="bg-primary-600 text-white rounded-2xl h-12 px-8" onClick={() => setActiveTab('explore')}>
                                    Browse Courses
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
