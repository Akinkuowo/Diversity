'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Briefcase,
    Users,
    Plus,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Edit,
    Trash2,
    Mail,
    Phone,
    MapPin,
    DollarSign,
    FileText,
    ChevronRight,
    UserPlus,
    Building2,
    Calendar
} from 'lucide-react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
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

export default function BusinessEmploymentPage() {
    const [notices, setNotices] = useState<any[]>([])
    const [applications, setApplications] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [selectedNoticeForEdit, setSelectedNoticeForEdit] = useState<any>(null)
    const [selectedApplication, setSelectedApplication] = useState<any>(null)
    const [newNotice, setNewNotice] = useState({
        title: '',
        description: '',
        location: '',
        type: 'Full-time',
        salary: '',
        requirements: ''
    })

    const fetchNotices = async () => {
        try {
            const data = await api.get('/businesses/me/employment-notices')
            setNotices(data)
        } catch (error) {
            console.error('Failed to fetch notices:', error)
            toast.error('Failed to load employment notices')
        }
    }

    const fetchApplications = async () => {
        try {
            const data = await api.get('/businesses/me/applications')
            setApplications(data)
        } catch (error) {
            console.error('Failed to fetch applications:', error)
            toast.error('Failed to load applications')
        }
    }

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            await Promise.all([fetchNotices(), fetchApplications()])
            setIsLoading(false)
        }
        loadData()
    }, [])

    const handleCreateNotice = async () => {
        if (!newNotice.title || !newNotice.description) {
            return toast.error('Please fill in required fields')
        }

        try {
            const requirementsArray = newNotice.requirements.split('\n').filter(r => r.trim() !== '')
            await api.post('/employment-notices', {
                ...newNotice,
                requirements: requirementsArray
            })
            toast.success('Notice posted successfully!')
            setIsCreateModalOpen(false)
            setNewNotice({ title: '', description: '', location: '', type: 'Full-time', salary: '', requirements: '' })
            fetchNotices()
        } catch (error) {
            toast.error('Failed to post notice')
        }
    }

    const handleEditNotice = async () => {
        if (!selectedNoticeForEdit || !selectedNoticeForEdit.title || !selectedNoticeForEdit.description) {
            return toast.error('Please fill in required fields')
        }

        try {
            const requirementsArray = typeof selectedNoticeForEdit.requirements === 'string' 
                ? selectedNoticeForEdit.requirements.split('\n').filter((r: string) => r.trim() !== '')
                : selectedNoticeForEdit.requirements;

            await api.put(`/employment-notices/${selectedNoticeForEdit.id}`, {
                ...selectedNoticeForEdit,
                requirements: requirementsArray
            })
            toast.success('Notice updated successfully!')
            setIsEditModalOpen(false)
            fetchNotices()
        } catch (error) {
            toast.error('Failed to update notice')
        }
    }

    const handleStatusUpdate = async (applicationId: string, status: string) => {
        try {
            await api.patch(`/applications/${applicationId}`, { status })
            toast.success(`Application marked as ${status.toLowerCase()}`)
            fetchApplications()
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const handleDeleteNotice = async (id: string) => {
        if (!confirm('Are you sure you want to delete this notice?')) return
        try {
            await api.delete(`/employment-notices/${id}`)
            toast.success('Notice deleted')
            fetchNotices()
        } catch (error) {
            toast.error('Failed to delete notice')
        }
    }

    return (
        <DashboardLayout role="BUSINESS">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employment Management</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Post notices, manage applicants, and grow your team.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Post New Notice
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Create Employment Notice</DialogTitle>
                                    <DialogDescription>
                                        Post a new job opportunity for target diversity groups.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Job Title *</label>
                                        <Input 
                                            placeholder="e.g. Senior Frontend Developer" 
                                            value={newNotice.title}
                                            onChange={e => setNewNotice({...newNotice, title: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Location</label>
                                            <Input 
                                                placeholder="e.g. London, UK / Remote" 
                                                value={newNotice.location}
                                                onChange={e => setNewNotice({...newNotice, location: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Type</label>
                                            <select 
                                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={newNotice.type}
                                                onChange={e => setNewNotice({...newNotice, type: e.target.value})}
                                            >
                                                <option>Full-time</option>
                                                <option>Part-time</option>
                                                <option>Contract</option>
                                                <option>Internship</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Salary Range</label>
                                        <Input 
                                            placeholder="e.g. £45,000 - £60,000" 
                                            value={newNotice.salary}
                                            onChange={e => setNewNotice({...newNotice, salary: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description *</label>
                                        <Textarea 
                                            placeholder="Describe the role and your diversity commitment..." 
                                            className="h-32"
                                            value={newNotice.description}
                                            onChange={e => setNewNotice({...newNotice, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Requirements (one per line)</label>
                                        <Textarea 
                                            placeholder="e.g. 5+ years React experience" 
                                            value={newNotice.requirements}
                                            onChange={e => setNewNotice({...newNotice, requirements: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                                    <Button 
                                        className="bg-primary-600 hover:bg-primary-700 text-white"
                                        onClick={handleCreateNotice}
                                    >
                                        Post Notice
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Employment Notice</DialogTitle>
                                    <DialogDescription>
                                        Update the details of your job notice.
                                    </DialogDescription>
                                </DialogHeader>
                                {selectedNoticeForEdit && (
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Job Title *</label>
                                            <Input 
                                                value={selectedNoticeForEdit.title}
                                                onChange={e => setSelectedNoticeForEdit({...selectedNoticeForEdit, title: e.target.value})}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Location</label>
                                                <Input 
                                                    value={selectedNoticeForEdit.location || ''}
                                                    onChange={e => setSelectedNoticeForEdit({...selectedNoticeForEdit, location: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Type</label>
                                                <select 
                                                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    value={selectedNoticeForEdit.type}
                                                    onChange={e => setSelectedNoticeForEdit({...selectedNoticeForEdit, type: e.target.value})}
                                                >
                                                    <option>Full-time</option>
                                                    <option>Part-time</option>
                                                    <option>Contract</option>
                                                    <option>Internship</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Salary Range</label>
                                            <Input 
                                                value={selectedNoticeForEdit.salary || ''}
                                                onChange={e => setSelectedNoticeForEdit({...selectedNoticeForEdit, salary: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Description *</label>
                                            <Textarea 
                                                className="h-32"
                                                value={selectedNoticeForEdit.description}
                                                onChange={e => setSelectedNoticeForEdit({...selectedNoticeForEdit, description: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Requirements (one per line)</label>
                                            <Textarea 
                                                value={Array.isArray(selectedNoticeForEdit.requirements) ? selectedNoticeForEdit.requirements.join('\n') : selectedNoticeForEdit.requirements}
                                                onChange={e => setSelectedNoticeForEdit({...selectedNoticeForEdit, requirements: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                )}
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                                    <Button 
                                        className="bg-primary-600 hover:bg-primary-700 text-white"
                                        onClick={handleEditNotice}
                                    >
                                        Update Notice
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Tabs defaultValue="notices" className="space-y-4">
                    <TabsList className="bg-gray-100/50 dark:bg-slate-900/50">
                        <TabsTrigger value="notices" className="gap-2">
                            <Briefcase className="w-4 h-4" />
                            Active Notices
                            {notices.length > 0 && <Badge variant="secondary" className="ml-1">{notices.length}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="applications" className="gap-2">
                            <FileText className="w-4 h-4" />
                            Applications
                            {applications.filter(a => a.status === 'PENDING').length > 0 && (
                                <Badge variant="default" className="ml-1 bg-primary-500">
                                    {applications.filter(a => a.status === 'PENDING').length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="employees" className="gap-2">
                            <Users className="w-4 h-4" />
                            Current Team
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="notices">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence>
                                {notices.map((notice, index) => (
                                    <motion.div
                                        key={notice.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <CardTitle className="text-xl">{notice.title}</CardTitle>
                                                        <CardDescription className="flex items-center gap-2 mt-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {notice.location || 'Remote'}
                                                        </CardDescription>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem 
                                                                className="cursor-pointer"
                                                                onClick={() => {
                                                                    setSelectedNoticeForEdit(notice)
                                                                    setIsEditModalOpen(true)
                                                                }}
                                                            >
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Edit Notice
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                className="cursor-pointer text-red-600"
                                                                onClick={() => handleDeleteNotice(notice.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex-1">
                                                <div className="flex gap-2 mb-4 flex-wrap">
                                                    <Badge variant="outline">{notice.type}</Badge>
                                                    {notice.salary && <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100">{notice.salary}</Badge>}
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                                                    {notice.description}
                                                </p>
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        Posted {new Date(notice.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm font-medium text-primary-600">
                                                        <Users className="w-4 h-4" />
                                                        {notice._count?.applications || 0} Applicants
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {notices.length === 0 && !isLoading && (
                                <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                    <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No active notices</h3>
                                    <p className="text-gray-500 mt-1 max-w-xs mx-auto">
                                        Start hiring by posting your first employment notice.
                                    </p>
                                    <Button 
                                        className="mt-6 bg-primary-600 text-white"
                                        onClick={() => setIsCreateModalOpen(true)}
                                    >
                                        Post New Notice
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="applications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Applications</CardTitle>
                                <CardDescription>Review and respond to job seekers.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Applicant</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Date Applied</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {applications.map((app) => (
                                            <TableRow key={app.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-9 h-9">
                                                            <AvatarImage src={app.user.profile?.avatar} />
                                                            <AvatarFallback className="bg-secondary-100 text-secondary-700">
                                                                {app.user.firstName[0]}{app.user.lastName[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">{app.user.firstName} {app.user.lastName}</p>
                                                            <p className="text-xs text-gray-500">{app.user.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-sm">{app.notice.title}</div>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-500">
                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        app.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                        app.status === 'REVIEWING' ? 'bg-blue-100 text-blue-700' :
                                                        app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-red-100 text-red-700'
                                                    }>
                                                        {app.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {app.status === 'PENDING' || app.status === 'REVIEWING' ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline" 
                                                                className="h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                                                onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}
                                                            >
                                                                Hire
                                                            </Button>
                                                            <Button 
                                                                size="sm" 
                                                                variant="ghost" 
                                                                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                                            >
                                                                Decline
                                                            </Button>
                                                            <Button 
                                                                size="sm" 
                                                                variant="ghost" 
                                                                className="h-8"
                                                                onClick={() => {
                                                                    setSelectedApplication(app)
                                                                    setIsDetailModalOpen(true)
                                                                }}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-8"
                                                            onClick={() => {
                                                                setSelectedApplication(app)
                                                                setIsDetailModalOpen(true)
                                                            }}
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {applications.length === 0 && !isLoading && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                                    No applications received yet.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Applicant Detail Modal */}
                        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none rounded-3xl">
                                {selectedApplication && (
                                    <div className="flex flex-col">
                                        <div className="bg-primary-600 p-8 text-white relative">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="w-20 h-20 border-4 border-white/20 shadow-xl">
                                                    <AvatarImage src={selectedApplication.user.profile?.avatar} />
                                                    <AvatarFallback className="bg-white text-primary-600 text-2xl font-bold">
                                                        {selectedApplication.user.firstName[0]}{selectedApplication.user.lastName[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <h2 className="text-2xl font-bold">{selectedApplication.user.firstName} {selectedApplication.user.lastName}</h2>
                                                    <p className="text-primary-100 flex items-center gap-2">
                                                        <Mail className="w-4 h-4" />
                                                        {selectedApplication.user.email}
                                                    </p>
                                                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mt-2">
                                                        Applied for: {selectedApplication.notice.title}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8 space-y-8 bg-white dark:bg-slate-950 max-h-[60vh] overflow-y-auto">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</p>
                                                    <p className="font-medium flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-primary-500" />
                                                        {new Date(selectedApplication.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
                                                    <Badge className={
                                                        selectedApplication.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                        selectedApplication.status === 'REVIEWING' ? 'bg-blue-100 text-blue-700' :
                                                        selectedApplication.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-red-100 text-red-700'
                                                    }>
                                                        {selectedApplication.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h3 className="text-lg font-bold flex items-center gap-2">
                                                    <FileText className="w-5 h-5 text-primary-500" />
                                                    Resume / Portfolio
                                                </h3>
                                                {selectedApplication.resumeUrl ? (
                                                    <a 
                                                        href={selectedApplication.resumeUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-900 group hover:border-primary-200 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                                <FileText className="w-5 h-5 text-emerald-600" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium truncate max-w-[200px]">View Resume</p>
                                                                <p className="text-xs text-gray-500 truncate">{selectedApplication.resumeUrl}</p>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                                                    </a>
                                                ) : (
                                                    <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center text-gray-400 text-sm">
                                                        No resume provided
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <h3 className="text-lg font-bold flex items-center gap-2">
                                                    <Mail className="w-5 h-5 text-primary-500" />
                                                    Cover Letter / Note
                                                </h3>
                                                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800 italic text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap text-sm">
                                                    {selectedApplication.coverLetter || "The applicant didn't provide a cover letter."}
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter className="p-6 pt-2 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-gray-800 gap-3">
                                            <Button variant="ghost" onClick={() => setIsDetailModalOpen(false)}>Close</Button>
                                            {selectedApplication.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                                        onClick={() => {
                                                            handleStatusUpdate(selectedApplication.id, 'REJECTED')
                                                            setIsDetailModalOpen(false)
                                                        }}
                                                    >
                                                        Decline
                                                    </Button>
                                                    <Button 
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        onClick={() => {
                                                            handleStatusUpdate(selectedApplication.id, 'ACCEPTED')
                                                            setIsDetailModalOpen(false)
                                                        }}
                                                    >
                                                        Hire Applicant
                                                    </Button>
                                                </div>
                                            )}
                                        </DialogFooter>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    <TabsContent value="employees">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Your Team</CardTitle>
                                        <CardDescription>Members of your organization who were hired through Diversity Network.</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Building2 className="w-4 h-4 mr-2" />
                                        Company Directory
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* This would be populated by fetching employees from the business record */}
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src="" />
                                            <AvatarFallback className="bg-primary-100 text-primary-700 font-bold">SJ</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 dark:text-white truncate">Sarah Johnson</h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">Senior UI Designer</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <button className="text-gray-400 hover:text-primary-600"><Mail className="w-3.5 h-3.5" /></button>
                                                <button className="text-gray-400 hover:text-primary-600"><Phone className="w-3.5 h-3.5" /></button>
                                                <Badge className="bg-emerald-50 text-emerald-700 border-none text-[10px] h-4">Active</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Mocking more for now but logic exists in schema */}
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                                            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                                                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
