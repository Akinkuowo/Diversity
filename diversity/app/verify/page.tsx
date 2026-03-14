'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Loader2, Home, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'

export default function VerifyTokenPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided.')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:3001/verify?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message)
        } else {
          setStatus('error')
          setMessage(data.message || 'Verification failed.')
        }
      } catch (err) {
        setStatus('error')
        setMessage('Could not connect to the server. Please try again later.')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">
      <Navbar />
      
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="pt-32 pb-12 relative z-10 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 text-center"
        >
          {status === 'loading' && (
            <div className="py-12">
              <Loader2 className="w-16 h-16 text-secondary-600 animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
              <p className="text-gray-600">Please wait while we activate your account.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Email Verified!</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {message || 'Your account has been successfully activated. You can now access all features of Diversity Network.'}
              </p>
              <div className="space-y-4">
                <Link href="/login">
                  <Button className="w-full bg-primary-600 text-white h-12 rounded-xl text-lg font-medium">
                    Continue to Login
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Verification Failed</h2>
              <p className="text-red-500 mb-8 px-4">
                {message}
              </p>
              <div className="space-y-4">
                <Link href="/register">
                  <Button className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 h-12 rounded-xl">
                    Back to Registration
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" className="w-full text-gray-500">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
