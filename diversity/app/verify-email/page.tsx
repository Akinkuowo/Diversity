'use client'

import VerifyEmail from '../components/verify-email'
import Navbar from '@/components/navbar'

export default function Page() {
  return (
    <main className="relative min-h-screen bg-slate-50 overflow-hidden">
      <Navbar />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="pt-24 pb-12 relative z-10">
        <VerifyEmail />
      </div>
    </main>
  )
}
