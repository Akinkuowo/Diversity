'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BadgeCard, BadgeLevel, BadgeStatus } from './BadgeCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Filter, Grid3x3, List, Award, TrendingUp, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface Badge {
    id: string
    name: string
    description: string
    level: BadgeLevel
    status: BadgeStatus
    progress?: number
    icon?: React.ReactNode
    requirements?: string[]
    dateEarned?: string
    points?: number
    category?: string
}

interface BadgeGridProps {
    badges: Badge[]
    onBadgeClick?: (badge: Badge) => void
    className?: string
}

const statusFilters = [
    { value: 'all', label: 'All Badges', icon: Award },
    { value: 'earned', label: 'Earned', icon: Award },
    { value: 'in-progress', label: 'In Progress', icon: TrendingUp },
    { value: 'locked', label: 'Locked', icon: Lock },
]

const levelColors = {
    supporter: 'bg-blue-100 text-blue-600 border-blue-200',
    partner: 'bg-secondary-100 text-secondary-600 border-secondary-200',
    champion: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    platinum: 'bg-gray-100 text-gray-600 border-gray-200',
    gold: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    silver: 'bg-gray-100 text-gray-500 border-gray-200',
    bronze: 'bg-amber-100 text-amber-700 border-amber-200',
}

export function BadgeGrid({ badges, onBadgeClick, className }: BadgeGridProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [levelFilter, setLevelFilter] = useState<string>('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const filteredBadges = badges.filter((badge) => {
        const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            badge.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || badge.status === statusFilter
        const matchesLevel = levelFilter === 'all' || badge.level === levelFilter
        return matchesSearch && matchesStatus && matchesLevel
    })

    const stats = {
        total: badges.length,
        earned: badges.filter(b => b.status === 'earned').length,
        inProgress: badges.filter(b => b.status === 'in-progress').length,
        locked: badges.filter(b => b.status === 'locked').length,
        totalPoints: badges.filter(b => b.status === 'earned').reduce((sum, b) => sum + (b.points || 0), 0),
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-primary-600 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90">Total Badges</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-green-500 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90">Earned</p>
                    <p className="text-2xl font-bold">{stats.earned}</p>
                </div>
                <div className="bg-blue-500 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90">In Progress</p>
                    <p className="text-2xl font-bold">{stats.inProgress}</p>
                </div>
                <div className="bg-gray-500 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90">Locked</p>
                    <p className="text-2xl font-bold">{stats.locked}</p>
                </div>
                <div className="bg-yellow-500 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90">Total Points</p>
                    <p className="text-2xl font-bold">{stats.totalPoints}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search badges..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="supporter">Diversity Supporter</SelectItem>
                        <SelectItem value="partner">Inclusion Partner</SelectItem>
                        <SelectItem value="champion">Diversity Champion</SelectItem>
                        <SelectItem value="platinum">Platinum</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="bronze">Bronze</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid3x3 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Status Tabs */}
            <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList className="grid w-full grid-cols-4">
                    {statusFilters.map((filter) => {
                        const Icon = filter.icon
                        return (
                            <TabsTrigger key={filter.value} value={filter.value} className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span className="hidden md:inline">{filter.label}</span>
                            </TabsTrigger>
                        )
                    })}
                </TabsList>
            </Tabs>

            {/* Badge Grid/List */}
            <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredBadges.map((badge) => (
                            <BadgeCard
                                key={badge.id}
                                {...badge}
                                onClick={() => onBadgeClick?.(badge)}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-3"
                    >
                        {filteredBadges.map((badge) => (
                            <div
                                key={badge.id}
                                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => onBadgeClick?.(badge)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center",
                                        levelColors[badge.level]
                                    )}>
                                        {badge.icon || <Award className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{badge.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</p>
                                        {badge.status === 'in-progress' && badge.progress && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <Progress value={badge.progress} className="w-32 h-1" />
                                                <span className="text-xs text-gray-500">{badge.progress}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {badge.points && (
                                        <Badge variant="secondary" className="bg-secondary-100 text-secondary-600">
                                            {badge.points} pts
                                        </Badge>
                                    )}
                                    <Badge variant={badge.status === 'earned' ? 'default' : 'secondary'}>
                                        {badge.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {filteredBadges.length === 0 && (
                <div className="text-center py-12">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No badges found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search term</p>
                </div>
            )}
        </div>
    )
}