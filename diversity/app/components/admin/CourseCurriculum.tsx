'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronDown,
    ChevronUp,
    Plus,
    GripVertical,
    Edit2,
    Trash2,
    Video,
    FileText,
    CheckCircle2,
    Clock,
    MoreVertical,
    RefreshCw,
    PlusCircle,
    Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface CourseCurriculumProps {
    courseId: string
    courseTitle: string
}

export default function CourseCurriculum({ courseId, courseTitle }: CourseCurriculumProps) {
    const [modules, setModules] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isPublished, setIsPublished] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})

    // Modals
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false)
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    // Selection
    const [selectedModule, setSelectedModule] = useState<any>(null)
    const [selectedLesson, setSelectedLesson] = useState<any>(null)
    const [deleteConfig, setDeleteConfig] = useState<{ type: 'module' | 'lesson', id: string, title: string } | null>(null)

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [moduleData, setModuleData] = useState({ title: '', description: '', order: 0 })
    const [lessonData, setLessonData] = useState({ 
        title: '', 
        content: '', 
        videoUrl: '', 
        duration: '', 
        order: 0, 
        isPreview: false 
    })

    const fetchCurriculum = useCallback(async () => {
        setIsLoading(true)
        try {
            const [curriculumData, courseData] = await Promise.all([
                api.get(`/admin/courses/${courseId}/curriculum`),
                api.get(`/courses/${courseId}`)
            ])
            setModules(curriculumData)
            setIsPublished(courseData.isPublished)
            // Expand first module by default if not already set
            if (curriculumData.length > 0 && Object.keys(expandedModules).length === 0) {
                setExpandedModules({ [curriculumData[0].id]: true })
            }
        } catch (error) {
            toast.error('Failed to load curriculum')
        } finally {
            setIsLoading(false)
        }
    }, [courseId])

    useEffect(() => {
        fetchCurriculum()
    }, [fetchCurriculum])

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }))
    }

    // Module Handlers
    const handleAddModule = () => {
        setSelectedModule(null)
        setModuleData({ title: '', description: '', order: modules.length })
        setIsModuleModalOpen(true)
    }

    const handleEditModule = (module: any) => {
        setSelectedModule(module)
        setModuleData({ 
            title: module.title, 
            description: module.description || '', 
            order: module.order 
        })
        setIsModuleModalOpen(true)
    }

    const handleModuleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (selectedModule) {
                await api.put(`/admin/modules/${selectedModule.id}`, moduleData)
                toast.success('Module updated')
            } else {
                await api.post(`/admin/courses/${courseId}/modules`, moduleData)
                toast.success('Module added')
            }
            setIsModuleModalOpen(false)
            fetchCurriculum()
        } catch (error) {
            toast.error('Failed to save module')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Lesson Handlers
    const handleAddLesson = (module: any) => {
        setSelectedModule(module)
        setSelectedLesson(null)
        setLessonData({ 
            title: '', 
            content: '', 
            videoUrl: '', 
            duration: '', 
            order: (module.lessons?.length || 0), 
            isPreview: false 
        })
        setIsLessonModalOpen(true)
    }

    const handleEditLesson = (module: any, lesson: any) => {
        setSelectedModule(module)
        setSelectedLesson(lesson)
        setLessonData({
            title: lesson.title,
            content: lesson.content || '',
            videoUrl: lesson.videoUrl || '',
            duration: (lesson.duration || '').toString(),
            order: lesson.order,
            isPreview: lesson.isPreview
        })
        setIsLessonModalOpen(true)
    }

    const handleLessonSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (selectedLesson) {
                await api.put(`/admin/lessons/${selectedLesson.id}`, lessonData)
                toast.success('Lesson updated')
            } else {
                await api.post(`/admin/modules/${selectedModule.id}/lessons`, lessonData)
                toast.success('Lesson added')
            }
            setIsLessonModalOpen(false)
            fetchCurriculum()
        } catch (error) {
            toast.error('Failed to save lesson')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Delete Handlers
    const confirmDelete = (type: 'module' | 'lesson', id: string, title: string) => {
        setDeleteConfig({ type, id, title })
        setIsDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        if (!deleteConfig) return
        setIsSubmitting(true)
        try {
            const endpoint = deleteConfig.type === 'module' 
                ? `/admin/modules/${deleteConfig.id}` 
                : `/admin/lessons/${deleteConfig.id}`
            await api.delete(endpoint)
            toast.success(`${deleteConfig.type === 'module' ? 'Module' : 'Lesson'} deleted`)
            setIsDeleteModalOpen(false)
            fetchCurriculum()
        } catch (error) {
            toast.error('Failed to delete')
        } finally {
            setIsSubmitting(false)
        }
    }

    const togglePublishStatus = async () => {
        setIsPublishing(true)
        try {
            await api.put(`/admin/courses/${courseId}`, { isPublished: !isPublished })
            setIsPublished(!isPublished)
            toast.success(!isPublished ? 'Course published and live!' : 'Course unpublished')
        } catch (error) {
            toast.error('Failed to update publishing status')
        } finally {
            setIsPublishing(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                            Curriculum: <span className="text-primary-600">{courseTitle}</span>
                        </h2>
                        <Badge variant={isPublished ? "default" : "secondary"} className={isPublished ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-500"}>
                            {isPublished ? 'Published' : 'Draft'}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Add modules and lessons to structure your course</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        onClick={togglePublishStatus} 
                        disabled={isPublishing}
                        className={cn(
                            "font-bold rounded-xl h-11 border-2",
                            isPublished ? "text-red-600 border-red-100 hover:bg-red-50" : "text-green-600 border-green-100 hover:bg-green-50"
                        )}
                    >
                        {isPublishing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : isPublished ? 'Unpublish' : 'Publish Course'}
                    </Button>
                    <Button onClick={handleAddModule} className="bg-primary-600 hover:bg-primary-700 font-bold rounded-xl h-11">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        New Module
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 min-h-[400px]">
                    <RefreshCw className="w-8 h-8 text-primary-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Loading curriculum structure...</p>
                </div>
            ) : modules.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Plus className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Your curriculum is empty</h3>
                    <p className="text-gray-500 max-w-sm mt-2">Start by creating your first module to organize lessons.</p>
                    <Button onClick={handleAddModule} variant="outline" className="mt-6 border-primary-200 text-primary-600 font-bold hover:bg-primary-50">
                        Create First Module
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {modules.map((module) => (
                        <div key={module.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all hover:shadow-md">
                            {/* Module Header */}
                            <div 
                                className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${expandedModules[module.id] ? 'bg-gray-50/80 border-b border-gray-100' : ''}`}
                                onClick={() => toggleModule(module.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-200/50 flex items-center justify-center text-gray-600">
                                        {expandedModules[module.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 flex items-center gap-2">
                                            Module {module.order + 1}: {module.title}
                                            <Badge variant="outline" className="text-[10px] uppercase font-bold text-gray-400 ml-2">
                                                {module.lessons?.length || 0} Lessons
                                            </Badge>
                                        </h3>
                                        {module.description && <p className="text-xs text-gray-500 truncate max-w-md">{module.description}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-primary-600" onClick={() => handleEditModule(module)}>
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => confirmDelete('module', module.id, module.title)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        className="bg-gray-900 text-white font-bold ml-2 rounded-lg"
                                        onClick={() => handleAddLesson(module)}
                                    >
                                        <Plus className="w-3 h-3 mr-1.5" />
                                        Add Lesson
                                    </Button>
                                </div>
                            </div>

                            {/* Module Lessons List */}
                            <AnimatePresence>
                                {expandedModules[module.id] && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-2 space-y-2">
                                            {module.lessons && module.lessons.length > 0 ? (
                                                module.lessons.map((lesson: any) => (
                                                    <div 
                                                        key={lesson.id}
                                                        className="group flex items-center justify-between p-3 ml-12 mr-4 rounded-xl border border-gray-50 hover:border-primary-100 hover:bg-primary-50/30 transition-all"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                                                {lesson.videoUrl ? <Video className="w-3.5 h-3.5 text-blue-500" /> : <FileText className="w-3.5 h-3.5 text-gray-400" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-700">{lesson.title}</p>
                                                                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                                                    <Clock className="w-3 h-3" />
                                                                    {lesson.duration || 0} mins
                                                                    {lesson.isPreview && (
                                                                        <Badge className="bg-green-100 text-green-700 border-green-200 h-4 text-[8px] uppercase font-black px-1.5">Free Preview</Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400 hover:text-primary-600" onClick={() => handleEditLesson(module, lesson)}>
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400 hover:text-red-500" onClick={() => confirmDelete('lesson', lesson.id, lesson.title)}>
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-8 text-center ml-12">
                                                    <p className="text-xs text-gray-400 italic">No lessons in this module yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            )}

            {/* Module Dialog */}
            <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-black text-xl">{selectedModule ? 'Edit Module' : 'Add New Module'}</DialogTitle>
                        <DialogDescription>Modules are the logical chunks of your entire course.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleModuleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="moduleTitle" className="font-bold">Module Title</Label>
                            <Input 
                                id="moduleTitle" 
                                placeholder="e.g. Getting Started" 
                                value={moduleData.title}
                                onChange={e => setModuleData({...moduleData, title: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="moduleDesc" className="font-bold">Summary (Optional)</Label>
                            <Textarea 
                                id="moduleDesc" 
                                placeholder="What will students learn in this module?" 
                                value={moduleData.description}
                                onChange={e => setModuleData({...moduleData, description: e.target.value})}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsModuleModalOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-primary-600 font-bold" disabled={isSubmitting}>
                                {isSubmitting && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                                {selectedModule ? 'Save Changes' : 'Add Module'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Lesson Dialog */}
            <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-black text-xl">{selectedLesson ? 'Edit Lesson' : 'Add New Lesson'}</DialogTitle>
                        <DialogDescription>Adding to module: <span className="font-bold text-gray-900">{selectedModule?.title}</span></DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleLessonSubmit} className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="lessTitle" className="font-bold">Lesson Title</Label>
                                <Input 
                                    id="lessTitle" 
                                    placeholder="e.g. Setting up your environment" 
                                    value={lessonData.title}
                                    onChange={e => setLessonData({...lessonData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lessDuration" className="font-bold">Duration (minutes)</Label>
                                <Input 
                                    id="lessDuration" 
                                    type="number" 
                                    placeholder="10" 
                                    value={lessonData.duration}
                                    onChange={e => setLessonData({...lessonData, duration: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lessVideo" className="font-bold">Video URL (Optional)</Label>
                                <Input 
                                    id="lessVideo" 
                                    placeholder="Vimeo/YouTube/S3 link" 
                                    value={lessonData.videoUrl}
                                    onChange={e => setLessonData({...lessonData, videoUrl: e.target.value})}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="lessContent" className="font-bold">Learning Content (Text/MD)</Label>
                                <Textarea 
                                    id="lessContent" 
                                    placeholder="Detailed lesson notes..." 
                                    className="min-h-[150px]"
                                    value={lessonData.content}
                                    onChange={e => setLessonData({...lessonData, content: e.target.value})}
                                />
                            </div>
                            <div className="col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${lessonData.isPreview ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                    <Info className="w-5 h-5" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-bold text-gray-900">Make this a Free Preview?</p>
                                    <p className="text-xs text-gray-500">Unregistered users can see this lesson (useful for sales).</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setLessonData({...lessonData, isPreview: !lessonData.isPreview})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${lessonData.isPreview ? 'bg-primary-600' : 'bg-gray-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${lessonData.isPreview ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsLessonModalOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-primary-600 font-bold px-8" disabled={isSubmitting}>
                                {isSubmitting && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                                {selectedLesson ? 'Save Lesson' : 'Add Lesson'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-black text-xl text-red-600">Permanently Delete {deleteConfig?.type}?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-bold text-gray-900">"{deleteConfig?.title}"</span>? 
                            {deleteConfig?.type === 'module' && ' All lessons within this module will also be deleted.'} This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} className="font-bold">Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} className="font-bold bg-red-600" disabled={isSubmitting}>
                            {isSubmitting && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
