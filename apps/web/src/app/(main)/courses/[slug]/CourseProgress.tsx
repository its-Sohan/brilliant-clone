"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"

interface Lesson {
  id: string
  order: number
  title: string
  estimatedMinutes: number
  _count: { blocks: number }
}

const STORAGE_KEY = "kakkoii_progress"

export function CourseProgress({
  lessons,
  slug,
  completedIds: serverCompleted,
}: {
  lessons: Lesson[]
  slug: string
  completedIds: string[]
}) {
  const { data: session } = useSession()
  const [localCompleted, setLocalCompleted] = useState<Set<string>>(new Set(serverCompleted))

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
    setLocalCompleted(merged)
  }, [serverCompleted, lessons])

  return (
    <div className="space-y-3">
      {lessons.map((lesson, i) => {
        const isCompleted = localCompleted.has(lesson.id)
        return (
          <Link
            key={lesson.id}
            href={`/courses/${slug}/${lesson.id}`}
            className={`group flex items-center gap-5 rounded-xl border bg-card p-5 transition-all ${
              isCompleted
                ? "border-primary/30 hover:border-primary"
                : "hover:shadow-md hover:-translate-y-0.5"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                isCompleted
                  ? "bg-primary/20 text-primary"
                  : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
              }`}
            >
              {isCompleted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium transition-colors ${isCompleted ? "text-muted-foreground" : "group-hover:text-primary"}`}>
                {lesson.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {lesson.estimatedMinutes} min &middot; {lesson._count.blocks} exercise{lesson._count.blocks !== 1 ? "s" : ""}
              </p>
            </div>
            {isCompleted ? (
              <span className="text-xs text-primary font-medium">Done</span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 text-muted-foreground/40 group-hover:text-primary transition-colors">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            )}
          </Link>
        )
      })}
    </div>
  )
}
