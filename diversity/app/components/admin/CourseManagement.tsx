'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BookOpen,
    Search,
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    CheckCircle2,
    Clock,
    Award,
    RefreshCw,
    AlertTriangle,
    Layers,
    FileText,
    TrendingUp,
    Globe,
    Lock,
    ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import CourseCurriculum from './CourseCurriculum'

export default function CourseManagement() {
    const [courses, setCourses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    
    // View state
    const [view, setView] = useState<'list' | 'curriculum'>('list')
    const [activeCourse, setActiveCourse] = useState<any>(null)

    // Filters
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [levelFilter, setLevelFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    // Modal state
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<any>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state (Simplified for initial creation)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'BEGINNER',
        duration: '0',
        category: '',
        price: '0',
        isPublished: false,
        thumbnail: '',
        videoUrl: '',
    })

    const fetchCourses = useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await api.get('/admin/courses', {
                params: {
                    page,
                    search,
                    category: categoryFilter,
                    level: levelFilter,
                    status: statusFilter
                }
            })
            setCourses(data.courses)
            setTotal(data.total)
        } catch (error) {
            console.error('Error fetching courses:', error)
            toast.error('Failed to load courses')
        } finally {
            setIsLoading(false)
        }
    }, [page, search, categoryFilter, levelFilter, statusFilter])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCourses()
        }, 300)
        return () => clearTimeout(timer)
    }, [fetchCourses])

    const handleOpenCreate = () => {
        setSelectedCourse(null)
        setFormData({
            title: '',
            description: '',
            level: 'BEGINNER',
            duration: '0',
            category: '',
            price: '0',
            isPublished: false,
            thumbnail: '',
            videoUrl: '',
        })
        setIsFormModalOpen(true)
    }

    const handleOpenEdit = (course: any) => {
        setSelectedCourse(course)
        setFormData({
            title: course.title,
            description: course.description || '',
            level: course.level,
            duration: (course.duration || 0).toString(),
            category: course.category,
            price: (course.price || 0).toString(),
            isPublished: course.isPublished,
            thumbnail: course.thumbnail || '',
            videoUrl: course.videoUrl || '',
        })
        setIsFormModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (selectedCourse) {
                await api.put(`/admin/courses/${selectedCourse.id}`, formData)
                toast.success('Course updated successfully')
            } else {
                const newCourse = await api.post('/admin/courses', formData)
                toast.success('Course title created! Now add your curriculum.')
                // Switch to curriculum view for the new course
                setActiveCourse(newCourse)
                setView('curriculum')
            }
            setIsFormModalOpen(false)
            fetchCourses()
        } catch (error) {
            toast.error('Failed to save course')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedCourse) return
        setIsSubmitting(true)
        try {
            await api.delete(`/admin/courses/${selectedCourse.id}`)
            toast.success('Course deleted successfully')
            setIsDeleteModalOpen(false)
            fetchCourses()
        } catch (error) {
            toast.error('Failed to delete course')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleManageCurriculum = (course: any) => {
        setActiveCourse(course)
        setView('curriculum')
    }

    const getLevelBadge = (level: string) => {
        switch (level) {
            case 'ADVANCED':
                return <Badge className="bg-red-100 text-red-700 border-red-200">Advanced</Badge>
            case 'INTERMEDIATE':
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Intermediate</Badge>
            case 'BEGINNER':
                return <Badge className="bg-green-100 text-green-700 border-green-200">Beginner</Badge>
            default:
                return <Badge variant="outline">{level}</Badge>
        }
    }

    if (view === 'curriculum' && activeCourse) {
        return (
            <div className="space-y-6">
                <Button 
                    variant="ghost" 
                    onClick={() => setView('list')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Course List
                </Button>
                <CourseCurriculum courseId={activeCourse.id} courseTitle={activeCourse.title} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                        Course Management
                    </h1>
                    <p className="text-gray-500 mt-1">Udemy-style course builder: Set a title, then build curriculum</p>
                </div>
                <Button onClick={handleOpenCreate} className="bg-primary-600 hover:bg-primary-700 font-bold shadow-lg shadow-primary-100 rounded-xl px-6 h-12">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Course
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Courses</p>
                        <p className="text-2xl font-bold text-gray-900">{total}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Published</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {courses.filter(c => c.isPublished).length}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Curriculum Health</p>
                        <p className="text-sm font-bold text-gray-900 text-purple-600">Active Builder</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Search courses..." 
                        className="pl-10 h-10 border-gray-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-10 border-gray-200">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Leadership">Leadership</SelectItem>
                        <SelectItem value="Diversity">Diversity</SelectItem>
                        <SelectItem value="Communication">Communication</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="h-10 border-gray-200">
                        <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-10 border-gray-200">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-bold text-gray-700">Course</TableHead>
                            <TableHead className="font-bold text-gray-700">Category</TableHead>
                            <TableHead className="font-bold text-gray-700">Level</TableHead>
                            <TableHead className="font-bold text-gray-700">Status</TableHead>
                            <TableHead className="font-bold text-gray-700">Curriculum</TableHead>
                            <TableHead className="font-bold text-gray-700 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode='wait'>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
                                            <p className="text-gray-500 font-medium">Loading courses...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : courses.length > 0 ? (
                                courses.map((course, index) => (
                                    <motion.tr 
                                        key={course.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50/50 transition-colors border-b last:border-0"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                                                    {course.thumbnail ? (
                                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <BookOpen className="w-6 h-6 text-primary-400" />
                                                    )}
                                                </div>
                                                <div className="max-w-[300px]">
                                                    <p className="font-bold text-gray-900 truncate">{course.title}</p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Clock className="w-3 h-3" />
                                                        {course.duration || 0} mins
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-medium">{course.category}</Badge>
                                        </TableCell>
                                        <TableCell>{getLevelBadge(course.level)}</TableCell>
                                        <TableCell>
                                            {course.isPublished ? (
                                                <Badge className="bg-green-100 text-green-700 border-green-200">Published</Badge>
                                            ) : (
                                                <Badge className="bg-gray-100 text-gray-500 border-gray-200">Draft</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="border-primary-100 bg-primary-50/30 text-primary-600 hover:bg-primary-50 font-bold"
                                                onClick={() => handleManageCurriculum(course)}
                                            >
                                                <Layers className="w-3.5 h-3.5 mr-1.5" />
                                                Build Content ({course._count?.modules || 0})
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                        <MoreVertical className="w-4 h-4 text-gray-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel className="text-[10px] uppercase text-gray-400 tracking-wider">Course Setup</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleOpenEdit(course)}>
                                                        <Edit2 className="w-4 h-4 mr-2" />
                                                        Edit Basics
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleManageCurriculum(course)}>
                                                        <Layers className="w-4 h-4 mr-2" />
                                                        Add Content
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedCourse(course)
                                                        setIsDeleteModalOpen(true)
                                                    }} className="text-red-600 focus:text-red-600">
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete Course
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </motion.tr>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-50">
                                            <BookOpen className="w-12 h-12 text-gray-300" />
                                            <p className="text-gray-500">No courses found matching your criteria.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {total > 10 && (
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-bold text-gray-900">{courses.length}</span> of <span className="font-bold text-gray-900">{total}</span>
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="rounded-lg h-8"
                        >
                            Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={courses.length < 10}
                            onClick={() => setPage(p => p + 1)}
                            className="rounded-lg h-8"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal (Simplified Setup) */}
            <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">
                            {selectedCourse ? 'Update Course Basics' : 'Establish New Course'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedCourse 
                                ? 'Refine the core identification of your course.' 
                                : 'Kick off your Udemy-style journey. Provide a title, and we\'ll build the curriculum next.'}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="title" className="font-bold">Course Title</Label>
                                <Input 
                                    id="title" 
                                    placeholder="e.g. Advanced AI Applications" 
                                    className="h-12 text-lg font-bold"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="description" className="font-bold">Description / Overview</Label>
                                <Textarea 
                                    id="description" 
                                    placeholder="What's this course about?" 
                                    className="min-h-[100px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category" className="font-bold">Category</Label>
                                <Input 
                                    id="category" 
                                    placeholder="e.g. Leadership" 
                                    className="h-11"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="level" className="font-bold">Target Experience Level</Label>
                                <Select 
                                    value={formData.level} 
                                    onValueChange={(val) => setFormData({...formData, level: val})}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-2 border-t border-gray-100 pt-6 mt-2">
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Marketing & Visuals</h4>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="thumbnail" className="font-bold">Thumbnail URL</Label>
                                <Input 
                                    id="thumbnail" 
                                    placeholder="Image link" 
                                    className="h-11"
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="videoUrl" className="font-bold">Preview Video URL</Label>
                                <Input 
                                    id="videoUrl" 
                                    placeholder="Vimeo/YouTube" 
                                    className="h-11"
                                    value={formData.videoUrl}
                                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                                />
                            </div>

                            <div className="col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.isPublished ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                    {formData.isPublished ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">Publish immediately?</p>
                                    <p className="text-xs text-gray-500">Visibility control for the platform.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, isPublished: !formData.isPublished})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.isPublished ? 'bg-primary-600' : 'bg-gray-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="ghost" onClick={() => setIsFormModalOpen(false)} className="font-bold text-gray-400">Cancel</Button>
                            <Button type="submit" className="bg-primary-600 hover:bg-primary-700 font-bold px-8 shadow-lg shadow-primary-100" disabled={isSubmitting}>
                                {isSubmitting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {selectedCourse ? 'Update Basics' : 'Continue to Curriculum'}
                                {!selectedCourse && <Plus className="ml-2 w-4 h-4" />}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <DialogTitle className="text-xl font-black text-gray-900">Delete Course?</DialogTitle>
                        <DialogDescription className="text-gray-500 mt-2">
                            This action is permanent. All course modules, lessons, and student progress for <span className="font-bold text-gray-900">"{selectedCourse?.title}"</span> will be lost.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} className="flex-1 font-bold h-11">Cancel</Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete} 
                            className="flex-1 font-bold h-11 shadow-lg shadow-red-100"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
