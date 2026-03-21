import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout'
import BusinessManagement from '@/app/components/admin/BusinessManagement'

export default function AdminBusinessesPage() {
    return (
        <DashboardLayout>
            <BusinessManagement />
        </DashboardLayout>
    )
}
