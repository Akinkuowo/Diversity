'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
    Clock,
    Calendar,
    Plus,
    History,
    CheckCircle2,
    XCircle,
    Building2,
    Loader2,
    Search,
    Filter,
    FileText,
    TrendingUp
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function VolunteerHoursPage() {
    const [hours, setHours] = useState<any[]>([])
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isLogModalOpen, setIsLogModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        taskId: '',
        hours: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    })

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [hoursData, tasksData] = await Promise.all([
                api.get('/volunteers/me/hours'),
                api.get('/volunteers/me/tasks')
            ])
            setHours(hoursData)
            setTasks(tasksData.filter((a: any) => a.status === 'ACCEPTED' || a.status === 'IN_PROGRESS' || a.status === 'COMPLETED'))
        } catch (err: any) {
            console.error('Failed to fetch data:', err)
            toast.error('Failed to load hours log')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleLogHours = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.hours || parseInt(formData.hours) <= 0) {
            return toast.error('Please enter valid hours')
        }

        setIsSubmitting(true)
        try {
            await api.post('/volunteers/me/hours', {
                ...formData,
                hours: parseInt(formData.hours)
            })
            toast.success('Hours logged successfully!')
            setIsLogModalOpen(false)
            setFormData({
                taskId: '',
                hours: '',
                date: new Date().toISOString().split('T')[0],
                notes: ''
            })
            fetchData()
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to log hours')
        } finally {
            setIsSubmitting(false)
        }
    }

    const totalHours = hours.reduce((acc, curr) => acc + curr.hours, 0)
    const verifiedHours = hours.filter(h => h.verified).reduce((acc, curr) => acc + curr.hours, 0)
    const pendingHours = totalHours - verifiedHours

    return (
        <DashboardLayout role="VOLUNTEER">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Hours Log</h1>
                        <p className="text-muted-foreground mt-1">
                            Track your volunteering contributions and verified impact.
                        </p>
                    </div>
                    <Button 
                        onClick={() => setIsLogModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-200"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Log Hours
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-md bg-gradient-to-br from-primary-50 to-white dark:from-primary-950/20 dark:to-slate-900">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl">
                                    <Clock className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                                    <p className="text-3xl font-bold text-primary-900 dark:text-primary-100">{totalHours}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-slate-900">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Verified Hours</p>
                                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">{verifiedHours}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/20 dark:to-slate-900">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl">
                                    <History className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Pending Verification</p>
                                    <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{pendingHours}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Log Table */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <History className="w-5 h-5 text-primary-600" />
                            Recent Contributions
                        </CardTitle>
                        <CardDescription>A complete history of your logged volunteer hours.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                                <p className="text-muted-foreground">Loading log entries...</p>
                            </div>
                        ) : hours.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-gray-100 dark:border-gray-800">
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Activity / Task</th>
                                            <th className="px-6 py-4">Hours</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {hours.map((entry) => (
                                            <tr key={entry.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 text-sm">
                                                    {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {entry.task ? (
                                                            <>
                                                                <Building2 className="w-4 h-4 text-primary-600" />
                                                                <span className="text-sm font-medium">{entry.task.title}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FileText className="w-4 h-4 text-gray-400" />
                                                                <span className="text-sm italic text-muted-foreground">General Activity</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-sm">
                                                    {entry.hours}h
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {entry.verified ? (
                                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0.5 rounded-full text-[10px] uppercase font-bold">
                                                            Verified
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none px-2 py-0.5 rounded-full text-[10px] uppercase font-bold">
                                                            Pending
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                                                    {entry.notes || '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-center">
                                <History className="w-12 h-12 text-gray-200 mb-4" />
                                <h3 className="text-lg font-bold">No hours logged yet</h3>
                                <p className="text-muted-foreground max-w-sm mb-6">
                                    Start tracking your impact by logging your first volunteer hours. 
                                </p>
                                <Button variant="outline" onClick={() => setIsLogModalOpen(true)}>
                                    Log Your First Session
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Log Hours Modal */}
            <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Log Volunteer Hours</DialogTitle>
                        <DialogDescription>
                            Record the hours you spent volunteering for a specific task or organization.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleLogHours} className="space-y-4 pt-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Related Task (Optional)</label>
                            <Select 
                                value={formData.taskId} 
                                onValueChange={(val) => setFormData(prev => ({ ...prev, taskId: val }))}
                            >
                                <SelectTrigger className="rounded-xl bg-gray-50 border-gray-100 dark:bg-slate-800 dark:border-gray-700">
                                    <SelectValue placeholder="Select a task you worked on" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="none">No specific task</SelectItem>
                                    {tasks.map((assignment: any) => (
                                        <SelectItem key={assignment.task.id} value={assignment.task.id}>
                                            {assignment.task.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Hours Spent</label>
                                <Input
                                    id="hours"
                                    type="number"
                                    placeholder="e.g. 4"
                                    className="rounded-xl bg-gray-50 border-gray-100 dark:bg-slate-800 dark:border-gray-700"
                                    value={formData.hours}
                                    onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Date</label>
                                <Input
                                    id="date"
                                    type="date"
                                    className="rounded-xl bg-gray-50 border-gray-100 dark:bg-slate-800 dark:border-gray-700"
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Notes (Optional)</label>
                            <Textarea
                                id="notes"
                                placeholder="What did you work on during this period?"
                                className="rounded-xl bg-gray-50 border-gray-100 dark:bg-slate-800 dark:border-gray-700 min-h-[100px]"
                                value={formData.notes}
                                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setIsLogModalOpen(false)}
                                className="rounded-xl"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log Contribution"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}
