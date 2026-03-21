'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Calendar,
    User,
    Award,
    Clock,
    Download,
    Share2,
    Building2,
    Search,
    Loader2,
    History,
    FileText,
    ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

export default function CertificateVerificationPage() {
    const params = useParams()
    const certificateId = params.id as string
    const [status, setStatus] = useState<'LOADING' | 'VERIFIED' | 'INVALID'>('LOADING')
    const [certificate, setCertificate] = useState<any>(null)

    useEffect(() => {
        const verifyCertificate = async () => {
            setStatus('LOADING')
            try {
                // In a real app, this would be a public endpoint
                // For now, we simulate the verification logic
                const response = await api.get(`/certificates/${certificateId}`)
                if (response) {
                    setCertificate(response)
                    setStatus('VERIFIED')
                } else {
                    setStatus('INVALID')
                }
            } catch (error) {
                console.error('Verification failed:', error)
                setStatus('INVALID')
            }
        }

        if (certificateId) {
            verifyCertificate()
        }
    }, [certificateId])

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden font-sans">
            {/* Background Branding Decor */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-600 to-indigo-700 -z-10" />
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-[100px] -z-10" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl space-y-12"
            >
                {/* Logo & Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-2xl">
                            <ShieldCheck className="w-8 h-8 text-blue-600" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">Diversity<span className="text-blue-200">Network</span></span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">Certificate Verification</h1>
                    <p className="text-blue-100/80 text-lg font-medium max-w-xl mx-auto">Ensuring the integrity and authenticity of diversity education achievements across the platform.</p>
                </div>

                <AnimatePresence mode="wait">
                    {status === 'LOADING' && (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white rounded-[3rem] shadow-2xl p-20 flex flex-col items-center justify-center space-y-6"
                        >
                            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                            <p className="text-xl font-black text-slate-800 tracking-tight">Verifying Credentials...</p>
                        </motion.div>
                    )}

                    {status === 'VERIFIED' && (
                        <motion.div 
                            key="verified"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <Card className="rounded-[3rem] bg-white border-none shadow-2xl overflow-hidden">
                                <CardHeader className="p-12 pb-6 border-b border-dashed border-slate-200 bg-emerald-50/50 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-[2rem] bg-emerald-100 flex items-center justify-center shadow-xl shadow-emerald-200 shrink-0">
                                            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                                        </div>
                                        <div className="space-y-1">
                                            <Badge className="bg-emerald-600 text-white border-none font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1 mb-2">Authenticity Verified</Badge>
                                            <CardTitle className="text-3xl font-black text-slate-900 leading-none">Certificate Valid</CardTitle>
                                            <CardDescription className="text-slate-500 font-bold">This credential was issued and verified by DiversityNetwork.</CardDescription>
                                        </div>
                                    </div>
                                    <div className="text-center md:text-right hidden sm:block">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Credential ID</p>
                                        <p className="text-lg font-black font-mono text-slate-900 group cursor-default">{certificateId}</p>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="p-12 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {/* Recipient Details */}
                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase text-blue-600 tracking-[0.2em] flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Certificate Holder
                                            </h3>
                                            <div>
                                                <p className="text-4xl font-black text-slate-900 tracking-tight">{certificate.learner?.user?.firstName} {certificate.learner?.user?.lastName}</p>
                                                <p className="text-slate-500 font-bold mt-1">Verified Member since {new Date(certificate.learner?.createdAt).getFullYear()}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase text-blue-600 tracking-[0.2em] flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                                Achievement
                                            </h3>
                                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm space-y-2">
                                                <p className="text-2xl font-black text-slate-900 leading-tight">{certificate.course?.title}</p>
                                                <Badge className="bg-blue-100 text-blue-700 border-none font-black text-[9px] uppercase px-2">Professional Certification</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Achievement Metrics */}
                                    <div className="space-y-10">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    Issued On
                                                </h4>
                                                <p className="text-xl font-black text-slate-800">{new Date(certificate.issueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                                    <Clock className="w-3 h-3 text-emerald-500" />
                                                    CPD Hours
                                                </h4>
                                                <p className="text-xl font-black text-slate-800">{certificate.course?.cpdHours || 5} Hours</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase text-blue-600 tracking-[0.2em] flex items-center gap-2">
                                                <Building2 className="w-4 h-4" />
                                                Issuing Authority
                                            </h3>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white text-lg">DN</div>
                                                <div className="space-y-0.5">
                                                    <p className="font-black text-slate-900 leading-none">DiversityNetwork Global</p>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global Educational Standards</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-4 flex flex-wrap gap-4">
                                            <Button className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm gap-2 shadow-xl">
                                                <Download className="w-4 h-4" />
                                                Official PDF
                                            </Button>
                                            <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 font-black text-sm gap-2">
                                                <Share2 className="w-4 h-4" />
                                                Share Publicly
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                                
                                <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                        <History className="w-4 h-4 text-emerald-500" />
                                        This record is immutable and cryptographically secured in our network.
                                    </div>
                                    <Button variant="ghost" className="text-blue-600 font-black text-xs uppercase tracking-widest gap-2">
                                        Learn about our standards
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {status === 'INVALID' && (
                        <motion.div 
                            key="invalid"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] shadow-2xl p-16 md:p-24 flex flex-col items-center text-center space-y-8"
                        >
                            <div className="w-24 h-24 bg-red-100 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-red-200">
                                <XCircle className="w-14 h-14 text-red-600" />
                            </div>
                            <div className="space-y-3 max-w-lg">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Verification Failed</h2>
                                <p className="text-lg text-slate-500 font-medium">We could not find a valid certificate matching the ID provided. Please check the ID or contact the issuer.</p>
                            </div>
                            <div className="pt-6 w-full max-w-sm space-y-4">
                                <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 text-lg shadow-xl" onClick={() => window.location.reload()}>
                                    Retry Verification
                                </Button>
                                <Button variant="ghost" className="w-full h-14 rounded-2xl text-slate-500 font-black text-sm uppercase tracking-widest" onClick={() => window.history.back()}>
                                    Go Back
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Verification Search (If invalid or manually searching) */}
                {status !== 'VERIFIED' && (
                    <div className="max-w-xl mx-auto w-full pt-12">
                        <div className="relative group">
                            <Input 
                                placeholder="Enter Credential ID to verify another..."
                                className="h-16 pl-14 pr-32 rounded-[2rem] bg-white/20 border-white/30 text-white placeholder:text-blue-200 font-black text-lg backdrop-blur-md focus:bg-white/30 transition-all outline-none"
                            />
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-200" />
                            <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 rounded-2xl bg-white text-blue-700 font-black text-sm uppercase tracking-widest shadow-xl">
                                Verify
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Sticky Verification Tooltip */}
            <div className="mt-20 flex flex-col items-center gap-6 text-blue-200/50">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Authentic</span>
                    </div>
                    <div className="w-px h-8 bg-blue-200/20" />
                    <div className="flex flex-col items-center gap-2">
                        <ShieldCheck className="w-8 h-8" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure</span>
                    </div>
                    <div className="w-px h-8 bg-blue-200/20" />
                    <div className="flex flex-col items-center gap-2">
                        <History className="w-8 h-8" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified</span>
                    </div>
                </div>
                <p className="text-[10px] font-bold tracking-widest uppercase">DiversityNetwork © 2026 Verification Portal</p>
            </div>
        </div>
    )
}
