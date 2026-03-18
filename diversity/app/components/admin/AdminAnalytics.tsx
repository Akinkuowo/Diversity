'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Building2, BookOpen, CalendarDays, MessageSquare,
  TrendingUp, TrendingDown, Award, Network, FileText
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { api } from '@/lib/api'

// ─────────────────── types ───────────────────
interface AnalyticsData {
  overview: {
    totalUsers: number
    totalBusinesses: number
    totalCourses: number
    totalEnrollments: number
    totalEvents: number
    totalEventRegistrations: number
    totalForumPosts: number
    totalCommunityPosts: number
    totalCertificates: number
    totalConnections: number
    userGrowthPct: number
    enrollmentGrowthPct: number
  }
  timeSeries: {
    labels: string[]
    users: number[]
    enrollments: number[]
    events: number[]
    forumPosts: number[]
    communityPosts: number[]
  }
  roleDistribution: { role: string; count: number }[]
  coursesByCategory: { category: string; count: number }[]
  topCourses: { id: string; title: string; enrollments: number }[]
  businessesByIndustry: { industry: string; count: number }[]
}

// ─────────────────── palette ───────────────────
const PALETTE = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa']

// ─────────────────── helpers ───────────────────
const formatRole = (role: string) =>
  role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

const GrowthBadge = ({ pct }: { pct: number }) => {
  const positive = pct >= 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
      {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(pct)}% vs last month
    </span>
  )
}

// ─────────────────── sub-components ───────────────────
function KPICard({ icon: Icon, label, value, growth, color }: {
  icon: React.ElementType; label: string; value: number; growth?: number; color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden group hover:shadow-lg transition-all"
    >
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity`} style={{ background: color }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{value.toLocaleString()}</p>
          {growth !== undefined && (
            <div className="mt-2"><GrowthBadge pct={growth} /></div>
          )}
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: color + '22' }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </motion.div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-black text-slate-800 dark:text-white mb-4 tracking-tight">{children}</h2>
}

// ─────────────────── main component ───────────────────
export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSeries, setActiveSeries] = useState<'users' | 'enrollments' | 'events' | 'forumPosts'>('users')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/admin/analytics')
        setData(res)
      } catch (e: any) {
        setError('Failed to load analytics data.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl" />)}
        </div>
        <div className="h-72 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
          <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 font-semibold">{error || 'No data.'}</div>
    )
  }

  const { overview, timeSeries, roleDistribution, coursesByCategory, topCourses, businessesByIndustry } = data

  // Build the line chart series data
  const lineData = timeSeries.labels.map((label, i) => ({
    month: label,
    users: timeSeries.users[i],
    enrollments: timeSeries.enrollments[i],
    events: timeSeries.events[i],
    forumPosts: timeSeries.forumPosts[i],
    communityPosts: timeSeries.communityPosts[i],
  }))

  const seriesOptions = [
    { key: 'users', label: 'New Users', color: '#6366f1' },
    { key: 'enrollments', label: 'Enrollments', color: '#22d3ee' },
    { key: 'events', label: 'Events Created', color: '#f59e0b' },
    { key: 'forumPosts', label: 'Forum Posts', color: '#10b981' },
  ] as const

  return (
    <div className="space-y-8 pb-12">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Analytics</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Platform-wide metrics & growth insights</p>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 text-sm font-bold">
          Last 6 months
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Total Users" value={overview.totalUsers} growth={overview.userGrowthPct} color="#6366f1" />
        <KPICard icon={Building2} label="Businesses" value={overview.totalBusinesses} color="#f59e0b" />
        <KPICard icon={BookOpen} label="Courses" value={overview.totalCourses} color="#22d3ee" />
        <KPICard icon={Award} label="Enrollments" value={overview.totalEnrollments} growth={overview.enrollmentGrowthPct} color="#10b981" />
        <KPICard icon={CalendarDays} label="Events" value={overview.totalEvents} color="#f43f5e" />
        <KPICard icon={MessageSquare} label="Forum Posts" value={overview.totalForumPosts} color="#a78bfa" />
        <KPICard icon={FileText} label="Certificates" value={overview.totalCertificates} color="#f59e0b" />
        <KPICard icon={Network} label="Connections" value={overview.totalConnections} color="#22d3ee" />
      </div>

      {/* ── Time-series line chart ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <SectionTitle>Monthly Growth</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {seriesOptions.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveSeries(s.key as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeSeries === s.key ? 'text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                style={activeSeries === s.key ? { background: s.color } : {}}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={lineData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 600 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: 13 }}
              labelStyle={{ fontWeight: 700 }}
            />
            {seriesOptions.map(s => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={activeSeries === s.key ? 3 : 1.5}
                dot={activeSeries === s.key ? { r: 4, fillOpacity: 1 } : false}
                strokeOpacity={activeSeries === s.key ? 1 : 0.25}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Middle row: Role Donut + Top Courses ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Role Donut */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <SectionTitle>User Roles</SectionTitle>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  dataKey="count"
                  nameKey="role"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {roleDistribution.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: any, n: any) => [v, formatRole(n)]}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {roleDistribution.map((r, i) => (
                <div key={r.role} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatRole(r.role)}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 dark:text-white">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <SectionTitle>Top Courses by Enrollment</SectionTitle>
          <div className="space-y-3">
            {topCourses.length === 0 && (
              <p className="text-slate-400 text-sm">No courses yet.</p>
            )}
            {topCourses.map((c, i) => {
              const max = topCourses[0]?.enrollments || 1
              const pct = Math.round((c.enrollments / max) * 100)
              return (
                <div key={c.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                      <span className="text-slate-400 mr-1">#{i + 1}</span>{c.title}
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{c.enrollments}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: PALETTE[i % PALETTE.length] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom row: Courses by Category + Businesses by Industry ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Courses by Category */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <SectionTitle>Courses by Category</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={coursesByCategory} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="category" width={90} tick={{ fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }}
              />
              <Bar dataKey="count" name="Courses" radius={[0, 8, 8, 0]}>
                {coursesByCategory.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Businesses by Industry */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <SectionTitle>Businesses by Industry</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={businessesByIndustry} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="industry" width={90} tick={{ fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }}
              />
              <Bar dataKey="count" name="Businesses" radius={[0, 8, 8, 0]}>
                {businessesByIndustry.map((_, i) => (
                  <Cell key={i} fill={PALETTE[(i + 2) % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Community Activity sparkline ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <SectionTitle>Community Activity (Forum + Posts)</SectionTitle>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={lineData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 600 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: 13 }}
              labelStyle={{ fontWeight: 700 }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
            <Bar dataKey="forumPosts" name="Forum Posts" stackId="a" fill="#a78bfa" radius={[0, 0, 0, 0]} />
            <Bar dataKey="communityPosts" name="Community Posts" stackId="a" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}
