'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calendar,
    Clock,
    MapPin,
    Building2,
    Loader2,
    ChevronRight,
    Search,
    CheckCircle2,
    FileText,
    User,
    X,
    Briefcase
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; className: string }> = {
    ASSIGNED:    { label: 'Pending Review',  className: 'bg-blue-100 text-blue-700 border-blue-200' },
    ACCEPTED:    { label: 'Accepted',        className: 'bg-green-100 text-green-700 border-green-200' },
    DECLINED:    { label: 'Declined',        className: 'bg-red-100 text-red-700 border-red-200' },
    IN_PROGRESS: { label: 'In Progress',     className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    COMPLETED:   { label: 'Completed',       className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    CANCELLED:   { label: 'Cancelled',       className: 'bg-gray-100 text-gray-600 border-gray-200' },
}

export default function MyTasksPage() {
    const [assignments, setAssignments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null)

    const fetchTasks = useCallback(async () => {
        setLoading(true)
        try {
            const data = await api.get('/volunteers/me/tasks')
            setAssignments(data)
        } catch (err: any) {
            console.error('Failed to fetch volunteer tasks:', err)
            toast.error('Failed to load your tasks')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTasks()
    }, [fetchTasks])

    const handleRequestComplete = async (assignmentId: string) => {
        try {
            await api.patch(`/volunteer-assignments/${assignmentId}/request-complete`, {})
            toast.success('Task marked as complete! The organization has been notified to verify.')
            fetchTasks()
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to request completion')
        }
    }

    const filteredAssignments = assignments.filter(assignment => {
        const q = searchQuery.toLowerCase()
        return (
            assignment.task.title.toLowerCase().includes(q) ||
            (assignment.task.business?.companyName ?? '').toLowerCase().includes(q) ||
            (assignment.task.project ?? '').toLowerCase().includes(q)
        )
    })

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Volunteer Tasks</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your assignments and track your contributions.
                        </p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                        <p className="text-muted-foreground animate-pulse">Loading your tasks...</p>
                    </div>
                ) : filteredAssignments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredAssignments.map((assignment, index) => {
                            const status = statusConfig[assignment.status] ?? { label: assignment.status, className: 'bg-gray-100 text-gray-700' }
                            return (
                                <motion.div
                                    key={assignment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className={cn(
                                        "overflow-hidden border-l-4 hover:shadow-md transition-shadow",
                                        assignment.status === 'DECLINED' ? 'border-l-red-400 opacity-70' :
                                        assignment.status === 'ACCEPTED' || assignment.status === 'IN_PROGRESS' ? 'border-l-green-500' :
                                        assignment.status === 'COMPLETED' ? 'border-l-emerald-500' :
                                        'border-l-primary-500'
                                    )}>
                                        <CardContent className="p-0">
                                            <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
                                                {/* Left: Task Info */}
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                                            <Building2 className="w-5 h-5 text-primary-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                {assignment.task.business?.companyName ?? 'Unknown Organization'}
                                                            </p>
                                                            <h3 className="text-xl font-bold text-foreground leading-tight">
                                                                {assignment.task.title}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                        {assignment.task.startDate && (
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>{new Date(assignment.task.startDate).toLocaleDateString()}</span>
                                                            </div>
                                                        )}
                                                        {assignment.task.hours && (
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-4 h-4" />
                                                                <span>{assignment.task.hours} hrs estimated</span>
                                                            </div>
                                                        )}
                                                        {assignment.task.project && (
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin className="w-4 h-4" />
                                                                <span>{assignment.task.project}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Duty banner */}
                                                    {assignment.duty && (
                                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 w-fit">
                                                            <Briefcase className="w-3.5 h-3.5 text-yellow-600" />
                                                            <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">Duty: {assignment.duty}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right: Status & Actions */}
                                                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 border-t lg:border-t-0 border-gray-100 dark:border-gray-800 pt-4 lg:pt-0">
                                                    <Badge className={cn("px-3 py-1", status.className)}>
                                                        {status.label}
                                                    </Badge>
                                                    <div className="flex items-center gap-2">
                                                        {(assignment.status === 'ACCEPTED' || assignment.status === 'IN_PROGRESS') && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="border-green-600 text-green-600 hover:bg-green-50"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRequestComplete(assignment.id);
                                                                }}
                                                            >
                                                                Mark as Complete
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            className="bg-primary-600 hover:bg-primary-700 text-white"
                                                            onClick={() => setSelectedAssignment(assignment)}
                                                        >
                                                            Details
                                                            <ChevronRight className="w-4 h-4 ml-1" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
                        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Tasks Found</h3>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            {searchQuery
                                ? "We couldn't find any tasks matching your search. Try a different keyword."
                                : "You haven't registered for any volunteer tasks yet. Start exploring opportunities to make an impact!"}
                        </p>
                        {!searchQuery && (
                            <Button className="bg-primary-600 text-white" onClick={() => window.location.href = '/volunteer/opportunities'}>
                                Explore Opportunities
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Task Detail Modal */}
            <Dialog open={!!selectedAssignment} onOpenChange={(open) => !open && setSelectedAssignment(null)}>
                <DialogContent className="sm:max-w-[560px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{selectedAssignment?.task.title}</DialogTitle>
                        <DialogDescription>
                            {selectedAssignment?.task.business?.companyName ?? 'Unknown Organization'}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedAssignment && (
                        <div className="space-y-5 py-2">
                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground font-medium">Status</span>
                                <Badge className={cn("px-3 py-1", statusConfig[selectedAssignment.status]?.className)}>
                                    {statusConfig[selectedAssignment.status]?.label ?? selectedAssignment.status}
                                </Badge>
                            </div>

                            {/* Duty */}
                            {selectedAssignment.duty && (
                                <div className="p-4 rounded-2xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30">
                                    <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1">Assigned Duty</p>
                                    <p className="text-sm text-yellow-900 dark:text-yellow-300 font-medium">{selectedAssignment.duty}</p>
                                </div>
                            )}

                            {/* Description */}
                            <div className="rounded-2xl bg-gray-50 dark:bg-slate-800 p-4 space-y-1">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {selectedAssignment.task.description || 'No description provided.'}
                                </p>
                            </div>

                            {/* Meta */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: Calendar, label: 'Start Date', value: selectedAssignment.task.startDate ? new Date(selectedAssignment.task.startDate).toLocaleDateString() : '—' },
                                    { icon: Clock, label: 'Est. Hours', value: selectedAssignment.task.hours ? `${selectedAssignment.task.hours} hrs` : '—' },
                                    { icon: MapPin, label: 'Project', value: selectedAssignment.task.project || '—' },
                                    { icon: User, label: 'Applied On', value: new Date(selectedAssignment.assignedAt).toLocaleDateString() },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
                                        <Icon className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">{label}</p>
                                            <p className="text-sm font-semibold">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Status message */}
                            {selectedAssignment.status === 'ASSIGNED' && (
                                <p className="text-xs text-center text-muted-foreground bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3">
                                    ⏳ Your interest is pending review by the organization. You'll be notified once they respond.
                                </p>
                            )}
                            {selectedAssignment.status === 'PENDING_COMPLETION' && (
                                <p className="text-xs text-center text-muted-foreground bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-3">
                                    ✅ You've marked this task as complete. Waiting for organization verification.
                                </p>
                            )}
                            {selectedAssignment.status === 'COMPLETED' && (
                                <p className="text-xs text-center text-muted-foreground bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-3">
                                    🎉 This task has been verified as completed. Thank you for your contribution!
                                </p>
                            )}
                            {selectedAssignment.status === 'DECLINED' && (
                                <p className="text-xs text-center text-muted-foreground bg-red-50 dark:bg-red-900/10 rounded-xl p-3">
                                    Unfortunately, your application was not selected this time. Keep exploring other opportunities!
                                </p>
                            )}

                            {/* Action in Modal */}
                            {(selectedAssignment.status === 'ACCEPTED' || selectedAssignment.status === 'IN_PROGRESS') && (
                                <Button 
                                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl"
                                    onClick={() => handleRequestComplete(selectedAssignment.id)}
                                >
                                    Mark as Complete & Request Verification
                                </Button>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}
