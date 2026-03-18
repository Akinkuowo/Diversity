'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Briefcase,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Clock,
    Award,
    ExternalLink,
    RefreshCw,
    Shield,
    Mail,
    Phone,
    MapPin,
    Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export default function BusinessManagement() {
    const [businesses, setBusinesses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    
    // Filters
    const [search, setSearch] = useState('')
    const [industryFilter, setIndustryFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [badgeFilter, setBadgeFilter] = useState('all')

    // Modal state
    const [selectedBusiness, setSelectedBusiness] = useState<any>(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const fetchBusinesses = useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await api.get('/admin/businesses', {
                params: {
                    page,
                    search,
                    industry: industryFilter,
                    status: statusFilter,
                    badge: badgeFilter
                }
            })
            setBusinesses(data.businesses)
            setTotal(data.total)
        } catch (error) {
            console.error('Error fetching businesses:', error)
            toast.error('Failed to load businesses')
        } finally {
            setIsLoading(false)
        }
    }, [page, search, industryFilter, statusFilter, badgeFilter])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBusinesses()
        }, 300)
        return () => clearTimeout(timer)
    }, [fetchBusinesses])

    const handleUpdateStatus = async (businessId: string, status: string) => {
        setIsUpdating(true)
        try {
            await api.patch(`/admin/businesses/${businessId}`, { verificationStatus: status })
            toast.success(`Business ${status.toLowerCase()} successfully`)
            fetchBusinesses()
            if (selectedBusiness?.id === businessId) {
                setIsDetailsModalOpen(false)
            }
        } catch (error) {
            toast.error('Failed to update status')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleUpdateBadge = async (businessId: string, badge: string) => {
        try {
            await api.patch(`/admin/businesses/${businessId}`, { badgeLevel: badge })
            toast.success('Badge level updated')
            fetchBusinesses()
        } catch (error) {
            toast.error('Failed to update badge')
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'VERIFIED':
                return <Badge className="bg-green-100 text-green-700 border-green-200">Verified</Badge>
            case 'PENDING':
                return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>
            case 'REJECTED':
                return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getBadgeStyle = (level: string) => {
        switch (level) {
            case 'CHAMPION':
                return 'bg-purple-100 text-purple-700 border-purple-200'
            case 'INCLUSION_PARTNER':
                return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'SUPPORTER':
                return 'bg-gray-100 text-gray-700 border-gray-200'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-primary-600" />
                        Business Management
                    </h1>
                    <p className="text-gray-500 mt-1">Verify and manage platform business partners</p>
                </div>
                <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-xl border border-primary-100">
                    <Building2 className="w-5 h-5 text-primary-600" />
                    <span className="text-primary-700 font-bold">{total}</span>
                    <span className="text-primary-600 text-sm">Registered</span>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative col-span-1 md:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Search businesses..." 
                        className="pl-10 h-10 border-gray-200 focus:ring-primary-500 rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger className="h-10 border-gray-200 rounded-lg">
                        <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-10 border-gray-200 rounded-lg">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="VERIFIED">Verified</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={badgeFilter} onValueChange={setBadgeFilter}>
                    <SelectTrigger className="h-10 border-gray-200 rounded-lg">
                        <SelectValue placeholder="Badge Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Badges</SelectItem>
                        <SelectItem value="CHAMPION">Champion</SelectItem>
                        <SelectItem value="INCLUSION_PARTNER">Partner</SelectItem>
                        <SelectItem value="SUPPORTER">Supporter</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-bold text-gray-700">Business</TableHead>
                            <TableHead className="font-bold text-gray-700">Industry</TableHead>
                            <TableHead className="font-bold text-gray-700">Status</TableHead>
                            <TableHead className="font-bold text-gray-700">Badge</TableHead>
                            <TableHead className="font-bold text-gray-700 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode='wait'>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
                                            <p className="text-gray-500 font-medium">Loading businesses...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : businesses.length > 0 ? (
                                businesses.map((business, index) => (
                                    <motion.tr 
                                        key={business.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50/50 transition-colors border-b last:border-0"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center border border-primary-100 overflow-hidden">
                                                    {business.logo ? (
                                                        <img src={business.logo} alt={business.companyName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Building2 className="w-5 h-5 text-primary-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{business.companyName}</p>
                                                    <p className="text-xs text-gray-500">{business.companyEmail}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-medium">{business.industry}</Badge>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(business.verificationStatus)}</TableCell>
                                        <TableCell>
                                            <Badge className={getBadgeStyle(business.badgeLevel)}>
                                                {business.badgeLevel}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                                                        <MoreVertical className="w-4 h-4 text-gray-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 p-1">
                                                    <DropdownMenuLabel className="text-[10px] uppercase text-gray-400 font-bold px-2 py-1.5Tracking-wider">Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedBusiness(business)
                                                        setIsDetailsModalOpen(true)
                                                    }}>
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuLabel className="text-[10px] uppercase text-gray-400 font-bold px-2 py-1.5 tracking-wider">Verification</DropdownMenuLabel>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleUpdateStatus(business.id, 'VERIFIED')}
                                                        disabled={business.verificationStatus === 'VERIFIED'}
                                                        className="text-green-600"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Verify Business
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleUpdateStatus(business.id, 'REJECTED')}
                                                        disabled={business.verificationStatus === 'REJECTED'}
                                                        className="text-red-600"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Reject Business
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuLabel className="text-[10px] uppercase text-gray-400 font-bold px-2 py-1.5 tracking-wider">Badge Level</DropdownMenuLabel>
                                                    {['SUPPORTER', 'INCLUSION_PARTNER', 'CHAMPION'].map((level) => (
                                                        <DropdownMenuItem 
                                                            key={level}
                                                            onClick={() => handleUpdateBadge(business.id, level)}
                                                            className={business.badgeLevel === level ? 'bg-primary-50 text-primary-600' : ''}
                                                        >
                                                            <Award className="w-4 h-4 mr-2" />
                                                            {level.replace('_', ' ')}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </motion.tr>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-50">
                                            <Briefcase className="w-12 h-12 text-gray-300" />
                                            <p className="text-gray-500">No businesses found matching your criteria.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Placeholder */}
            {total > 10 && (
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-bold text-gray-900">{businesses.length}</span> of <span className="font-bold text-gray-900">{total}</span>
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="rounded-lg h-8"
                        >
                            Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={businesses.length < 10}
                            onClick={() => setPage(p => p + 1)}
                            className="rounded-lg h-8"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
                <DialogContent className="max-w-2xl overflow-hidden p-0 rounded-3xl border-0 shadow-2xl">
                    {selectedBusiness && (
                        <div className="bg-white">
                            <div className="relative h-32 bg-gradient-to-r from-primary-600 to-indigo-600 p-6">
                                <div className="absolute -bottom-10 left-8">
                                    <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-xl border border-gray-100 overflow-hidden">
                                        <div className="w-full h-full rounded-xl bg-primary-50 flex items-center justify-center overflow-hidden">
                                            {selectedBusiness.logo ? (
                                                <img src={selectedBusiness.logo} alt={selectedBusiness.companyName} className="w-full h-full object-cover" />
                                            ) : (
                                                <Building2 className="w-8 h-8 text-primary-600" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4">
                                     {getStatusBadge(selectedBusiness.verificationStatus)}
                                </div>
                            </div>
                            
                            <div className="pt-14 px-8 pb-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedBusiness.companyName}</h2>
                                        <p className="text-primary-600 font-bold flex items-center gap-1.5">
                                            {selectedBusiness.industry}
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            {selectedBusiness.size} employees
                                        </p>
                                    </div>
                                    <Badge className={`${getBadgeStyle(selectedBusiness.badgeLevel)} py-1 px-3 text-xs`}>
                                        <Award className="w-3 h-3 mr-1.5" />
                                        {selectedBusiness.badgeLevel.replace('_', ' ')}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Contact Information</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                </div>
                                                {selectedBusiness.companyEmail}
                                            </div>
                                            {selectedBusiness.companyPhone && (
                                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    {selectedBusiness.companyPhone}
                                                </div>
                                            )}
                                            {selectedBusiness.address && (
                                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-left">
                                                        <MapPin className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <span className="leading-tight">{selectedBusiness.address}, {selectedBusiness.city}, {selectedBusiness.country}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Platform Activity</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                                                <p className="text-2xl font-black text-gray-900">{selectedBusiness._count.courses}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Courses</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                                                <p className="text-2xl font-black text-gray-900">{selectedBusiness._count.corporateVolunteering}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Project</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Business Owner</h3>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 border-2 border-white overflow-hidden">
                                             <Avatar>
                                                <AvatarImage src={selectedBusiness.user?.profile?.avatar} />
                                                <AvatarFallback className="bg-primary-500 text-white font-bold h-full w-full flex items-center justify-center">
                                                    {selectedBusiness.user?.firstName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{selectedBusiness.user?.firstName} {selectedBusiness.user?.lastName}</p>
                                            <p className="text-xs text-gray-500">{selectedBusiness.user?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="pt-6 border-t border-gray-100 flex gap-3">
                                    <div className="flex-1 flex gap-2">
                                        {selectedBusiness.verificationStatus === 'PENDING' && (
                                            <>
                                                <Button 
                                                    className="flex-1 bg-green-600 hover:bg-green-700 font-bold" 
                                                    onClick={() => handleUpdateStatus(selectedBusiness.id, 'VERIFIED')}
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                                    Verify
                                                </Button>
                                                <Button 
                                                    variant="destructive" 
                                                    className="flex-1 font-bold"
                                                    onClick={() => handleUpdateStatus(selectedBusiness.id, 'REJECTED')}
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        {selectedBusiness.verificationStatus === 'REJECTED' && (
                                            <Button 
                                                className="flex-1 bg-primary-600 hover:bg-primary-700 font-bold" 
                                                onClick={() => handleUpdateStatus(selectedBusiness.id, 'VERIFIED')}
                                                disabled={isUpdating}
                                            >
                                                Reconsider & Verify
                                            </Button>
                                        )}
                                        {selectedBusiness.verificationStatus === 'VERIFIED' && (
                                            <Button 
                                                variant="outline" 
                                                className="flex-1 text-red-600 border-red-200 hover:bg-red-50 font-bold"
                                                onClick={() => handleUpdateStatus(selectedBusiness.id, 'REJECTED')}
                                                disabled={isUpdating}
                                            >
                                                Revoke Verification
                                            </Button>
                                        )}
                                    </div>
                                    <Button variant="ghost" onClick={() => setIsDetailsModalOpen(false)} className="font-bold text-gray-400">Close</Button>
                                </DialogFooter>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
