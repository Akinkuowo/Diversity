'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    User,
    Bell,
    Lock,
    Eye,
    Globe,
    Shield,
    Smartphone,
    Mail,
    Key,
    Moon,
    Sun,
    Monitor,
    CreditCard
} from 'lucide-react'
import { DashboardLayout } from '../components/dashboard/layout'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [currentLang, setCurrentLang] = useState('en')
    const [notifPrefs, setNotifPrefs] = useState({
        communityUpdates: true,
        weeklyDigest: true,
        mentionsReplies: true,
        directMessages: true,
        eventReminders: true,
    })
    const router = useRouter()

    useEffect(() => {
        // Read the googtrans cookie to show the active language
        const match = document.cookie.match(/googtrans=\/en\/([^;]+)/)
        if (match && match[1]) {
            setCurrentLang(match[1])
        }
    }, [])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const savedUser = localStorage.getItem('user')
                if (savedUser) setUser(JSON.parse(savedUser))
                const userData = await api.get('/me')
                setUser(userData)
                localStorage.setItem('user', JSON.stringify(userData))
            } catch (error) {
                console.error('Failed to fetch user:', error)
                router.push('/login')
            } finally {
                setIsLoading(false)
            }
        }
        fetchUser()
    }, [router])

    useEffect(() => {
        const fetchNotifPrefs = async () => {
            try {
                const prefs = await api.get('/users/me/notification-prefs')
                setNotifPrefs({
                    communityUpdates: prefs.communityUpdates,
                    weeklyDigest: prefs.weeklyDigest,
                    mentionsReplies: prefs.mentionsReplies,
                    directMessages: prefs.directMessages,
                    eventReminders: prefs.eventReminders,
                })
            } catch (e) {
                // silently ignore – defaults remain
            }
        }
        fetchNotifPrefs()
    }, [])

    const handleNotifToggle = async (key: keyof typeof notifPrefs, value: boolean) => {
        const updated = { ...notifPrefs, [key]: value }
        setNotifPrefs(updated)
        try {
            await api.put('/users/me/notification-prefs', { [key]: value })
            toast.success(
                value
                    ? 'Notifications enabled. You\'ll receive emails for this.'
                    : 'Notifications disabled.'
            )
        } catch (e) {
            setNotifPrefs(notifPrefs) // rollback
            toast.error('Failed to save notification preference.')
        }
    }

    if (isLoading && !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    const role = user?.role || 'COMMUNITY_MEMBER'

    return (
        <DashboardLayout role={role}>
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your account preferences, notifications, and privacy.
                    </p>
                </div>

                <Tabs defaultValue="account" className="space-y-6">
                    <TabsList className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-1 rounded-xl shadow-sm w-full sm:w-auto overflow-x-auto flex-nowrap justify-start h-auto">
                        <TabsTrigger value="account" className="flex items-center gap-2 py-2.5 px-4 rounded-lg data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-none transition-all">
                            <User className="w-4 h-4" />
                            Account
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center gap-2 py-2.5 px-4 rounded-lg data-[state=active]:bg-secondary-50 data-[state=active]:text-secondary-600 data-[state=active]:shadow-none transition-all">
                            <Bell className="w-4 h-4" />
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2 py-2.5 px-4 rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none transition-all">
                            <Shield className="w-4 h-4" />
                            Security
                        </TabsTrigger>
                        <TabsTrigger value="display" className="flex items-center gap-2 py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:shadow-none transition-all">
                            <Eye className="w-4 h-4" />
                            Display
                        </TabsTrigger>
                    </TabsList>

                    {/* Account Settings */}
                    <TabsContent value="account">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <Card className="border-none shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg">
                                        <Globe className="w-5 h-5 mr-2 text-primary-500" />
                                        Regional Preferences
                                    </CardTitle>
                                    <CardDescription>Customize your language and timezone settings.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Language</label>
                                            <Select
                                                value={currentLang}
                                                onValueChange={(val) => {
                                                    if (val === 'en') {
                                                        // To revert to the original language, we must completely delete the cookie
                                                        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                                                        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
                                                    } else {
                                                        // Set the translation cookie. Format: /en/[target-language]
                                                        document.cookie = `googtrans=/en/${val}; path=/; max-age=31536000; samesite=lax`
                                                    }
                                                    window.location.reload()
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English (US)</SelectItem>
                                                    <SelectItem value="es">Español</SelectItem>
                                                    <SelectItem value="fr">Français</SelectItem>
                                                    <SelectItem value="de">Deutsch</SelectItem>
                                                    <SelectItem value="it">Italiano</SelectItem>
                                                    <SelectItem value="pt">Português</SelectItem>
                                                    <SelectItem value="zh-CN">中文 (Simplified)</SelectItem>
                                                    <SelectItem value="ja">日本語</SelectItem>
                                                    <SelectItem value="ar">العربية</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Timezone</label>
                                            <Select defaultValue="pst">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Timezone" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pst">Pacific Time (US & Canada)</SelectItem>
                                                    <SelectItem value="est">Eastern Time (US & Canada)</SelectItem>
                                                    <SelectItem value="gmt">Greenwich Mean Time (London)</SelectItem>
                                                    <SelectItem value="cet">Central European Time (Paris)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-lg text-red-600 flex items-center">
                                        Danger Zone
                                    </CardTitle>
                                    <CardDescription>Irreversible and destructive actions.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 p-4 rounded-xl">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">Delete Account</p>
                                            <p className="text-sm text-gray-500">Permanently remove your account and all its data.</p>
                                        </div>
                                        <Button variant="destructive">Delete Account</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    {/* Notifications Settings */}
                    <TabsContent value="notifications">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <Card className="border-none shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg">
                                        <Mail className="w-5 h-5 mr-2 text-secondary-500" />
                                        Email Notifications
                                    </CardTitle>
                                    <CardDescription>Control what emails you receive from us.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-gray-900 dark:text-white">Community Updates</p>
                                            <p className="text-sm text-gray-500">News, announcements, and featured opportunities.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-gray-900 dark:text-white">Weekly Digest</p>
                                            <p className="text-sm text-gray-500">A weekly summary of your stats and impact.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-gray-900 dark:text-white">Mentions & Replies</p>
                                            <p className="text-sm text-gray-500">When someone comments on your post or tags you.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg">
                                        <Smartphone className="w-5 h-5 mr-2 text-secondary-500" />
                                        Push Notifications
                                    </CardTitle>
                                    <CardDescription>Instant alerts delivered to your device.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-gray-900 dark:text-white">Direct Messages</p>
                                            <p className="text-sm text-gray-500">Get notified immediately when someone messages you.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-gray-900 dark:text-white">Event Reminders</p>
                                            <p className="text-sm text-gray-500">Alerts 24 hours before your registered events.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    {/* Security Settings */}
                    <TabsContent value="security">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <Card className="border-none shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg">
                                        <Key className="w-5 h-5 mr-2 text-emerald-600" />
                                        Password & Authentication
                                    </CardTitle>
                                    <CardDescription>Manage your password and secure your account.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-4 max-w-sm">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Current Password</label>
                                            <Input type="password" placeholder="••••••••" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">New Password</label>
                                            <Input type="password" placeholder="••••••••" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Confirm New Password</label>
                                            <Input type="password" placeholder="••••••••" />
                                        </div>
                                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Update Password</Button>
                                    </div>

                                    <hr className="border-gray-100 dark:border-gray-800" />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                                            <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                                        </div>
                                        <Button variant="outline">Enable 2FA</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg">
                                        <Monitor className="w-5 h-5 mr-2 text-emerald-600" />
                                        Active Sessions
                                    </CardTitle>
                                    <CardDescription>Devices currently logged into your account.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-4">
                                                <Monitor className="w-8 h-8 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">Mac OS Safari</p>
                                                    <p className="text-xs text-green-600 font-medium">Active now — San Francisco, CA</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-4">
                                                <Smartphone className="w-8 h-8 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">iPhone 14 iOS</p>
                                                    <p className="text-xs text-gray-500">Last active 2 hours ago — San Francisco, CA</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Revoke</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    {/* Display Settings */}
                    <TabsContent value="display">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <Card className="border-none shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg">
                                        <Eye className="w-5 h-5 mr-2 text-blue-500" />
                                        Appearance & Theme
                                    </CardTitle>
                                    <CardDescription>Customize how Diversity Network looks on your device.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="border-2 border-primary-500 bg-white p-4 rounded-xl flex flex-col items-center gap-3 cursor-pointer">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Sun className="w-6 h-6 text-gray-900" />
                                            </div>
                                            <p className="font-medium">Light Mode</p>
                                        </div>
                                        <div className="border-2 border-transparent hover:border-gray-200 bg-slate-900 p-4 rounded-xl flex flex-col items-center gap-3 cursor-pointer">
                                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                                                <Moon className="w-6 h-6 text-white" />
                                            </div>
                                            <p className="font-medium text-white">Dark Mode</p>
                                        </div>
                                        <div className="border-2 border-transparent hover:border-gray-200 bg-primary-100 p-4 rounded-xl flex flex-col items-center gap-3 cursor-pointer">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
                                                <Monitor className="w-6 h-6 text-gray-900 dark:text-white" />
                                            </div>
                                            <p className="font-medium text-gray-900 dark:text-white">System Auto</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-lg">Accessibility</CardTitle>
                                    <CardDescription>Make the interface easier to use.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-gray-900 dark:text-white">Reduce Motion</p>
                                            <p className="text-sm text-gray-500">Disable UI animations and transitions.</p>
                                        </div>
                                        <Switch />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-gray-900 dark:text-white">High Contrast Text</p>
                                            <p className="text-sm text-gray-500">Increase color contrast for better readability.</p>
                                        </div>
                                        <Switch />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
