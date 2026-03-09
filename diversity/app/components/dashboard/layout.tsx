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
    Instagram
} from 'lucide-react'
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
    BUSINESS: 'from-purple-500 to-indigo-500',
    VOLUNTEER: 'from-green-500 to-emerald-500',
    LEARNER: 'from-blue-500 to-cyan-500',
    COMMUNITY_MEMBER: 'from-orange-500 to-amber-500',
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

        // Fetch User Data from backend to ensure it's up to date
        const fetchUser = async () => {
            console.log('DashboardLayout: Fetching user data from /me...');
            try {
                const userData = await api.get('/me')
                console.log('DashboardLayout: User data received:', userData);
                setUser(userData)
                // Update localStorage with fresh data
                localStorage.setItem('user', JSON.stringify(userData))
            } catch (error) {
                console.error('DashboardLayout: Failed to fetch user:', error)
                // If unauthorized, redirect to login
                if ((error as any).response?.status === 401) {
                    console.log('DashboardLayout: Unauthorized, redirecting to login');
                    router.push('/login')
                }
            }
        }
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
            { name: 'Events', href: '/admin/events', icon: Calendar },
            { name: 'Volunteers', href: '/admin/volunteers', icon: Heart },
            { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
            { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
            { name: 'Settings', href: '/admin/settings', icon: Settings },
        ],
        BUSINESS: [
            { name: 'Dashboard', href: '/business/dashboard', icon: LayoutDashboard },
            { name: 'Profile', href: '/business/profile', icon: Building2 },
            { name: 'Diversity Badge', href: '/business/badge', icon: Award },
            { name: 'Employees', href: '/business/employees', icon: Users },
            { name: 'Training', href: '/business/training', icon: BookOpen },
            { name: 'Volunteering', href: '/business/volunteering', icon: Heart },
            { name: 'Sponsorships', href: '/business/sponsorships', icon: Gift },
            { name: 'Impact Report', href: '/business/impact', icon: Target },
            { name: 'Settings', href: '/business/settings', icon: Settings },
        ],
        VOLUNTEER: [
            { name: 'Dashboard', href: '/volunteer/dashboard', icon: LayoutDashboard },
            { name: 'My Tasks', href: '/volunteer/tasks', icon: CheckCircle },
            { name: 'Opportunities', href: '/volunteer/opportunities', icon: Target },
            { name: 'Hours Log', href: '/volunteer/hours', icon: Clock },
            { name: 'Achievements', href: '/volunteer/achievements', icon: Trophy },
            { name: 'Events', href: '/volunteer/events', icon: Calendar },
            { name: 'Training', href: '/volunteer/training', icon: BookOpen },
            { name: 'Community', href: '/volunteer/community', icon: Users2 },
            { name: 'Settings', href: '/volunteer/settings', icon: Settings },
        ],
        LEARNER: [
            { name: 'Dashboard', href: '/learner/dashboard', icon: LayoutDashboard },
            { name: 'My Courses', href: '/learner/courses', icon: BookOpen },
            { name: 'Learning Path', href: '/learner/path', icon: TrendingUp },
            { name: 'Certificates', href: '/learner/certificates', icon: Award },
            { name: 'Quizzes', href: '/learner/quizzes', icon: FileText },
            { name: 'Resources', href: '/learner/resources', icon: FileSpreadsheet },
            { name: 'Progress', href: '/learner/progress', icon: Activity },
            { name: 'Community', href: '/learner/community', icon: Users2 },
            { name: 'Settings', href: '/learner/settings', icon: Settings },
        ],
        COMMUNITY_MEMBER: [
            { name: 'Dashboard', href: '/community/dashboard', icon: LayoutDashboard },
            { name: 'Events', href: '/community/events', icon: Calendar },
            { name: 'Forums', href: '/community/forums', icon: MessageCircle },
            { name: 'Resources', href: '/community/resources', icon: FileText },
            { name: 'Businesses', href: '/community/businesses', icon: Building2 },
            { name: 'Volunteer', href: '/community/volunteer', icon: Heart },
            { name: 'Announcements', href: '/community/announcements', icon: Bell },
            { name: 'Network', href: '/community/network', icon: Users2 },
            { name: 'Settings', href: '/community/settings', icon: Settings },
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
                                                className="cursor-pointer"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                <div className="flex flex-col gap-1">
                                                    <p className={`text-sm ${notification.read ? 'text-gray-600' : 'font-semibold'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <Badge className="ml-auto" variant="default">New</Badge>
                                                )}
                                            </DropdownMenuItem>
                                        ))
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-center text-purple-600 cursor-pointer justify-center"
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
                                            <AvatarFallback className={`bg-gradient-to-r ${roleColors[role]} text-white uppercase`}>
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
                                    <DropdownMenuItem>
                                        <UserCircle className="w-4 h-4 mr-2" />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
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
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${roleColors[role as keyof typeof roleColors]} flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">DN</span>
                </div>
                <span className="font-semibold text-lg">Diversity<span className="text-purple-600">Network</span></span>
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
                                    ? `bg-gradient-to-r ${roleColors[role as keyof typeof roleColors]} text-white`
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
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${roleColors[role as keyof typeof roleColors]} flex items-center justify-center`}>
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
                                    ? `bg-gradient-to-r ${roleColors[role as keyof typeof roleColors]} text-white`
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