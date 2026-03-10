'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

export default function VerifyEmail() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' })
  const { toast } = useToast()

  const handleResend = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Email address is missing.',
        variant: 'destructive',
      })
      return
    }

    setIsResending(true)
    setResendStatus({ type: null, message: '' })
    try {
      const response = await fetch('http://localhost:4000/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification link')
      }

      setResendStatus({
        type: 'success',
        message: `A new verification link has been sent to ${email}.`
      })

      toast({
        title: 'Verification link sent',
        description: `A new link has been sent to ${email}.`,
      })
    } catch (error: any) {
      const errorMessage = error.message || 'Something went wrong. Please try again.'
      setResendStatus({
        type: 'error',
        message: errorMessage
      })

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 text-center relative z-10"
      >
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto relative">
            <Mail className="w-12 h-12 text-secondary-600" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
            </motion.div>
          </div>

          {/* Decorative blobs */}
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>

        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-primary-600 mb-4">
          Check your email
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          We've sent a verification link to <br />
          <span className="font-semibold text-gray-900">{email || 'your email'}</span>. <br />
          Please click the link to activate your account.
        </p>

        {/* Professional Alert */}
        {resendStatus.type && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            className={`p-4 rounded-xl text-sm font-medium flex items-start space-x-3 text-left ${resendStatus.type === 'success'
                ? 'bg-green-50 border border-green-100 text-green-800'
                : 'bg-red-50 border border-red-100 text-red-800'
              }`}
          >
            <div className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center ${resendStatus.type === 'success' ? 'bg-green-200' : 'bg-red-200'
              }`}>
              {resendStatus.type === 'success' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
              ) : (
                <span className="font-bold text-xs font-sans">!</span>
              )}
            </div>
            <p className="flex-1">{resendStatus.message}</p>
          </motion.div>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleResend}
            disabled={isResending}
            className="w-full bg-primary-600 text-white hover:from-secondary-700 hover:to-secondary-700 h-12 rounded-xl text-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isResending ? (
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            ) : (
              'Resend Verification Link'
            )}
          </Button>

          <Link href="/login" className="block">
            <Button variant="ghost" className="w-full text-gray-500 hover:text-secondary-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or <br />
            <button
              onClick={handleResend}
              className="text-secondary-600 font-medium hover:underline"
            >
              try another email address
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
