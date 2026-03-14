'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Heart,
    Award,
    Medal,
    Star,
    Trophy,
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
    Clock,
    MapPin,
    Briefcase,
    BookOpen,
    Camera,
    Music,
    Palette,
    Code,
    Globe,
    AlertCircle
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

// Mock data for volunteer achievements
const volunteerAchievements = [
    {
        id: 'v1',
        name: 'First Steps',
        description: 'Completed your first volunteer activity',
        level: 'bronze' as const,
        status: 'earned' as const,
        dateEarned: '2024-01-10',
        points: 50,
        category: 'Beginner',
        requirements: [
            'Complete first volunteer task',
            'Log 5+ hours',
            'Get verified by organizer'
        ],
        holders: 5432,
        icon: <Heart className="w-6 h-6" />,
    },
    {
        id: 'v2',
        name: 'Dedicated Volunteer',
        description: 'Accumulated 100 hours of volunteer service',
        level: 'silver' as const,
        status: 'earned' as const,
        dateEarned: '2024-02-15',
        points: 150,
        category: 'Intermediate',
        requirements: [
            'Complete 100 volunteer hours',
            'Participate in 10+ events',
            'Positive feedback from 5 organizers'
        ],
        holders: 2341,
        icon: <Clock className="w-6 h-6" />,
    },
    {
        id: 'v3',
        name: 'Community Champion',
        description: 'Outstanding contribution to community service',
        level: 'gold' as const,
        status: 'in-progress' as const,
        progress: 65,
        points: 300,
        category: 'Advanced',
        requirements: [
            'Complete 500 volunteer hours',
            'Lead 5+ volunteer events',
            'Train 10 new volunteers',
            'Create impact report'
        ],
        holders: 856,
        icon: <Trophy className="w-6 h-6" />,
    },
    {
        id: 'v4',
        name: 'Emergency Responder',
        description: 'Quick response in crisis situations',
        level: 'platinum' as const,
        status: 'locked' as const,
        points: 400,
        category: 'Special',
        requirements: [
            'Complete emergency training',
            'Respond to 5+ crisis events',
            '50+ emergency hours',
            'Certification required'
        ],
        holders: 423,
        icon: <AlertCircle className="w-6 h-6" />,
    },
    {
        id: 'v5',
        name: 'Youth Mentor',
        description: 'Excellence in mentoring young people',
        level: 'gold' as const,
        status: 'locked' as const,
        points: 250,
        category: 'Mentoring',
        requirements: [
            'Complete mentor training',
            'Mentor 3+ youth',
            '100+ mentoring hours',
            'Positive feedback from mentees'
        ],
        holders: 567,
        icon: <Users className="w-6 h-6" />,
    },
    {
        id: 'v6',
        name: 'Environmental Hero',
        description: 'Dedication to environmental causes',
        level: 'silver' as const,
        status: 'earned' as const,
        dateEarned: '2024-03-01',
        points: 200,
        category: 'Environment',
        requirements: [
            'Participate in 10+ environmental events',
            'Plant 50+ trees',
            'Lead cleanup initiatives',
            'Environmental education'
        ],
        holders: 789,
        icon: <Globe className="w-6 h-6" />,
    },
    {
        id: 'v7',
        name: 'Team Leader',
        description: 'Leadership in volunteer coordination',
        level: 'gold' as const,
        status: 'in-progress' as const,
        progress: 40,
        points: 350,
        category: 'Leadership',
        requirements: [
            'Lead 20+ volunteer events',
            'Coordinate 50+ volunteers',
            'Event planning certification',
            'Team feedback score >4.5'
        ],
        holders: 234,
        icon: <Briefcase className="w-6 h-6" />,
    },
    {
        id: 'v8',
        name: 'Skills for Change',
        description: 'Using professional skills for community benefit',
        level: 'partner' as const,
        status: 'locked' as const,
        points: 275,
        category: 'Professional',
        requirements: [
            'Volunteer 100+ hours using professional skills',
            'Complete skills assessment',
            'Impact report',
            'Client testimonials'
        ],
        holders: 345,
        icon: <Code className="w-6 h-6" />,
    },
]

