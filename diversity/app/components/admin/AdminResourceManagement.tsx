'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, Search, Pencil, Trash2, X, Check, BookOpen,
    FileText, Video, Link as LinkIcon, Package, Globe,
    Eye, EyeOff, Download, ExternalLink, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { toast } from 'sonner'

// ─────────── types ───────────
interface Resource {
    id: string
    title: string
    description?: string
    type: string
    category: string
    fileUrl?: string
    content?: string
    language: string
    tags: string[]
    downloads: number
    views: number
    isPublished: boolean
    createdAt: string
    author: { firstName: string; lastName: string }
}

const RESOURCE_TYPES = ['ARTICLE', 'VIDEO', 'PDF', 'LINK', 'GUIDE', 'TEMPLATE', 'OTHER']
const RESOURCE_CATEGORIES = [
    'Diversity & Inclusion', 'Mental Health', 'Career Development', 'Legal & Compliance',
    'Leadership', 'Education', 'Wellbeing', 'Community', 'Technology', 'Finance', 'Other'
]
const TYPE_ICONS: Record<string, React.ElementType> = {
    ARTICLE: FileText, VIDEO: Video, PDF: FileText, LINK: LinkIcon,
    GUIDE: BookOpen, TEMPLATE: Package, OTHER: Globe,
}
const TYPE_COLORS: Record<string, string> = {
    ARTICLE: '#6366f1', VIDEO: '#f43f5e', PDF: '#f59e0b',
    LINK: '#22d3ee', GUIDE: '#10b981', TEMPLATE: '#a78bfa', OTHER: '#64748b',
}

// ─────────── form default ───────────
const EMPTY_FORM = {
    title: '', description: '', type: 'ARTICLE', category: 'Other',
    fileUrl: '', content: '', language: 'en', tags: '', isPublished: false,
}

