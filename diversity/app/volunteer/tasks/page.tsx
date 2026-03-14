'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
    Calendar,
    Clock,
    MapPin,
    CheckCircle,
    AlertCircle,
    Building2,
    Loader2,
    ChevronRight,
    Search,
    MessageSquare,
    CheckCircle2
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function MyTasksPage() {
    const [assignments, setAssignments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

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

    const filteredAssignments = assignments.filter(assignment => 
        assignment.task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.task.business.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ASSIGNED': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    return (
        <DashboardLayout role="VOLUNTEER">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Volunteer Tasks</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your assignments and track your contributions.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
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
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                        <p className="text-muted-foreground animate-pulse">Loading your tasks...</p>
                    </div>
                ) : filteredAssignments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredAssignments.map((assignment, index) => (
                            <motion.div
                                key={assignment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="overflow-hidden border-l-4 border-l-primary-500 hover:shadow-md transition-shadow">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
                                            {/* Left: Organization & Task Info */}
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                        <Building2 className="w-5 h-5 text-primary-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-muted-foreground">
                                                            {assignment.task.business.companyName}
                                                        </p>
                                                        <h3 className="text-xl font-bold text-foreground">
                                                            {assignment.task.title}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{new Date(assignment.task.startDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{assignment.task.hours} Hours Estimated</span>
                                                    </div>
                                                    {assignment.task.project && (
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{assignment.task.project}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Status & Actions */}
                                            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 border-t lg:border-t-0 border-gray-100 dark:border-gray-800 pt-4 lg:pt-0">
                                                <Badge className={cn("px-3 py-1", getStatusColor(assignment.status))}>
                                                    {assignment.status.replace('_', ' ')}
                                                </Badge>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm">
                                                        <MessageSquare className="w-4 h-4 mr-2" />
                                                        Contact
                                                    </Button>
                                                    <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">
                                                        Details
                                                        <ChevronRight className="w-4 h-4 ml-1" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
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
                            <Button className="bg-primary-600 text-white" onClick={() => window.location.href = '/community/volunteer'}>
                                Explore Opportunities
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
