'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Heart,
    Users,
    Plus,
    Search,
    BarChart3,
    Calendar,
    Clock,
    MapPin,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    ChevronRight,
    TrendingUp,
    CheckCircle,
    Flag,
    Award,
    Building2,
    ArrowUpRight
} from 'lucide-react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { api } from '@/lib/api'
import { toast } from 'sonner'

// Status badge colors
const statusColors: Record<string, string> = {
    ASSIGNED:    'bg-blue-100 text-blue-700',
    ACCEPTED:    'bg-green-100 text-green-700',
    DECLINED:    'bg-red-100 text-red-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    PENDING_COMPLETION: 'bg-orange-100 text-orange-700 font-medium',
    COMPLETED:   'bg-emerald-100 text-emerald-700',
    CANCELLED:   'bg-gray-100 text-gray-500',
}

function VolunteerRow({ assignment, onUpdate }: { assignment: any, onUpdate: (updated: any) => void }) {
    const [dutyInput, setDutyInput] = useState('')
    const [showDutyInput, setShowDutyInput] = useState(false)
    const [loading, setLoading] = useState<string | null>(null)

    const handleRespond = async (action: 'ACCEPTED' | 'DECLINED') => {
        setLoading(action)
        try {
            const updated = await api.patch(`/volunteer-assignments/${assignment.id}/respond`, { action })
            onUpdate({ ...assignment, status: updated.status })
            toast.success(action === 'ACCEPTED' ? 'Volunteer accepted!' : 'Volunteer declined')
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update')
        } finally {
            setLoading(null)
        }
    }

    const handleAssignDuty = async () => {
        if (!dutyInput.trim()) return toast.error('Enter a duty description')
        setLoading('duty')
        try {
            const updated = await api.patch(`/volunteer-assignments/${assignment.id}/duty`, { duty: dutyInput.trim() })
            onUpdate({ ...assignment, status: updated.status, duty: updated.duty })
            setShowDutyInput(false)
            setDutyInput('')
            toast.success('Duty assigned!')
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to assign duty')
        } finally {
            setLoading(null)
        }
    }

    const handleConfirmComplete = async () => {
        setLoading('confirm')
        try {
            const updated = await api.patch(`/volunteer-assignments/${assignment.id}/confirm-complete`, {})
            onUpdate({ ...assignment, status: updated.status })
            toast.success('Task completion verified!')
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to verify completion')
        } finally {
            setLoading(null)
        }
    }

    const isPending   = assignment.status === 'ASSIGNED'
    const isAccepted  = assignment.status === 'ACCEPTED'
    const hasActiveDuty = ['IN_PROGRESS', 'COMPLETED'].includes(assignment.status)

    return (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800">
                <Avatar className="w-11 h-11 shrink-0">
                    <AvatarImage src={assignment.volunteer.avatar} />
                    <AvatarFallback className="bg-rose-100 text-rose-600 font-bold text-sm">
                        {assignment.volunteer.firstName?.[0]}{assignment.volunteer.lastName?.[0]}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white leading-tight">
                        {assignment.volunteer.firstName} {assignment.volunteer.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{assignment.volunteer.email}</p>
                </div>
                <Badge className={`shrink-0 text-xs ${statusColors[assignment.status] || 'bg-gray-100 text-gray-500'}`}>
                    {assignment.status.replace('_', ' ')}
                </Badge>
            </div>

            {/* Assigned duty display */}
            {assignment.duty && (
                <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/10 border-t border-yellow-100 dark:border-yellow-800/30 flex items-center gap-2">
                    <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">Duty:</span>
                    <span className="text-xs text-yellow-800 dark:text-yellow-300 flex-1">{assignment.duty}</span>
                </div>
            )}

            {/* Action buttons */}
            <div className="px-4 py-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
                {isPending && (
                    <>
                        <Button size="sm" onClick={() => handleRespond('ACCEPTED')} disabled={!!loading}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs h-8 px-4">
                            {loading === 'ACCEPTED' ? 'Accepting...' : '✓ Accept'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRespond('DECLINED')} disabled={!!loading}
                            className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs h-8 px-4">
                            {loading === 'DECLINED' ? 'Declining...' : '✕ Decline'}
                        </Button>
                    </>
                )}
                {isAccepted && !showDutyInput && !assignment.duty && (
                    <Button size="sm" variant="outline" onClick={() => setShowDutyInput(true)}
                        className="rounded-xl text-xs h-8 px-4 border-blue-200 text-blue-600 hover:bg-blue-50">
                        + Assign Duty
                    </Button>
                )}
                {isAccepted && assignment.duty && (
                    <Button size="sm" variant="ghost" onClick={() => setShowDutyInput(true)}
                        className="rounded-xl text-xs h-8 px-4 text-gray-500">
                        Edit Duty
                    </Button>
                )}
                {assignment.status === 'PENDING_COMPLETION' && (
                    <Button size="sm" onClick={handleConfirmComplete} disabled={loading === 'confirm'}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs h-8 px-4">
                        {loading === 'confirm' ? 'Confirming...' : '✓ Confirm Completion'}
                    </Button>
                )}
                {(isPending || isAccepted || hasActiveDuty || assignment.status === 'PENDING_COMPLETION') && (
                    <span className="text-xs text-gray-400 self-center ml-auto">
                        Joined {new Date(assignment.assignedAt).toLocaleDateString()}
                    </span>
                )}
            </div>

            {/* Duty input */}
            {showDutyInput && (
                <div className="px-4 pb-4 pt-2 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                    <input
                        type="text"
                        value={dutyInput}
                        onChange={e => setDutyInput(e.target.value)}
                        placeholder={assignment.duty ? `Current: ${assignment.duty}` : "e.g. Registration desk coordinator"}
                        className="flex-1 text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={e => e.key === 'Enter' && handleAssignDuty()}
                    />
                    <Button size="sm" onClick={handleAssignDuty} disabled={loading === 'duty'}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-9 px-4">
                        {loading === 'duty' ? '...' : 'Save'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setShowDutyInput(false); setDutyInput('') }}
                        className="rounded-xl text-xs h-9">
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    )
}


export default function BusinessVolunteeringPage() {
    const [tasks, setTasks] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<any>(null)
    const [taskVolunteers, setTaskVolunteers] = useState<any[]>([])
    const [isVolunteersLoading, setIsVolunteersLoading] = useState(false)
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        project: '',
        startDate: '',
        endDate: '',
        hours: ''
    })

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [tasksData, statsData] = await Promise.all([
                api.get('/businesses/me/volunteer-tasks'),
                api.get('/businesses/me/volunteering-stats')
            ])
            setTasks(tasksData)
            setStats(statsData)
        } catch (error) {
            console.error('Failed to fetch volunteering data:', error)
            toast.error('Failed to load volunteering dashboard')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleCreateTask = async () => {
        if (!newTask.title || !newTask.description || !newTask.startDate) {
            return toast.error('Please fill in required fields')
        }

        try {
            await api.post('/businesses/me/volunteer-tasks', newTask)
            toast.success('Volunteer opportunity posted!')
            setIsCreateModalOpen(false)
            setNewTask({ title: '', description: '', project: '', startDate: '', endDate: '', hours: '' })
            fetchData()
        } catch (error) {
            toast.error('Failed to post opportunity')
        }
    }

    const handleDeleteTask = async (id: string) => {
        if (!confirm('Are you sure you want to delete this opportunity?')) return
        try {
            await api.delete(`/volunteer-tasks/${id}`)
            toast.success('Opportunity removed')
            fetchData()
        } catch (error) {
            toast.error('Failed to delete opportunity')
        }
    }

    const handleViewDetails = async (task: any) => {
        setSelectedTask(task)
        setTaskVolunteers([])
        setIsVolunteersLoading(true)
        try {
            const data = await api.get(`/volunteer-tasks/${task.id}/volunteers`)
            setTaskVolunteers(data)
        } catch (error) {
            toast.error('Failed to load volunteer details')
        } finally {
            setIsVolunteersLoading(false)
        }
    }

    return (
        <DashboardLayout role="BUSINESS">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Corporate Volunteering</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage social impact initiatives and community projects.
                        </p>
                    </div>
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20 rounded-xl">
                                <Plus className="w-4 h-4 mr-2" />
                                Post Opportunity
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] rounded-3xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl">Create Volunteer Task</DialogTitle>
                                <DialogDescription>
                                    Invite the community to join your social impact projects.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Project Name</label>
                                    <Input 
                                        placeholder="e.g. Community Garden Outreach" 
                                        value={newTask.project}
                                        onChange={e => setNewTask({...newTask, project: e.target.value})}
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Task Title *</label>
                                    <Input 
                                        placeholder="e.g. Lead Gardener / Event Coordinator" 
                                        value={newTask.title}
                                        onChange={e => setNewTask({...newTask, title: e.target.value})}
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Start Date *</label>
                                        <Input 
                                            type="date"
                                            value={newTask.startDate}
                                            onChange={e => setNewTask({...newTask, startDate: e.target.value})}
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Estimated Hours</label>
                                        <Input 
                                            type="number"
                                            placeholder="e.g. 5" 
                                            value={newTask.hours}
                                            onChange={e => setNewTask({...newTask, hours: e.target.value})}
                                            className="rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Description *</label>
                                    <Textarea 
                                        placeholder="What will volunteers be doing? What impact will they make?" 
                                        className="h-32 rounded-xl"
                                        value={newTask.description}
                                        onChange={e => setNewTask({...newTask, description: e.target.value})}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="rounded-xl">Cancel</Button>
                                <Button 
                                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-8"
                                    onClick={handleCreateTask}
                                >
                                    Post Task
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Impact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-3xl border-none shadow-sm bg-rose-50 dark:bg-rose-900/10">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-rose-600">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-rose-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalHours || 0}</h3>
                            <p className="text-sm text-gray-500 font-medium">Total Volunteer Hours Logged</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-3xl border-none shadow-sm bg-blue-50 dark:bg-blue-900/10">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-blue-600">
                                    <Users className="w-6 h-6" />
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalVolunteers || 0}</h3>
                            <p className="text-sm text-gray-500 font-medium">Unique Community Volunteers</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-3xl border-none shadow-sm bg-emerald-50 dark:bg-emerald-900/10">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-emerald-600">
                                    <Flag className="w-6 h-6" />
                                </div>
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalTasks || 0}</h3>
                            <p className="text-sm text-gray-500 font-medium">Projects & Tasks Created</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="tasks" className="space-y-6">
                    <TabsList className="bg-gray-100/50 dark:bg-slate-900/50 p-1 rounded-xl">
                        <TabsTrigger value="tasks" className="rounded-lg px-8">Active Tasks</TabsTrigger>
                        <TabsTrigger value="history" className="rounded-lg px-8">Impact History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="tasks" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {tasks.map((task, index) => (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="group border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                                            <CardHeader className="pb-4">
                                                <div className="flex justify-between items-start">
                                                    <Badge className="bg-rose-50 text-rose-600 border-none px-3 py-1 mb-2">
                                                        {task.project || 'General'}
                                                    </Badge>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-red-500">
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <CardTitle className="text-xl leading-tight">{task.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <p className="text-sm text-gray-500 line-clamp-2 italic">
                                                    "{task.description}"
                                                </p>
                                                <div className="space-y-2 pt-2">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(task.startDate).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {task.hours} hours estimated
                                                    </div>
                                                </div>
                                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-primary-600 font-bold text-sm">
                                                        <Users className="w-4 h-4" />
                                                        {task._count?.assignments || 0} Volunteers
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-xs group/btn" onClick={() => handleViewDetails(task)}>
                                                        View Details
                                                        <ChevronRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {tasks.length === 0 && !isLoading && (
                                <div className="col-span-full py-24 text-center">
                                    <div className="bg-rose-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transform -rotate-12">
                                        <Heart className="w-12 h-12 text-rose-600" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Make an Impact</h3>
                                    <p className="text-gray-500 mt-3 max-w-sm mx-auto text-lg leading-relaxed">
                                        Post your first corporate volunteering opportunity and engage with our diverse community.
                                    </p>
                                    <Button 
                                        className="mt-10 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl px-12 h-14 shadow-2xl shadow-rose-500/30 text-lg font-bold"
                                        onClick={() => setIsCreateModalOpen(true)}
                                    >
                                        Post First Opportunity
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="history">
                        <Card className="rounded-3xl border-none shadow-sm bg-gray-50 dark:bg-slate-900/50">
                            <CardHeader>
                                <CardTitle>CSR Impact History</CardTitle>
                                <CardDescription>A record of all volunteering hours contributed across projects.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-20">
                                    <BarChart3 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400">Detailed historical reporting is being generated...</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Volunteer Details Modal */}
                <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
                    <DialogContent className="sm:max-w-[620px] rounded-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl">{selectedTask?.title}</DialogTitle>
                            <DialogDescription>Manage volunteers who have shown interest in this opportunity.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                            {isVolunteersLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : taskVolunteers.length > 0 ? (
                                taskVolunteers.map((assignment: any) => (
                                    <VolunteerRow
                                        key={assignment.id}
                                        assignment={assignment}
                                        onUpdate={(updated: any) => {
                                            setTaskVolunteers(prev => prev.map(a => a.id === updated.id ? { ...a, ...updated } : a))
                                        }}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">No volunteers yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Volunteers will appear here when they register interest.</p>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setSelectedTask(null)} className="rounded-xl">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}
