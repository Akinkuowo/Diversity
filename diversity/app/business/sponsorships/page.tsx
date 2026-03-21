'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CircleDollarSign,
    Users,
    Plus,
    Search,
    BarChart3,
    Calendar,
    ArrowUpRight,
    TrendingUp,
    Heart,
    HandHeart,
    ShieldCheck,
    Globe,
    ChevronRight,
    MessageSquare,
    ExternalLink,
    Building2,
    DollarSign
} from 'lucide-react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

export default function BusinessSponsorshipsPage() {
    const [sponsorships, setSponsorships] = useState<any[]>([])
    const [projects, setProjects] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState<any>(null)
    const [sponsorshipForm, setSponsorshipForm] = useState({
        amount: '',
        message: ''
    })

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [sponsorshipData, projectsData, statsData] = await Promise.all([
                api.get('/businesses/me/sponsorships'),
                api.get('/community/projects/available'),
                api.get('/businesses/me/sponsorship-stats')
            ])
            setSponsorships(sponsorshipData)
            setProjects(projectsData)
            setStats(statsData)
        } catch (error) {
            console.error('Failed to fetch sponsorship data:', error)
            toast.error('Failed to load sponsorship dashboard')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSponsor = async () => {
        if (!sponsorshipForm.amount || parseFloat(sponsorshipForm.amount) <= 0) {
            return toast.error('Please enter a valid amount')
        }

        try {
            const response = await api.post('/businesses/me/sponsorships', {
                projectId: selectedProject.id,
                amount: sponsorshipForm.amount,
                message: sponsorshipForm.message
            })
            
            if (response.url) {
                toast.info('Redirecting to secure payment...')
                window.location.href = response.url
            } else {
                throw new Error('No checkout URL received')
            }
        } catch (error) {
            toast.error('Failed to initiate sponsorship payment')
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Philanthropic Impact</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Support community projects and track your corporate social contributions.
                        </p>
                    </div>
                </div>

                {/* Impact Charts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-3xl border-none shadow-sm bg-indigo-50 dark:bg-indigo-900/10 hover:bg-indigo-100/50 transition-colors">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-indigo-600">
                                    <CircleDollarSign className="w-6 h-6" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">${stats?.totalSponsored?.toLocaleString() || 0}</h3>
                            <p className="text-sm text-gray-500 font-medium">Total Lifetime Sponsorship</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-3xl border-none shadow-sm bg-violet-50 dark:bg-violet-900/10 hover:bg-violet-100/50 transition-colors">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-violet-600">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-violet-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.impactReach?.toLocaleString() || 0}</h3>
                            <p className="text-sm text-gray-500 font-medium">Estimated Community Reach</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-3xl border-none shadow-sm bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-100/50 transition-colors">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-emerald-600">
                                    <HandHeart className="w-6 h-6" />
                                </div>
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.uniqueProjects || 0}</h3>
                            <p className="text-sm text-gray-500 font-medium">Initiatives Supported</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                    {/* Active Sponsorships */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-primary-600" />
                                Active Sponsorships
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Ongoing commitments and contributions.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {sponsorships.map((s) => (
                                <Card key={s.id} className="rounded-2xl border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                                    <CardContent className="p-5 flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                            {s.project.image ? (
                                                <img src={s.project.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-primary-600">
                                                    <Heart className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 dark:text-white truncate">{s.project.title}</h4>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                <span className="font-semibold text-emerald-600">${s.amount.toLocaleString()}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(s.sponsoredAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1">
                                            {s.status}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}

                            {sponsorships.length === 0 && (
                                <div className="py-12 text-center bg-gray-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <CircleDollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">No active sponsorships yet.</p>
                                    <p className="text-sm text-gray-400">Discover projects on the right to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Discover Projects */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Search className="w-5 h-5 text-primary-600" />
                                Support New Causes
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Browse projects seeking corporate partners.</p>
                        </div>

                        <div className="space-y-4">
                            {projects.map((project) => (
                                <Card key={project.id} className="rounded-2xl border-gray-100 overflow-hidden hover:border-primary-200 transition-colors">
                                    <div className="h-32 bg-gray-100 dark:bg-slate-800 relative">
                                        {project.image && <img src={project.image} alt="" className="w-full h-full object-cover" />}
                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-white/90 backdrop-blur-md text-primary-700 border-none shadow-sm">
                                                {project.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-base font-bold line-clamp-1">{project.title}</CardTitle>
                                        <CardDescription className="text-xs line-clamp-2">{project.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2 space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold">
                                                <span className="text-gray-500">${project.raised.toLocaleString()} raised</span>
                                                <span className="text-primary-600">{Math.round((project.raised / project.goal) * 100)}%</span>
                                            </div>
                                            <Progress value={Math.min(100, (project.raised / project.goal) * 100)} className="h-1 bg-gray-100" />
                                        </div>
                                        <Button 
                                            className="w-full rounded-xl bg-gray-900 hover:bg-black text-white dark:bg-primary-600 dark:hover:bg-primary-700 font-bold h-10"
                                            onClick={() => {
                                                setSelectedProject(project)
                                                setIsSponsorModalOpen(true)
                                            }}
                                        >
                                            Sponsor Initiative
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sponsorship Modal */}
            <Dialog open={isSponsorModalOpen} onOpenChange={setIsSponsorModalOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Initiate Sponsorship</DialogTitle>
                        <DialogDescription>
                            Supporting: <span className="font-bold text-gray-900">{selectedProject?.title}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl flex items-start gap-3">
                            <HandHeart className="w-5 h-5 text-emerald-600 mt-1" />
                            <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                                Your sponsorship will directly fund this community project. Businesses that sponsor over $1,000 receive a 'Founding Sponsor' badge on their profile.
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Sponsorship Amount ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input 
                                    type="number"
                                    placeholder="e.g. 500" 
                                    value={sponsorshipForm.amount}
                                    onChange={e => setSponsorshipForm({...sponsorshipForm, amount: e.target.value})}
                                    className="pl-9 h-12 rounded-xl border-gray-200"
                                />
                            </div>
                            <div className="flex gap-2 pt-1">
                                {[250, 500, 1000, 2500].map(amt => (
                                    <button 
                                        key={amt}
                                        onClick={() => setSponsorshipForm({...sponsorshipForm, amount: amt.toString()})}
                                        className="text-[10px] bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full font-bold transition-colors"
                                    >
                                        ${amt.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Message for Project Organizers (Optional)</label>
                            <Textarea 
                                placeholder="Why are you sponsoring this project?" 
                                className="h-24 rounded-xl resize-none"
                                value={sponsorshipForm.message}
                                onChange={e => setSponsorshipForm({...sponsorshipForm, message: e.target.value})}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" className="rounded-xl" onClick={() => setIsSponsorModalOpen(false)}>Cancel</Button>
                        <Button 
                            className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-8 h-12 font-bold"
                            onClick={handleSponsor}
                        >
                            Confirm Sponsorship
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}
