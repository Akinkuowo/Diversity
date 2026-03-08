'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">DN</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Diversity<span className="text-purple-600">Network</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-gray-600 hover:text-purple-600 transition-colors">
              Features
            </Link>
            <Link href="/#solutions" className="text-gray-600 hover:text-purple-600 transition-colors">
              Solutions
            </Link>
            <Link href="/#impact" className="text-gray-600 hover:text-purple-600 transition-colors">
              Impact
            </Link>
            <Link href="/#testimonials" className="text-gray-600 hover:text-purple-600 transition-colors">
              Testimonials
            </Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">
              Pricing
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700">
                Join Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link href="/#features" className="block py-2 text-gray-600 hover:text-purple-600">
              Features
            </Link>
            <Link href="/#solutions" className="block py-2 text-gray-600 hover:text-purple-600">
              Solutions
            </Link>
            <Link href="/#impact" className="block py-2 text-gray-600 hover:text-purple-600">
              Impact
            </Link>
            <Link href="/#testimonials" className="block py-2 text-gray-600 hover:text-purple-600">
              Testimonials
            </Link>
            <Link href="/#pricing" className="block py-2 text-gray-600 hover:text-purple-600">
              Pricing
            </Link>
            <div className="pt-4 border-t space-y-2">
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/register" className="block">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  Join Free
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
