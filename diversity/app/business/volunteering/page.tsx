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
import { api } from '@/lib/api'
import { toast } from 'sonner'

export default function BusinessVolunteeringPage() {
    const [tasks, setTasks] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
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
                                                    <Button variant="ghost" size="sm" className="text-xs group/btn">
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
            </div>
        </DashboardLayout>
    )
}