// ─────────── modal ───────────
function ResourceModal({
    initial, onClose, onSaved
}: {
    initial?: Resource | null
    onClose: () => void
    onSaved: (r: Resource) => void
}) {
    const isEdit = !!initial
    const [form, setForm] = useState(initial ? {
        title: initial.title,
        description: initial.description || '',
        type: initial.type,
        category: initial.category,
        fileUrl: initial.fileUrl || '',
        content: initial.content || '',
        language: initial.language,
        tags: initial.tags.join(', '),
        isPublished: initial.isPublished,
    } : EMPTY_FORM)
    const [loading, setLoading] = useState(false)

    const set = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }))

    const handleSubmit = async () => {
        if (!form.title.trim()) return toast.error('Title is required')
        setLoading(true)
        try {
            const payload = {
                ...form,
                tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
            }
            const res = isEdit
                ? await api.put(`/admin/resources/${initial!.id}`, payload)
                : await api.post('/admin/resources', payload)
            toast.success(isEdit ? 'Resource updated' : 'Resource created')
            onSaved(res)
        } catch {
            toast.error('Failed to save resource')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="sticky top-0 bg-white dark:bg-slate-900 z-10 flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 rounded-t-3xl">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                        {isEdit ? 'Edit Resource' : 'Add New Resource'}
                    </h2>
                    <button onClick={onClose} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Title *</label>
                        <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Resource title…" className="rounded-xl" />
                    </div>

                    {/* Type + Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Type *</label>
                            <select value={form.type} onChange={e => set('type', e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Category *</label>
                            <select value={form.category} onChange={e => set('category', e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                {RESOURCE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                        <textarea value={form.description} onChange={e => set('description', e.target.value)}
                            rows={3} placeholder="Brief description…"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>

                    {/* File URL */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">File / External URL</label>
                        <Input value={form.fileUrl} onChange={e => set('fileUrl', e.target.value)} placeholder="https://…" className="rounded-xl" />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Content (optional)</label>
                        <textarea value={form.content} onChange={e => set('content', e.target.value)}
                            rows={4} placeholder="Inline content or notes…"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>

                    {/* Tags + Language */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tags (comma-separated)</label>
                            <Input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="inclusion, leadership…" className="rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Language</label>
                            <select value={form.language} onChange={e => set('language', e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                <option value="en">English</option>
                                <option value="fr">French</option>
                                <option value="es">Spanish</option>
                                <option value="de">German</option>
                                <option value="pt">Portuguese</option>
                                <option value="yo">Yoruba</option>
                                <option value="ig">Igbo</option>
                            </select>
                        </div>
                    </div>

                    {/* Publish toggle */}
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                        <button
                            type="button"
                            onClick={() => set('isPublished', !form.isPublished)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-6' : ''}`} />
                        </button>
                        <div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{form.isPublished ? 'Published' : 'Draft'}</p>
                            <p className="text-xs text-slate-500">{form.isPublished ? 'Visible to all users' : 'Only visible to admins'}</p>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white dark:bg-slate-900 p-6 border-t border-slate-100 dark:border-slate-800 flex gap-3 rounded-b-3xl">
                    <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSubmit} disabled={loading}>
                        {loading ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : isEdit ? 'Save Changes' : 'Create Resource'}
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}

// ─────────── delete confirm ───────────
function DeleteConfirm({ resource, onClose, onDeleted }: { resource: Resource; onClose: () => void; onDeleted: (id: string) => void }) {
    const [loading, setLoading] = useState(false)
    const doDelete = async () => {
        setLoading(true)
        try {
            await api.delete(`/admin/resources/${resource.id}`)
            toast.success('Resource deleted')
            onDeleted(resource.id)
        } catch {
            toast.error('Delete failed')
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-8 text-center"
            >
                <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Delete Resource?</h3>
                <p className="text-slate-500 text-sm mb-6">
                    <strong className="text-slate-700 dark:text-slate-300">{resource.title}</strong> will be permanently removed.
                </p>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white" onClick={doDelete} disabled={loading}>
                        {loading ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Delete'}
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}

// ─────────── main component ───────────
export default function AdminResourceManagement() {
    const [resources, setResources] = useState<Resource[]>([])
    const [filtered, setFiltered] = useState<Resource[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [filterPublished, setFilterPublished] = useState('all')
    const [modal, setModal] = useState<'create' | 'edit' | null>(null)
    const [editing, setEditing] = useState<Resource | null>(null)
    const [deleting, setDeleting] = useState<Resource | null>(null)

    const fetchResources = async () => {
        setLoading(true)
        try {
            const data = await api.get('/admin/resources')
            setResources(data)
        } catch {
            toast.error('Failed to load resources')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchResources() }, [])

    useEffect(() => {
        let list = [...resources]
        if (search) list = list.filter(r =>
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.description?.toLowerCase().includes(search.toLowerCase()) ||
            r.category.toLowerCase().includes(search.toLowerCase())
        )
        if (filterType !== 'all') list = list.filter(r => r.type === filterType)
        if (filterPublished !== 'all') list = list.filter(r => r.isPublished === (filterPublished === 'published'))
        setFiltered(list)
    }, [resources, search, filterType, filterPublished])

    const handleSaved = (saved: Resource) => {
        setResources(prev => {
            const exists = prev.find(r => r.id === saved.id)
            return exists ? prev.map(r => r.id === saved.id ? saved : r) : [saved, ...prev]
        })
        setModal(null)
        setEditing(null)
    }

    const handleDeleted = (id: string) => {
        setResources(prev => prev.filter(r => r.id !== id))
        setDeleting(null)
    }

    const published = resources.filter(r => r.isPublished).length
    const drafts = resources.filter(r => !r.isPublished).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Resources</h1>
                    <p className="text-slate-500 text-sm mt-0.5 font-medium">
                        {resources.length} total · <span className="text-emerald-600">{published} published</span> · <span className="text-amber-500">{drafts} drafts</span>
                    </p>
                </div>
                <Button onClick={() => setModal('create')} className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 gap-2 shadow-lg shadow-indigo-200 dark:shadow-none">
                    <Plus className="w-4 h-4" /> Add Resource
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search resources…" value={search} onChange={e => setSearch(e.target.value)}
                        className="pl-11 rounded-2xl h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
                </div>
                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                    className="h-11 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option value="all">All Types</option>
                    {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={filterPublished} onChange={e => setFilterPublished(e.target.value)}
                    className="h-11 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-slate-400">
                    <span>Resource</span>
                    <span className="hidden md:block">Category</span>
                    <span className="hidden md:block">Stats</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>

                {loading ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-1/2" />
                                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <BookOpen className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                        <p className="font-bold text-slate-500">No resources found</p>
                        <p className="text-sm text-slate-400 mt-1">Add your first resource using the button above</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filtered.map((r, i) => {
                            const Icon = TYPE_ICONS[r.type] || Globe
                            const color = TYPE_COLORS[r.type] || '#64748b'
                            return (
                                <motion.div
                                    key={r.id}
                                    layout
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.2, delay: i * 0.03 }}
                                    className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                >
                                    {/* Name + meta */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: color + '18' }}>
                                            <Icon className="w-5 h-5" style={{ color }} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{r.title}</p>
                                            <p className="text-xs text-slate-400 truncate max-w-[260px]">{r.description || '—'}</p>
                                            {r.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {r.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] rounded-md font-medium">#{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div className="hidden md:block">
                                        <Badge variant="outline" className="rounded-xl text-xs font-bold whitespace-nowrap">{r.category}</Badge>
                                    </div>

                                    {/* Stats */}
                                    <div className="hidden md:flex flex-col items-end text-xs text-slate-400 font-medium gap-1">
                                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{r.views}</span>
                                        <span className="flex items-center gap-1"><Download className="w-3 h-3" />{r.downloads}</span>
                                    </div>

                                    {/* Published badge */}
                                    <div>
                                        {r.isPublished ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                                                <Check className="w-3 h-3" /> Live
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
                                                <EyeOff className="w-3 h-3" /> Draft
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1">
                                        {r.fileUrl && (
                                            <a href={r.fileUrl} target="_blank" rel="noreferrer"
                                                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => { setEditing(r); setModal('edit') }}
                                            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setDeleting(r)}
                                            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {(modal === 'create' || modal === 'edit') && (
                    <ResourceModal
                        initial={modal === 'edit' ? editing : null}
                        onClose={() => { setModal(null); setEditing(null) }}
                        onSaved={handleSaved}
                    />
                )}
                {deleting && (
                    <DeleteConfirm
                        resource={deleting}
                        onClose={() => setDeleting(null)}
                        onDeleted={handleDeleted}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
