"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Brain, BarChart3, ArrowLeft, RotateCcw, Sparkles, Zap, Target, Medal } from "lucide-react"

interface Skill {
  conceptTag: string
  pKnown: number
  mastered: boolean
  numAttempts: number
  numCorrect: number
}

interface ReviewItem {
  conceptTag: string
  easeFactor: number
  interval: number
}

interface RecommendBlock {
  id: string
  difficulty: number
  blockType: string
  conceptTags: string[]
  lessonTitle: string
}

interface RecData {
  skillLevel: number
  totalAttempts: number
  weakestConcepts: { conceptTag: string; pKnown: number }[]
  recommendedBlocks: RecommendBlock[]
  dailyChallenge: RecommendBlock | null
  masteredCount: number
  zoneRange: string
}

export default function DashboardPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [recs, setRecs] = useState<RecData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/progress/skill").then((r) => r.json()),
      fetch("/api/progress/review").then((r) => r.json()),
      fetch("/api/progress/recommend").then((r) => r.json()),
    ])
      .then(([skillData, reviewData, recData]) => {
        setSkills(Array.isArray(skillData) ? skillData : [])
        setReviews(Array.isArray(reviewData) ? reviewData : [])
        setRecs(recData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const mastered = skills.filter((s) => s.mastered)
  const learning = skills.filter((s) => !s.mastered)

  const handleReview = async (conceptTag: string, quality: number) => {
    await fetch("/api/progress/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conceptTag, quality }),
    })
    setReviews((prev) => prev.filter((r) => r.conceptTag !== conceptTag))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} />
        Back to courses
      </Link>

      <div className="flex items-center gap-3 mt-6 mb-8">
        <div className="inline-flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
          <Brain size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Knowledge</h1>
          <p className="text-muted-foreground text-sm">Track your concept mastery and find your next challenge</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <BarChart3 className="mx-auto size-10 text-muted-foreground/40 animate-pulse" />
          <p className="mt-4 text-muted-foreground">Loading your progress...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Overview cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="rounded-xl border bg-card p-4 text-center">
              <p className="text-2xl font-bold">{skills.length}</p>
              <p className="text-xs text-muted-foreground">Concepts</p>
            </div>
            <div className="rounded-xl border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-green-500">{mastered.length}</p>
              <p className="text-xs text-muted-foreground">Mastered</p>
            </div>
            <div className="rounded-xl border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-amber-500">{learning.length}</p>
              <p className="text-xs text-muted-foreground">Learning</p>
            </div>
            <div className="rounded-xl border bg-card p-4 text-center">
              <p className="text-2xl font-bold">{recs?.totalAttempts ?? skills.reduce((s, sk) => s + sk.numAttempts, 0)}</p>
              <p className="text-xs text-muted-foreground">Attempts</p>
            </div>
            <div className="rounded-xl border bg-card p-4 text-center">
              <p className="text-2xl font-bold">{recs?.skillLevel ?? "-"}</p>
              <p className="text-xs text-muted-foreground">Skill level</p>
            </div>
          </div>

          {/* Daily Challenge */}
          {recs?.dailyChallenge && (
            <section className="rounded-xl border-2 border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-card dark:from-purple-950/20 dark:to-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Medal size={20} className="text-purple-500" />
                <h2 className="text-lg font-semibold">Daily Challenge</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                A tough problem to stretch your skills (difficulty {recs.dailyChallenge.difficulty}/10)
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Concepts: {recs.dailyChallenge.conceptTags.join(", ")}
              </p>
              <Link
                href={`/courses`}
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 transition-colors"
              >
                <Zap size={16} />
                Take challenge
              </Link>
            </section>
          )}

          {/* Recommended blocks */}
          {recs?.recommendedBlocks && recs.recommendedBlocks.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} className="text-primary" />
                <h2 className="text-lg font-semibold">Recommended for you</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  Zone: {recs.zoneRange}
                </span>
              </div>
              <div className="space-y-3">
                {recs.recommendedBlocks.map((b) => (
                  <div key={b.id} className="rounded-xl border bg-card p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{b.lessonTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.blockType.replace(/_/g, " ")} &middot; Difficulty {b.difficulty}/10
                      </p>
                    </div>
                    <Link
                      href="/courses"
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      Start
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Due for review */}
          {reviews.length > 0 && (
            <section className="rounded-xl border-2 border-amber-200 dark:border-amber-900 bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <RotateCcw size={18} className="text-amber-500" />
                <h2 className="text-lg font-semibold">Due for review</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{reviews.length} items</span>
              </div>
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.conceptTag} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium capitalize text-sm">{r.conceptTag}</p>
                      <p className="text-xs text-muted-foreground">Ease: {r.easeFactor} &middot; Interval: {r.interval}d</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((q) => (
                        <button
                          key={q}
                          onClick={() => handleReview(r.conceptTag, q)}
                          className="size-7 rounded-full border text-xs hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title={`Rate ${q}`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Rate: 1=forgot &middot; 3=recalled &middot; 5=perfect</p>
            </section>
          )}

          {/* Mastered */}
          {mastered.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-green-500" />
                Mastered
              </h2>
              <div className="flex flex-wrap gap-2">
                {mastered.map((s) => (
                  <div key={s.conceptTag} className="rounded-full border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 px-3.5 py-1.5 text-sm text-green-700 dark:text-green-300">
                    {s.conceptTag} ({Math.round(s.pKnown * 100)}%)
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* In progress */}
          {learning.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">In progress</h2>
              <div className="space-y-3">
                {learning.map((s) => {
                  const pct = Math.round(s.pKnown * 100)
                  return (
                    <div key={s.conceptTag} className="rounded-xl border bg-card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{s.conceptTag}</span>
                        <span className="text-xs text-muted-foreground">{s.numCorrect}/{s.numAttempts} correct</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{pct}% confidence — {85 - pct}% to mastery</p>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
