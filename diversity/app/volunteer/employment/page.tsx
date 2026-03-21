'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Briefcase,
    Search,
    Filter,
    MapPin,
    DollarSign,
    Clock,
    Building2,
    CheckCircle2,
    XCircle,
    ChevronRight,
    FileText,
    ArrowUpRight,
    History,
    Loader2,
    Calendar,
    Send
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function VolunteerEmploymentPage() {
    const [notices, setNotices] = useState<any[]>([])
    const [applications, setApplications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('browse')
    const [searchQuery, setSearchQuery] = useState('')
    
    // Apply Modal state
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
    const [selectedJob, setSelectedJob] = useState<any>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        resumeUrl: '',
        coverLetter: ''
    })

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [noticesData, applicationsData] = await Promise.all([
                api.get('/employment-notices'),
                api.get('/volunteers/me/applications')
            ])
            setNotices(noticesData)
            setApplications(applicationsData)
        } catch (err: any) {
            console.error('Failed to fetch employment data:', err)
            toast.error('Failed to load job listings')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedJob) return

        setIsSubmitting(true)
        try {
            await api.post(`/employment-notices/${selectedJob.id}/apply`, formData)
            toast.success(`Application sent to ${selectedJob.business.companyName}!`)
            setIsApplyModalOpen(false)
            setFormData({ resumeUrl: '', coverLetter: '' })
            fetchData()
            setActiveTab('applications')
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to submit application')
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredNotices = notices.filter(notice =>
        notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.business.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.location?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const statusColors: Record<string, { bg: string, text: string }> = {
        PENDING: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
        REVIEWING: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
        ACCEPTED: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
        REJECTED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Career Opportunities</h1>
                        <p className="text-muted-foreground mt-1">
                            Browse roles from inclusive businesses committed to diversity.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by job, company, or city..."
                                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-gray-100/50 dark:bg-slate-800/50 p-1 rounded-2xl w-fit">
                        <TabsTrigger value="browse" className="rounded-xl px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                            <Briefcase className="w-4 h-4 mr-2" />
                            Browse Jobs
                        </TabsTrigger>
                        <TabsTrigger value="applications" className="rounded-xl px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                            <History className="w-4 h-4 mr-2" />
                            My Applications
                            {applications.length > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-primary-100 text-primary-700 border-none px-1.5 py-0">
                                    {applications.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="browse" className="m-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                                <p className="text-muted-foreground">Fetching latest opportunities...</p>
                            </div>
                        ) : filteredNotices.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredNotices.map((job, index) => {
                                    const hasApplied = applications.some(a => a.noticeId === job.id)
                                    return (
                                        <motion.div
                                            key={job.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card className="h-full group hover:shadow-xl hover:shadow-primary-100/20 transition-all border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden flex flex-col">
                                                <CardHeader className="pb-2">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ring-1 ring-gray-100">
                                                            {job.business.logo ? (
                                                                <img src={job.business.logo} alt={job.business.companyName} className="w-8 h-8 object-contain" />
                                                            ) : (
                                                                <Building2 className="w-6 h-6 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <Badge variant="outline" className="rounded-lg text-[10px] uppercase font-bold tracking-wider py-0.5 border-gray-200">
                                                            {job.type}
                                                        </Badge>
                                                    </div>
                                                    <CardTitle className="text-lg group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                                                        {job.title}
                                                    </CardTitle>
                                                    <CardDescription className="text-sm font-medium text-primary-600/80">
                                                        {job.business.companyName}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="flex-1 space-y-4">
                                                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            {job.location || 'Remote'}
                                                        </div>
                                                        {job.salary && (
                                                            <div className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-gray-100">
                                                                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                                                                {job.salary}
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {new Date(job.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                        {job.description}
                                                    </p>
                                                    <div className="pt-4 mt-auto">
                                                        <Button 
                                                            className={cn(
                                                                "w-full rounded-2xl font-bold h-11 transition-all",
                                                                hasApplied ? "bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-100" : "bg-primary-600 hover:bg-primary-700 text-white"
                                                            )}
                                                            onClick={() => {
                                                                if (!hasApplied) {
                                                                    setSelectedJob(job)
                                                                    setIsApplyModalOpen(true)
                                                                }
                                                            }}
                                                            disabled={hasApplied}
                                                        >
                                                            {hasApplied ? (
                                                                <><CheckCircle2 className="w-4 h-4 mr-2" /> Application Sent</>
                                                            ) : (
                                                                <><Send className="w-4 h-4 mr-2" /> Apply Now</>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 text-center px-4">
                                <div className="w-16 h-16 rounded-3xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-6">
                                    <Briefcase className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No jobs matching "{searchQuery}"</h3>
                                <p className="text-muted-foreground max-w-sm mb-6">
                                    Check back soon or try adjusting your filters to find new opportunities.
                                </p>
                                <Button variant="outline" className="rounded-xl" onClick={() => setSearchQuery('')}>Clear Search</Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="applications" className="m-0">
                        {applications.length > 0 ? (
                            <div className="space-y-4">
                                {applications.map((app, index) => {
                                    const colors = statusColors[app.status] || statusColors.PENDING
                                    return (
                                        <motion.div
                                            key={app.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card className="rounded-3xl border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="flex flex-col md:flex-row items-center p-5 md:p-6 gap-6">
                                                    <div className="w-full md:w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                                                        {app.notice.business.logo ? (
                                                            <img src={app.notice.business.logo} alt={app.notice.business.companyName} className="w-10 h-10 object-contain" />
                                                        ) : (
                                                            <Building2 className="w-8 h-8 text-gray-300" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 w-full text-center md:text-left space-y-1">
                                                        <h3 className="text-lg font-bold uppercase tracking-tight line-clamp-1">{app.notice.title}</h3>
                                                        <p className="text-sm font-medium text-primary-600">{app.notice.business.companyName}</p>
                                                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-muted-foreground mt-2">
                                                            <span className="flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                Applied: {new Date(app.createdAt).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <FileText className="w-3.5 h-3.5" />
                                                                Status Updated: {new Date(app.updatedAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row md:flex-col items-center gap-4 shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                                        <Badge className={cn("rounded-xl px-4 py-1.5 text-xs font-bold border-none", colors.bg, colors.text)}>
                                                            {app.status}
                                                        </Badge>
                                                        <Button variant="ghost" size="sm" className="hidden md:flex rounded-xl font-medium text-xs">
                                                            View Details <ChevronRight className="w-4 h-4 ml-1" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 text-center px-4">
                                <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/10 flex items-center justify-center mb-6">
                                    <Send className="w-10 h-10 text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">No applications yet</h3>
                                <p className="text-muted-foreground max-w-sm mb-6">
                                    You haven't applied to any positions yet. Start your journey by browsing available roles in Browse Jobs.
                                </p>
                                <Button className="bg-primary-600 text-white rounded-2xl h-12 px-8" onClick={() => setActiveTab('browse')}>
                                    Start Searching
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Apply Modal */}
            <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-primary-600 p-6 text-white relative">
                        <DialogTitle className="text-2xl font-bold">Submit Application</DialogTitle>
                        <DialogDescription className="text-primary-100 mt-1">
                            Apply for {selectedJob?.title} at {selectedJob?.business.companyName}
                        </DialogDescription>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    </div>
                    <form onSubmit={handleApply} className="p-6 space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary-600" />
                                Resume URL
                            </label>
                            <Input
                                placeholder="https://linkedin.com/in/profile or google drive link"
                                className="rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all h-12"
                                value={formData.resumeUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, resumeUrl: e.target.value }))}
                                required
                            />
                            <p className="text-[10px] text-muted-foreground px-1">Ensure the link is publicly accessible for the hiring team.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Send className="w-4 h-4 text-primary-600" />
                                Cover Letter (Optional)
                            </label>
                            <Textarea
                                placeholder="Why are you the perfect fit for this diversity-focused role?"
                                className="rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all min-h-[150px] text-sm"
                                value={formData.coverLetter}
                                onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                            />
                        </div>
                        <DialogFooter className="pt-2">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setIsApplyModalOpen(false)}
                                className="rounded-xl flex-1 h-12"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-200 flex-[2] h-12"
                            >
                                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : "Submit Application"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}
