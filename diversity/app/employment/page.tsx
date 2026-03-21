'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Briefcase,
    Building2,
    MapPin,
    Clock,
    DollarSign,
    Search,
    Filter,
    ChevronRight,
    ArrowLeft,
    FileText,
    Send,
    CheckCircle,
    Info,
    Calendar,
    Star
} from 'lucide-react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export default function EmploymentBoardPage() {
    const [notices, setNotices] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedNotice, setSelectedNotice] = useState<any>(null)
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
    const [application, setApplication] = useState({
        resumeUrl: '',
        coverLetter: ''
    })

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const data = await api.get('/employment-notices')
                setNotices(data)
            } catch (error) {
                console.error('Failed to fetch notices:', error)
                toast.error('Failed to load job board')
            } finally {
                setIsLoading(false)
            }
        }
        fetchNotices()
    }, [])

    const handleApply = async () => {
        if (!selectedNotice) return

        try {
            await api.post(`/employment-notices/${selectedNotice.id}/apply`, application)
            toast.success('Application submitted successfully!')
            setIsApplyModalOpen(false)
            setApplication({ resumeUrl: '', coverLetter: '' })
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to submit application'
            toast.error(message)
        }
    }

    const filteredNotices = notices.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.business.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Hero / Header */}
                <div className="relative overflow-hidden rounded-3xl bg-primary-600 p-8 md:p-12 text-white shadow-2xl">
                    <div className="relative z-10 space-y-4 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none px-4 py-1">
                                <Star className="w-3 h-3 mr-2 inline" />
                                Diversity-Focused Opportunities
                            </Badge>
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Find Your Next Step with Inclusive Employers
                        </h1>
                        <p className="text-primary-100 text-lg md:text-xl">
                            Browse opportunities from businesses committed to diversity, equity, and inclusion.
                        </p>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 right-0 mr-20 mb-10 w-64 h-64 bg-secondary-500 rounded-full blur-3xl opacity-20" />
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input 
                            placeholder="Search by job title, company, or keywords..." 
                            className="pl-10 h-12 rounded-xl border-gray-200 dark:border-gray-800 focus:ring-primary-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-12 rounded-xl px-6 gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
                </div>

                {/* Job Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-64 rounded-2xl bg-gray-100 dark:bg-slate-900/50 animate-pulse border border-gray-200 dark:border-gray-800" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {filteredNotices.map((notice, index) => (
                                <motion.div
                                    key={notice.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="group h-full flex flex-col hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center p-2">
                                                        {notice.business.logo ? (
                                                            <img src={notice.business.logo} alt={notice.business.companyName} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <Building2 className="w-8 h-8 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl group-hover:text-primary-600 transition-colors">
                                                            {notice.title}
                                                        </CardTitle>
                                                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                                                            {notice.business.companyName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="bg-primary-50 text-primary-700 border-none">
                                                    {notice.type}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 space-y-4">
                                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    {notice.location || 'Remote'}
                                                </div>
                                                {notice.salary && (
                                                    <div className="flex items-center gap-1.5">
                                                        <DollarSign className="w-4 h-4 text-emerald-500" />
                                                        {notice.salary}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    Posted {new Date(notice.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm leading-relaxed">
                                                {notice.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-4">
                                                <Button 
                                                    variant="ghost" 
                                                    className="px-0 hover:bg-transparent text-primary-600 hover:text-primary-700 gap-1 group/btn"
                                                    onClick={() => {
                                                        setSelectedNotice(notice)
                                                        setIsApplyModalOpen(true)
                                                    }}
                                                >
                                                    View Details
                                                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                                </Button>
                                                <Button 
                                                    className="rounded-xl px-6 bg-primary-600 hover:bg-primary-700 text-white"
                                                    onClick={() => {
                                                        setSelectedNotice(notice)
                                                        setIsApplyModalOpen(true)
                                                    }}
                                                >
                                                    Apply Now
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredNotices.length === 0 && !isLoading && (
                            <div className="col-span-full py-20 text-center">
                                <div className="bg-gray-100 dark:bg-slate-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Briefcase className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No jobs found</h3>
                                <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                                    Try adjusting your search terms or filters to find what you're looking for.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Detailed View / Apply Modal */}
                <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
                    <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none rounded-3xl">
                        {selectedNotice && (
                            <div className="flex flex-col max-h-[90vh]">
                                <div className="bg-primary-600 p-8 text-white">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Building2 className="w-5 h-5 text-primary-200" />
                                                <span className="text-primary-100 font-medium">{selectedNotice.business.companyName}</span>
                                            </div>
                                            <h2 className="text-3xl font-bold">{selectedNotice.title}</h2>
                                            <div className="flex flex-wrap gap-4 text-sm text-primary-100 italic">
                                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{selectedNotice.location}</span>
                                                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" />{selectedNotice.type}</span>
                                                {selectedNotice.salary && <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" />{selectedNotice.salary}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white dark:bg-slate-950">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <Info className="w-5 h-5 text-primary-500" />
                                            Role Description
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                                            {selectedNotice.description}
                                        </p>
                                    </div>

                                    {selectedNotice.requirements && selectedNotice.requirements.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                Requirements
                                            </h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {selectedNotice.requirements.map((req: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                                                        {req}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                <Send className="w-5 h-5 text-primary-500" />
                                                Your Application
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Tell the employer why you're a great fit and your commitment to diversity.
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Resume Link (URL)</label>
                                                <Input 
                                                    placeholder="Link to your CV or portfolio" 
                                                    className="bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-gray-800"
                                                    value={application.resumeUrl}
                                                    onChange={e => setApplication({...application, resumeUrl: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Cover Letter / Note</label>
                                                <Textarea 
                                                    placeholder="Briefly introduce yourself..." 
                                                    className="h-32 bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-gray-800"
                                                    value={application.coverLetter}
                                                    onChange={e => setApplication({...application, coverLetter: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="p-8 pt-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-gray-800">
                                    <Button variant="ghost" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
                                    <Button 
                                        className="bg-primary-600 hover:bg-primary-700 text-white px-8 h-12 rounded-xl shadow-lg shadow-primary-500/20"
                                        onClick={handleApply}
                                    >
                                        Submit Application
                                    </Button>
                                </DialogFooter>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}
