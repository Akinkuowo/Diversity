'use client'

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
    Twitter,
    Linkedin,
    Facebook,
    Link2,
    X,
    Clock,
    Trophy
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { BadgeLevel, BadgeStatus } from './BadgeCard'
import { cn } from '@/lib/utils'

interface BadgeDetailProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    badge: {
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
        image?: string
        holders?: number
        createdAt?: string
        updatedAt?: string
    }
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

const levelIcons = {
    supporter: Shield,
    partner: Award,
    champion: Crown,
    platinum: Star,
    gold: Medal,
    silver: Sparkles,
    bronze: Gift,
}

export function BadgeDetail({ open, onOpenChange, badge }: BadgeDetailProps) {
    const colors = levelColors[badge.level]
    const LevelIcon = levelIcons[badge.level]

    const shareOnSocial = (platform: string) => {
        const text = `I earned the ${badge.name} badge on Diversity Network!`
        const url = window.location.href

        let shareUrl = ''
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
                break
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
                break
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                break
        }

        window.open(shareUrl, '_blank')
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Badge Details</DialogTitle>
                    <DialogDescription>
                        View detailed information about this badge
                    </DialogDescription>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Badge Header */}
                    <div className={cn(
                        "rounded-xl p-6 bg-gradient-to-r text-white relative overflow-hidden",
                        colors.bg
                    )}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16" />

                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                                {badge.icon || <LevelIcon className={cn("w-10 h-10", colors.icon)} />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{badge.name}</h2>
                                <p className="text-white/90">{badge.category}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                                        {badge.level}
                                    </Badge>
                                    {badge.points && (
                                        <Badge variant="secondary" className="bg-white/20 text-white border-0">
                                            {badge.points} points
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status and Progress */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    {badge.status === 'earned' && (
                                        <>
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <span className="font-medium">Earned on {new Date(badge.dateEarned!).toLocaleDateString()}</span>
                                        </>
                                    )}
                                    {badge.status === 'in-progress' && (
                                        <>
                                            <TrendingUp className="w-5 h-5 text-blue-500" />
                                            <span className="font-medium">In Progress - {badge.progress}% complete</span>
                                        </>
                                    )}
                                    {badge.status === 'locked' && (
                                        <>
                                            <Lock className="w-5 h-5 text-gray-500" />
                                            <span className="font-medium">Locked - Meet requirements to unlock</span>
                                        </>
                                    )}
                                </div>
                                {badge.holders && (
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Users className="w-4 h-4" />
                                        <span>{badge.holders} holders</span>
                                    </div>
                                )}
                            </div>

                            {badge.status === 'in-progress' && badge.progress && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Progress</span>
                                        <span className="font-medium">{badge.progress}%</span>
                                    </div>
                                    <Progress value={badge.progress} className={cn("h-2", colors.bg)} />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-2">About this badge</h3>
                            <p className="text-gray-600 dark:text-gray-400">{badge.description}</p>
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    {badge.requirements && badge.requirements.length > 0 && (
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Requirements</h3>
                                <div className="space-y-3">
                                    {badge.requirements.map((req, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className={cn(
                                                "w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                                                badge.status === 'earned' ? 'bg-green-100' : 'bg-gray-100'
                                            )}>
                                                {badge.status === 'earned' ? (
                                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                                ) : (
                                                    <Target className="w-3 h-3 text-gray-500" />
                                                )}
                                            </div>
                                            <span className={cn(
                                                "text-sm",
                                                badge.status === 'earned' ? 'text-gray-900' : 'text-gray-600'
                                            )}>{req}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4">
                        {badge.createdAt && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Created</span>
                                    </div>
                                    <p className="font-medium">{new Date(badge.createdAt).toLocaleDateString()}</p>
                                </CardContent>
                            </Card>
                        )}
                        {badge.updatedAt && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Clock className="w-4 h-4" />
                                        <span>Updated</span>
                                    </div>
                                    <p className="font-medium">{new Date(badge.updatedAt).toLocaleDateString()}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Actions */}
                    {badge.status === 'earned' && (
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => shareOnSocial('twitter')}>
                                    <Twitter className="w-4 h-4 mr-2" />
                                    Twitter
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => shareOnSocial('linkedin')}>
                                    <Linkedin className="w-4 h-4 mr-2" />
                                    LinkedIn
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => shareOnSocial('facebook')}>
                                    <Facebook className="w-4 h-4 mr-2" />
                                    Facebook
                                </Button>
                            </div>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    )}

                    {badge.status === 'locked' && (
                        <Button className="w-full bg-primary-600 text-white">
                            View Requirements
                        </Button>
                    )}

                    {badge.status === 'in-progress' && (
                        <Button className="w-full bg-primary-500 text-white">
                            Continue Progress
                        </Button>
                    )}
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}