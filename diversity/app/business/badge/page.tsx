'use client'

import React, { useState, useEffect } from 'react'
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
    ChevronRight,
    BookOpen,
    Handshake
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
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { useCallback } from 'react'
import { exportToCSV } from '@/lib/exportUtils'

// Mock data removed in favor of real data from API

// Milestones removed in favor of real data from API

export default function BusinessBadgePage() {
    const [selectedBadge, setSelectedBadge] = useState<any>(null)
    const [detailOpen, setDetailOpen] = useState(false)
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchBadges = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await api.get('/businesses/me/badges')
            setData(res)
        } catch (error) {
            console.error('Failed to fetch badges:', error)
            toast.error('Failed to load badges')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchBadges()
    }, [fetchBadges])

    const handleRefresh = () => {
        fetchBadges()
    }

    const handleExport = () => {
        if (!data || !data.milestones) return;

        const exportData = data.milestones.map((m: any) => ({
            'Milestone': m.title,
            'Description': m.description,
            'Status': m.completed ? 'Completed' : 'Locked',
            'Progress': m.progress ? `${m.progress}%` : (m.completed ? '100%' : '0%'),
            'Points Earned': m.completed ? 100 : 0
        }));

        exportToCSV(exportData, 'diversity_badges_report');
    }

    const handleBadgeClick = (badge: any) => {
        setSelectedBadge(badge)
        setDetailOpen(true)
    }

    if (isLoading) {
        return (
            <DashboardLayout role="BUSINESS">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-pulse text-gray-400 font-medium text-lg">Loading your achievements...</div>
                </div>
            </DashboardLayout>
        )
    }

    const milestones = data?.milestones || []
    const earnedCount = milestones.filter((m: any) => m.completed).length
    const progress = milestones.length > 0 ? Math.round((earnedCount / milestones.length) * 100) : 0

    // Map milestones to businessBadges icons/styles for the grid
    const dynamicBadges = milestones.map((m: any, i: number) => ({
        id: String(i + 1),
        name: m.title,
        description: m.description,
        status: m.completed ? 'earned' : 'locked',
        points: m.completed ? 100 : 0,
        icon: i === 0 ? <Shield className="w-6 h-6" /> :
            i === 1 ? <BookOpen className="w-6 h-6" /> :
                i === 2 ? <Handshake className="w-6 h-6" /> :
                    i === 3 ? <TrendingUp className="w-6 h-6" /> :
                        <Trophy className="w-6 h-6" />,
        level: m.title === 'Leadership Certificate' ? 'platinum' : 'gold'
    }))

    const earnedBadges = dynamicBadges.filter((b: any) => b.status === 'earned')
    const inProgressBadges = dynamicBadges.filter((b: any) => b.status === 'in-progress')
    const lockedBadges = dynamicBadges.filter((b: any) => b.status === 'locked')

    const currentBadge = earnedCount > 0 ? dynamicBadges[earnedCount - 1].name : 'Diversity Starter'
    const nextBadge = earnedCount < dynamicBadges.length ? dynamicBadges[earnedCount].name : 'Diversity Legend'

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
                        <Button size="sm" className="bg-primary-600 text-white" onClick={handleExport}>
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
                                    <h3 className="text-lg font-semibold">Current Status: {currentBadge}</h3>
                                </div>
                                <p className="text-white/90 mb-4">
                                    {earnedCount === 5
                                        ? "Congratulations! You've achieved the highest level of diversity leadership."
                                        : `You're on track to become a ${nextBadge}. Keep up the great work!`
                                    }
                                </p>
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-sm opacity-90">Badges Earned</p>
                                        <p className="text-2xl font-bold">{earnedCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-90">Total Points</p>
                                        <p className="text-2xl font-bold">
                                            {earnedCount * 100}
                                        </p>
                                    </div>
                                    {earnedCount < 5 && (
                                        <div>
                                            <p className="text-sm opacity-90">Next Badge</p>
                                            <p className="text-2xl font-bold">{nextBadge}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white/20 rounded-lg p-4">
                                <p className="text-sm mb-1">Overall Progress</p>
                                <p className="text-3xl font-bold">{progress}%</p>
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
                            {milestones.map((milestone: any, index: number) => (
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
                                        <p className="text-sm text-gray-500">{milestone.description}</p>
                                        {milestone.completed && (
                                            <p className="text-xs text-green-600 font-bold mt-1">Completed</p>
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
                        <TabsTrigger value="earned">Earned ({earnedCount})</TabsTrigger>
                        <TabsTrigger value="locked">Locked ({dynamicBadges.length - earnedCount})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <BadgeGrid
                            badges={dynamicBadges}
                            onBadgeClick={handleBadgeClick}
                        />
                    </TabsContent>

                    <TabsContent value="earned">
                        <BadgeGrid
                            badges={earnedBadges}
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