"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"

const STORAGE_KEY = "kakkoii_progress"
const STREAK_KEY = "kakkoii_streak"

interface StoredProgress {
  [lessonId: string]: {
    completedAt: string
    timeSpent: number
  }
}

function updateStreak() {
  try {
    const raw = localStorage.getItem(STREAK_KEY)
    const today = new Date().toISOString().split("T")[0]
    let count = 1

    if (raw) {
      const prev = JSON.parse(raw)
      const prevDate = new Date(prev.date)
      const diff = Math.round((Date.now() - prevDate.getTime()) / 86400000)

      if (diff === 0) {
        count = prev.count // same day, no change
      } else if (diff === 1) {
        count = prev.count + 1 // consecutive
      }
      // else reset to 1
    }

    localStorage.setItem(STREAK_KEY, JSON.stringify({ count, date: today }))
  } catch {}
}

export function useLessonProgress(lessonId: string) {
  const { data: session } = useSession()
  const [completed, setCompleted] = useState(false)
  const startTime = useRef(Date.now())

  const loadProgress = useCallback(() => {
    if (session?.user) return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: StoredProgress = JSON.parse(stored)
        if (data[lessonId]) {
          setCompleted(true)
        }
      }
    } catch {
      // localStorage not available
    }
  }, [lessonId, session?.user])

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  const markComplete = useCallback(async () => {
    const timeSpent = Math.round((Date.now() - startTime.current) / 1000)

    if (session?.user) {
      try {
        await fetch("/api/progress/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        })
      } catch {
        // ignore
      }
    }

    // Always save to localStorage for guest fallback
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const data: StoredProgress = stored ? JSON.parse(stored) : {}
      data[lessonId] = { completedAt: new Date().toISOString(), timeSpent }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // ignore
    }

    updateStreak()
    setCompleted(true)
  }, [lessonId, session?.user])

  return { completed, markComplete }
}
