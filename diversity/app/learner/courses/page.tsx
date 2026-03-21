'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BookOpen,
    Search,
    Filter,
    Play,
    CheckCircle2,
    Clock,
    Award,
    TrendingUp,
    Bookmark,
    ArrowRight,
    Loader2,
    BarChart3,
    Zap,
    Building2,
    Star,
    ChevronRight,
    Layout
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function LearnerCoursesPage() {
    const router = useRouter()
    const [enrollments, setEnrollments] = useState<any[]>([])
    const [availableCourses, setAvailableCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('my-learning')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCourse, setSelectedCourse] = useState<any>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [enrollingId, setEnrollingId] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            // Fetch enrollments and courses independently to avoid one blocking the other
            const fetchEnrollments = async () => {
                try {
                    const data = await api.get('/learners/me/enrollments')
                    setEnrollments(Array.isArray(data) ? data : [])
                } catch (err) {
                    console.error('Failed to fetch enrollments:', err)
                    setEnrollments([])
                }
            }

            const fetchCourses = async () => {
                try {
                    const data = await api.get('/learners/me/courses')
                    setAvailableCourses(Array.isArray(data) ? data : [])
                } catch (err) {
                    console.error('Failed to fetch courses:', err)
                    setAvailableCourses([])
                    toast.error('Failed to load available courses')
                }
            }

            await Promise.all([fetchEnrollments(), fetchCourses()])
        } catch (err) {
            console.error('Failed to fetch data:', err)
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
            await api.post(`/learners/me/enroll/${courseId}`, {})
            toast.success('Successfully enrolled! Redirecting to your courses...')
            setActiveTab('my-learning')
            fetchData()
            setIsDetailModalOpen(false)
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to enroll')
        } finally {
            setEnrollingId(null)
        }
    }

    const filteredCourses = availableCourses.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header & Hero */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 text-white shadow-2xl">
                    <div className="relative z-10 space-y-6 max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="p-2 bg-blue-500/20 rounded-xl backdrop-blur-md">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-blue-400 font-bold uppercase tracking-wider text-xs">Learning Progress</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                            Elevate Your Career with <span className="text-blue-500 underline decoration-blue-500/30">Inclusive Education</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl">
                            Track your certifications, master new skills, and become a champion of diversity in the workplace.
                        </p>
                        
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl px-6 py-3 flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <BookOpen className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">Active Courses</p>
                                    <p className="text-xl font-black">{enrollments.filter(e => e.progress < 100).length}</p>
                                </div>
                            </div>
                            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl px-6 py-3 flex items-center gap-3">
                                <div className="p-2 bg-amber-500/20 rounded-lg">
                                    <Award className="w-4 h-4 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">Certificates</p>
                                    <p className="text-xl font-black">{enrollments.filter(e => e.progress === 100).length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-0 mr-12 mb-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />
                </div>

                {/* Tabs & Filters */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl flex gap-1 border border-gray-100 dark:border-gray-800 shadow-sm w-full md:w-fit">
                        <button
                            onClick={() => setActiveTab('my-learning')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                                activeTab === 'my-learning' 
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200 dark:shadow-none" 
                                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            <Layout className="w-4 h-4" />
                            My Learning
                        </button>
                        <button
                            onClick={() => setActiveTab('explore')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                                activeTab === 'explore' 
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200 dark:shadow-none" 
                                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            <Search className="w-4 h-4" />
                            Explore Courses
                        </button>
                    </div>

                    {activeTab === 'explore' && (
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Find your next course..."
                                    className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="h-12 w-12 rounded-xl p-0 border-gray-200">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-500 font-bold animate-pulse">Building your learning path...</p>
                    </div>
                ) : (
                    <div className="pb-12">
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
                                                <div className="absolute inset-0 bg-blue-600 opacity-10 group-hover:opacity-20 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <BookOpen className="w-16 h-16 text-blue-500 transition-transform group-hover:scale-110 duration-500" />
                                                </div>
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-white/80 backdrop-blur-md text-blue-600 border-none font-bold hover:bg-white">
                                                        {enr.progress === 100 ? 'Completed' : 'In Progress'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardHeader className="p-6 pb-2">
                                                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-1">{enr.course.title}</CardTitle>
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
                                                        <Zap className="w-4 h-4 text-amber-500" />
                                                        {enr.course._count?.modules || 0} Modules
                                                    </div>
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                        {enr.course.duration || '4h'}
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
                                                    className={cn(
                                                        "w-full rounded-2xl h-12 font-bold transition-all shadow-md group-hover:shadow-blue-500/20",
                                                        enr.progress === 100 
                                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                                                            : "bg-slate-900 hover:bg-slate-800 text-white"
                                                    )}
                                                >
                                                    {enr.progress === 100 ? (
                                                        <><Award className="w-4 h-4 mr-2" /> View Certificate</>
                                                    ) : (
                                                        <><Play className="w-4 h-4 mr-2 fill-current" /> Continue Learning</>
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
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Ready to start?</h3>
                                                <p className="text-slate-500 mt-2">You haven't enrolled in any courses yet. Discover our catalog!</p>
                                            </div>
                                            <Button 
                                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 h-12 font-bold"
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
                                    {filteredCourses.length > 0 ? filteredCourses.map((course, idx) => (
                                        <Card key={course.id} className="group overflow-hidden rounded-[2rem] border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900 flex flex-col">
                                            <div className="relative h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                <div className="absolute inset-0 bg-blue-600 opacity-5 group-hover:opacity-10 transition-opacity" />
                                                {course.thumbnail ? (
                                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                                                ) : (
                                                    <Layout className="w-16 h-16 text-slate-300" />
                                                )}
                                                <div className="absolute top-4 right-4">
                                                    <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none items-center gap-1 font-bold">
                                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                        4.9
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardHeader className="p-6 pb-2">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="outline" className="text-[10px] uppercase font-black text-blue-600 border-blue-100 bg-blue-50/50">
                                                        {course.category || 'Tech'}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-[10px] uppercase font-black text-slate-400 border-slate-100">
                                                        {course.difficulty || 'Intermediate'}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-1">{course.title}</CardTitle>
                                                <CardDescription className="line-clamp-2 min-h-[40px]">{course.description}</CardDescription>
                                            </CardHeader>
                                            <CardFooter className="p-6 pt-4 border-t border-slate-50 dark:border-slate-800/50 mt-auto">
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex -space-x-2">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200" />
                                                        ))}
                                                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 flex items-center justify-center text-[8px] font-bold">
                                                            +12
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        variant="ghost" 
                                                        className="font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl"
                                                        onClick={() => {
                                                            setSelectedCourse(course)
                                                            setIsDetailModalOpen(true)
                                                        }}
                                                    >
                                                        Details
                                                        <ChevronRight className="w-4 h-4 ml-1" />
                                                    </Button>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    )) : (
                                        <div className="col-span-full py-20 text-center space-y-6">
                                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Search className="w-12 h-12 text-slate-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">No courses found</h3>
                                                <p className="text-slate-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
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

                {/* Course Detail Modal */}
                <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                    <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none rounded-[2.5rem] bg-white dark:bg-slate-950">
                        {selectedCourse && (
                            <div className="flex flex-col max-h-[90vh]">
                                <div className="relative h-64 bg-slate-900 overflow-hidden">
                                    <div className="absolute inset-0 bg-blue-600/20" />
                                    <div className="absolute bottom-8 left-8 space-y-3 z-10 px-4">
                                        <Badge className="bg-blue-500 text-white border-none font-bold uppercase tracking-widest text-[10px] py-1 px-3">
                                            Featured Course
                                        </Badge>
                                        <h2 className="text-3xl font-black text-white leading-tight">{selectedCourse.title}</h2>
                                        <div className="flex items-center gap-4 text-slate-300 text-sm">
                                            <span className="flex items-center gap-1.5 font-bold"><Clock className="w-4 h-4" /> {selectedCourse.duration || '6h 30m'}</span>
                                            <span className="flex items-center gap-1.5 font-bold"><Zap className="w-4 h-4" /> {selectedCourse._count?.modules || 0} Modules</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
                                </div>

                                <div className="p-8 overflow-y-auto space-y-8 bg-white dark:bg-slate-950 flex-1">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-black flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-blue-500" />
                                            About this Course
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                            {selectedCourse.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-3">
                                            <h4 className="font-bold flex items-center gap-2 text-sm text-slate-500 uppercase tracking-widest">
                                                <Building2 className="w-4 h-4" />
                                                Sponsor
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-950 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                                    <Bookmark className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <span className="font-black">Diversity Network HQ</span>
                                            </div>
                                        </div>
                                        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-3">
                                            <h4 className="font-bold flex items-center gap-2 text-sm text-slate-500 uppercase tracking-widest">
                                                <Award className="w-4 h-4" />
                                                Certification
                                            </h4>
                                            <p className="font-black">Shareable Digital Badge</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <h3 className="text-xl font-black">Curriculum Overview</h3>
                                        <div className="space-y-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black">{i}</span>
                                                        <span className="font-bold">Module {i}: Fundamental Concepts</span>
                                                    </div>
                                                    <Badge variant="outline" className="text-slate-400 font-bold">30 mins</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="p-8 pt-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                                    <Button variant="outline" className="rounded-2xl font-bold h-12 px-6" onClick={() => setIsDetailModalOpen(false)}>
                                        Back to catalog
                                    </Button>
                                    <Button 
                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 px-8 font-black shadow-lg shadow-blue-500/20"
                                        onClick={() => handleEnroll(selectedCourse.id)}
                                        disabled={enrollingId === selectedCourse.id}
                                    >
                                        {enrollingId === selectedCourse.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        ) : (
                                            <><ArrowRight className="w-5 h-5 mr-2" /> Enroll Now</>
                                        )}
                                    </Button>
                                </DialogFooter>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}
