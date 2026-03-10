'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X, LogOut, LayoutDashboard, UserCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/use-toast'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)

  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(pathname)

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    // Check for user in localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to parse user', e)
      }
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast({
      title: 'Logged out successfully',
      description: 'You have been signed out.',
    })
    router.push('/')
  }

  const getDashboardPath = () => {
    if (!user) return '/login'
    const roleRedirects: Record<string, string> = {
      ADMIN: '/admin/dashboard',
      VOLUNTEER: '/volunteer/dashboard',
      BUSINESS: '/business/dashboard',
      LEARNER: '/learner/dashboard',
      COMMUNITY_MEMBER: '/community/dashboard',
    }
    return roleRedirects[user.role] || '/community/dashboard'
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' : 'bg-transparent'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-secondary-200">
              <span className="text-white font-bold text-xl">DN</span>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Diversity<span className="text-secondary-600">Network</span></span>
          </Link>

          {/* Desktop Navigation */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-gray-600 hover:text-secondary-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="/#solutions" className="text-gray-600 hover:text-secondary-600 transition-colors font-medium">
                Solutions
              </Link>
              <Link href="/#impact" className="text-gray-600 hover:text-secondary-600 transition-colors font-medium">
                Impact
              </Link>
              <Link href="/#testimonials" className="text-gray-600 hover:text-secondary-600 transition-colors font-medium">
                Testimonials
              </Link>
            </div>
          )}

          {/* CTA Buttons / User Menu */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href={getDashboardPath()}>
                    <Button variant="ghost" className="text-secondary-600 font-semibold hover:bg-secondary-50">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 border-2 border-secondary-100">
                          {user.profile?.avatar && <AvatarImage src={user.profile.avatar} />}
                          <AvatarFallback className="bg-secondary-600 text-white font-bold">
                            {user.firstName?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-bold leading-none">{user.firstName} {user.lastName}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/profile')}>
                        <UserCircle className="mr-2 h-4 w-4 text-gray-500" />
                        <span>Profile Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 cursor-pointer font-semibold" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="font-semibold text-gray-700">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-primary-600 text-white hover:from-secondary-700 hover:to-secondary-700 font-bold px-6 shadow-md shadow-secondary-100 rounded-xl transition-all active:scale-95">
                      Join Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isAuthPage && (
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              <Link href="/#features" className="block py-2 text-gray-600 hover:text-secondary-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                Features
              </Link>
              <Link href="/#solutions" className="block py-2 text-gray-600 hover:text-secondary-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                Solutions
              </Link>
              <Link href="/#impact" className="block py-2 text-gray-600 hover:text-secondary-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                Impact
              </Link>
              <Link href="/#testimonials" className="block py-2 text-gray-600 hover:text-secondary-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                Testimonials
              </Link>

              <div className="pt-4 border-t border-gray-50 space-y-3">
                {user ? (
                  <>
                    <Link href={getDashboardPath()} className="block" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-secondary-600 text-white font-bold h-12 rounded-xl">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full text-red-600 border-red-100 hover:bg-red-50 h-12 rounded-xl" onClick={handleLogout}>
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-12 rounded-xl font-bold">Sign In</Button>
                    </Link>
                    <Link href="/register" className="block" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full h-12 bg-primary-600 text-white font-bold rounded-xl">
                        Join Free
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
