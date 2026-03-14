'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Award,
    Medal,
    Star,
    Shield,
    Crown,
    Sparkles,
    CheckCircle,
    Lock,
    Gift,
    TrendingUp,
    Calendar,
    Users,
    Target,
    Share2,
    Download,
    BookOpen,
    GraduationCap,
    Clock,
    FileText,
    Printer,
    Mail,
    Linkedin,
    Twitter,
    Facebook,
    Globe,
    MessageCircle
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Progress } from '../../../components/ui/progress'
import { Badge } from '../../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { BadgeGrid } from '../../components/badges/BadgeGrid'
import { BadgeDetail } from '../../components/badges/BadgeDetails'
import { cn } from '@/lib/utils'

// Mock data for learner certificates and badges
const learnerBadges = [
    {
        id: 'l1',
        name: 'Diversity Fundamentals',
        description: 'Completed the core diversity and inclusion course',
        level: 'bronze' as const,
        status: 'earned' as const,
        dateEarned: '2024-01-15',
        points: 100,
        category: 'Foundation',
        requirements: [
            'Complete all core modules',
            'Pass final assessment with 80%',
            'Submit reflection essay'
        ],
        holders: 3456,
        icon: <BookOpen className="w-6 h-6" />,
    },
    {
        id: 'l2',
        name: 'Inclusive Leadership',
        description: 'Advanced certification in inclusive leadership practices',
        level: 'silver' as const,
        status: 'earned' as const,
        dateEarned: '2024-02-20',
        points: 250,
        category: 'Leadership',
        requirements: [
            'Complete leadership track',
            'Case study presentation',
            'Peer review passed',
            'Final project approved'
        ],
        holders: 1234,
        icon: <GraduationCap className="w-6 h-6" />,
    },
    {
        id: 'l3',
        name: 'Cultural Competence',
        description: 'Mastery in cross-cultural communication and understanding',
        level: 'gold' as const,
        status: 'in-progress' as const,
        progress: 60,
        points: 300,
        category: 'Cultural',
        requirements: [
            'Complete 5 cultural modules',
            'Cultural immersion project',
            'Language proficiency test',
            'Community engagement'
        ],
        holders: 567,
        icon: <Globe className="w-6 h-6" />,
    },
    {
        id: 'l4',
        name: 'Bias Awareness Expert',
        description: 'Advanced understanding of unconscious bias',
        level: 'platinum' as const,
        status: 'locked' as const,
        points: 400,
        category: 'Advanced',
        requirements: [
            'Complete bias track',
            'Research paper published',
            'Workshop facilitation',
            'Peer recognition'
        ],
        holders: 234,
        icon: <Target className="w-6 h-6" />,
    },
    {
        id: 'l5',
        name: 'Inclusive Communication',
        description: 'Expert in inclusive language and communication',
        level: 'gold' as const,
        status: 'locked' as const,
        points: 275,
        category: 'Communication',
        requirements: [
            'Communication certification',
            'Public speaking event',
            'Content creation',
            'Community workshop'
        ],
        holders: 789,
        icon: <MessageCircle className="w-6 h-6" />,
    },
]

const certificates = [
    {
        id: 'c1',
        name: 'Diversity & Inclusion Professional',
        issuer: 'Diversity Network',
        issueDate: '2024-01-15',
        expiryDate: '2026-01-15',
        credentialId: 'DIP-2024-001',
        cpdHours: 40,
        image: '/certificates/dip.jpg',
        verificationUrl: 'https://verify.diversity.network/DIP-2024-001',
    },
    {
        id: 'c2',
        name: 'Inclusive Leadership Certificate',
        issuer: 'Leadership Institute',
        issueDate: '2024-02-20',
        expiryDate: '2026-02-20',
        credentialId: 'ILC-2024-089',
        cpdHours: 35,
        image: '/certificates/ilc.jpg',
        verificationUrl: 'https://verify.diversity.network/ILC-2024-089',
    },
    {
        id: 'c3',
        name: 'Cultural Competence Practitioner',
        issuer: 'Cultural Intelligence Center',
        issueDate: '2024-03-10',
        expiryDate: '2026-03-10',
        credentialId: 'CCP-2024-234',
        cpdHours: 45,
        image: '/certificates/ccp.jpg',
        verificationUrl: 'https://verify.diversity.network/CCP-2024-234',
    },
]

const learningStats = {
    completedCourses: 8,
    cpdHours: 120,
    currentLevel: 'Silver Learner',
    nextLevel: 'Gold Learner',
    progressToNext: 65,
}

