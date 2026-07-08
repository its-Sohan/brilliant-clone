"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, ArrowLeft, TrendingUp, Activity } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts"

interface BlockStat {
  blockId: string
  blockType: string
  lessonTitle: string
  courseTitle: string
  difficulty: number
  totalAttempts: number
  firstTrySuccess: number
  avgTimeMs: number
}

interface LessonStat {
  lessonTitle: string
  totalBlocks: number
  startedCount: number
  completedCount: number
  completionRate: number
}

interface TimelinePoint {
  date: string
  attempts: number
  correct: number
  accuracy: number
}

interface AnalyticsData {
  blockStats: BlockStat[]
  lessonStats: LessonStat[]
  timeline: TimelinePoint[]
  totalResponses: number
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="p-6">
      <p className="text-sm text-muted-foreground">Loading analytics...</p>
    </div>
  )

  if (!data) return (
    <div className="p-6">
      <p className="text-sm text-destructive">Failed to load analytics.</p>
    </div>
  )

  const topBlocks = [...data.blockStats].sort((a, b) => b.totalAttempts - a.totalAttempts).slice(0, 10)

  return (
    <div className="p-6 space-y-8">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} />
        Admin
      </Link>

      <div className="flex items-center gap-3 mt-2 mb-2">
        <div className="inline-flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
          <BarChart3 size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">{data.totalResponses} total responses recorded</p>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{data.blockStats.length}</p>
          <p className="text-xs text-muted-foreground">Exercise blocks</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{data.lessonStats.length}</p>
          <p className="text-xs text-muted-foreground">Lessons</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{data.totalResponses}</p>
          <p className="text-xs text-muted-foreground">Total responses</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold">
            {data.blockStats.length > 0
              ? Math.round(data.blockStats.reduce((s, b) => s + b.firstTrySuccess, 0) / data.blockStats.length)
              : 0}%
          </p>
          <p className="text-xs text-muted-foreground">Avg success rate</p>
        </div>
      </div>

      {/* Accuracy trend */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-primary" />
          Accuracy Trend (14 days)
        </h2>
        {data.timeline.length > 0 ? (
          <div className="rounded-xl border bg-card p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="currentColor" strokeOpacity={0.3} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="currentColor" strokeOpacity={0.3} />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name="Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No response data in the last 14 days.</p>
        )}
      </section>

      {/* Top blocks by attempts */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity size={18} className="text-primary" />
          Most Attempted Blocks
        </h2>
        <div className="rounded-xl border bg-card p-4">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topBlocks}>
              <XAxis dataKey="lessonTitle" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.3} />
              <YAxis tick={{ fontSize: 11 }} stroke="currentColor" strokeOpacity={0.3} />
              <Tooltip />
              <Bar dataKey="totalAttempts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Attempts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Block stats table */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Block Performance</h2>
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Block</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Lesson</th>
                  <th className="text-center px-4 py-2 font-medium text-muted-foreground">Attempts</th>
                  <th className="text-center px-4 py-2 font-medium text-muted-foreground">Success</th>
                  <th className="text-center px-4 py-2 font-medium text-muted-foreground">Avg Time</th>
                </tr>
              </thead>
              <tbody>
                {data.blockStats.map((b, i) => (
                  <tr key={b.blockId} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-mono text-muted-foreground">{b.blockType.replace(/_/g, " ")}</span>
                      <span className="ml-2 text-xs text-muted-foreground/50">D{b.difficulty}</span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{b.lessonTitle}</td>
                    <td className="px-4 py-2.5 text-center">{b.totalAttempts}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={b.firstTrySuccess >= 70 ? "text-green-500" : b.firstTrySuccess >= 40 ? "text-amber-500" : "text-red-500"}>
                        {b.firstTrySuccess}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center text-xs text-muted-foreground">
                      {b.avgTimeMs > 0 ? `${Math.round(b.avgTimeMs / 1000)}s` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
