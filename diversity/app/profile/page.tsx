'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
    User,
    Mail,
    MapPin,
    Phone,
    Briefcase,
    Star,
    Globe,
    Edit2,
    Save,
    X,
    Camera,
    CheckCircle,
    Users
} from 'lucide-react'
import { DashboardLayout } from '../components/dashboard/layout'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Edit State
    const [editForm, setEditForm] = useState({
        bio: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        skills: '', // Commas separated string for editing
        interests: '', // Commas separated string for editing
        languages: '', // Commas separated string for editing
        avatar: ''
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            setIsLoading(true)
            const data = await api.get('/users/me/profile')
            setUser(data)
            setProfile(data.profile || {})

            // Initialize edit form
            const existingProfile = data.profile || {}
            setEditForm({
                bio: existingProfile.bio || '',
                phone: existingProfile.phone || '',
                address: existingProfile.address || '',
                city: existingProfile.city || '',
                country: existingProfile.country || '',
                skills: existingProfile.skills?.join(', ') || '',
                interests: existingProfile.interests?.join(', ') || '',
                languages: existingProfile.languages?.join(', ') || '',
                avatar: existingProfile.avatar || ''
            })
        } catch (error) {
            console.error('Failed to fetch profile:', error)
            toast.error('Failed to load profile')
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            toast.loading('Uploading avatar...')
            const formData = new FormData()
            formData.append('file', file)

            // 1. Upload to storage
            const response = await api.upload('/upload', formData)
            const newAvatarUrl = response.url

            // 2. Update local edit form state
            setEditForm(prev => ({ ...prev, avatar: newAvatarUrl }))

            // 3. Immediately save to backend so it persists on refresh
            const payload = {
                ...editForm,
                avatar: newAvatarUrl,
                skills: editForm.skills ? editForm.skills.split(',').map(s => s.trim()).filter(s => s) : [],
                interests: editForm.interests ? editForm.interests.split(',').map(s => s.trim()).filter(s => s) : [],
                languages: editForm.languages ? editForm.languages.split(',').map(s => s.trim()).filter(s => s) : []
            }
            const updatedProfile = await api.put('/users/me/profile', payload)

            // 4. Update the base profile state so View Mode gets the new avatar immediately
            setProfile(updatedProfile)

            toast.dismiss()
            toast.success('Avatar uploaded successfully')
        } catch (error) {
            console.error('Failed to upload image:', error)
            toast.dismiss()
            toast.error('Failed to upload avatar')
        }
    }

    const handleSave = async () => {
        try {
            // Convert comma-separated strings back to arrays
            const payload = {
                ...editForm,
                skills: editForm.skills.split(',').map(s => s.trim()).filter(s => s),
                interests: editForm.interests.split(',').map(s => s.trim()).filter(s => s),
                languages: editForm.languages.split(',').map(s => s.trim()).filter(s => s)
            }

            const updatedProfile = await api.put('/users/me/profile', payload)
            setProfile(updatedProfile)
            setIsEditing(false)
            toast.success('Profile updated successfully')
        } catch (error) {
            console.error('Failed to update profile:', error)
            toast.error('Failed to save profile changes')
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        // Reset form to what was last fetched
        setEditForm({
            bio: profile?.bio || '',
            phone: profile?.phone || '',
            address: profile?.address || '',
            city: profile?.city || '',
            country: profile?.country || '',
            skills: profile?.skills?.join(', ') || '',
            interests: profile?.interests?.join(', ') || '',
            languages: profile?.languages?.join(', ') || '',
            avatar: profile?.avatar || ''
        })
    }

    if (isLoading) {
        return (
            <DashboardLayout role="COMMUNITY_MEMBER">
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
            </DashboardLayout>
        )
    }

    const renderBadgeArray = (items: string[], emptyMsg: string, colorClass: string) => {
        if (!items || items.length === 0) return <p className="text-sm text-gray-500 italic">{emptyMsg}</p>
        return (
            <div className="flex flex-wrap gap-2">
                {items.map((item, index) => (
                    <Badge key={index} className={colorClass}>{item}</Badge>
                ))}
            </div>
        )
    }

    return (
        <DashboardLayout role="COMMUNITY_MEMBER">
            <div className="space-y-6 max-w-5xl mx-auto">

                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage your personal information and preferences.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)} className="bg-primary-500 hover:bg-primary-600">
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={handleCancel}>
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Top Overview Card */}
                <Card className="overflow-hidden border-none shadow-md">
                    <div className="h-32 bg-primary-400"></div>
                    <CardContent className="relative pt-0 px-6 pb-6 sm:px-10 sm:pb-10">
                        <div className="flex flex-col sm:flex-row gap-6 relative -top-12">
                            <div className="relative group">
                                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-xl dark:border-gray-900 bg-white">
                                    <AvatarImage src={isEditing ? editForm.avatar : profile?.avatar} className="object-cover" />
                                    <AvatarFallback className="text-2xl sm:text-4xl bg-primary-100 text-primary-600">
                                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </>
                                )}
                            </div>

                            <div className="flex-1 pt-2 sm:pt-14">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {user?.firstName} {user?.lastName}
                                    {profile?.impactPoints > 1000 && <CheckCircle className="w-5 h-5 text-blue-500" />}
                                </h2>
                                <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
                                    <Badge variant="outline" className="text-primary-600 bg-primary-50 border-primary-200">
                                        {user?.role?.replace('_', ' ')}
                                    </Badge>
                                    {profile?.city && profile?.country && (
                                        <span className="flex items-center text-sm">
                                            <MapPin className="w-3.5 h-3.5 mr-1" />
                                            {profile.city}, {profile.country}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2 sm:pt-14 flex sm:flex-col gap-4 text-sm whitespace-nowrap">
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <Users className="w-4 h-4 mr-2 text-secondary-500" />
                                    <span className="font-semibold text-gray-900 dark:text-white mr-1">{profile?.connections || 0}</span> Connections
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                                    <span className="font-semibold text-gray-900 dark:text-white mr-1">{profile?.impactPoints || 0}</span> Impact Points
                                </div>
                            </div>
                        </div>

                        {/* Editing Top Section Fields */}
                        {isEditing && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">City</label>
                                        <Input
                                            value={editForm.city}
                                            onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                                            placeholder="e.g. San Francisco"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Country</label>
                                        <Input
                                            value={editForm.country}
                                            onChange={e => setEditForm({ ...editForm, country: e.target.value })}
                                            placeholder="e.g. USA"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Main Content Column */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">
                                    <User className="w-5 h-5 mr-2 text-primary-500" />
                                    About Me
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <Textarea
                                        value={editForm.bio}
                                        onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                        placeholder="Tell the community about yourself..."
                                        className="min-h-[120px]"
                                    />
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {profile?.bio || <span className="italic text-gray-400">No bio provided yet. Click "Edit Profile" to add one!</span>}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg">
                                        <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                                        Skills
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Input
                                                value={editForm.skills}
                                                onChange={e => setEditForm({ ...editForm, skills: e.target.value })}
                                                placeholder="e.g. React, UI Design, Marketing (comma separated)"
                                            />
                                            <p className="text-xs text-gray-500">Separate skills with commas</p>
                                        </div>
                                    ) : (
                                        renderBadgeArray(profile?.skills, "No skills listed", "bg-blue-100 text-blue-700 hover:bg-blue-200")
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg">
                                        <Globe className="w-5 h-5 mr-2 text-emerald-500" />
                                        Languages
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Input
                                                value={editForm.languages}
                                                onChange={e => setEditForm({ ...editForm, languages: e.target.value })}
                                                placeholder="e.g. English, Spanish (comma separated)"
                                            />
                                        </div>
                                    ) : (
                                        renderBadgeArray(profile?.languages, "No languages listed", "bg-emerald-100 text-emerald-700 hover:bg-emerald-200")
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Contact Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                                    {user?.email}
                                </div>

                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                                    {isEditing ? (
                                        <Input
                                            value={editForm.phone}
                                            onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                            placeholder="Phone number"
                                            className="h-8"
                                        />
                                    ) : (
                                        profile?.phone || <span className="italic text-gray-400 tracking-wide">Not provided</span>
                                    )}
                                </div>

                                <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                    <MapPin className="w-4 h-4 mr-3 text-gray-400 shrink-0 mt-0.5" />
                                    {isEditing ? (
                                        <Textarea
                                            value={editForm.address}
                                            onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                            placeholder="Full Address"
                                            className="min-h-[60px]"
                                        />
                                    ) : (
                                        profile?.address || <span className="italic text-gray-400 tracking-wide">Not provided</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Interests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <Textarea
                                            value={editForm.interests}
                                            onChange={e => setEditForm({ ...editForm, interests: e.target.value })}
                                            placeholder="e.g. Mentorship, Tech, Art (comma separated)"
                                            className="min-h-[80px]"
                                        />
                                    </div>
                                ) : (
                                    renderBadgeArray(profile?.interests, "No interests listed", "bg-secondary-100 text-secondary-700 hover:bg-secondary-200")
                                )}
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    )
}
