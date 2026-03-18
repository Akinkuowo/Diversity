'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BookOpen,
    Users,
    Search,
    Clock,
    Award,
    TrendingUp,
    CheckCircle,
    PlayCircle,
    Layout,
    Activity,
} from 'lucide-react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export default function BusinessTrainingPage() {
    const router = useRouter()
    const [enrollments, setEnrollments] = useState<any[]>([])
    const [availableCourses, setAvailableCourses] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('my-learning')
    const [searchTerm, setSearchTerm] = useState('')
    const [enrollingId, setEnrollingId] = useState<string | null>(null)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [enrollmentsData, coursesData, statsData] = await Promise.all([
                api.get('/learners/me/enrollments'),
                api.get('/learners/me/courses'),
                api.get('/businesses/me/training-stats')
            ])
            setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : [])
            setAvailableCourses(Array.isArray(coursesData) ? coursesData : [])
            setStats(statsData)
        } catch (error) {
            console.error('Failed to fetch training data:', error)
            toast.error('Failed to load training dashboard')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEnroll = async (courseId: string) => {
        setEnrollingId(courseId)
        try {
            await api.post(`/learners/me/enroll/${courseId}`, {})
            toast.success('Successfully enrolled! Redirecting to your training...')
            setActiveTab('my-learning')
            fetchData()
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to enroll')
        } finally {
            setEnrollingId(null)
        }
    }

    const filteredCourses = availableCourses.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <DashboardLayout role="BUSINESS">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Training & Development</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Enhance your team's skills with our curated diversity and inclusion training.
                        </p>
                    </div>
                </div>

                {/* Training Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="rounded-2xl border-none shadow-sm bg-primary-50 dark:bg-primary-900/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <BookOpen className="w-5 h-5 text-primary-600" />
                                <Badge variant="secondary" className="bg-white/50 border-none text-primary-600">Active</Badge>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{enrollments.filter(e => e.progress < 100).length}</h3>
                            <p className="text-sm text-gray-500 capitalize">Courses In Progress</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl border-none shadow-sm bg-emerald-50 dark:bg-emerald-900/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <Users className="w-5 h-5 text-emerald-600" />
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalEnrolled || enrollments.length}</h3>
                            <p className="text-sm text-gray-500">Total Enrollments</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl border-none shadow-sm bg-amber-50 dark:bg-amber-900/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <Award className="w-5 h-5 text-amber-600" />
                                <CheckCircle className="w-4 h-4 text-amber-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats?.completed || enrollments.filter(e => e.progress === 100).length}
                            </h3>
                            <p className="text-sm text-gray-500">Certifications Earned</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl border-none shadow-sm bg-blue-50 dark:bg-blue-900/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <Activity className="w-4 h-4 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats?.avgProgress || 0}%
                            </h3>
                            <p className="text-sm text-gray-500">Average Progress</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mt-8">
                    <div className="bg-gray-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl flex gap-1 border border-gray-100 dark:border-gray-800 shadow-sm w-full md:w-fit">
                        <button
                            onClick={() => setActiveTab('my-learning')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                activeTab === 'my-learning' 
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200 dark:shadow-none" 
                                    : "text-slate-500 hover:bg-white dark:hover:bg-slate-800"
                            }`}
                        >
                            <Layout className="w-4 h-4" />
                            My Training
                        </button>
                        <button
                            onClick={() => setActiveTab('explore')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                activeTab === 'explore' 
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200 dark:shadow-none" 
                                    : "text-slate-500 hover:bg-white dark:hover:bg-slate-800"
                            }`}
                        >
                            <Search className="w-4 h-4" />
                            Explore Training
                        </button>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Find training..."
                            className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-primary-500"
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
                                    {enrollments.length > 0 ? enrollments.map((enr, idx) => (
                                        <Card key={enr.id} className="group overflow-hidden border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 rounded-[2rem] flex flex-col bg-white dark:bg-slate-900">
                                            <div className="relative h-48 overflow-hidden">
                                                <div className="absolute inset-0 bg-primary-600 opacity-10 group-hover:opacity-20 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <BookOpen className="w-16 h-16 text-primary-500 transition-transform group-hover:scale-110 duration-500" />
                                                </div>
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-white/80 backdrop-blur-md text-primary-600 border-none font-bold hover:bg-white">
                                                        {enr.progress === 100 ? 'Completed' : 'In Progress'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardHeader className="p-6 pb-2">
                                                <CardTitle className="text-xl group-hover:text-primary-600 transition-colors line-clamp-1">{enr.course.title}</CardTitle>
                                                <CardDescription className="line-clamp-2 min-h-[40px]">{enr.course.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-6 pt-2 space-y-4 flex-1">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-black uppercase text-slate-400">
                                                        <span>Course Progress</span>
                                                        <span className="text-slate-900 dark:text-white">{Math.round(enr.progress)}%</span>
                                                    </div>
                                                    <Progress value={enr.progress} className="h-2 rounded-full bg-slate-100 dark:bg-slate-800" />
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <Layout className="w-4 h-4 text-primary-500" />
                                                        {enr.course.level}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                        {enr.course.duration} mins
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="p-6 pt-0">
                                                <Button 
                                                    onClick={() => {
                                                        const certId = enr.course.certificates?.[0]?.id;
                                                        if (enr.progress === 100 && certId) {
                                                            router.push(`/certificates/${certId}`)
                                                        } else {
                                                            router.push(`/learner/courses/${enr.course.id}`)
                                                        }
                                                    }}
                                                    className={`w-full rounded-2xl h-12 font-bold transition-all shadow-md group-hover:shadow-primary-500/20 ${
                                                        enr.progress === 100 
                                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                                                            : "bg-slate-900 hover:bg-slate-800 text-white"
                                                    }`}
                                                >
                                                    {enr.progress === 100 ? (
                                                        <><Award className="w-4 h-4 mr-2" /> View Certificate</>
                                                    ) : (
                                                        <><PlayCircle className="w-4 h-4 mr-2" /> Continue Training</>
                                                    )}
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    )) : (
                                        <div className="col-span-full py-20 text-center space-y-6">
                                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <BookOpen className="w-12 h-12 text-slate-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Start your journey</h3>
                                                <p className="text-slate-500 mt-2">You haven't enrolled in any training yet. Explore our catalog!</p>
                                            </div>
                                            <Button 
                                                className="bg-primary-600 hover:bg-primary-700 text-white rounded-2xl px-8 h-12 font-bold"
                                                onClick={() => setActiveTab('explore')}
                                            >
                                                Browse Catalog
                                            </Button>
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
                                    {filteredCourses.length > 0 ? filteredCourses.map((course, idx) => {
                                        const isEnrolled = enrollments.some(e => e.courseId === course.id)
                                        return (
                                            <Card key={course.id} className="group overflow-hidden rounded-[2rem] border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900 flex flex-col">
                                                <div className="relative h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <div className="absolute inset-0 bg-primary-600 opacity-5 group-hover:opacity-10 transition-opacity" />
                                                    {course.thumbnail ? (
                                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                                                    ) : (
                                                        <Layout className="w-16 h-16 text-slate-300" />
                                                    )}
                                                    <div className="absolute top-4 left-4">
                                                        <Badge className="bg-white/90 backdrop-blur-md text-primary-700 border-none font-bold">
                                                            {course.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <CardHeader className="p-6 pb-2">
                                                    <CardTitle className="text-xl group-hover:text-primary-600 transition-colors line-clamp-1">{course.title}</CardTitle>
                                                    <CardDescription className="line-clamp-2 min-h-[40px]">{course.description}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-6 pt-2 space-y-4 flex-1">
                                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                                        <div className="flex items-center gap-1.5 font-medium">
                                                            <Layout className="w-4 h-4 text-primary-500" />
                                                            {course.level}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 font-medium">
                                                            <Clock className="w-4 h-4 text-slate-400" />
                                                            {course.duration} mins
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="p-6 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                                                    {isEnrolled ? (
                                                        <Button 
                                                            variant="outline"
                                                            className="w-full rounded-2xl h-11 border-primary-200 text-primary-600 font-bold"
                                                            onClick={() => setActiveTab('my-learning')}
                                                        >
                                                            Already Enrolled
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            className="w-full rounded-2xl h-11 bg-primary-600 hover:bg-primary-700 text-white font-bold"
                                                            onClick={() => handleEnroll(course.id)}
                                                            disabled={enrollingId === course.id}
                                                        >
                                                            {enrollingId === course.id ? "Enrolling..." : "Enroll Now"}
                                                        </Button>
                                                    )}
                                                </CardFooter>
                                            </Card>
                                        )
                                    }) : (
                                        <div className="col-span-full py-20 text-center space-y-6">
                                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Search className="w-12 h-12 text-slate-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">No training found</h3>
                                                <p className="text-slate-500 mt-2">Try adjusting your search to find what you're looking for.</p>
                                            </div>
                                            <Button 
                                                variant="outline"
                                                className="rounded-2xl px-8 h-12 font-bold"
                                                onClick={() => setSearchTerm('')}
                                            >
                                                Clear Search
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
