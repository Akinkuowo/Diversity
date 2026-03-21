import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout'
import CourseManagement from '@/app/components/admin/CourseManagement'

export default function AdminCoursesPage() {
    return (
        <DashboardLayout>
            <CourseManagement />
        </DashboardLayout>
    )
}
