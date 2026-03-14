'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BookOpen,
    Users,
    Plus,
    Search,
    BarChart3,
    Clock,
    Award,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    ChevronRight,
    TrendingUp,
    CheckCircle,
    PlayCircle,
    Layout
} from 'lucide-react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export default function BusinessTrainingPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        level: 'BEGINNER',
        duration: '',
        category: 'Compliance',
        thumbnail: ''
    })

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [coursesData, statsData] = await Promise.all([
                api.get('/businesses/me/courses'),
                api.get('/businesses/me/training-stats')
            ])
            setCourses(coursesData)
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

    const handleCreateCourse = async () => {
        if (!newCourse.title || !newCourse.description) {
            return toast.error('Please fill in required fields')
        }

        try {
            await api.post('/businesses/me/courses', newCourse)
            toast.success('Training course created successfully!')
            setIsCreateModalOpen(false)
            setNewCourse({ title: '', description: '', level: 'BEGINNER', duration: '', category: 'Compliance', thumbnail: '' })
            fetchData()
        } catch (error) {
            toast.error('Failed to create course')
        }
    }

    const handleDeleteCourse = async (id: string) => {
        if (!confirm('Are you sure you want to delete this course? All enrollment data will be lost.')) return
        try {
            await api.delete(`/courses/${id}`)
            toast.success('Course deleted')
            fetchData()
        } catch (error) {
            toast.error('Failed to delete course')
        }
    }

    return (
        <DashboardLayout role="BUSINESS">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Training & Development</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage internal certifications and employee upskilling.
                        </p>
                    </div>
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20">
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Training
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px] rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl">Create Internal Course</DialogTitle>
                                <DialogDescription>
                                    Design a training module specific to your organization's needs.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Course Title *</label>
                                    <Input 
                                        placeholder="e.g. Workplace Inclusion 101" 
                                        value={newCourse.title}
                                        onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                                        className="rounded-xl border-gray-200 focus:ring-primary-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Category</label>
                                        <select 
                                            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                            value={newCourse.category}
                                            onChange={e => setNewCourse({...newCourse, category: e.target.value})}
                                        >
                                            <option>Compliance</option>
                                            <option>Technical</option>
                                            <option>Soft Skills</option>
                                            <option>Leadership</option>
                                            <option>Onboarding</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Difficulty</label>
                                        <select 
                                            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                            value={newCourse.level}
                                            onChange={e => setNewCourse({...newCourse, level: e.target.value})}
                                        >
                                            <option value="BEGINNER">Beginner</option>
                                            <option value="INTERMEDIATE">Intermediate</option>
                                            <option value="ADVANCED">Advanced</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Duration (minutes)</label>
                                    <Input 
                                        type="number"
                                        placeholder="e.g. 120" 
                                        value={newCourse.duration}
                                        onChange={e => setNewCourse({...newCourse, duration: e.target.value})}
                                        className="rounded-xl border-gray-200 focus:ring-primary-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Description *</label>
                                    <Textarea 
                                        placeholder="What will employees learn in this course?" 
                                        className="h-24 rounded-xl border-gray-200 focus:ring-primary-500"
                                        value={newCourse.description}
                                        onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="rounded-xl">Cancel</Button>
                                <Button 
                                    className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-8"
                                    onClick={handleCreateCourse}
                                >
                                    Create Course
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Training Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="rounded-2xl border-none shadow-sm bg-primary-50 dark:bg-primary-900/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <BookOpen className="w-5 h-5 text-primary-600" />
                                <Badge variant="secondary" className="bg-white/50 border-none text-primary-600">Active</Badge>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalCourses || 0}</h3>
                            <p className="text-sm text-gray-500 capitalize">Courses Created</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl border-none shadow-sm bg-emerald-50 dark:bg-emerald-900/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <Users className="w-5 h-5 text-emerald-600" />
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalEnrollments || 0}</h3>
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
                                {stats?.courses?.reduce((sum: number, c: any) => sum + (c.completions || 0), 0) || 0}
                            </h3>
                            <p className="text-sm text-gray-500">Certifications Issued</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl border-none shadow-sm bg-blue-50 dark:bg-blue-900/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <Layout className="w-5 h-5 text-blue-600" />
                                <Clock className="w-4 h-4 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats?.activeEmployees || 0}
                            </h3>
                            <p className="text-sm text-gray-500">Active Learners</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="courses" className="space-y-4">
                    <TabsList className="bg-gray-100/50 dark:bg-slate-900/50 p-1 rounded-xl">
                        <TabsTrigger value="courses" className="rounded-lg px-6 py-2">Our Courses</TabsTrigger>
                        <TabsTrigger value="analytics" className="rounded-lg px-6 py-2">Analytics</TabsTrigger>
                        <TabsTrigger value="settings" className="rounded-lg px-6 py-2">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="courses">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input placeholder="Search within your courses..." className="pl-10 rounded-xl" />
                            </div>
                            <Button variant="outline" className="rounded-xl border-gray-200">
                                <Clock className="w-4 h-4 mr-2" />
                                Sort by Newest
                            </Button>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-64 rounded-2xl bg-gray-100 dark:bg-slate-900 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <AnimatePresence>
                                    {courses.map((course, index) => (
                                        <motion.div
                                            key={course.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card className="group h-full flex flex-col hover:shadow-xl transition-all duration-300 border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden">
                                                <div className="relative h-44 bg-gray-200 dark:bg-slate-800">
                                                    {course.thumbnail ? (
                                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/20 dark:to-primary-900/20">
                                                            <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl">
                                                                <PlayCircle className="w-12 h-12 text-primary-600" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="absolute top-4 left-4 flex gap-2">
                                                        <Badge className="bg-white/90 backdrop-blur-sm text-primary-700 hover:bg-white border-none shadow-sm">
                                                            {course.category}
                                                        </Badge>
                                                    </div>
                                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button 
                                                            variant="secondary" 
                                                            size="icon" 
                                                            className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md"
                                                            onClick={() => handleDeleteCourse(course.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <CardContent className="p-6 flex-1 space-y-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{course.title}</h3>
                                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                            <Clock className="w-3 h-3" />
                                                            {course.duration} mins • {course.level}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-xs font-medium">
                                                            <span className="text-gray-500">Employee Engagement</span>
                                                            <span className="text-primary-600">{course._count?.enrollments || 0} Learners</span>
                                                        </div>
                                                        <Progress value={Math.min(100, (course._count?.enrollments || 0) * 10)} className="h-1.5 bg-gray-100" />
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2">
                                                        <div className="flex -space-x-2">
                                                            {[1, 2, 3].map(i => (
                                                                <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                                                                    U{i}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <Button 
                                                            variant="ghost" 
                                                            className="p-0 h-auto hover:bg-transparent text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1 group/btn text-sm"
                                                        >
                                                            Manage Modules
                                                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {courses.length === 0 && !isLoading && (
                                    <div className="col-span-full py-20 text-center">
                                        <div className="bg-primary-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-6">
                                            <BookOpen className="w-10 h-10 text-primary-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Unleash Knowledge</h3>
                                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                                            Start by creating your organization's first internal training module.
                                        </p>
                                        <Button 
                                            className="mt-8 bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-10 h-12 shadow-xl shadow-primary-500/20"
                                            onClick={() => setIsCreateModalOpen(true)}
                                        >
                                            <Plus className="w-5 h-5 mr-2" />
                                            Get Started
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="analytics">
                        <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                            <div className="text-center">
                                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h4 className="text-lg font-bold">Analytics Coming Soon</h4>
                                <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2">
                                    We're building advanced reporting tools to help you track ROI and skill gaps.
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
