'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    User,
    Bell,
    Lock,
    Globe,
    Shield,
    Smartphone,
    Mail,
    Key,
    Monitor,
    LogOut
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
            toast.success(value ? "Notifications enabled. You'll receive emails for this." : 'Notifications disabled.')
        } catch (e) {
            setNotifPrefs(notifPrefs)
            toast.error('Failed to save notification preference.')
        }
    }

    // ——— Security state ———
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [pwLoading, setPwLoading] = useState(false)
    const [sessions, setSessions] = useState<any[]>([])
    const [sessionsLoading, setSessionsLoading] = useState(false)
    const [twoFAEnabled, setTwoFAEnabled] = useState(false)
    const [twoFASetup, setTwoFASetup] = useState<{ secret: string; qrCode: string } | null>(null)
    const [twoFAToken, setTwoFAToken] = useState('')
    const [twoFADisableToken, setTwoFADisableToken] = useState('')
    const [twoFALoading, setTwoFALoading] = useState(false)

    useEffect(() => {
        const fetchSessions = async () => {
            setSessionsLoading(true)
            try {
                const data = await api.get('/users/me/sessions')
                setSessions(data)
            } catch { /* ignore */ } finally { setSessionsLoading(false) }
        }
        fetchSessions()
    }, [])

    useEffect(() => {
        if (user) setTwoFAEnabled(user.twoFactorEnabled ?? false)
    }, [user])

    const handlePasswordChange = async () => {
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            return toast.error('New passwords do not match.')
        }
        setPwLoading(true)
        try {
            const res = await api.post('/users/me/change-password', {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            })
            toast.success(res.message)
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            // Force re-login since sessions are invalidated
            setTimeout(() => { localStorage.removeItem('token'); router.push('/login') }, 1500)
        } catch (e: any) {
            toast.error(e?.message || 'Failed to change password.')
        } finally { setPwLoading(false) }
    }

    const handleRevokeSession = async (id: string) => {
        try {
            await api.delete(`/users/me/sessions/${id}`)
            setSessions(s => s.filter(sess => sess.id !== id))
            toast.success('Session revoked.')
        } catch { toast.error('Failed to revoke session.') }
    }

    const handleRevokeAll = async () => {
        try {
            await api.delete('/users/me/sessions')
            const data = await api.get('/users/me/sessions')
            setSessions(data)
            toast.success('All other sessions revoked.')
        } catch { toast.error('Failed to revoke sessions.') }
    }

    const handle2FASetup = async () => {
        setTwoFALoading(true)
        try {
            const res = await api.post('/users/me/2fa/setup', {})
            setTwoFASetup(res)
        } catch (e: any) { toast.error(e?.message || 'Failed to start 2FA setup.') }
        finally { setTwoFALoading(false) }
    }

    const handle2FAVerify = async () => {
        setTwoFALoading(true)
        try {
            const res = await api.post('/users/me/2fa/verify', { token: twoFAToken })
            toast.success(res.message)
            setTwoFAEnabled(true)
            setTwoFASetup(null)
            setTwoFAToken('')
        } catch (e: any) { toast.error(e?.message || 'Invalid code.') }
        finally { setTwoFALoading(false) }
    }

    const handle2FADisable = async () => {
        setTwoFALoading(true)
        try {
            const res = await api.post('/users/me/2fa/disable', { token: twoFADisableToken })
            toast.success(res.message)
            setTwoFAEnabled(false)
            setTwoFADisableToken('')
        } catch (e: any) { toast.error(e?.message || 'Invalid code.') }
        finally { setTwoFALoading(false) }
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
                                        <Switch
                                            checked={notifPrefs.communityUpdates}
                                            onCheckedChange={(v) => handleNotifToggle('communityUpdates', v)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-gray-900 dark:text-white">Weekly Digest</p>
                                            <p className="text-sm text-gray-500">A weekly summary of your stats and impact.</p>
                                        </div>
                                        <Switch
                                            checked={notifPrefs.weeklyDigest}
                                            onCheckedChange={(v) => handleNotifToggle('weeklyDigest', v)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-gray-900 dark:text-white">Mentions & Replies</p>
                                            <p className="text-sm text-gray-500">When someone comments on your post or tags you.</p>
                                        </div>
                                        <Switch
                                            checked={notifPrefs.mentionsReplies}
                                            onCheckedChange={(v) => handleNotifToggle('mentionsReplies', v)}
                                        />
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
                                        <Switch
                                            checked={notifPrefs.directMessages}
                                            onCheckedChange={(v) => handleNotifToggle('directMessages', v)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-gray-900 dark:text-white">Event Reminders</p>
                                            <p className="text-sm text-gray-500">Alerts 24 hours before your registered events.</p>
                                        </div>
                                        <Switch
                                            checked={notifPrefs.eventReminders}
                                            onCheckedChange={(v) => handleNotifToggle('eventReminders', v)}
                                        />
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
                                    {/* Password Change Form */}
                                    <div className="grid gap-4 max-w-sm">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Current Password</label>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                value={pwForm.currentPassword}
                                                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">New Password</label>
                                            <Input
                                                type="password"
                                                placeholder="Min. 8 characters"
                                                value={pwForm.newPassword}
                                                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Confirm New Password</label>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                value={pwForm.confirmPassword}
                                                onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                            />
                                        </div>
                                        <Button
                                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                                            onClick={handlePasswordChange}
                                            disabled={pwLoading}
                                        >
                                            {pwLoading ? 'Updating...' : 'Update Password'}
                                        </Button>
                                    </div>

                                    <hr className="border-gray-100 dark:border-gray-800" />

                                    {/* 2FA Section */}
                                    {!twoFAEnabled && !twoFASetup && (
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                                                <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                                            </div>
                                            <Button variant="outline" onClick={handle2FASetup} disabled={twoFALoading}>
                                                {twoFALoading ? 'Setting up...' : 'Enable 2FA'}
                                            </Button>
                                        </div>
                                    )}

                                    {!twoFAEnabled && twoFASetup && (
                                        <div className="space-y-4">
                                            <p className="font-medium text-gray-900 dark:text-white">Scan with your authenticator app</p>
                                            <img src={twoFASetup.qrCode} alt="2FA QR Code" className="w-48 h-48 rounded-xl border" />
                                            <p className="text-sm text-gray-500">Or enter this code manually:</p>
                                            <code className="block text-sm bg-gray-100 dark:bg-slate-800 px-3 py-2 rounded-lg font-mono break-all">{twoFASetup.secret}</code>
                                            <div className="flex gap-3 max-w-sm">
                                                <Input
                                                    placeholder="Enter 6-digit code"
                                                    value={twoFAToken}
                                                    onChange={e => setTwoFAToken(e.target.value)}
                                                    maxLength={6}
                                                />
                                                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handle2FAVerify} disabled={twoFALoading}>
                                                    {twoFALoading ? 'Verifying...' : 'Verify & Enable'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {twoFAEnabled && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                                <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication is <span className="text-emerald-600">Enabled</span></p>
                                            </div>
                                            <p className="text-sm text-gray-500">To disable, enter your current authenticator code below.</p>
                                            <div className="flex gap-3 max-w-sm">
                                                <Input
                                                    placeholder="Enter 6-digit code"
                                                    value={twoFADisableToken}
                                                    onChange={e => setTwoFADisableToken(e.target.value)}
                                                    maxLength={6}
                                                />
                                                <Button variant="destructive" onClick={handle2FADisable} disabled={twoFALoading}>
                                                    {twoFALoading ? 'Disabling...' : 'Disable 2FA'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center text-lg">
                                                <Monitor className="w-5 h-5 mr-2 text-emerald-600" />
                                                Active Sessions
                                            </CardTitle>
                                            <CardDescription>Devices currently logged into your account.</CardDescription>
                                        </div>
                                        {sessions.length > 1 && (
                                            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50" onClick={handleRevokeAll}>
                                                <LogOut className="w-4 h-4 mr-1" /> Revoke All Others
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {sessionsLoading && (
                                            <p className="text-sm text-gray-500 text-center py-4">Loading sessions...</p>
                                        )}
                                        {!sessionsLoading && sessions.length === 0 && (
                                            <div className="text-center py-6 text-gray-500 text-sm">
                                                <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                                No active sessions found. Log in from a device to see it here.
                                            </div>
                                        )}
                                        {sessions.map((session, i) => (
                                            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center gap-4">
                                                    <Monitor className="w-8 h-8 text-gray-400" />
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                            {session.userAgent ? session.userAgent.slice(0, 60) : 'Unknown device'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {session.ipAddress || 'IP unknown'} · Last active {new Date(session.lastActiveAt).toLocaleString()}
                                                        </p>
                                                        {i === 0 && <span className="text-xs font-semibold text-emerald-600">Current session</span>}
                                                    </div>
                                                </div>
                                                {i !== 0 && (
                                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleRevokeSession(session.id)}>
                                                        Revoke
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
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
