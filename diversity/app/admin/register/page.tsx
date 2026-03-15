'use client'

import AdminRegisterForm from '@/app/components/admin/AdminRegisterForm';
import Navbar from '@/components/navbar';

export default function AdminRegisterPage() {
    return (
        <div className="relative min-h-screen bg-slate-950">
            <Navbar />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary-500/5 rounded-full blur-[100px]" />
            </div>
            <AdminRegisterForm />
        </div>
    );
}
