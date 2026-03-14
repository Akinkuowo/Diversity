'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Calendar,
    MapPin,
    Users,
    ChevronLeft,
    Globe,
    Clock,
    Share2,
    Shield,
    CheckCircle2,
    CalendarCheck,
    ArrowLeft,
    Ticket,
    Info
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

export default function EventDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [event, setEvent] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRegistering, setIsRegistering] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [isRegistered, setIsRegistered] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const userData = await api.get('/me')
                setUser(userData)

                const eventData = await api.get(`/events/${params.id}`)
                setEvent(eventData)

                // Check if user is already registered
                const myEvents = await api.get('/users/me/events')
                const alreadyRegistered = myEvents.some((e: any) => e.id === params.id)
                setIsRegistered(alreadyRegistered)
            } catch (err) {
                toast.error('Failed to load event details')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [params.id])

    const handleRegister = async () => {
        setIsRegistering(true)
        try {
            await api.post(`/events/${params.id}/register`, {})
            setIsRegistered(true)
            toast.success('Successfully registered for event!')
            // Refresh event to get updated registration count
            const updatedEvent = await api.get(`/events/${params.id}`)
            setEvent(updatedEvent)
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to register for event')
        } finally {
            setIsRegistering(false)
        }
    }

    if (isLoading) {
        return (
            <DashboardLayout role="COMMUNITY_MEMBER">
                <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
                    <div className="h-10 w-32 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                    <div className="h-[400px] w-full bg-gray-200 dark:bg-slate-800 rounded-3xl" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            <div className="h-12 w-3/4 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                            <div className="h-32 w-full bg-gray-200 dark:bg-slate-800 rounded-lg" />
                        </div>
                        <div className="h-64 w-full bg-gray-200 dark:bg-slate-800 rounded-3xl" />
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (!event) return null

    return (
        <DashboardLayout role={user?.role || 'COMMUNITY_MEMBER'}>
            <div className="max-w-5xl mx-auto space-y-8 pb-20">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="group flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors p-0 hover:bg-transparent"
                    onClick={() => router.push('/events')}
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to all events
                </Button>

                {/* Hero Banner */}
                <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                    <img
                        src={event.image || 'https://images.unsplash.com/photo-1540575861501-7ad05823c23d?auto=format&fit=crop&q=80&w=1000'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex flex-wrap gap-2">
                                <Badge className="bg-primary-500 text-white border-none px-3 py-1 text-sm">{event.type}</Badge>
                                <Badge className="bg-white/20 backdrop-blur-md text-white border-none px-3 py-1 text-sm">{event.category}</Badge>
                                {event.online && (
                                    <Badge className="bg-secondary-500 text-white border-none px-3 py-1 text-sm flex items-center gap-1">
                                        <Globe className="w-3 h-3" />
                                        Online
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl">{event.title}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary-400" />
                                    {new Date(event.startDate).toLocaleDateString('en-GB', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary-400" />
                                    {new Date(event.startDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    -
                                    {new Date(event.endDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* About Section */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Info className="w-6 h-6 text-primary-500" />
                                About this event
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </section>

                        {/* Event Location / Access */}
                        <Card className="rounded-3xl border-none shadow-sm bg-gray-50 dark:bg-slate-900 overflow-hidden">
                            <CardHeader className="p-6">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary-500" />
                                    Location & Accessibility
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-6">
                                <div className="space-y-2">
                                    <p className="font-bold text-gray-900 dark:text-white">Venue:</p>
                                    <p className="text-gray-600 dark:text-gray-300">{event.location || 'Remote Selection'}</p>
                                </div>
                                {event.online && (
                                    <div className="p-4 rounded-2xl bg-secondary-100 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary-500 flex items-center justify-center text-white">
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-secondary-800 dark:text-secondary-100 italic">This is an online event</p>
                                                <p className="text-sm text-secondary-700 dark:text-secondary-300">The meeting link will be emailed to you after registration.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Organizer Profile */}
                        <section className="pt-4 border-t border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-bold mb-6">Organized by</h3>
                            <div className="flex items-start gap-5">
                                <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                                    <AvatarImage src={event.organizer.profile?.avatar} />
                                    <AvatarFallback className="bg-primary-100 text-primary-600 font-bold text-xl uppercase">
                                        {event.organizer.firstName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2 flex-1">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {event.organizer.firstName} {event.organizer.lastName}
                                    </h4>
                                    <p className="text-gray-500 line-clamp-2">
                                        {event.organizer.profile?.bio || 'Passionate about building inclusive communities and sharing knowledge to drive meaningful impact.'}
                                    </p>
                                    <Button variant="outline" size="sm" className="rounded-full">Follow Organizer</Button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Registration Card */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="sticky top-24 rounded-3xl border-none shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <CardHeader className="bg-primary-600 text-white p-6">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium opacity-80">Registration</p>
                                        <Ticket className="w-6 h-6 opacity-80" />
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-3xl font-bold">
                                            {event.price === 0 ? 'Free' : `£${event.price}`}
                                        </p>
                                        <p className="text-white/70 text-sm mt-1">Limited availability — {event.capacity - event._count.registrations} spots left</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 pt-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                            <Shield className="w-5 h-5 text-emerald-500" />
                                            Verified Diversity Network Event
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                            <CalendarCheck className="w-5 h-5 text-emerald-500" />
                                            Instant confirmation
                                        </div>
                                    </div>

                                    {!isRegistered ? (
                                        <Button
                                            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-6 rounded-2xl text-lg font-bold shadow-lg shadow-primary-600/20"
                                            onClick={handleRegister}
                                            disabled={isRegistering}
                                        >
                                            {isRegistering ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                                    Registering...
                                                </span>
                                            ) : (
                                                'Register Now'
                                            )}
                                        </Button>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 font-bold border border-emerald-100 dark:border-emerald-800">
                                                <CheckCircle2 className="w-6 h-6" />
                                                Registered
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-2xl py-6 border-gray-200"
                                                onClick={() => toast.info('Registration management coming soon!')}
                                            >
                                                Manage Ticket
                                            </Button>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-gray-50 dark:border-slate-800">
                                        <div className="flex items-center justify-between text-xs text-gray-400 font-medium px-1">
                                            <span>Already registered: {event._count.registrations}</span>
                                            <span>Capacity: {event.capacity}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                                            <motion.div
                                                className="h-full bg-primary-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(event._count.registrations / event.capacity) * 100}%` }}
                                                transition={{ duration: 1, ease: 'easeOut' }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-6 pt-0">
                                    <Button variant="ghost" className="w-full rounded-xl text-gray-500 hover:text-primary-600 gap-2">
                                        <Share2 className="w-4 h-4" />
                                        Share Event
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