const stats = {
    totalHours: 245,
    eventsAttended: 32,
    badgesEarned: 3,
    currentStreak: 15,
    impactScore: 85,
    ranking: 'Silver Volunteer',
}

export default function VolunteerAchievementsPage() {
    const [selectedAchievement, setSelectedAchievement] = useState<any>(null)
    const [detailOpen, setDetailOpen] = useState(false)

    const handleAchievementClick = (achievement: any) => {
        setSelectedAchievement(achievement)
        setDetailOpen(true)
    }

    const earnedBadges = volunteerAchievements.filter(b => b.status === 'earned')
    const inProgressBadges = volunteerAchievements.filter(b => b.status === 'in-progress')
    const lockedBadges = volunteerAchievements.filter(b => b.status === 'locked')

    return (
        <DashboardLayout role="VOLUNTEER">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Achievements</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Track your volunteer milestones and earn recognition.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Profile
                        </Button>
                        <Button size="sm" className="bg-primary-500 text-white">
                            <Download className="w-4 h-4 mr-2" />
                            Download CV
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold">{stats.totalHours}</p>
                            <p className="text-xs text-gray-500">Total Hours</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold">{stats.eventsAttended}</p>
                            <p className="text-xs text-gray-500">Events</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Award className="w-6 h-6 text-secondary-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold">{stats.badgesEarned}</p>
                            <p className="text-xs text-gray-500">Badges</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <TrendingUp className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold">{stats.currentStreak}</p>
                            <p className="text-xs text-gray-500">Day Streak</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Target className="w-6 h-6 text-red-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold">{stats.impactScore}%</p>
                            <p className="text-xs text-gray-500">Impact Score</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary-500 text-white">
                        <CardContent className="p-4 text-center">
                            <Trophy className="w-6 h-6 mx-auto mb-2" />
                            <p className="text-2xl font-bold">{stats.ranking}</p>
                            <p className="text-xs opacity-90">Current Rank</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Achievement Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle>Next Milestone</CardTitle>
                        <CardDescription>You're making great progress!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">Community Champion</h3>
                                <p className="text-sm text-gray-600 mb-2">Complete 500 volunteer hours</p>
                                <Progress value={65} className="h-2" />
                                <div className="flex items-center justify-between mt-2 text-sm">
                                    <span className="text-gray-500">325/500 hours</span>
                                    <span className="text-green-600">65% complete</span>
                                </div>
                            </div>
                            <Button variant="outline">View Details</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Achievements Tabs */}
                <Tabs defaultValue="all" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">All ({volunteerAchievements.length})</TabsTrigger>
                        <TabsTrigger value="earned">Earned ({earnedBadges.length})</TabsTrigger>
                        <TabsTrigger value="in-progress">In Progress ({inProgressBadges.length})</TabsTrigger>
                        <TabsTrigger value="locked">Locked ({lockedBadges.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <BadgeGrid
                            badges={volunteerAchievements}
                            onBadgeClick={handleAchievementClick}
                        />
                    </TabsContent>

                    <TabsContent value="earned">
                        <BadgeGrid
                            badges={earnedBadges}
                            onBadgeClick={handleAchievementClick}
                        />
                    </TabsContent>

                    <TabsContent value="in-progress">
                        <BadgeGrid
                            badges={inProgressBadges}
                            onBadgeClick={handleAchievementClick}
                        />
                    </TabsContent>

                    <TabsContent value="locked">
                        <BadgeGrid
                            badges={lockedBadges}
                            onBadgeClick={handleAchievementClick}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Achievement Detail Modal */}
            {selectedAchievement && (
                <BadgeDetail
                    open={detailOpen}
                    onOpenChange={setDetailOpen}
                    badge={selectedAchievement}
                />
            )}
        </DashboardLayout>
    )
}