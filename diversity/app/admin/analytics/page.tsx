'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import AdminAnalytics from '../../components/admin/AdminAnalytics'
import { api } from '@/lib/api'

export default function AdminAnalyticsPage() {
    const router = useRouter()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await api.get('/me')
                if (user?.role !== 'ADMIN') {
                    router.push('/')
                }
            } catch {
                router.push('/login')
            } finally {
                setChecking(false)
            }
        }
        checkAuth()
    }, [router])

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            </div>
        )
    }

    return (
        <DashboardLayout>
            <AdminAnalytics />
        </DashboardLayout>
    )
}
