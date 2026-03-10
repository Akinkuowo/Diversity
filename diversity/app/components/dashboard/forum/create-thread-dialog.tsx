'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Send, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface CreateThreadDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    categories: any[]
    onThreadCreated: (thread: any) => void
}

export function CreateThreadDialog({ isOpen, onOpenChange, categories, onThreadCreated }: CreateThreadDialogProps) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('')
    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault()
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()])
            }
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim() || !category) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsSubmitting(true)
        try {
            const newThread = await api.post('/forum/posts', {
                title,
                content,
                category,
                tags
            })
            toast.success('Discussion thread created!')
            onThreadCreated(newThread)
            onOpenChange(false)
            // Reset form
            setTitle('')
            setContent('')
            setCategory('')
            setTags([])
        } catch (err) {
            toast.error('Failed to create thread')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-slate-900">
                <div className="h-2 bg-gradient-to-r from-primary-400 to-primary-600" />

                <div className="p-8 space-y-6">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-950/30 text-primary-600">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-primary-200 text-primary-600 bg-primary-50/50">New Discussion</Badge>
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Start a Conversation</DialogTitle>
                        <DialogDescription className="text-gray-500 font-medium text-base">
                            Share your thoughts, ask questions, or start a debate with the community.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Title</label>
                            <Input
                                placeholder="What's on your mind?"
                                className="h-14 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50 border-none focus-visible:ring-2 focus-visible:ring-primary-500/50 transition-all font-bold text-lg"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Category</label>
                                <Select onValueChange={setCategory} value={category}>
                                    <SelectTrigger className="h-14 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-primary-500/50 transition-all font-bold">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-xl">
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.name} className="rounded-xl font-bold py-3">
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Tags (Press Enter)</label>
                                <Input
                                    placeholder="e.g. accessibility, career"
                                    className="h-14 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50 border-none focus-visible:ring-2 focus-visible:ring-primary-500/50 transition-all font-bold"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                />
                            </div>
                        </div>

                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1 transition-all">
                                {tags.map((tag) => (
                                    <Badge key={tag} className="bg-gray-100 dark:bg-slate-800 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors border-none py-1.5 px-3 rounded-xl font-bold group">
                                        #{tag}
                                        <X className="w-3 h-3 ml-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeTag(tag)} />
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Content</label>
                            <Textarea
                                placeholder="Tell us more about it..."
                                className="min-h-[180px] rounded-[1.5rem] bg-gray-50/50 dark:bg-slate-800/50 border-none focus-visible:ring-2 focus-visible:ring-primary-500/50 transition-all font-medium p-6 text-lg resize-none shadow-inner"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-2xl h-14 px-8 font-bold text-gray-500"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="rounded-2xl h-14 px-10 bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-lg shadow-primary-500/20 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            {isSubmitting ? 'Posting...' : 'Create Discussion'}
                            {!isSubmitting && <Send className="w-4 h-4 ml-1" />}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
