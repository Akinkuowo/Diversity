'use client'

import { useState, useRef } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
    Image as ImageIcon,
    Smile,
    MapPin,
    X,
    Send,
    Loader2
} from 'lucide-react'
import { api } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import EmojiPicker from 'emoji-picker-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function CreatePostDialog({ user, onPostCreated }: { user: any, onPostCreated: (post: any) => void }) {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState('')
    const [location, setLocation] = useState('')
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isGettingLocation, setIsGettingLocation] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
            const data = await response.json()
            if (data.url) {
                setImageUrls(prev => [...prev, data.url])
            }
        } catch (error) {
            console.error('Upload failed:', error)
            toast({
                title: 'Upload Failed',
                description: 'Could not upload image. Please try again.',
                variant: 'destructive'
            })
        } finally {
            setIsUploading(false)
        }
    }

    const getLocation = () => {
        if (!navigator.geolocation) {
            toast({
                title: 'Error',
                description: 'Geolocation is not supported by your browser',
                variant: 'destructive'
            })
            return
        }

        setIsGettingLocation(true)
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords
                console.log('Fetching address for:', latitude, longitude)
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                if (!response.ok) throw new Error('Location service failed')

                const data = await response.json()
                if (data.display_name) {
                    const addressParts = data.display_name.split(',')
                    const address = addressParts.length > 3
                        ? addressParts.slice(0, 3).join(',')
                        : data.display_name
                    setLocation(address)
                    toast({
                        title: 'Location set',
                        description: `Pinned to ${address}`
                    })
                } else {
                    throw new Error('Address not found')
                }
            } catch (error: any) {
                console.error('Location fetch failed:', error)
                toast({
                    title: 'Location Error',
                    description: error.message || 'Could not resolve your address',
                    variant: 'destructive'
                })
            } finally {
                setIsGettingLocation(false)
            }
        }, (error) => {
            console.error('Location error:', error)
            setIsGettingLocation(false)
            let message = 'Could not get your position'
            if (error.code === 1) message = 'Location access denied'
            else if (error.code === 2) message = 'Position unavailable'
            else if (error.code === 3) message = 'Location request timed out'

            toast({
                title: 'Error',
                description: message,
                variant: 'destructive'
            })
        }, { timeout: 10000 })
    }

    const handleSubmit = async () => {
        if (!content.trim()) return

        console.log('Submitting post:', { content, location, images: imageUrls })
        setIsSubmitting(true)
        try {
            const post = await api.post('/posts', {
                content,
                location: location || null,
                images: imageUrls
            })
            toast({
                title: 'Success',
                description: 'Post created successfully!',
            })
            setContent('')
            setLocation('')
            setImageUrls([])
            setOpen(false)
            onPostCreated(post)
        } catch (error: any) {
            console.error('Failed to create post:', error)
            const errorMsg = error.response?.data?.message || error.message || 'Failed to create post. Please try again.'
            toast({
                title: 'Post Failed',
                description: errorMsg,
                variant: 'destructive'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const onEmojiClick = (emojiData: any) => {
        setContent(prev => prev + emojiData.emoji)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full justify-start text-gray-400 bg-gray-50/50 dark:bg-slate-800/50 border border-dashed border-gray-200 dark:border-slate-700 hover:bg-gray-100 hover:text-gray-600 transition-all rounded-xl h-12 font-normal">
                    Share something with your community...
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                <DialogHeader className="px-6 py-4 border-b bg-gray-50/50 dark:bg-slate-900/50">
                    <DialogTitle className="text-xl font-bold">Create Post</DialogTitle>
                </DialogHeader>
                <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-11 h-11 border-2 border-orange-100">
                            <AvatarImage src={user?.profile?.avatar} />
                            <AvatarFallback className="bg-orange-50 text-orange-600 font-bold">{user?.firstName?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-base font-bold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                            <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-none px-2 py-0 text-[10px] uppercase font-bold tracking-wider">
                                {user?.role?.toLowerCase().replace('_', ' ')}
                            </Badge>
                        </div>
                    </div>

                    {/* Previews (Location and Images) shown BEFORE content */}
                    {location && (
                        <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800/30 animate-in slide-in-from-top-2">
                            <div className="flex items-center text-sm text-green-700 dark:text-green-300">
                                <MapPin className="w-4 h-4 mr-2 text-green-500" />
                                <span className="font-medium">{location}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full hover:bg-green-100 dark:hover:bg-green-800/50" onClick={() => setLocation('')}>
                                <X className="w-3 h-3 text-green-600" />
                            </Button>
                        </div>
                    )}

                    {imageUrls.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
                            {imageUrls.map((url, idx) => (
                                <div key={idx} className="relative rounded-xl overflow-hidden border group aspect-video">
                                    <img src={url} alt="Post preview" className="w-full h-full object-cover" />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 w-7 h-7 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== idx))}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <Textarea
                        placeholder="What's on your mind? Share an update, ask a question, or celebrate an achievement..."
                        className="text-lg leading-relaxed placeholder:text-gray-300 min-h-[150px] border-none focus-visible:ring-0 shadow-none p-0"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="rounded-full border-gray-200 text-gray-600 hover:text-orange-500 hover:border-orange-200">
                                        <Smile className="w-4 h-4 mr-2" />
                                        Emoji
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 border-none w-auto" align="start">
                                    <EmojiPicker onEmojiClick={onEmojiClick} />
                                </PopoverContent>
                            </Popover>

                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-gray-200 text-gray-600 hover:text-blue-500 hover:border-blue-200"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                                {isUploading ? 'Uploading...' : 'Photo'}
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`rounded-full border-gray-200 text-gray-600 transition-all ${location ? 'text-green-600 border-green-200 bg-green-50' : 'hover:text-green-600 hover:border-green-200'}`}
                                        disabled={isGettingLocation}
                                    >
                                        {isGettingLocation ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
                                        {location ? 'Location Added' : 'Location'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-4 space-y-4 bg-white dark:bg-slate-900 shadow-xl border border-gray-100 dark:border-slate-800" align="start">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Add Location</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Choose how you want to add your location.
                                        </p>
                                    </div>
                                    <Button
                                        className="w-full justify-start gap-2"
                                        variant="secondary"
                                        onClick={getLocation}
                                        disabled={isGettingLocation}
                                    >
                                        <MapPin className="w-4 h-4" />
                                        {isGettingLocation ? 'Detecting...' : 'Detect my location'}
                                    </Button>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="e.g. London, UK"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="h-9"
                                        />
                                        <Button size="sm" onClick={() => {
                                            if (location.trim()) {
                                                toast({
                                                    title: 'Location set',
                                                    description: `Pinned to ${location}`
                                                })
                                            }
                                        }}>
                                            Set
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                <DialogFooter className="px-6 py-4 border-t bg-gray-50/50 dark:bg-slate-900/50">
                    <Button
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 rounded-xl font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                        disabled={!content.trim() || isSubmitting || isUploading}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Posting...
                            </>
                        ) : (
                            <>
                                Share Post
                                <Send className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
