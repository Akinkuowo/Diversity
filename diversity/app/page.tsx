'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import {
  Users,
  BookOpen,
  Calendar,
  Heart,
  Award,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
  Zap,
  MessageCircle,
  Target,
  Briefcase,
  GraduationCap,
  Coffee,
  Sparkles,
  ChevronRight,
  Play,
  Quote,
  Mail,
  MapPin,
  Phone,
  Clock,
  Menu,
  X
} from 'lucide-react'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
}

export default function HomePage() {
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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-100 mb-6">
                <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-600">Welcome to the future of inclusive communities</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
              >
                Building Inclusive
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  Communities Together
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
              >
                Join the leading platform for diversity, equity, and inclusion. Connect with businesses, access learning resources, and make a real impact in your community.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
              >
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 text-lg px-8">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 text-lg px-8">
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0"
              >
                <div>
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Members</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Businesses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Hours</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Hero Image/Animation */}
            <motion.div
              variants={scaleIn}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[500px]">
                {/* Main Image Placeholder - Replace with actual image */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold">Community Meetup</div>
                        <div className="text-sm opacity-80">120+ attending</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-10 -right-10 bg-white rounded-xl shadow-xl p-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Diversity Champion</div>
                      <div className="text-sm text-gray-600">Badge earned</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-10 -left-10 bg-white rounded-xl shadow-xl p-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold">EDI Course</div>
                      <div className="text-sm text-gray-600">85% completed</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 mb-8">Trusted by leading organizations</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-50">
            {/* Company logos - replace with actual logos */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-300 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to build an inclusive community
            </h2>
            <p className="text-xl text-gray-600">
              Our platform provides comprehensive tools for organizations and individuals to promote diversity and inclusion.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Briefcase className="w-8 h-8 text-purple-600" />,
                title: "Business Directory",
                description: "Showcase your commitment to diversity with verified badges and public pledges.",
                color: "purple"
              },
              {
                icon: <GraduationCap className="w-8 h-8 text-indigo-600" />,
                title: "EDI Learning",
                description: "Access certified courses on cultural awareness, inclusive leadership, and more.",
                color: "indigo"
              },
              {
                icon: <Heart className="w-8 h-8 text-pink-600" />,
                title: "Volunteer Management",
                description: "Organize volunteer opportunities, track hours, and recognize contributions.",
                color: "pink"
              },
              {
                icon: <Calendar className="w-8 h-8 text-green-600" />,
                title: "Events & Workshops",
                description: "Host inclusive events with integrated ticketing and QR code check-ins.",
                color: "green"
              },
              {
                icon: <Target className="w-8 h-8 text-red-600" />,
                title: "Impact Dashboard",
                description: "Track your organization's diversity metrics and generate impact reports.",
                color: "red"
              },
              {
                icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
                title: "Community Engagement",
                description: "Foster discussions with forums, announcements, and direct messaging.",
                color: "blue"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link href={`/${feature.title.toLowerCase().replace(' ', '-')}`} className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700">
                  Learn more
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tailored solutions for every role
            </h2>
            <p className="text-xl text-gray-600">
              Whether you're a business, volunteer, or learner, we have the tools you need.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: "For Businesses",
                icon: <Briefcase className="w-12 h-12 text-white" />,
                features: [
                  "Diversity badge system",
                  "CSR impact reporting",
                  "Employee training dashboard",
                  "Sponsorship opportunities",
                  "Community recognition"
                ],
                gradient: "from-purple-600 to-indigo-600",
                buttonText: "Register your business"
              },
              {
                title: "For Volunteers",
                icon: <Heart className="w-12 h-12 text-white" />,
                features: [
                  "Skill-based matching",
                  "Hours tracking",
                  "Achievement badges",
                  "Event participation",
                  "Impact metrics"
                ],
                gradient: "from-pink-600 to-red-600",
                buttonText: "Start volunteering"
              },
              {
                title: "For Learners",
                icon: <BookOpen className="w-12 h-12 text-white" />,
                features: [
                  "Certified courses",
                  "Progress tracking",
                  "CPD hours",
                  "Interactive quizzes",
                  "Learning pathways"
                ],
                gradient: "from-green-600 to-teal-600",
                buttonText: "Explore courses"
              }
            ].map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className={`bg-gradient-to-r ${solution.gradient} p-8 text-center`}>
                  <div className="inline-flex p-4 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
                    {solution.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{solution.title}</h3>
                </div>
                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    {solution.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full bg-gradient-to-r ${solution.gradient} text-white hover:opacity-90`}>
                    {solution.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section id="impact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Making a measurable difference in communities
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our platform has helped organizations and individuals create meaningful impact through diversity and inclusion initiatives.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
                  <div className="text-gray-600">Active members</div>
                </div>
                <div className="bg-indigo-50 rounded-xl p-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
                  <div className="text-gray-600">Partner businesses</div>
                </div>
                <div className="bg-pink-50 rounded-xl p-6">
                  <div className="text-4xl font-bold text-pink-600 mb-2">50K+</div>
                  <div className="text-gray-600">Volunteer hours</div>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
                  <div className="text-gray-600">Courses & resources</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Impact Report 2024</h3>
                <p className="mb-6 opacity-90">See how our community is driving change</p>
                <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                  Download Report
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {/* Chart Placeholder */}
                <div className="mt-8 h-48 bg-white/20 rounded-xl backdrop-blur-sm p-4">
                  <div className="flex items-end justify-between h-full">
                    {[65, 45, 80, 55, 70, 85, 60].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="w-8 bg-white rounded-t-lg"
                      ></motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What our community says
            </h2>
            <p className="text-xl text-gray-600">
              Hear from organizations and individuals making a difference.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "This platform has transformed how we approach diversity in our organization. The learning resources are exceptional.",
                author: "Sarah Johnson",
                role: "HR Director, TechCorp",
                rating: 5,
                image: "SJ"
              },
              {
                quote: "As a volunteer, I've found meaningful opportunities that match my skills. The hours tracking and achievements keep me motivated.",
                author: "Michael Chen",
                role: "Community Volunteer",
                rating: 5,
                image: "MC"
              },
              {
                quote: "The courses are well-structured and the certification has helped me advance my career in DEI.",
                author: "Priya Patel",
                role: "DEI Consultant",
                rating: 5,
                image: "PP"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <Quote className="w-10 h-10 text-purple-200 mb-4" />
                <p className="text-gray-700 mb-6">{testimonial.quote}</p>

                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.image}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to make a difference?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of organizations and individuals committed to building inclusive communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600 text-lg px-8">
                  Contact Sales
                </Button>
              </Link>
            </div>
            <p className="text-white/80 mt-4 text-sm">
              No credit card required. Free forever for individuals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">DN</span>
                </div>
                <span className="font-bold text-xl text-white">DiversityNetwork</span>
              </div>
              <p className="text-gray-400 mb-6">
                Building inclusive communities through education, collaboration, and action.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'facebook', 'instagram'].map((social) => (
                  <Link key={social} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-gray-400 rounded"></div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                {['Features', 'Solutions', 'Pricing', 'Impact', 'Testimonials'].map((item) => (
                  <li key={item}>
                    <Link href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {['Blog', 'Documentation', 'Help Center', 'Community', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-purple-400" />
                  <a href="mailto:info@diversitynetwork.com" className="hover:text-white transition-colors">
                    info@diversitynetwork.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-purple-400" />
                  <a href="tel:+1234567890" className="hover:text-white transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-purple-400" />
                  <span>123 Inclusion Ave, Diversity City, DC 12345</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; 2024 Diversity Network Platform. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}