'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
    Building2,
    Mail,
    MapPin,
    Phone,
    Globe,
    Briefcase,
    Users,
    Edit2,
    Save,
    X,
    Camera,
    CheckCircle,
    Info,
    FileText,
    Target,
    Activity,
    BadgeCheck,
    Star
} from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

export default function BusinessProfilePage() {
    const [business, setBusiness] = useState<any>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Edit State
    const [editForm, setEditForm] = useState({
        companyName: '',
        companyEmail: '',
        companyPhone: '',
        website: '',
        industry: '',
        size: '',
        description: '',
        logo: '',
        address: '',
        city: '',
        country: '',
        diversityCommitment: '',
        csrReport: ''
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchBusinessProfile()
    }, [])

    const fetchBusinessProfile = async () => {
        try {
            setIsLoading(true)
            const data = await api.get('/businesses/me')
            setBusiness(data)

            // Initialize edit form
            setEditForm({
                companyName: data.companyName || '',
                companyEmail: data.companyEmail || '',
                companyPhone: data.companyPhone || '',
                website: data.website || '',
                industry: data.industry || '',
                size: data.size || '',
                description: data.description || '',
                logo: data.logo || '',
                address: data.address || '',
                city: data.city || '',
                country: data.country || '',
                diversityCommitment: data.diversityCommitment || '',
                csrReport: data.csrReport || ''
            })
        } catch (error) {
            console.error('Failed to fetch business profile:', error)
            toast.error('Failed to load business profile')
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            toast.loading('Uploading logo...')
            const formData = new FormData()
            formData.append('file', file)

            const response = await api.upload('/upload', formData)
            const newLogoUrl = response.url

            setEditForm(prev => ({ ...prev, logo: newLogoUrl }))

            // Immediately save logo to backend
            const payload = { ...editForm, logo: newLogoUrl }
            const updatedBusiness = await api.put('/businesses/me', payload)
            setBusiness(updatedBusiness)

            toast.dismiss()
            toast.success('Logo uploaded successfully')
        } catch (error) {
            console.error('Failed to upload logo:', error)
            toast.dismiss()
            toast.error('Failed to upload logo')
        }
    }

    const handleSave = async () => {
        try {
            const updatedBusiness = await api.put('/businesses/me', editForm)
            setBusiness(updatedBusiness)
            setIsEditing(false)
            toast.success('Business profile updated successfully')
        } catch (error) {
            console.error('Failed to update business profile:', error)
            toast.error('Failed to save changes')
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        // Reset form
        setEditForm({
            companyName: business?.companyName || '',
            companyEmail: business?.companyEmail || '',
            companyPhone: business?.companyPhone || '',
            website: business?.website || '',
            industry: business?.industry || '',
            size: business?.size || '',
            description: business?.description || '',
            logo: business?.logo || '',
            address: business?.address || '',
            city: business?.city || '',
            country: business?.country || '',
            diversityCommitment: business?.diversityCommitment || '',
            csrReport: business?.csrReport || ''
        })
    }

    if (isLoading) {
        return (
            <DashboardLayout role="BUSINESS">
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
            </DashboardLayout>
        )
    }

    const badgeColors: Record<string, string> = {
        CHAMPION: 'bg-purple-100 text-purple-700 border-purple-200',
        INCLUSION_PARTNER: 'bg-blue-100 text-blue-700 border-blue-200',
        SUPPORTER: 'bg-green-100 text-green-700 border-green-200'
    }

    return (
        <DashboardLayout role="BUSINESS">
            <div className="space-y-6 max-w-6xl mx-auto pb-12">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Profile</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage your organization's public presence and commitment.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)} className="bg-primary-600 hover:bg-primary-700">
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

                {/* Overview Card */}
                <Card className="overflow-hidden border-none shadow-lg">
                    <div className="h-40 bg-gradient-to-r from-primary-500 to-primary-700"></div>
                    <CardContent className="relative pt-0 px-6 pb-6 sm:px-10 sm:pb-8">
                        <div className="flex flex-col sm:flex-row gap-8 relative -top-16">
                            <div className="relative group self-center sm:self-start">
                                <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-8 border-white dark:border-gray-900 shadow-2xl bg-white rounded-2xl overflow-hidden">
                                    <AvatarImage src={isEditing ? editForm.logo : business?.logo} className="object-contain p-4" />
                                    <AvatarFallback className="text-4xl bg-gray-50 text-gray-400">
                                        <Building2 className="w-16 h-16" />
                                    </AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Camera className="w-10 h-10 text-white" />
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

                            <div className="flex-1 pt-4 sm:pt-20 text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {business?.companyName}
                                    </h2>
                                    {business?.verificationStatus === 'VERIFIED' && (
                                        <Badge className="bg-blue-600 w-fit self-center">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Verified Business
                                        </Badge>
                                    )}
                                </div>
                                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center">
                                        <Briefcase className="w-4 h-4 mr-1.5 text-primary-500" />
                                        {business?.industry}
                                    </span>
                                    <span className="flex items-center">
                                        <Users className="w-4 h-4 mr-1.5 text-secondary-500" />
                                        {business?.size} employees
                                    </span>
                                    {(business?.city || business?.country) && (
                                        <span className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
                                            {business?.city}{business?.city && business?.country ? ', ' : ''}{business?.country}
                                        </span>
                                    )}
                                    {business?.website && (
                                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary-600 transition-colors">
                                            <Globe className="w-4 h-4 mr-1.5 text-blue-500" />
                                            Website
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 sm:pt-20 flex flex-col items-center sm:items-end gap-3 self-center sm:self-start">
                                {business?.badgeLevel && (
                                    <Badge variant="outline" className={`px-4 py-1.5 text-sm font-semibold rounded-full border-2 ${badgeColors[business.badgeLevel]}`}>
                                        {business.badgeLevel.replace('_', ' ')}
                                    </Badge>
                                )}
                                <div className="text-xs text-gray-500">
                                    Member since {new Date(business?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        </div>

                        {/* Top Editing Fields */}
                        {isEditing && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 pt-6 border-t dark:border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Company Name</label>
                                    <Input
                                        value={editForm.companyName}
                                        onChange={e => setEditForm(prev => ({ ...prev, companyName: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Industry</label>
                                    <Select 
                                        value={editForm.industry} 
                                        onValueChange={val => setEditForm(prev => ({ ...prev, industry: val }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Technology">Technology</SelectItem>
                                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                                            <SelectItem value="Finance">Finance</SelectItem>
                                            <SelectItem value="Education">Education</SelectItem>
                                            <SelectItem value="Real Estate">Real Estate</SelectItem>
                                            <SelectItem value="Retail">Retail</SelectItem>
                                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                            <SelectItem value="Marketing">Marketing</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Company Size</label>
                                    <Select 
                                        value={editForm.size} 
                                        onValueChange={val => setEditForm(prev => ({ ...prev, size: val }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1-10">1-10 employees</SelectItem>
                                            <SelectItem value="11-50">11-50 employees</SelectItem>
                                            <SelectItem value="51-200">51-200 employees</SelectItem>
                                            <SelectItem value="201-500">201-500 employees</SelectItem>
                                            <SelectItem value="501-1000">501-1000 employees</SelectItem>
                                            <SelectItem value="1000+">1000+ employees</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left/Main Column */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* About/Description */}
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center text-xl">
                                    <Info className="w-5 h-5 mr-3 text-primary-500" />
                                    About {business?.companyName}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <Textarea
                                        value={editForm.description}
                                        onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Describe your company and its mission..."
                                        className="min-h-[150px] text-base"
                                    />
                                ) : (
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                        {business?.description || <span className="italic text-gray-400">No description provided yet.</span>}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Diversity Pledge/Commitment */}
                        <Card className="border-none shadow-md bg-gradient-to-br from-white to-primary-50 dark:from-gray-900 dark:to-primary-950">
                            <CardHeader>
                                <CardTitle className="flex items-center text-xl">
                                    <Target className="w-5 h-5 mr-3 text-primary-600" />
                                    Diversity & Inclusion Commitment
                                </CardTitle>
                                <CardDescription>
                                    Your organization's publicly stated pledge for equity and representation.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <Textarea
                                        value={editForm.diversityCommitment}
                                        onChange={e => setEditForm(prev => ({ ...prev, diversityCommitment: e.target.value }))}
                                        placeholder="E.g. We commit to hiring 40% underrepresented groups..."
                                        className="min-h-[120px] bg-white dark:bg-gray-800"
                                    />
                                ) : (
                                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border-l-4 border-primary-500 shadow-sm">
                                        <p className="font-medium text-gray-800 dark:text-gray-200 italic">
                                            "{business?.diversityCommitment || "We are dedicated to building a diverse and inclusive workplace for everyone."}"
                                        </p>
                                    </div>
                                )}
                                {!isEditing && (
                                    <div className="mt-6 flex items-center justify-between p-4 bg-primary-100/50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                                        <div className="flex items-center">
                                            <FileText className="w-5 h-5 mr-3 text-primary-600" />
                                            <div>
                                                <p className="text-sm font-semibold text-primary-900 dark:text-primary-100">Annual CSR Report</p>
                                                <p className="text-xs text-primary-700 dark:text-primary-300">Last updated: Jan 2024</p>
                                            </div>
                                        </div>
                                        <Link href="/business/badges">
                                            <Button variant="outline" size="sm" className="bg-white hover:bg-primary-50 border-primary-200">View All Badges</Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right/Sidebar Column */}
                    <div className="space-y-8">
                        
                        {/* Contact Information */}
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="flex items-start">
                                    <Mail className="w-4 h-4 mr-4 mt-1 text-gray-400 group-hover:text-primary-500 transition-colors" />
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Company Email</p>
                                        {isEditing ? (
                                            <Input
                                                value={editForm.companyEmail}
                                                onChange={e => setEditForm(prev => ({ ...prev, companyEmail: e.target.value }))}
                                                className="h-9"
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-white font-medium">{business?.companyEmail}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Phone className="w-4 h-4 mr-4 mt-1 text-gray-400" />
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone Number</p>
                                        {isEditing ? (
                                            <Input
                                                value={editForm.companyPhone}
                                                onChange={e => setEditForm(prev => ({ ...prev, companyPhone: e.target.value }))}
                                                className="h-9"
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-white font-medium">{business?.companyPhone || '--'}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <MapPin className="w-4 h-4 mr-4 mt-1 text-gray-400" />
                                    <div className="flex-1 space-y-3">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</p>
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <Input
                                                    placeholder="Address"
                                                    value={editForm.address}
                                                    onChange={e => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                                                />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input
                                                        placeholder="City"
                                                        value={editForm.city}
                                                        onChange={e => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                                                    />
                                                    <Input
                                                        placeholder="Country"
                                                        value={editForm.country}
                                                        onChange={e => setEditForm(prev => ({ ...prev, country: e.target.value }))}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-900 dark:text-white font-medium space-y-1">
                                                <p>{business?.address}</p>
                                                <p>{business?.city}{business?.city && business?.country ? ', ' : ''}{business?.country}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Globe className="w-4 h-4 mr-4 mt-1 text-gray-400" />
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Official Website</p>
                                        {isEditing ? (
                                            <Input
                                                value={editForm.website}
                                                onChange={e => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                                                className="h-9"
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-white font-medium truncate">{business?.website || '--'}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Visibility & Status */}
                        <Card className="border-none shadow-md overflow-hidden bg-gray-50/50 dark:bg-gray-800/50">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Visibility Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BadgeCheck className="w-5 h-5 mr-3 text-green-500" />
                                        <span className="text-sm font-medium">Public Profile</span>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 uppercase text-[10px] tracking-widest">Active</Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold text-gray-500">
                                        <span>Profile Completion</span>
                                        <span>85%</span>
                                    </div>
                                    <Progress value={85} className="h-2 bg-gray-200 dark:bg-gray-700" />
                                    <p className="text-[10px] text-gray-400 flex items-center">
                                        <Activity className="w-3 h-3 mr-1" />
                                        Impact metrics last synced 2h ago
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
