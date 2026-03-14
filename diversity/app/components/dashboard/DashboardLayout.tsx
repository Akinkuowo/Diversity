'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Menu,
    X,
    Home,
    Users,
    BookOpen,
    Calendar,
    Heart,
    CircleDollarSign,
    Award,
    Settings,
    LogOut,
    Bell,
    Search,
    ChevronDown,
    BarChart3,
    Briefcase,
    GraduationCap,
    MessageCircle,
    FileText,
    Shield,
    CreditCard,
    HelpCircle,
    LayoutDashboard,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    Download,
    Filter,
    MoreVertical,
    UserCircle,
    Building2,
    Globe,
    Target,
    Zap,
    Sparkles,
    Gift,
    Trophy,
    Users2,
    CalendarCheck,
    Video,
    FileSpreadsheet,
    PieChart,
    Activity,
    Settings2,
    Lock,
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Twitter,
    Github,
    Instagram,
    MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '../../../components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'

interface DashboardLayoutProps {
    children: React.ReactNode
    role: 'ADMIN' | 'BUSINESS' | 'VOLUNTEER' | 'LEARNER' | 'COMMUNITY_MEMBER'
}

const roleColors = {
    ADMIN: 'from-red-500 to-pink-500',
    BUSINESS: 'from-secondary-500 to-secondary-500',
    VOLUNTEER: 'from-green-500 to-emerald-500',
    LEARNER: 'from-blue-500 to-cyan-500',
    COMMUNITY_MEMBER: 'from-primary-500 to-amber-500',
}

