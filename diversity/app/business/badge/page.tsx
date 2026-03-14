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
    Building2,
    Briefcase,
    Globe,
    Trophy,
    BadgeCheck,
    AlertCircle,
    Clock,
    ChevronRight
} from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BadgeGrid } from '../../components/badges/BadgeGrid'
import { BadgeDetail } from '../../components/badges/BadgeDetails'
import { cn } from '@/lib/utils'

// Mock data for business badges
const businessBadges = [
    {
        id: '1',
        name: 'Diversity Supporter',
        description: 'Demonstrated commitment to diversity through initial pledge and basic initiatives',
        level: 'supporter' as const,
        status: 'earned' as const,
        dateEarned: '2024-01-15',
        points: 100,
        category: 'Foundation',
        requirements: [
            'Sign diversity pledge',
            'Complete diversity policy',
            'Appoint diversity officer',
            'Conduct initial assessment'
        ],
        holders: 1250,
        icon: <Shield className="w-6 h-6" />,
    },
    {
        id: '2',
        name: 'Inclusion Partner',
        description: 'Active participation in diversity programs and community engagement',
        level: 'partner' as const,
        status: 'earned' as const,
        dateEarned: '2024-02-20',
        points: 250,
        category: 'Advanced',
        requirements: [
            'Achieve Diversity Supporter',
            'Implement training program',
            'Partner with community orgs',
            'Track diversity metrics'
        ],
        holders: 850,
        icon: <Award className="w-6 h-6" />,
    },
    {
        id: '3',
        name: 'Diversity Champion',
        description: 'Excellence in diversity initiatives and measurable impact',
        level: 'champion' as const,
        status: 'in-progress' as const,
        progress: 75,
        points: 500,
        category: 'Elite',
        requirements: [
            'Achieve Inclusion Partner',
            'Leadership in diversity',
            'Community impact project',
            'Published case study',
            'Mentor other businesses'
        ],
        holders: 320,
        icon: <Crown className="w-6 h-6" />,
    },
    {
        id: '4',
        name: 'Community Impact',
        description: 'Significant contribution to local community through volunteering and support',
        level: 'gold' as const,
        status: 'locked' as const,
        points: 300,
        category: 'Special',
        requirements: [
            '500+ volunteer hours',
            '10+ community events',
            'Local partnership',
            'Impact report'
        ],
        holders: 180,
        icon: <Gift className="w-6 h-6" />,
    },
    {
        id: '5',
        name: 'Workplace Inclusion',
        description: 'Excellence in creating an inclusive work environment',
        level: 'platinum' as const,
        status: 'locked' as const,
        points: 400,
        category: 'Workplace',
        requirements: [
            'Employee survey score >90%',
            'Inclusive policies audit',
            'Employee resource groups',
            'Leadership training'
        ],
        holders: 95,
        icon: <Briefcase className="w-6 h-6" />,
    },
    {
        id: '6',
        name: 'Supplier Diversity',
        description: 'Commitment to diverse suppliers and vendors',
        level: 'silver' as const,
        status: 'locked' as const,
        points: 150,
        category: 'Supply Chain',
        requirements: [
            'Supplier diversity policy',
            '20% diverse suppliers',
            'Track supplier metrics',
            'Annual review'
        ],
        holders: 420,
        icon: <Globe className="w-6 h-6" />,
    },
]

const milestones = [
    {
        title: 'Diversity Pledge',
        completed: true,
        date: '2024-01-15',
    },
    {
        title: 'Training Program',
        completed: true,
        date: '2024-02-01',
    },
    {
        title: 'Community Partnership',
        completed: true,
        date: '2024-02-20',
    },
    {
        title: 'Impact Report',
        completed: false,
        dueDate: '2024-03-30',
    },
    {
        title: 'Leadership Certification',
        completed: false,
        dueDate: '2024-04-15',
    },
]

export default function BusinessBadgePage() {
    const [selectedBadge, setSelectedBadge] = useState<any>(null)
    const [detailOpen, setDetailOpen] = useState(false)

    const handleBadgeClick = (badge: any) => {
        setSelectedBadge(badge)
        setDetailOpen(true)
    }

    const earnedBadges = businessBadges.filter(b => b.status === 'earned')
    const inProgressBadges = businessBadges.filter(b => b.status === 'in-progress')
    const lockedBadges = businessBadges.filter(b => b.status === 'locked')

    return (
        <DashboardLayout role="BUSINESS">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Diversity Badges</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Track your progress and earn recognition for your diversity initiatives.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Progress
                        </Button>
                        <Button size="sm" className="bg-primary-600 text-white">
                            <Download className="w-4 h-4 mr-2" />
                            Download Report
                        </Button>
                    </div>
                </div>

                {/* Current Badge Status */}
                <Card className="bg-primary-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Crown className="w-6 h-6" />
                                    <h3 className="text-lg font-semibold">Current Status: Inclusion Partner</h3>
                                </div>
                                <p className="text-white/90 mb-4">
                                    You're on track to become a Diversity Champion. Keep up the great work!
                                </p>
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-sm opacity-90">Badges Earned</p>
                                        <p className="text-2xl font-bold">{earnedBadges.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-90">Total Points</p>
                                        <p className="text-2xl font-bold">
                                            {businessBadges.filter(b => b.status === 'earned').reduce((sum, b) => sum + (b.points || 0), 0)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-90">Next Badge</p>
                                        <p className="text-2xl font-bold">Diversity Champion</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/20 rounded-lg p-4">
                                <p className="text-sm mb-1">Overall Progress</p>
                                <p className="text-3xl font-bold">75%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Milestones */}
                <Card>
                    <CardHeader>
                        <CardTitle>Journey Milestones</CardTitle>
                        <CardDescription>Your path to diversity excellence</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {milestones.map((milestone, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center",
                                        milestone.completed ? 'bg-green-100' : 'bg-gray-100'
                                    )}>
                                        {milestone.completed ? (
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <Clock className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{milestone.title}</p>
                                        {milestone.completed ? (
                                            <p className="text-sm text-green-600">Completed {new Date(milestone.date!).toLocaleDateString()}</p>
                                        ) : (
                                            <p className="text-sm text-gray-500">Due {new Date(milestone.dueDate!).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                    {index < milestones.length - 1 && (
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Badge Categories */}
                <Tabs defaultValue="all" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">All Badges</TabsTrigger>
                        <TabsTrigger value="earned">Earned ({earnedBadges.length})</TabsTrigger>
                        <TabsTrigger value="in-progress">In Progress ({inProgressBadges.length})</TabsTrigger>
                        <TabsTrigger value="locked">Locked ({lockedBadges.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <BadgeGrid
                            badges={businessBadges}
                            onBadgeClick={handleBadgeClick}
                        />
                    </TabsContent>

                    <TabsContent value="earned">
                        <BadgeGrid
                            badges={earnedBadges}
                            onBadgeClick={handleBadgeClick}
                        />
                    </TabsContent>

                    <TabsContent value="in-progress">
                        <BadgeGrid
                            badges={inProgressBadges}
                            onBadgeClick={handleBadgeClick}
                        />
                    </TabsContent>

                    <TabsContent value="locked">
                        <BadgeGrid
                            badges={lockedBadges}
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