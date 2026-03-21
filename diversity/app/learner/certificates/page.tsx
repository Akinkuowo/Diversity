'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Award,
    Download,
    Share2,
    Eye,
    ExternalLink,
    Search,
    Filter,
    Calendar,
    Shield,
    CheckCircle2,
    Building2,
    QrCode,
    ChevronRight,
    ArrowRight,
    TrendingUp,
    Sparkles,
    FileText,
    Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export default function LearnerCertificatesPage() {
    const [certificates, setCertificates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCert, setSelectedCert] = useState<any>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const data = await api.get('/learners/me/certificates')
                setCertificates(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('Failed to fetch certificates:', err)
                toast.error('Failed to load certificates')
            } finally {
                setLoading(false)
            }
        }
        fetchCertificates()
    }, [])

    const filteredCerts = certificates.filter(cert => 
        cert.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.verificationCode.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 text-white shadow-2xl">
                    <div className="relative z-10 space-y-6 max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="p-2 bg-amber-500/20 rounded-xl backdrop-blur-md">
                                <Award className="w-5 h-5 text-amber-400" />
                            </div>
                            <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">Professional Credentials</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
                            Your Diversity <span className="text-blue-500 underline decoration-blue-500/30">Milestones</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl">
                            Showcase your expertise in building inclusive workspaces. All certifications are verified and shareable globally.
                        </p>
                        
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl px-6 py-4 flex items-center gap-4">
                                <div className="p-3 bg-amber-500/20 rounded-2xl">
                                    <Star className="w-6 h-6 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Earned</p>
                                    <p className="text-2xl font-black">{certificates.length}</p>
                                </div>
                            </div>
                            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl px-6 py-4 flex items-center gap-4">
                                <div className="p-3 bg-blue-500/20 rounded-2xl">
                                    <TrendingUp className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-black tracking-widest">CPD Hours</p>
                                    <p className="text-2xl font-black">{certificates.reduce((acc, c) => acc + (c.course.cpdHours || 0), 0)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-0 mr-12 mb-12 w-64 h-64 bg-amber-600/10 rounded-full blur-[80px]" />
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="Search certificates by title or ID..."
                                className="pl-12 h-14 rounded-2xl border-slate-200 focus:ring-blue-500 text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-200 flex-shrink-0">
                            <Filter className="w-5 h-5 text-slate-500" />
                        </Button>
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        Total {filteredCerts.length} Achievements Found
                    </p>
                </div>

                {/* Certificates Grid */}
                {loading ? (
                    <div className="py-24 flex flex-col items-center gap-6">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-500 font-black animate-pulse uppercase tracking-widest">Retrieving your credentials...</p>
                    </div>
                ) : filteredCerts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCerts.map((cert) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -10 }}
                                className="group"
                            >
                                <Card className="h-full rounded-[2.5rem] overflow-hidden border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 flex flex-col bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
                                    <div className="relative h-56 bg-gradient-to-br from-slate-900 to-slate-800 p-8 flex flex-col items-center justify-center text-center overflow-hidden">
                                        {/* Certificate Preview Mockup */}
                                        <div className="relative z-10 space-y-2">
                                            <Award className="w-16 h-16 text-amber-500 mx-auto drop-shadow-lg" />
                                            <p className="text-[10px] font-black uppercase text-amber-400 tracking-[0.2em]">Verified Certification</p>
                                            <h4 className="text-white font-black text-xl line-clamp-2 leading-tight px-4">{cert.course.title}</h4>
                                        </div>
                                        {/* Decorative backgrounds */}
                                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                                            <div className="absolute top-0 left-0 w-32 h-32 border-[20px] border-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                                            <div className="absolute bottom-0 right-0 w-48 h-48 border-[1px] border-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
                                        </div>
                                    </div>
                                    
                                    <CardContent className="p-8 space-y-6 flex-1">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Issued By</p>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="rounded-lg border-2 font-black py-1">
                                                    {cert.course.authorBusiness?.companyName || 'Diversity Network'}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Issue Date</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Type</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                                                    CPD Accredited
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between border border-transparent group-hover:border-blue-100 transition-colors">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ID</p>
                                                <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">{cert.verificationCode}</p>
                                            </div>
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        </div>
                                    </CardContent>

                                    <CardFooter className="px-8 pb-8 pt-0 gap-3">
                                        <Button 
                                            className="flex-1 h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 shadow-lg"
                                            onClick={() => {
                                                setSelectedCert(cert)
                                                setIsDetailModalOpen(true)
                                            }}
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="h-12 w-12 rounded-2xl border-2 p-0"
                                            title="Download Certificate"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="h-12 w-12 rounded-2xl border-2 p-0"
                                            title="Share to LinkedIn"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] flex items-center justify-center mx-auto">
                            <Award className="w-12 h-12 text-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Certificates Yet</h3>
                            <p className="text-slate-500 max-w-sm mx-auto font-medium">Complete your active courses to earn official certifications and showcase your achievements.</p>
                        </div>
                        <Button className="rounded-2xl h-14 px-8 font-black gap-2 text-lg shadow-xl shadow-blue-500/20" onClick={() => (window.location.href = '/learner/courses')}>
                            Explore Courses
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Certificate Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="max-w-4xl p-0 rounded-[3rem] overflow-hidden border-none shadow-3xl">
                    {selectedCert && (
                        <div className="flex flex-col md:flex-row h-full">
                            {/* Visual Side */}
                            <div className="md:w-1/2 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                                <div className="relative z-10 space-y-4">
                                    <div className="w-20 h-20 bg-amber-500/20 rounded-[2rem] flex items-center justify-center backdrop-blur-md">
                                        <Award className="w-10 h-10 text-amber-500" />
                                    </div>
                                    <h2 className="text-3xl font-black leading-tight">Achievement <br /><span className="text-blue-500">Certificate</span></h2>
                                </div>

                                <div className="space-y-8 relative z-10 pt-12">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Program Mastered</p>
                                        <p className="text-xl font-black">{selectedCert.course.title}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Verify Authenticity</p>
                                        <div className="p-4 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10 flex items-center justify-between gap-4">
                                            <div className="w-16 h-16 bg-white rounded-xl p-1">
                                                <QrCode className="w-full h-full text-slate-900" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-bold text-slate-400 capitalize">Scan to verify or use ID:</p>
                                                <p className="text-xs font-mono font-black text-blue-400 mt-0.5">{selectedCert.verificationCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Abstract background */}
                                <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-600/30 rounded-full blur-[100px] translate-x-1/2" />
                            </div>

                            {/* Info Side */}
                            <div className="md:w-1/2 p-12 bg-white dark:bg-slate-900 flex flex-col justify-between">
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Details</h3>
                                        <p className="text-slate-500 font-medium">Verified credentials for professional use.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex gap-4 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800">
                                                <Building2 className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Accrediting Body</p>
                                                <p className="font-black text-slate-900 dark:text-white">
                                                    {selectedCert.course.authorBusiness?.companyName || 'Diversity Network HQ'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800">
                                                <FileText className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">CPD Recognition</p>
                                                <p className="font-black text-slate-900 dark:text-white">
                                                    Official Professional Credit
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mt-12">
                                    <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black text-lg gap-3 shadow-xl shadow-blue-500/20">
                                        <Download className="w-6 h-6" />
                                        Download PDF
                                    </Button>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1 h-14 rounded-2xl border-2 font-black gap-2">
                                            <Share2 className="w-5 h-5" />
                                            Share
                                        </Button>
                                        <Button variant="ghost" className="h-14 px-6 rounded-2xl font-black text-slate-500 uppercase tracking-widest text-xs" onClick={() => setIsDetailModalOpen(false)}>
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}