const roleIcons = {
    ADMIN: Shield,
    BUSINESS: Building2,
    VOLUNTEER: Heart,
    LEARNER: GraduationCap,
    COMMUNITY_MEMBER: Users,
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { toast } = useToast()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [notifications, setNotifications] = useState<any[]>([])

    // Fetch User Data from backend to ensure it's up to date
    const fetchUser = async () => {
        try {
            const userData = await api.get('/me')
            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))
        } catch (error) {
            console.error('DashboardLayout: Failed to fetch user:', error)
            if ((error as any).response?.status === 401) {
                router.push('/login')
            }
        }
    }

    useEffect(() => {
        // Initialize user from localStorage
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser))
            } catch (e) {
                console.error('Failed to parse user from localStorage', e)
            }
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)

        fetchUser()

        // Fetch Notifications
        const fetchNotifications = async () => {
            try {
                const data = await api.get('/notifications')
                setNotifications(data)
            } catch (error) {
                console.error('DashboardLayout: Failed to fetch notifications:', error)
            }
        }
        fetchNotifications()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [router])

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`)
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
        } catch (error) {
            console.error('Failed to mark notification as read:', error)
        }
    }

    const handleConnectionResponse = async (notificationId: string, requesterId: string, action: 'accept' | 'decline') => {
        try {
            await api.post('/notifications/connection/respond', { notificationId, action, requesterId })
            toast({
                title: action === 'accept' ? 'Connection accepted' : 'Connection declined',
                description: action === 'accept' ? 'You are now connected!' : 'The request has been removed.',
            })
            // Refresh notifications and user data
            const data = await api.get('/notifications')
            setNotifications(data)
            await fetchUser()
        } catch (error) {
            console.error('Failed to respond to connection request:', error)
            toast({
                title: 'Error',
                description: 'Failed to process request. Please try again.',
                variant: 'destructive'
            })
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        toast({
            title: 'Logged out successfully',
            description: 'You have been signed out of your account.',
        })
        router.push('/')
    }

    const navigation = {
        ADMIN: [
            { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Users', href: '/admin/users', icon: Users },
            { name: 'Businesses', href: '/admin/businesses', icon: Building2 },
            { name: 'Courses', href: '/admin/courses', icon: BookOpen },
            { name: 'Events', href: '/events', icon: Calendar },
            { name: 'Volunteers', href: '/admin/volunteers', icon: Heart },
            { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
            { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
            { name: 'Resources', href: '/resources', icon: BookOpen },
            { name: 'Billing', href: '/billing', icon: CreditCard },
            { name: 'Settings', href: '/settings', icon: Settings },
        ],
        BUSINESS: [
            { name: 'Dashboard', href: '/business/dashboard', icon: LayoutDashboard },
            { name: 'Profile', href: '/business/profile', icon: Building2 },
            { name: 'Diversity Badge', href: '/business/badge', icon: Award },
            { name: 'Employment', href: '/business/employment', icon: Users },
            { name: 'Training', href: '/business/training', icon: BookOpen },
            { name: 'Volunteering', href: '/business/volunteering', icon: Heart },
            { name: 'Sponsorships', href: '/business/sponsorships', icon: CircleDollarSign },
            { name: 'Impact Report', href: '/business/impact', icon: Target },
            { name: 'Resources', href: '/resources', icon: BookOpen },
            { name: 'Billing', href: '/billing', icon: CreditCard },
            { name: 'Settings', href: '/settings', icon: Settings },
        ],
        VOLUNTEER: [
            { name: 'Dashboard', href: '/volunteer/dashboard', icon: LayoutDashboard },
            { name: 'My Tasks', href: '/volunteer/tasks', icon: CheckCircle },
            { name: 'Opportunities', href: '/volunteer/opportunities', icon: Target },
            { name: 'Hours Log', href: '/volunteer/hours', icon: Clock },
            { name: 'Achievements', href: '/volunteer/achievements', icon: Trophy },
            { name: 'Events', href: '/events', icon: Calendar },
            { name: 'Training', href: '/volunteer/training', icon: BookOpen },
            { name: 'Jobs', href: '/employment', icon: Briefcase },
            { name: 'Community', href: '/volunteer/community', icon: Users2 },
            { name: 'Resources', href: '/resources', icon: BookOpen },
            { name: 'Billing', href: '/billing', icon: CreditCard },
            { name: 'Settings', href: '/settings', icon: Settings },
        ],
        LEARNER: [
            { name: 'Dashboard', href: '/learner/dashboard', icon: LayoutDashboard },
            { name: 'My Courses', href: '/learner/courses', icon: BookOpen },
            { name: 'Learning Path', href: '/learner/path', icon: TrendingUp },
            { name: 'Certificates', href: '/learner/certificates', icon: Award },
            { name: 'Quizzes', href: '/learner/quizzes', icon: FileText },
            { name: 'Resources', href: '/resources', icon: BookOpen },
            { name: 'Progress', href: '/learner/progress', icon: Activity },
            { name: 'Community', href: '/learner/community', icon: Users2 },
            { name: 'Jobs', href: '/employment', icon: Briefcase },
            { name: 'Billing', href: '/billing', icon: CreditCard },
            { name: 'Settings', href: '/settings', icon: Settings },
        ],
        COMMUNITY_MEMBER: [
            { name: 'Dashboard', href: '/community/dashboard', icon: LayoutDashboard },
            { name: 'Events', href: '/events', icon: Calendar },
            { name: 'Forums', href: '/forums', icon: MessageCircle },
            { name: 'Resources', href: '/resources', icon: BookOpen },
            { name: 'Businesses', href: '/community/businesses', icon: Building2 },
            { name: 'Volunteer', href: '/community/volunteer', icon: Heart },
            { name: 'Announcements', href: '/community/announcements', icon: Bell },
            { name: 'Network', href: '/community/network', icon: Users2 },
            { name: 'Billing', href: '/billing', icon: CreditCard },
            { name: 'Settings', href: '/settings', icon: Settings },
        ],
    }

    const RoleIcon = roleIcons[role]

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Mobile Sidebar */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetContent side="left" className="w-72 p-0">
                    <MobileSidebar
                        navigation={navigation[role]}
                        role={role}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 hidden lg:block">
                <DesktopSidebar navigation={navigation[role]} role={role} />
            </aside>

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Header */}
                <header className={`sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all ${isScrolled ? 'shadow-md' : ''
                    }`}>
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu className="w-5 h-5" />
                            </Button>

                            {/* Search */}
                            <div className="hidden md:flex items-center relative">
                                <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search..."
                                    className="w-80 pl-10 bg-gray-100/50 dark:bg-slate-900/50 border-gray-200 dark:border-gray-800"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="relative">
                                        <Bell className="w-5 h-5" />
                                        {notifications.some(n => !n.read) && (
                                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            No notifications
                                        </div>
                                    ) : (
                                        notifications.slice(0, 5).map((notification) => (
                                            <DropdownMenuItem
                                                key={notification.id}
                                                className={cn(
                                                    "flex flex-col items-start gap-2 p-4 cursor-pointer",
                                                    !notification.read && "bg-slate-50 dark:bg-slate-900/50"
                                                )}
                                                onClick={() => {
                                                    markAsRead(notification.id)
                                                    if (notification.link) router.push(notification.link)
                                                }}
                                            >
                                                <div className="flex justify-between w-full">
                                                    <div className="flex flex-col gap-1 pr-4">
                                                        <p className={cn(
                                                            "text-[13px] leading-tight",
                                                            notification.read ? "text-slate-500 font-medium" : "text-slate-900 dark:text-white font-bold"
                                                        )}>
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-[12px] text-slate-400">
                                                            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notification.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 rounded-full bg-primary-500 mt-1" />
                                                    )}
                                                </div>

                                                {notification.type === 'connection_request' && !notification.read && (
                                                    <div className="flex gap-2 w-full mt-2">
                                                        <Button 
                                                            size="sm" 
                                                            className="h-8 flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                // Extract requesterId from link /community/network?requesterId=...
                                                                const requesterId = notification.link?.split('=')[1]
                                                                if (requesterId) handleConnectionResponse(notification.id, requesterId, 'accept')
                                                            }}
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            className="h-8 flex-1 border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                const requesterId = notification.link?.split('=')[1]
                                                                if (requesterId) handleConnectionResponse(notification.id, requesterId, 'decline')
                                                            }}
                                                        >
                                                            Decline
                                                        </Button>
                                                    </div>
                                                )}

                                                {notification.type === 'new_message' && (
                                                    <div className="mt-2 w-full">
                                                        <Button 
                                                            size="sm" 
                                                            variant="ghost" 
                                                            className="h-8 w-full justify-start px-0 text-primary-600 hover:text-primary-700 font-bold text-xs"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                markAsRead(notification.id)
                                                                router.push('/messages')
                                                            }}
                                                        >
                                                            <MessageSquare className="w-3 h-3 mr-2" />
                                                            Open Messages
                                                        </Button>
                                                    </div>
                                                )}

                                                {(notification.type === 'like' || notification.type === 'comment') && (
                                                    <div className="mt-2 w-full">
                                                        <Button 
                                                            size="sm" 
                                                            variant="ghost" 
                                                            className="h-8 w-full justify-start px-0 text-primary-600 hover:text-primary-700 font-bold text-xs"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                markAsRead(notification.id)
                                                                if (notification.link) router.push(notification.link)
                                                            }}
                                                        >
                                                            {notification.type === 'like' ? <Heart className="w-3 h-3 mr-2" /> : <MessageCircle className="w-3 h-3 mr-2" />}
                                                            View Post
                                                        </Button>
                                                    </div>
                                                )}
                                            </DropdownMenuItem>
                                        ))
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-center text-secondary-600 cursor-pointer justify-center"
                                        onClick={() => router.push('/notifications')}
                                    >
                                        View all notifications
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2">
                                        <Avatar className="w-8 h-8">
                                            {user?.profile?.avatar && <AvatarImage src={user.profile.avatar} />}
                                            <AvatarFallback className={`bg-primary-600 text-white uppercase`}>
                                                {user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName || ''}` : 'Loading...'}</p>
                                            <p className="text-xs text-gray-500">{role.toLowerCase().replace('_', ' ')}</p>
                                        </div>
                                        <ChevronDown className="w-4 h-4 hidden md:block" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/profile')}>
                                        <UserCircle className="w-4 h-4 mr-2" />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/settings')}>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/billing')}>
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}

function DesktopSidebar({ navigation, role }: { navigation: any[]; role: string }) {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-200 dark:border-gray-700">
                <div className={`w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">DN</span>
                </div>
                <span className="font-semibold text-lg">Diversity<span className="text-secondary-600">Network</span></span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <div className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                    ? `bg-primary-600 text-white`
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.name}</span>
                                {item.badge && (
                                    <Badge variant="secondary" className="ml-auto">{item.badge}</Badge>
                                )}
                            </Link>
                        )
                    })}
                </div>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        href="/help"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <HelpCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Help & Support</span>
                    </Link>
                </div>
            </nav>
        </div>
    )
}

function MobileSidebar({ navigation, role, onClose }: { navigation: any[]; role: string; onClose: () => void }) {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg">DN</span>
                    </div>
                    <span className="font-semibold">DiversityNetwork</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <div className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                    ? `bg-primary-600 text-white`
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
export default DashboardLayout;
