'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Shield,
    Mail,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    UserCircle,
    CheckCircle2,
    XCircle,
    Phone,
    MapPin,
    Calendar,
    Award,
    BookOpen,
    Briefcase,
    Heart,
    AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { api } from '@/lib/api'

interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    emailVerified: boolean
    createdAt: string
    profile?: {
        avatar?: string
        city?: string
        country?: string
    }
}

interface Meta {
    totalCount: number
    currentPage: number
    totalPages: number
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [meta, setMeta] = useState<Meta | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [page, setPage] = useState(1)

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [userDetails, setUserDetails] = useState<any>(null)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchUsers = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await api.get('/admin/users', {
                params: {
                    search: search || undefined,
                    role: roleFilter !== 'all' ? roleFilter : undefined,
                    page,
                    limit: 10
                }
            })
            setUsers(response.users)
            setMeta(response.meta)
        } catch (error: any) {
            console.error('Error fetching users:', error)
            toast.error('Failed to load users', {
                description: error.response?.data?.message || 'Please try again later.',
            })
        } finally {
            setIsLoading(false)
        }
    }, [search, roleFilter, page])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers()
        }, 500)
        return () => clearTimeout(timer)
    }, [fetchUsers])

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await api.patch(`/admin/users/${userId}`, { role: newRole })
            toast.success('Role updated successfully')
            fetchUsers()
        } catch (error: any) {
            toast.error('Failed to update role', {
                description: error.response?.data?.message || 'Operation failed.',
            })
        }
    }

    const handleDeleteUser = async () => {
        if (!userToDeleteId) return
        
        setIsDeleting(true)
        try {
            await api.delete(`/admin/users/${userToDeleteId}`)
            toast.success('User deleted successfully', {
                description: 'The user and all related records have been removed.'
            })
            setIsDeleteDialogOpen(false)
            setUserToDeleteId(null)
            fetchUsers()
        } catch (error: any) {
            console.error('Error deleting user:', error)
            toast.error('Failed to delete user', {
                description: error.response?.data?.message || 'Operation failed.',
            })
        } finally {
            setIsDeleting(false)
        }
    }
    const handleViewProfile = async (userId: string) => {
        setIsLoadingDetails(true)
        setSelectedUserId(userId)
        setIsProfileModalOpen(true)
        setUserDetails(null)
        
        try {
            const data = await api.get(`/admin/users/${userId}`)
            setUserDetails(data)
        } catch (error: any) {
            console.error('Error fetching user details:', error)
            toast.error('Failed to load profile details')
        } finally {
            setIsLoadingDetails(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary-500" />
                        User Management
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {meta?.totalCount || 0} total users registered on the platform
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => fetchUsers()} disabled={isLoading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <Select value={roleFilter} onValueChange={(val) => {
                        setRoleFilter(val)
                        setPage(1)
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="ADMIN">Administrator</SelectItem>
                            <SelectItem value="BUSINESS">Business</SelectItem>
                            <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                            <SelectItem value="LEARNER">Learner</SelectItem>
                            <SelectItem value="COMMUNITY_MEMBER">Community Member</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="animate-pulse">
                                        <TableCell><div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded" /></TableCell>
                                        <TableCell><div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded" /></TableCell>
                                        <TableCell><div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded" /></TableCell>
                                        <TableCell><div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded" /></TableCell>
                                        <TableCell><div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={user.profile?.avatar} />
                                                    <AvatarFallback className="bg-primary-100 text-primary-600 font-bold">
                                                        {user.firstName[0]}{user.lastName[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                        {user.firstName} {user.lastName}
                                                    </span>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-semibold px-2 py-0.5 border-primary-500/30 text-primary-600 bg-primary-50/50">
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.emailVerified ? (
                                                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Pending
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-500 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[200px]">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleViewProfile(user.id)}>
                                                        <UserCircle className="w-4 h-4 mr-2" />
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuLabel className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Change Role</DropdownMenuLabel>
                                                    {['ADMIN', 'VOLUNTEER', 'BUSINESS', 'LEARNER', 'COMMUNITY_MEMBER'].map((role) => (
                                                        <DropdownMenuItem 
                                                            key={role}
                                                            className={user.role === role ? 'bg-primary-50 text-primary-600' : ''}
                                                            onClick={() => handleRoleChange(user.id, role)}
                                                        >
                                                            {user.role === role && <Shield className="w-3 h-3 mr-2" />}
                                                            {role}
                                                        </DropdownMenuItem>
                                                    ))}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => { setUserToDeleteId(user.id); setIsDeleteDialogOpen(true); }} className="text-red-600">
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <Users className="w-12 h-12 text-gray-200" />
                                            <p className="text-gray-500 font-medium">No users found matching your search.</p>
                                            <Button variant="outline" size="sm" onClick={() => {
                                                setSearch('')
                                                setRoleFilter('all')
                                                setPage(1)
                                            }}>
                                                Clear all filters
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, meta.totalCount)} of {meta.totalCount} users
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: meta.totalPages }).map((_, i) => (
                                <Button
                                    key={i + 1}
                                    variant={page === i + 1 ? 'default' : 'outline'}
                                    size="sm"
                                    className="w-8 h-8 p-0"
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === meta.totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <UserCircle className="w-6 h-6 text-primary-500" />
                            User Profile Details
                        </DialogTitle>
                        <DialogDescription>
                            Detailed information for user {selectedUserId}
                        </DialogDescription>
                    </DialogHeader>

                    {isLoadingDetails ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <RefreshCw className="w-10 h-10 text-primary-500 animate-spin" />
                            <p className="text-gray-500 font-medium">Fetching profile details...</p>
                        </div>
                    ) : userDetails ? (
                        <div className="space-y-8 py-4">
                            {/* Header / Basic Info */}
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <Avatar className="w-24 h-24 border-4 border-primary-50">
                                    <AvatarImage src={userDetails.profile?.avatar} />
                                    <AvatarFallback className="text-2xl bg-primary-100 text-primary-700 font-bold">
                                        {userDetails.firstName?.[0]}{userDetails.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {userDetails.firstName} {userDetails.lastName}
                                        </h3>
                                        <Badge variant="outline" className="px-3 py-1 text-sm font-semibold capitalize">
                                            {userDetails.role.toLowerCase().replace('_', ' ')}
                                        </Badge>
                                        {userDetails.emailVerified ? (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                                                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">
                                                <XCircle className="w-3 h-3 mr-1" /> Pending
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-gray-500 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {userDetails.email}
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        {userDetails.profile?.phone && (
                                            <span className="flex items-center gap-1.5">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                {userDetails.profile.phone}
                                            </span>
                                        )}
                                        {userDetails.profile?.city && (
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                {userDetails.profile.city}, {userDetails.profile.country}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            Joined {new Date(userDetails.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="career">Career & Skills</TabsTrigger>
                                    <TabsTrigger value="activity">Platform Activity</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="overview" className="mt-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-xl space-y-3">
                                            <h4 className="font-bold flex items-center gap-2 text-primary-700">
                                                <UserCircle className="w-4 h-4" />
                                                Bio
                                            </h4>
                                            <p className="text-gray-600 text-sm leading-relaxed italic">
                                                {userDetails.profile?.bio || 'No bio provided for this user.'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-xl space-y-3">
                                            <h4 className="font-bold flex items-center gap-2 text-primary-700">
                                                <Award className="w-4 h-4" />
                                                Impact & Connections
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white p-3 rounded-lg text-center border">
                                                    <p className="text-2xl font-bold text-primary-600">
                                                        {userDetails.profile?.impactPoints || 0}
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-medium">Impact Points</p>
                                                </div>
                                                <div className="bg-white p-3 rounded-lg text-center border">
                                                    <p className="text-2xl font-bold text-secondary-600">
                                                        {userDetails.profile?.connections || 0}
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-medium">Connections</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {userDetails.business && (
                                        <div className="border border-primary-50 rounded-xl p-5 bg-primary-50/20">
                                            <h4 className="font-bold flex items-center gap-2 text-primary-800 mb-4">
                                                <Briefcase className="w-5 h-5 text-primary-600" />
                                                Business Details
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Company</p>
                                                    <p className="font-semibold text-gray-900">{userDetails.business.companyName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Industry</p>
                                                    <p className="font-semibold text-gray-900">{userDetails.business.industry}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                                    <Badge variant="outline">{userDetails.business.verificationStatus}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                                
                                <TabsContent value="career" className="mt-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="font-bold flex items-center gap-2 text-gray-800">
                                                <Award className="w-4 h-4 text-primary-500" />
                                                Skills
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {userDetails.profile?.skills?.length > 0 ? (
                                                    userDetails.profile.skills.map((skill: string) => (
                                                        <Badge key={skill} variant="secondary" className="bg-gray-100 font-medium text-gray-700">
                                                            {skill}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-400">No skills listed.</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="font-bold flex items-center gap-2 text-gray-800">
                                                <Heart className="w-4 h-4 text-pink-500" />
                                                Interests
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {userDetails.profile?.interests?.length > 0 ? (
                                                    userDetails.profile.interests.map((interest: string) => (
                                                        <Badge key={interest} variant="secondary" className="bg-gray-100 font-medium text-gray-700">
                                                            {interest}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-400">No interests listed.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-bold flex items-center gap-2 text-gray-800">
                                            <BookOpen className="w-4 h-4 text-blue-500" />
                                            Certificates
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {userDetails.certificates?.length > 0 ? (
                                                userDetails.certificates.map((cert: any) => (
                                                    <div key={cert.id} className="border p-3 rounded-lg flex items-center gap-3 bg-white hover:border-primary-200 transition-colors">
                                                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                                            <Award className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-gray-900">{cert.course?.title}</p>
                                                            <p className="text-xs text-gray-500">Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400">No certificates earned yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                                
                                <TabsContent value="activity" className="mt-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-gray-800">Course Enrollments</h4>
                                            <div className="space-y-3">
                                                {userDetails.enrollments?.length > 0 ? (
                                                    userDetails.enrollments.map((enr: any) => (
                                                        <div key={enr.id} className="bg-white border rounded-xl p-4 space-y-2">
                                                            <div className="flex justify-between items-start">
                                                                <p className="font-bold text-gray-900 text-sm leading-tight flex-1">{enr.course?.title}</p>
                                                                <Badge variant="outline" className="ml-2">{Math.round(enr.progress)}%</Badge>
                                                            </div>
                                                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                                <div 
                                                                    className="bg-primary-500 h-full rounded-full transition-all duration-500" 
                                                                    style={{ width: `${enr.progress}%` }} 
                                                                />
                                                            </div>
                                                            <p className="text-[10px] text-gray-400 font-medium">Enrolled: {new Date(enr.enrolledAt).toLocaleDateString()}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-400">No active course enrollments.</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-gray-800">Recent Achievements</h4>
                                            <div className="space-y-3">
                                                {userDetails.achievements?.length > 0 ? (
                                                    userDetails.achievements.map((ua: any) => (
                                                        <div key={ua.id} className="bg-white border rounded-xl p-4 flex items-center gap-3">
                                                            <div className="text-primary-500 bg-primary-50 p-2 rounded-full">
                                                                <Award className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900 text-sm">{ua.achievement?.name}</p>
                                                                <p className="text-xs text-gray-500">Awarded: {new Date(ua.awardedAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-400">No achievements recorded.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500 italic">
                            No user data found.
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Professional Deletion Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="bg-red-100 p-3 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl">Delete User Account?</DialogTitle>
                                <DialogDescription className="text-gray-500 mt-1">
                                    This action is permanent and cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Deleting this user will permanently remove their profile, business records, achievements, and all other associated data from the platform.
                        </p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting}
                            className="flex-1 sm:flex-none"
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 font-bold"
                        >
                            {isDeleting ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Account'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
