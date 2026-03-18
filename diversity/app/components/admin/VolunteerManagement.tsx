import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Loader2, Calendar, ClipboardList, Trash2, Edit } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export function VolunteerManagement() {
    const [volunteers, setVolunteers] = useState<any[]>([])
    const [tasks, setTasks] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchVal, setSearchVal] = useState('')
    const [searchTask, setSearchTask] = useState('')

    // Task editing state
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<any>(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        hours: 0,
        startDate: new Date().toISOString().split('T')[0],
        status: 'OPEN'
    })

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [volData, taskData] = await Promise.all([
                api.get('/admin/volunteers'),
                api.get('/admin/volunteer-tasks')
            ])
            setVolunteers(volData)
            setTasks(taskData)
        } catch (error) {
            toast.error('Failed to load volunteer data')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleTaskSubmit = async () => {
        try {
            if (editingTask) {
                await api.put(`/admin/volunteer-tasks/${editingTask.id}`, formData)
                toast.success('Task updated successfully')
            } else {
                await api.post('/admin/volunteer-tasks', formData)
                toast.success('Task created successfully')
            }
            setIsTaskModalOpen(false)
            fetchData()
        } catch (error) {
            toast.error('Failed to save task')
        }
    }

    const handleDeleteTask = async (id: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return
        try {
            await api.delete(`/admin/volunteer-tasks/${id}`)
            toast.success('Task deleted successfully')
            fetchData()
        } catch (error) {
            toast.error('Failed to delete task')
        }
    }

    const filteredVolunteers = volunteers.filter(v => 
        v.user?.firstName.toLowerCase().includes(searchVal.toLowerCase()) || 
        v.user?.lastName.toLowerCase().includes(searchVal.toLowerCase()) ||
        v.user?.email.toLowerCase().includes(searchVal.toLowerCase())
    )

    const filteredTasks = tasks.filter(t => 
        t.title.toLowerCase().includes(searchTask.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="bg-gray-50/50 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <ClipboardList className="h-6 w-6 text-primary" />
                            Volunteer Management
                        </CardTitle>
                        <CardDescription>Manage volunteers, tasks, and hour logging.</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <Tabs defaultValue="volunteers" className="w-full">
                    <div className="border-b px-6 py-2">
                        <TabsList className="bg-transparent space-x-2">
                            <TabsTrigger 
                                value="volunteers"
                                className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 rounded-full px-4"
                            >
                                Volunteers ({volunteers.length})
                            </TabsTrigger>
                            <TabsTrigger 
                                value="tasks"
                                className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 rounded-full px-4"
                            >
                                Tasks ({tasks.length})
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Volunteers Tab */}
                    <TabsContent value="volunteers" className="m-0 border-none p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input 
                                    className="pl-9 bg-gray-50" 
                                    placeholder="Search volunteers..." 
                                    value={searchVal}
                                    onChange={e => setSearchVal(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="rounded-xl border bg-white overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                        <TableHead>User</TableHead>
                                        <TableHead>Skills/Interests</TableHead>
                                        <TableHead>Total Hours</TableHead>
                                        <TableHead>Assigned Tasks</TableHead>
                                        <TableHead>Joined</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredVolunteers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                No volunteers found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredVolunteers.map(vol => (
                                            <TableRow key={vol.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarImage src={vol.user?.profile?.avatar} />
                                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                                {vol.user?.firstName[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{vol.user?.firstName} {vol.user?.lastName}</div>
                                                            <div className="text-xs text-gray-500">{vol.user?.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1 max-w-[250px]">
                                                        {vol.skills?.slice(0, 2).map((s: string) => (
                                                            <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                                                        ))}
                                                        {vol.skills?.length > 2 && <Badge variant="outline" className="text-[10px]">+{vol.skills.length - 2}</Badge>}
                                                        {vol.skills?.length === 0 && <span className="text-gray-400 text-sm">None listed</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-mono bg-blue-50 text-blue-700 border-blue-200">
                                                        {vol.totalHours} hrs
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {vol._count?.tasks || 0} tasks
                                                </TableCell>
                                                <TableCell className="text-gray-500 text-sm">
                                                    {new Date(vol.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Tasks Tab */}
                    <TabsContent value="tasks" className="m-0 border-none p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input 
                                    className="pl-9 bg-gray-50" 
                                    placeholder="Search tasks..." 
                                    value={searchTask}
                                    onChange={e => setSearchTask(e.target.value)}
                                />
                            </div>

                            <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => {
                                        setEditingTask(null)
                                        setFormData({ title: '', description: '', hours: 0, startDate: new Date().toISOString().split('T')[0], status: 'OPEN' })
                                    }}>
                                        Create Task
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                                        <DialogDescription>Fill out the details for the volunteer task.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input 
                                                value={formData.title} 
                                                onChange={e => setFormData({...formData, title: e.target.value})} 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Input 
                                                value={formData.description} 
                                                onChange={e => setFormData({...formData, description: e.target.value})} 
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Hours Reward</Label>
                                                <Input 
                                                    type="number" 
                                                    value={formData.hours} 
                                                    onChange={e => setFormData({...formData, hours: parseInt(e.target.value) || 0})} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Start Date</Label>
                                                <Input 
                                                    type="date" 
                                                    value={formData.startDate} 
                                                    onChange={e => setFormData({...formData, startDate: e.target.value})} 
                                                />
                                            </div>
                                        </div>
                                        {/* Simplified editing options */}
                                        {editingTask && (
                                            <div className="space-y-2">
                                                <Label>Status</Label>
                                                <div className="flex gap-2">
                                                    {['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(status => (
                                                        <Button 
                                                            key={status} 
                                                            type="button"
                                                            variant={formData.status === status ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => setFormData({...formData, status})}
                                                        >
                                                            {status.replace('_', ' ')}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
                                        <Button onClick={handleTaskSubmit}>Save</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="rounded-xl border bg-white overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                        <TableHead>Task Details</TableHead>
                                        <TableHead>Hours</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Assignments</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTasks.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                No tasks found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredTasks.map(task => (
                                            <TableRow key={task.id}>
                                                <TableCell>
                                                    <div className="font-medium text-gray-900">{task.title}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Calendar className="h-3 w-3 text-gray-400" />
                                                        <span className="text-xs text-gray-500">{new Date(task.startDate).toLocaleDateString()}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{task.hours} hrs</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        task.status === 'OPEN' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                                                        task.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                                                        task.status === 'COMPLETED' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                                        'bg-gray-100 text-gray-700 hover:bg-gray-100'
                                                    }>
                                                        {task.status.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {task._count?.assignments || 0} volunteers
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon"
                                                            onClick={() => {
                                                                setEditingTask(task)
                                                                setFormData({
                                                                    title: task.title,
                                                                    description: task.description,
                                                                    hours: task.hours,
                                                                    startDate: new Date(task.startDate).toISOString().split('T')[0],
                                                                    status: task.status
                                                                })
                                                                setIsTaskModalOpen(true)
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4 text-blue-600" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon"
                                                            onClick={() => handleDeleteTask(task.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
