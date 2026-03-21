'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calendar,
    MapPin,
    Search,
    Filter,
    Users,
    ChevronRight,
    Globe,
    Clock,
    Sparkles,
    Ticket,
    CheckCircle2,
    Pause,
    Play,
    Trash2,
    AlertTriangle
} from 'lucide-react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const CATEGORIES = ['All', 'Workplace Inclusion', 'Technology', 'Community', 'Education']
const TYPES = ['All', 'Conference', 'Workshop', 'Social', 'Seminar']

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedType, setSelectedType] = useState('All')
    const [user, setUser] = useState<any>(null)
    const [eventToDelete, setEventToDelete] = useState<any | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await api.get('/me')
                setUser(userData)
            } catch (err) {
                console.error('Failed to fetch user', err)
            }
        }
        fetchUser()
    }, [])

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true)
            try {
                const data = await api.get(`/events?category=${selectedCategory}&type=${selectedType}`)
                setEvents(data)
            } catch (err) {
                toast.error('Failed to load events')
            } finally {
                setIsLoading(false)
            }
        }
        fetchEvents()
    }, [selectedCategory, selectedType])

    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleStatusUpdate = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'SUSPENDED' ? 'PUBLISHED' : 'SUSPENDED';
        try {
            await api.patch(`/admin/events/${id}/status`, { status: newStatus });
            setEvents(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
            toast.success(`Event ${newStatus === 'SUSPENDED' ? 'suspended' : 'unsuspended'} successfully`);
        } catch (err) {
            toast.error('Failed to update event status');
        }
    };

    const handleDeleteClick = (event: any) => {
        setEventToDelete(event);
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/admin/events/${eventToDelete.id}`);
            setEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
            toast.success('Event deleted successfully');
            setEventToDelete(null);
        } catch (err) {
            toast.error('Failed to delete event');
        } finally {
            setIsDeleting(false);
        }
    };

    const role = user?.role || 'COMMUNITY_MEMBER'

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Hero / Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-[#006666] p-8 md:p-12 text-white shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

                    <div className="relative z-10 max-w-2xl space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium border border-white/30"
                        >
                            <Sparkles className="w-4 h-4" />
                            Discover What's Next
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold leading-tight"
                        >
                            Explore Upcoming Events
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/80 text-lg md:text-xl"
                        >
                            Connect, learn, and grow with our diverse community through conferences, workshops, and networking sessions.
                        </motion.p>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search events..."
                            className="pl-10 h-10 bg-gray-50 dark:bg-slate-800 border-none rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <select
                            className="bg-gray-50 dark:bg-slate-800 text-sm font-medium px-4 py-2 rounded-xl outline-none border-none cursor-pointer"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                        </select>

                        <select
                            className="bg-gray-50 dark:bg-slate-800 text-sm font-medium px-4 py-2 rounded-xl outline-none border-none cursor-pointer"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            {TYPES.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
                        </select>
                    </div>
                </div>

                {/* Events Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[400px] rounded-3xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
                        ))}
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode='popLayout'>
                            {filteredEvents.map((event, i) => (
                                <motion.div
                                    key={event.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                >
                                    <Card className="group overflow-hidden rounded-3xl border-none shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                                            <div className="relative h-56 w-full overflow-hidden">
                                                <img
                                                    src={event.image || 'https://images.unsplash.com/photo-1540575861501-7ad05823c23d?auto=format&fit=crop&q=80&w=1000'}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-white/90 backdrop-blur-sm text-primary-600 hover:bg-white/90 border-none font-bold">
                                                        {event.type}
                                                    </Badge>
                                                </div>
                                                {event.online && (
                                                    <div className="absolute top-4 right-4">
                                                        <Badge className="bg-secondary-500 text-white border-none font-bold flex items-center gap-1">
                                                            <Globe className="w-3 h-3" />
                                                            Online
                                                        </Badge>
                                                    </div>
                                                )}
                                                {role === 'ADMIN' && event.status === 'SUSPENDED' && (
                                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                                                        <Badge variant="destructive" className="text-lg px-4 py-2 rounded-xl font-black uppercase tracking-widest animate-pulse border-2 border-white/20">
                                                            <Pause className="w-5 h-5 mr-2" />
                                                            Suspended
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            <CardHeader className="p-6 pb-2">
                                                <div className="flex items-center gap-2 text-primary-600 font-semibold mb-2 text-sm uppercase tracking-wider">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                                <CardTitle className="text-xl group-hover:text-primary-600 transition-colors line-clamp-1">{event.title}</CardTitle>
                                            </CardHeader>

                                            <CardContent className="p-6 pt-0 space-y-4 flex-1">
                                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                                                    {event.description}
                                                </p>

                                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <MapPin className="w-4 h-4 text-gray-400" />
                                                        <span className="line-clamp-1">{event.location || 'Remote'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <Users className="w-4 h-4 text-gray-400" />
                                                        {event._count?.registrations || 0} Joined
                                                    </div>
                                                </div>
                                            </CardContent>

                                            <CardFooter className="p-6 pt-0 flex flex-col gap-4 border-t border-gray-50 dark:border-slate-800 mt-auto">
                                                <div className="flex items-center justify-between w-full pt-4">
                                                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {event.price === 0 ? 'Free' : `£${event.price}`}
                                                    </div>
                                                    <Link href={`/events/${event.id}`}>
                                                        <Button
                                                            variant="ghost"
                                                            className="group/btn text-primary-600 hover:text-primary-700 hover:bg-primary-50 p-0"
                                                        >
                                                            Learn More
                                                            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                                                        </Button>
                                                    </Link>
                                                </div>

                                                {role === 'ADMIN' && (
                                                    <div className="flex gap-2 w-full pt-2 border-t border-gray-50 dark:border-slate-800/50">
                                                        <Button 
                                                            variant="outline"
                                                            size="sm"
                                                            className={cn(
                                                                "flex-1 rounded-xl font-bold h-10",
                                                                event.status === 'SUSPENDED' 
                                                                    ? "text-emerald-600 border-emerald-100 hover:bg-emerald-50" 
                                                                    : "text-amber-600 border-amber-100 hover:bg-amber-50"
                                                            )}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleStatusUpdate(event.id, event.status);
                                                            }}
                                                        >
                                                            {event.status === 'SUSPENDED' ? (
                                                                <><Play className="w-3.5 h-3.5 mr-1.5" /> Unsuspend</>
                                                            ) : (
                                                                <><Pause className="w-3.5 h-3.5 mr-1.5" /> Suspend</>
                                                            )}
                                                        </Button>
                                                        <Button 
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 rounded-xl font-bold h-10 text-red-600 border-red-100 hover:bg-red-50"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleDeleteClick(event);
                                                            }}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                                                        </Button>
                                                    </div>
                                                )}
                                            </CardFooter>
                                        </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No events found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mt-2">Try adjusting your filters or search term to discover other community happenings.</p>
                        <Button
                            variant="outline"
                            className="mt-6 rounded-xl"
                            onClick={() => { setSelectedCategory('All'); setSelectedType('All'); setSearchTerm(''); }}
                        >
                            Reset all filters
                        </Button>
                    </div>
                )}

                {/* Community Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                    <Card className="bg-secondary-50 dark:bg-secondary-950/20 border-none shadow-sm rounded-3xl p-4">
                        <CardContent className="flex items-center gap-6 p-4">
                            <div className="w-16 h-16 rounded-2xl bg-secondary-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-secondary-500/30">
                                <Ticket className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">My Registrations</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">View and manage the events you're planning to attend.</p>
                                <Button variant="link" className="p-0 h-auto text-secondary-600 font-semibold mt-1">Check my tickets &rarr;</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary-50 dark:bg-primary-950/20 border-none shadow-sm rounded-3xl p-4">
                        <CardContent className="flex items-center gap-6 p-4">
                            <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-500/30">
                                <Plus className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Host an Event</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Want to share your expertise or host a social? Start here.</p>
                                <Button variant="link" className="p-0 h-auto text-primary-600 font-semibold mt-1">Get started &rarr;</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Delete Event
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-gray-100">{eventToDelete?.title}</span>? 
                            This action cannot be undone and will permanently remove all associated registrations and data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setEventToDelete(null)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Deleting...
                                </span>
                            ) : (
                                "Delete Event"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}

function Plus({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" /><path d="M12 5v14" />
        </svg>
    )
}
