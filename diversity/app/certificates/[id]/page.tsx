'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Award,
    Download,
    Share2,
    CheckCircle2,
    ShieldCheck,
    Calendar,
    ArrowLeft,
    Printer,
    ExternalLink,
    Building2,
    Users,
    Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function CertificatePage() {
    const params = useParams()
    const router = useRouter()
    const certificateId = params.id as string
    const [certificate, setCertificate] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const certificateRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const data = await api.get(`/certificates/${certificateId}`)
                setCertificate(data)
            } catch (err) {
                console.error('Failed to fetch certificate:', err)
                toast.error('Certificate not found or invalid')
            } finally {
                setLoading(false)
            }
        }
        fetchCertificate()
    }, [certificateId])

    const handlePrint = () => {
        window.print()
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Authenticating certificate...</p>
                </div>
            </div>
        )
    }

    if (!certificate) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
                <Card className="max-w-md w-full rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
                    <div className="bg-red-500 p-8 text-white text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">Invalid Certificate</h1>
                    </div>
                    <CardContent className="p-8 text-center">
                        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            This certificate could not be verified. It may have been revoked or the link is incorrect.
                        </p>
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl font-bold border-2"
                            onClick={() => router.push('/')}
                        >
                            Return Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const fullName = `${certificate.user.firstName} ${certificate.user.lastName}`
    const issueDate = new Date(certificate.issuedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-morphism p-4 rounded-3xl print:hidden">
                    <Button
                        variant="ghost"
                        className="rounded-xl font-bold gap-2 text-slate-600 hover:text-blue-600"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Learning
                    </Button>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            className="flex-1 sm:flex-none rounded-xl font-bold border-2 gap-2"
                            onClick={handlePrint}
                        >
                            <Printer className="w-4 h-4" />
                            Print Certificate
                        </Button>
                        <Button
                            className="flex-1 sm:flex-none rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-500/20"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </Button>
                    </div>
                </div>

                {/* Certificate Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <div
                        ref={certificateRef}
                        className={cn(
                            "aspect-[1.414/1] w-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden relative border-[12px] border-slate-100 dark:border-slate-800",
                            "print:border-none print:shadow-none print:rounded-none m-auto max-w-[1000px]"
                        )}
                    >
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full -ml-48 -mb-48 blur-3xl pointer-events-none" />

                        {/* Certificate Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-between p-12 sm:p-20 text-center">
                            {/* Logo and Institution */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                                        DN
                                    </div>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                        Diversity<span className="text-blue-600">Network</span>
                                    </span>
                                </div>
                                <div className="h-px w-24 bg-slate-200 dark:bg-slate-800 mx-auto" />
                                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                                    Professional Certification Board
                                </p>
                            </div>

                            {/* Main Text */}
                            <div className="space-y-8 sm:space-y-12 py-8 sm:py-0 w-full max-w-3xl">
                                <div className="space-y-2">
                                    <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                                        Certificate
                                    </h1>
                                    <p className="text-sm sm:text-lg font-bold text-slate-500 uppercase tracking-widest">
                                        of Achievement
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-widest">This is to certify that</p>
                                    <div className="relative inline-block">
                                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white px-8 py-2 border-b-4 border-blue-600">
                                            {fullName}
                                        </h2>
                                        <Sparkles className="absolute -top-4 -right-2 w-6 h-6 text-amber-400 animate-pulse" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-widest leading-relaxed">
                                        has successfully completed the professional course
                                    </p>
                                    <h3 className="text-xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 max-w-2xl mx-auto line-clamp-2">
                                        {certificate.course.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Footer Information */}
                            <div className="w-full flex flex-col sm:flex-row items-end justify-between gap-8 pt-8">
                                <div className="text-left space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Issued On</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{issueDate}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Partner Institution</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            {certificate.course.authorBusiness?.companyName || 'Diversity Network Faculty'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center sm:items-end gap-6 w-full sm:w-auto">
                                    {/* Verification Seal */}
                                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 dark:border-slate-800">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Verified Credential</p>
                                            <p className="text-[10px] font-mono font-bold text-slate-900 dark:text-white uppercase">
                                                ID: {certificate.verificationCode}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Signature Section */}
                                    <div className="text-center sm:text-right">
                                        <div className="mb-2 font-['Dancing_Script'] text-2xl sm:text-3xl text-slate-900 dark:text-white pr-4">
                                            Alex Thompson
                                        </div>
                                        <div className="h-px w-48 bg-slate-300 dark:bg-slate-700 ml-auto" />
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">
                                            Director of Education, Diversity Network
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-blue-600/20 rounded-tl-[3rem] pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-blue-600/20 rounded-br-[3rem] pointer-events-none" />
                        </div>
                    </div>
                </motion.div>

                {/* Additional Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
                    <Card className="rounded-[2rem] border-none shadow-xl bg-white dark:bg-slate-900">
                        <CardContent className="p-6 space-y-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">Share Achievement</h4>
                                <p className="text-sm text-slate-500">Post your success on LinkedIn, Twitter, or your profile.</p>
                            </div>
                            <Button variant="outline" className="w-full rounded-xl border-2 font-bold">
                                Share Externally
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-none shadow-xl bg-white dark:bg-slate-900">
                        <CardContent className="p-6 space-y-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">Verified Credential</h4>
                                <p className="text-sm text-slate-500">Employers can verify this certificate using the unique ID.</p>
                            </div>
                            <Button variant="ghost" className="w-full rounded-xl font-bold text-green-600 gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Verification Portal
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-none shadow-xl bg-white dark:bg-slate-900">
                        <CardContent className="p-6 space-y-4">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">What's Next?</h4>
                                <p className="text-sm text-slate-500">Explore advanced courses to further your DEI skills.</p>
                            </div>
                            <Button
                                className="w-full rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 font-bold"
                                onClick={() => router.push('/learner/courses')}
                            >
                                Browse Courses
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 0;
                    }
                    body {
                        background: white !important;
                        padding: 0 !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:border-none {
                        border: none !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:rounded-none {
                        border-radius: 0 !important;
                    }
                }
            `}</style>
        </div>
    )
}
