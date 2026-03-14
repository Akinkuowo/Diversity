'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Play,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Clock,
    Award,
    MessageSquare,
    Share2,
    ThumbsUp,
    MoreVertical,
    FileText,
    Download,
    Lock,
    Pause,
    SkipForward,
    Volume2,
    Settings,
    Maximize,
    ChevronDown,
    ArrowLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export default function CourseViewerPage() {
    const params = useParams()
    const router = useRouter()
    const courseId = params.id as string

    const [course, setCourse] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [currentLesson, setCurrentLesson] = useState<any>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')
    const [markingComplete, setMarkingComplete] = useState(false)

    const fetchCourse = useCallback(async () => {
        try {
            const data = await api.get(`/courses/${courseId}`)
            setCourse(data)
            
            // Find first incomplete lesson or first lesson overall
            let found = false
            for (const module of data.modules) {
                for (const lesson of module.lessons) {
                    if (lesson.completions?.length === 0) {
                        setCurrentLesson(lesson)
                        found = true
                        break
                    }
                }
                if (found) break
            }
            if (!found && data.modules.length > 0 && data.modules[0].lessons.length > 0) {
                setCurrentLesson(data.modules[0].lessons[0])
            }
        } catch (err) {
            console.error('Failed to fetch course:', err)
            toast.error('Failed to load course')
        } finally {
            setLoading(false)
        }
    }, [courseId])

    useEffect(() => {
        fetchCourse()
    }, [fetchCourse])

    const handleLessonComplete = async (lessonId: string) => {
        setMarkingComplete(true)
        try {
            await api.post(`/lessons/${lessonId}/complete`, {})
            toast.success('Lesson completed!')
            
            // Refresh course data to update completion icons and progress
            await fetchCourse()

            // Find next lesson to auto-advance
            let foundCurrent = false
            let nextLesson = null
            
            for (const module of course.modules) {
                for (const lesson of module.lessons) {
                    if (foundCurrent) {
                        nextLesson = lesson
                        break
                    }
                    if (lesson.id === lessonId) {
                        foundCurrent = true
                    }
                }
                if (nextLesson) break
            }

            if (nextLesson) {
                setCurrentLesson(nextLesson)
            } else {
                toast.success('Congratulations! You\'ve completed this course!')
            }
        } catch (err) {
            console.error('Failed to complete lesson:', err)
            toast.error('Failed to update progress')
        } finally {
            setMarkingComplete(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Preparing your classroom...</p>
                </div>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Course not found</h1>
                    <Button onClick={() => router.push('/learner/courses')}>Back to Courses</Button>
                </div>
            </div>
        )
    }

    const totalLessons = course.modules.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0)
    const completedLessons = course.modules.reduce((acc: number, mod: any) => 
        acc + (mod.lessons?.filter((l: any) => l.completions?.length > 0).length || 0), 0
    )
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    return (
        <div className="flex h-screen bg-white dark:bg-slate-950 overflow-hidden">
            {/* Sidebar */}
            <motion.div 
                initial={false}
                animate={{ width: isSidebarOpen ? 320 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                className="h-full border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative flex-shrink-0"
            >
                <div className="flex flex-col h-full w-[320px]">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Course Content</h2>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                {progressPercent}% done
                            </Badge>
                        </div>
                        <Progress value={progressPercent} className="h-1.5 bg-slate-200 dark:bg-slate-800" />
                    </div>

                    <div className="flex-1 overflow-auto">
                        <div className="p-4 space-y-4">
                            {course.modules.map((module: any, mIdx: number) => (
                                <div key={module.id} className="space-y-1">
                                    <div className="px-2 py-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                            {mIdx + 1}
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                                            {module.title}
                                        </h3>
                                    </div>
                                    <div className="space-y-1">
                                        {module.lessons.map((lesson: any, lIdx: number) => {
                                            const isActive = currentLesson?.id === lesson.id
                                            const isCompleted = lesson.completions?.length > 0
                                            
                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => setCurrentLesson(lesson)}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group",
                                                        isActive 
                                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none" 
                                                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        isActive 
                                                            ? "border-white/50" 
                                                            : isCompleted 
                                                                ? "border-green-500 bg-green-500" 
                                                                : "border-slate-300 dark:border-slate-600"
                                                    )}>
                                                        {isCompleted ? (
                                                            <CheckCircle2 className={cn("w-3 h-3", isActive ? "text-white" : "text-white")} />
                                                        ) : (
                                                            <Play className={cn("w-2 h-2 ml-0.5", isActive ? "text-white" : "text-slate-400")} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={cn("text-[13px] font-bold line-clamp-1", isActive ? "text-white" : "text-slate-700 dark:text-slate-200")}>
                                                            {lesson.title}
                                                        </p>
                                                        <p className={cn("text-[10px]", isActive ? "text-blue-100" : "text-slate-400")}>
                                                            {lesson.duration || '5'} mins
                                                        </p>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950">
                {/* Top Nav */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="gap-2 text-slate-500 font-bold rounded-xl"
                                onClick={() => router.push('/learner/courses')}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Exit Course</span>
                            </Button>
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
                            <h1 className="text-sm font-black line-clamp-1 text-slate-900 dark:text-white uppercase tracking-tight">
                                {course.title}
                            </h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-6 mr-4">
                            <div className="text-center">
                                <p className="text-[10px] uppercase font-black text-slate-400">Lessons</p>
                                <p className="text-xs font-black text-slate-900 dark:text-white">{completedLessons}/{totalLessons}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] uppercase font-black text-slate-400">Total Hours</p>
                                <p className="text-xs font-black text-slate-900 dark:text-white">{course.duration || '0'}h</p>
                            </div>
                        </div>
                        <Button variant="outline" className="rounded-xl font-bold border-2 hidden sm:flex">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto">
                    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8">
                        {/* Video Player Placeholder */}
                        <div className="aspect-video relative bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl group">
                            {currentLesson?.videoUrl ? (
                                <iframe 
                                    src={currentLesson.videoUrl} 
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform cursor-pointer">
                                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                                    </div>
                                    <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Video Lesson Content</p>
                                </div>
                            )}
                            
                            {/* Player Overlays (Minimal) */}
                            <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-4">
                                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full">
                                        <Pause className="w-5 h-5 fill-white" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full">
                                        <SkipForward className="w-5 h-5 fill-white" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full">
                                        <Volume2 className="w-5 h-5" />
                                    </Button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full">
                                        <Settings className="w-5 h-5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full">
                                        <Maximize className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Lesson Info */}
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex-1 space-y-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold rounded-lg border-none">
                                            Module {course.modules.findIndex((m: any) => m.id === currentLesson?.moduleId) + 1}
                                        </Badge>
                                        <span className="text-slate-300 dark:text-slate-700">•</span>
                                        <span className="text-slate-500 font-medium text-sm flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {currentLesson?.duration || '5'} minutes
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                                        {currentLesson?.title}
                                    </h2>
                                </div>

                                <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                                    <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl w-full sm:w-auto h-auto">
                                        <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">Overview</TabsTrigger>
                                        <TabsTrigger value="resources" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">Resources</TabsTrigger>
                                        <TabsTrigger value="q&a" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">Q&A</TabsTrigger>
                                    </TabsList>

                                    <div className="mt-8">
                                        <TabsContent value="overview" className="space-y-6">
                                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    {currentLesson?.content || 'This lesson covers the fundamental concepts and practical implementation of inclusive leadership in modern professional environments.'}
                                                </p>
                                                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs mt-8 mb-4">Key Learning Points</h4>
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <li key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                            <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Understanding the core principles of DEI integration.</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="resources" className="space-y-4">
                                            {[1, 2].map(i => (
                                                <Card key={i} className="rounded-[2rem] border-slate-100 dark:border-slate-800 overflow-hidden group hover:border-blue-200 transition-colors">
                                                    <CardContent className="p-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
                                                                <FileText className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 dark:text-white">Lesson Summary Guide.pdf</p>
                                                                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">1.2 MB • PDF Document</p>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50 text-blue-600">
                                                            <Download className="w-5 h-5" />
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </div>

                            {/* Sidemenu Actions */}
                            <div className="w-full md:w-80 space-y-4">
                                <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
                                    <div className="bg-blue-600 p-8 text-white">
                                        <h3 className="text-lg font-black mb-1">Lesson Actions</h3>
                                        <p className="text-blue-100 text-sm">Update your progress</p>
                                    </div>
                                    <CardContent className="p-6 space-y-4">
                                        <Button 
                                            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg gap-3 shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]"
                                            disabled={markingComplete || currentLesson?.completions?.length > 0}
                                            onClick={() => handleLessonComplete(currentLesson.id)}
                                        >
                                            {currentLesson?.completions?.length > 0 ? (
                                                <>
                                                    <CheckCircle2 className="w-6 h-6" />
                                                    Completed
                                                </>
                                            ) : (
                                                <>
                                                    {markingComplete ? 'Processing...' : 'Complete Lesson'}
                                                    <ChevronRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-2">
                                                <ThumbsUp className="w-4 h-4 mr-2" />
                                                Helpful
                                            </Button>
                                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl font-bold border-2">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 border-none">
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-12 h-12 border-2 border-white dark:border-slate-800 shadow-sm">
                                                {course.authorBusiness?.logo && <AvatarImage src={course.authorBusiness.logo} />}
                                                <AvatarFallback className="bg-blue-600 text-white uppercase text-xs font-black">
                                                    {course.authorBusiness?.companyName?.[0] || 'C'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Sponsor</p>
                                                <p className="font-black text-slate-900 dark:text-white leading-none">
                                                    {course.authorBusiness?.companyName || 'Diversity Partner'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-500 italic">Certificate included</span>
                                                <Award className="w-4 h-4 text-amber-500" />
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                                Complete all lessons and the final assessment to earn your official Diversity Network certification.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
