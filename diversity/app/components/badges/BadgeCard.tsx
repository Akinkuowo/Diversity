'use client'

import { motion } from 'framer-motion'
import { Award, Medal, Star, Shield, Crown, Sparkles, CheckCircle, Lock, Gift, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { cn } from '@/lib/utils'

export type BadgeLevel = 'supporter' | 'partner' | 'champion' | 'platinum' | 'gold' | 'silver' | 'bronze'
export type BadgeStatus = 'earned' | 'in-progress' | 'locked'

interface BadgeProps {
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
    onClick?: () => void
    className?: string
}

const levelColors = {
    supporter: {
        bg: 'from-blue-500 to-cyan-500',
        text: 'text-blue-600',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        gradient: 'bg-primary-50',
    },
    partner: {
        bg: 'from-secondary-500 to-pink-500',
        text: 'text-secondary-600',
        border: 'border-secondary-200',
        icon: 'text-secondary-600',
        gradient: 'bg-primary-50',
    },
    champion: {
        bg: 'from-yellow-500 to-primary-500',
        text: 'text-yellow-600',
        border: 'border-yellow-200',
        icon: 'text-yellow-600',
        gradient: 'bg-primary-50',
    },
    platinum: {
        bg: 'from-gray-400 to-gray-600',
        text: 'text-gray-600',
        border: 'border-gray-200',
        icon: 'text-gray-600',
        gradient: 'bg-primary-50',
    },
    gold: {
        bg: 'from-yellow-400 to-yellow-600',
        text: 'text-yellow-600',
        border: 'border-yellow-200',
        icon: 'text-yellow-600',
        gradient: 'bg-primary-50',
    },
    silver: {
        bg: 'from-gray-300 to-gray-500',
        text: 'text-gray-500',
        border: 'border-gray-200',
        icon: 'text-gray-500',
        gradient: 'bg-primary-50',
    },
    bronze: {
        bg: 'from-amber-600 to-primary-700',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: 'text-amber-700',
        gradient: 'bg-primary-50',
    },
}

const statusIcons = {
    earned: CheckCircle,
    'in-progress': TrendingUp,
    locked: Lock,
}

const levelIcons = {
    supporter: Shield,
    partner: Award,
    champion: Crown,
    platinum: Star,
    gold: Medal,
    silver: Sparkles,
    bronze: Gift,
}

export function BadgeCard({
    name,
    description,
    level,
    status,
    progress = 0,
    icon,
    requirements = [],
    dateEarned,
    points,
    category,
    onClick,
    className,
}: BadgeProps) {
    const colors = levelColors[level]
    const StatusIcon = statusIcons[status]
    const LevelIcon = levelIcons[level]

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "cursor-pointer transition-all duration-200",
                status === 'locked' && 'opacity-60',
                className
            )}
            onClick={onClick}
        >
            <Card className={cn(
                "overflow-hidden border-2 hover:shadow-lg transition-shadow",
                status === 'earned' ? colors.border : 'border-gray-200'
            )}>
                {/* Badge Header */}
                <div className={cn(
                    "h-24 bg-gradient-to-r p-4 relative overflow-hidden",
                    colors.bg
                )}>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-8 -mb-8" />

                    <div className="relative z-10 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                {icon || <LevelIcon className={cn("w-6 h-6", colors.icon)} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{name}</h3>
                                {category && (
                                    <p className="text-xs text-white/80">{category}</p>
                                )}
                            </div>
                        </div>
                        <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
                            <StatusIcon className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>

                {/* Badge Content */}
                <CardContent className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {description}
                    </p>

                    {status === 'earned' && dateEarned && (
                        <div className="flex items-center justify-between mb-3 text-sm">
                            <span className="text-gray-500">Earned on</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {new Date(dateEarned).toLocaleDateString()}
                            </span>
                        </div>
                    )}

                    {status === 'in-progress' && (
                        <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Progress</span>
                                <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
                            </div>
                            <Progress value={progress} className={cn("h-2", colors.bg)} />
                        </div>
                    )}

                    {requirements.length > 0 && (
                        <div className="space-y-2 mt-3">
                            <p className="text-xs font-medium text-gray-500 uppercase">Requirements</p>
                            {requirements.map((req, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full mt-1.5",
                                        status === 'earned' ? 'bg-green-500' : 'bg-gray-300'
                                    )} />
                                    <span className={cn(
                                        "text-sm",
                                        status === 'earned' ? 'text-gray-700' : 'text-gray-500'
                                    )}>{req}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {points && (
                        <div className="mt-4 flex items-center justify-between">
                            <Badge variant="secondary" className="bg-secondary-100 text-secondary-600">
                                {points} points
                            </Badge>
                            {status === 'earned' && (
                                <Badge className="bg-green-100 text-green-600">Earned</Badge>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}