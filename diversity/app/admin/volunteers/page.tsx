'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { VolunteerManagement } from '../../components/admin/VolunteerManagement'
import { api } from '@/lib/api'

export default function AdminVolunteersPage() {
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await api.get('/me')
                setUser(userData)
            } catch (err) {
                console.error("Failed to fetch user:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUser()
    }, [])

    if (isLoading || !user) return null
    if (user.role !== 'ADMIN') return null

    return (
        <DashboardLayout role={user.role}>
            <div className="max-w-7xl mx-auto space-y-8 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <VolunteerManagement />
                </motion.div>
            </div>
        </DashboardLayout>
    )
}
