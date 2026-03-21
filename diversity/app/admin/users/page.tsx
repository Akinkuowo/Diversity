'use client'

import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout'
import UserManagement from '@/app/components/admin/UserManagement'

export default function AdminUsersPage() {
    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <UserManagement />
            </div>
        </DashboardLayout>
    )
}
