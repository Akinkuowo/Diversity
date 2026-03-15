'use client'

import AdminLoginForm from '@/app/components/admin/AdminLoginForm';
import Navbar from '@/components/navbar';

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen bg-slate-950">
      <Navbar />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[120px]" />
      </div>
      <AdminLoginForm />
    </div>
  );
}
