"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"

const STORAGE_KEY = "kakkoii_progress"

interface StoredProgress {
  [lessonId: string]: {
    completedAt: string
    timeSpent: number
  }
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

    setCompleted(true)
  }, [lessonId, session?.user])

  return { completed, markComplete }
}