export default function LearnerCertificatesPage() {
    const [selectedBadge, setSelectedBadge] = useState<any>(null)
    const [detailOpen, setDetailOpen] = useState(false)
    const [selectedCertificate, setSelectedCertificate] = useState<any>(null)

    const handleBadgeClick = (badge: any) => {
        setSelectedBadge(badge)
        setDetailOpen(true)
    }

    const shareCertificate = (platform: string, cert: any) => {
        const text = `I earned the ${cert.name} certificate on Diversity Network!`
        const url = cert.verificationUrl

        let shareUrl = ''
        switch (platform) {
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
                break
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
                break
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                break
        }

        window.open(shareUrl, '_blank')
    }

    return (
        <DashboardLayout role="LEARNER">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Certificates & Badges</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Track your learning achievements and professional certifications.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Profile
                        </Button>
                        <Button size="sm" className="bg-primary-500 text-white">
                            <Download className="w-4 h-4 mr-2" />
                            Download All
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Award className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{learningStats.completedCourses}</p>
                                    <p className="text-sm text-gray-500">Completed Courses</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{learningStats.cpdHours}</p>
                                    <p className="text-sm text-gray-500">CPD Hours</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-secondary-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{certificates.length}</p>
                                    <p className="text-sm text-gray-500">Certificates</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{learningStats.currentLevel}</p>
                                    <p className="text-sm opacity-90">Current Level</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Level Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle>Learning Level Progress</CardTitle>
                        <CardDescription>You're on track to reach {learningStats.nextLevel}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Progress</span>
                                <span className="font-medium">{learningStats.progressToNext}%</span>
                            </div>
                            <Progress value={learningStats.progressToNext} className="h-2" />
                            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                                <span>{learningStats.currentLevel}</span>
                                <span>{learningStats.nextLevel}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Certificates Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Certificates</CardTitle>
                        <CardDescription>Verified professional credentials</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {certificates.map((cert) => (
                                <motion.div
                                    key={cert.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="relative group"
                                >
                                    <Card className="overflow-hidden">
                                        {/* Certificate Header */}
                                        <div className="h-32 bg-primary-600 relative">
                                            <div className="absolute inset-0 bg-black opacity-10" />
                                            <div className="absolute top-4 right-4">
                                                <Award className="w-8 h-8 text-white opacity-50" />
                                            </div>
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <p className="text-xs opacity-90">Certificate of Completion</p>
                                                <p className="font-semibold">{cert.cpdHours} CPD Hours</p>
                                            </div>
                                        </div>

                                        {/* Certificate Content */}
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold text-lg mb-1">{cert.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">Issued by {cert.issuer}</p>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <FileText className="w-4 h-4" />
                                                    <span className="truncate">ID: {cert.credentialId}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shareCertificate('linkedin', cert)}>
                                                        <Linkedin className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shareCertificate('twitter', cert)}>
                                                        <Twitter className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shareCertificate('facebook', cert)}>
                                                        <Facebook className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Printer className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Verification Badge */}
                                            <div className="absolute top-2 left-2">
                                                <Badge className="bg-green-500 text-white">Verified</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg pointer-events-none" />
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Learning Badges */}
                <Tabs defaultValue="all" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">All Badges ({learnerBadges.length})</TabsTrigger>
                        <TabsTrigger value="earned">Earned ({learnerBadges.filter(b => b.status === 'earned').length})</TabsTrigger>
                        <TabsTrigger value="in-progress">In Progress ({learnerBadges.filter(b => b.status === 'in-progress').length})</TabsTrigger>
                        <TabsTrigger value="locked">Locked ({learnerBadges.filter(b => b.status === 'locked').length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <BadgeGrid
                            badges={learnerBadges}
                            onBadgeClick={handleBadgeClick}
                        />
                    </TabsContent>

                    <TabsContent value="earned">
                        <BadgeGrid
                            badges={learnerBadges.filter(b => b.status === 'earned')}
                            onBadgeClick={handleBadgeClick}
                        />
                    </TabsContent>

                    <TabsContent value="in-progress">
                        <BadgeGrid
                            badges={learnerBadges.filter(b => b.status === 'in-progress')}
                            onBadgeClick={handleBadgeClick}
                        />
                    </TabsContent>

                    <TabsContent value="locked">
                        <BadgeGrid
                            badges={learnerBadges.filter(b => b.status === 'locked')}
                            onBadgeClick={handleBadgeClick}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Badge Detail Modal */}
            {selectedBadge && (
                <BadgeDetail
                    open={detailOpen}
                    onOpenChange={setDetailOpen}
                    badge={selectedBadge}
                />
            )}
        </DashboardLayout>
    )
}