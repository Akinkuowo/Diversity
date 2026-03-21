'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bell,
    CheckCheck,
    Trash2,
    Clock,
    ChevronRight,
    Search,
    Filter,
    MoreVertical,
    AlertCircle,
    Info,
    CheckCircle2,
    XCircle
} from 'lucide-react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const { toast } = useToast()

    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        setIsLoading(true)
        try {
            const data = await api.get('/notifications')
            setNotifications(data)
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
            toast({
                title: 'Error',
                description: 'Failed to load notifications.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`)
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
            toast({
                title: 'Success',
                description: 'Notification marked as read.',
            })
        } catch (error) {
            console.error('Failed to mark as read:', error)
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />
            case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />
            case 'error': return <XCircle className="w-5 h-5 text-red-500" />
            default: return <Info className="w-5 h-5 text-blue-500" />
        }
    }

    const filteredNotifications = notifications.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                        <p className="text-muted-foreground mt-1">Stay updated with your latest alerts and messages.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={fetchNotifications}>
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search notifications..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Bell className="w-5 h-5 text-secondary-600" />
                                All Notifications
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <Badge variant="secondary" className="bg-secondary-100 text-secondary-700">
                                        {notifications.filter(n => !n.read).length} Unread
                                    </Badge>
                                )}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-8 text-center bg-gray-50/50">
                                <div className="animate-spin w-8 h-8 border-4 border-secondary-500 border-t-transparent rounded-full mx-auto" />
                                <p className="text-sm text-gray-500 mt-4">Loading notifications...</p>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="p-12 text-center bg-gray-50/50">
                                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No notifications found</h3>
                                <p className="text-sm text-gray-500">We'll let you know when something new arrives.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                <AnimatePresence initial={false}>
                                    {filteredNotifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${!notification.read ? 'bg-secondary-50/30 dark:bg-secondary-900/10' : ''}`}
                                        >
                                            <div className="flex gap-4">
                                                <div className="mt-1">
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className={`text-sm ${!notification.read ? 'font-bold' : 'font-medium'} text-gray-900 dark:text-gray-100`}>
                                                            {notification.title}
                                                        </h4>
                                                        <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(notification.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <div className="mt-3 flex items-center gap-3">
                                                        {!notification.read && (
                                                            <Button
                                                                variant="link"
                                                                size="sm"
                                                                className="h-auto p-0 text-secondary-600 font-semibold"
                                                                onClick={() => markAsRead(notification.id)}
                                                            >
                                                                Mark as read
                                                            </Button>
                                                        )}
                                                        {notification.link && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-auto p-0 text-gray-500 hover:text-gray-700 font-medium flex items-center"
                                                                onClick={() => window.open(notification.link, '_blank')}
                                                            >
                                                                View details
                                                                <ChevronRight className="w-4 h-4 ml-0.5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
