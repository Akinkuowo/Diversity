'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    BookOpen,
    Download,
    Eye,
    Clock,
    Sparkles,
    ChevronRight,
    ArrowRight,
    FileText,
    Shield,
    Lightbulb,
    Presentation,
    Filter
} from 'lucide-react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ResourcesPage() {
    const [resources, setResources] = useState<any[]>([])
    const [meta, setMeta] = useState<{ categories: string[], types: string[] }>({ categories: [], types: [] })
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [userData, metaData] = await Promise.all([
                    api.get('/me'),
                    api.get('/resources/meta')
                ])
                setUser(userData)
                setMeta(metaData)
            } catch (err) {
                console.error('Failed to fetch initial data', err)
            }
        }
        fetchInitialData()
    }, [])

    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true)
            try {
                const data = await api.get(`/resources?category=${selectedCategory}&search=${searchTerm}`)
                setResources(data)
            } catch (err) {
                toast.error('Failed to load resources')
            } finally {
                setIsLoading(false)
            }
        }
        const debounce = setTimeout(fetchResources, 300)
        return () => clearTimeout(debounce)
    }, [selectedCategory, searchTerm])

    const getIconForType = (type: string) => {
        switch (type.toLowerCase()) {
            case 'research': return <BookOpen className="w-5 h-5" />
            case 'toolkit': return <Shield className="w-5 h-5" />
            case 'guide': return <Lightbulb className="w-5 h-5" />
            case 'presentation': return <Presentation className="w-5 h-5" />
            default: return <FileText className="w-5 h-5" />
        }
    }

    const handleAccess = async (resource: any) => {
        try {
            // Increment view count on backend
            await api.get(`/resources/${resource.id}`)

            // If it's a PDF or external link, open it
            if (resource.contentUrl) {
                window.open(resource.contentUrl, '_blank')
            } else {
                toast.info('Resource is being prepared for digital access.')
            }

            // Update local state to reflect new view count immediately
            setResources(prev => prev.map(r =>
                r.id === resource.id ? { ...r, views: r.views + 1 } : r
            ))
        } catch (err) {
            console.error('Failed to access resource', err)
            // toast.error('Could not access this resource at the moment.')
        }
    }

    const role = user?.role || 'COMMUNITY_MEMBER'

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Hero section */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] p-8 md:p-14 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />

                    <div className="relative z-10 max-w-3xl space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl text-sm font-semibold border border-white/20 shadow-inner"
                        >
                            <Sparkles className="w-4 h-4 text-primary-300" />
                            Knowledge & Growth
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl font-black leading-tight tracking-tight"
                        >
                            Community <span className="text-primary-300">Toolkits</span> & Research
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/70 text-lg md:text-xl font-medium max-w-xl"
                        >
                            Access our curated library of DE&I research, practical toolkits, and guides designed to drive measurable impact.
                        </motion.p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="sticky top-4 z-40 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-[2rem] shadow-xl border border-gray-100/50 dark:border-gray-800/50">
                    <div className="relative w-full md:w-[400px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search resources, topics, tags..."
                            className="pl-12 h-14 bg-gray-50/50 dark:bg-slate-800/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary-500/50 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide max-w-full">
                        <Button
                            variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setSelectedCategory('all')}
                            className={`rounded-xl px-4 h-10 font-bold transition-all ${selectedCategory === 'all' ? 'bg-primary-600 text-white' : 'text-gray-500'}`}
                        >
                            All Resources
                        </Button>
                        {meta.categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedCategory(cat)}
                                className={`rounded-xl px-4 h-10 font-bold transition-all ${selectedCategory === cat ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:text-primary-600'}`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-80 rounded-[2.5rem] bg-gray-100 dark:bg-slate-800 animate-pulse" />
                        ))
                    ) : resources.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            {resources.map((resource, i) => (
                                <motion.div
                                    key={resource.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                >
                                    <Card className="group h-full flex flex-col overflow-hidden rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800">
                                        <CardContent className="p-8 flex-1 flex flex-col">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className={`p-4 rounded-2xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 group-hover:scale-110 transition-transform duration-500`}>
                                                    {getIconForType(resource.type)}
                                                </div>
                                                <Badge className="bg-gray-50 dark:bg-slate-800 text-gray-500 border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                                                    {resource.category}
                                                </Badge>
                                            </div>

                                            <div className="space-y-4 flex-1">
                                                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">
                                                    {resource.title}
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400 font-medium line-clamp-3 leading-relaxed">
                                                    {resource.description}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-6">
                                                {resource.tags.slice(0, 3).map((tag: string) => (
                                                    <span key={tag} className="px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 text-[10px] font-bold">#{tag}</span>
                                                ))}
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-gray-400">
                                                    <div className="flex items-center gap-1.5 font-bold text-xs">
                                                        <Eye className="w-4 h-4" />
                                                        {resource.views}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 font-bold text-xs">
                                                        <Download className="w-4 h-4" />
                                                        {resource.downloads}
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAccess(resource)}
                                                    className="rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:scale-105 transition-transform"
                                                >
                                                    Access
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
                            <BookOpen className="w-20 h-20 mx-auto mb-6 text-gray-100" />
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">No resources found</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mt-2">Try adjusting your filters or search terms to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
