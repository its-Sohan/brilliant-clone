"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Lock, ChevronRight, CheckCircle2, Flame, Clock, FileText } from "lucide-react"

interface Lesson {
  id: string
  order: number
  title: string
  estimatedMinutes: number
  _count: { blocks: number }
}

const STORAGE_KEY = "kakkoii_progress"
const STREAK_KEY = "kakkoii_streak"

export function CourseProgress({
  lessons,
  slug,
  completedIds: serverCompleted,
  initialStreak = 0,
}: {
  lessons: Lesson[]
  slug: string
  completedIds: string[]
  initialStreak?: number
}) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(serverCompleted))
  const [streak, setStreak] = useState(initialStreak)

  useEffect(() => {
    const merged = new Set(serverCompleted)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored) as Record<string, { completedAt: string }>
        for (const id of Object.keys(data)) {
          if (lessons.some((l) => l.id === id)) {
            merged.add(id)
          }
        }
      }
    } catch {}
    setCompleted(merged)

    if (!initialStreak) {
      try {
        const streakData = localStorage.getItem(STREAK_KEY)
        if (streakData) {
          const { count, date } = JSON.parse(streakData)
          const today = new Date().toISOString().split("T")[0]
          if (date === today) {
            setStreak(count)
          }
        }
      } catch {}
    }
  }, [serverCompleted, lessons, initialStreak])

  const completedCount = completed.size

  return (
    <div className="space-y-3">
      {streak > 0 && (
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Flame size={22} />
          </div>
          <div>
            <p className="text-sm font-medium flex items-center gap-1.5">
              <Flame size={16} className="text-amber-500" />
              {streak}-day streak
            </p>
            <p className="text-xs text-muted-foreground">Keep learning every day!</p>
          </div>
        </div>
      )}

      {lessons.map((lesson, i) => {
        const isCompleted = completed.has(lesson.id)
        const isLocked = i > 0 && !completed.has(lessons[i - 1].id)

        const content = (
          <div
            className={`flex items-center gap-4 rounded-xl border bg-card p-5 transition-all ${
              isCompleted
                ? "border-primary/30"
                : isLocked
                  ? "border-muted opacity-50"
                  : "hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                isCompleted
                  ? "bg-primary/20 text-primary"
                  : isLocked
                    ? "bg-muted text-muted-foreground"
                    : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 size={20} />
              ) : isLocked ? (
                <Lock size={15} />
              ) : (
                i + 1
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p
                  className={`font-medium transition-colors ${
                    isCompleted || isLocked ? "text-muted-foreground" : "group-hover:text-primary"
                  }`}
                >
                  {lesson.title}
                </p>
                {isCompleted && (
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  {lesson.estimatedMinutes} min
                </span>
                <span className="flex items-center gap-1">
                  <FileText size={13} />
                  {lesson._count.blocks} exercise{lesson._count.blocks !== 1 ? "s" : ""}
                </span>
              </p>
            </div>
            {isCompleted ? (
              <span className="text-xs text-primary font-medium">Done</span>
            ) : isLocked ? (
              <Lock size={15} className="text-muted-foreground/40" />
            ) : (
              <ChevronRight size={18} className="text-muted-foreground/40 group-hover:text-primary transition-colors" />
            )}
          </div>
        )

        if (isLocked) {
          return <div key={lesson.id}>{content}</div>
        }

        return (
          <Link key={lesson.id} href={`/courses/${slug}/${lesson.id}`} className="block">
            {content}
          </Link>
        )
      })}

      <p className="mt-4 text-xs text-muted-foreground text-center">
        {completedCount} / {lessons.length} lessons completed
      </p>
    </div>
  )
}
