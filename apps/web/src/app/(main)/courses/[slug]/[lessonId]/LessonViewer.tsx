"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { BlockRenderer } from "@/components/blocks/BlockRenderer"
import type { BlockData, BlockResult } from "@/components/blocks/types"

interface LessonViewerProps {
  lesson: {
    id: string
    title: string
    estimatedMinutes: number
    blocks: BlockData[]
  }
  courseTitle: string
  courseSlug: string
  initialBlockIndex: number
}

export function LessonViewer({ lesson, courseTitle, courseSlug, initialBlockIndex }: LessonViewerProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentIndex, setCurrentIndex] = useState(initialBlockIndex)

  const totalBlocks = lesson.blocks.length
  const currentBlock = lesson.blocks[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === totalBlocks - 1

  // Sync block index to URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set("block", String(currentIndex))
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, "", newUrl)
  }, [currentIndex])

  const handleComplete = useCallback(
    async (result: BlockResult) => {
      // Save response to API
      if (session?.user) {
        try {
          await fetch("/api/progress/response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              blockId: currentBlock.id,
              isCorrect: result.isCorrect,
              input: result.answer,
            }),
          })
        } catch {
          // silently fail - progress is best effort
        }
      }

      // Auto-advance or show next
      if (isLast) {
        await fetch("/api/progress/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lesson.id }),
        }).catch(() => {})
      } else {
        setCurrentIndex((i) => i + 1)
      }
    },
    [currentBlock?.id, isLast, lesson.id, session?.user]
  )

  const goTo = (index: number) => {
    setCurrentIndex(index)
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && !isLast) {
        setCurrentIndex((i) => i + 1)
      }
      if (e.key === "ArrowLeft" && !isFirst) {
        setCurrentIndex((i) => i - 1)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isFirst, isLast])

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-muted/20">
        <div className="border-b p-4">
          <Link
            href={`/courses/${courseSlug}`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; {courseTitle}
          </Link>
          <h2 className="mt-2 text-sm font-semibold truncate">{lesson.title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{lesson.estimatedMinutes} min</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {lesson.blocks.map((block, i) => (
            <button
              key={block.id}
              onClick={() => goTo(i)}
              className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                i === currentIndex
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <span className="mr-2 opacity-50">{i + 1}.</span>
              {block.blockType === "TEXT_EXPLANATION" ? "Read" : "Exercise"}
            </button>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden border-b px-4 py-3">
          <Link
            href={`/courses/${courseSlug}`}
            className="text-xs text-muted-foreground"
          >
            &larr; {courseTitle}
          </Link>
          <p className="text-sm font-medium mt-1">{lesson.title}</p>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalBlocks) * 100}%` }}
          />
        </div>

        {/* Block content */}
        <div className="flex-1 flex items-start justify-center px-4 py-12 md:py-16">
          {currentBlock ? (
            <div className="w-full max-w-2xl">
              <div className="mb-6">
                <span className="text-xs text-muted-foreground">
                  {currentIndex + 1} / {totalBlocks}
                </span>
              </div>
              <BlockRenderer block={currentBlock} onComplete={handleComplete} />
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No content blocks found.</p>
            </div>
          )}
        </div>

        {/* Bottom navigation */}
        <div className="border-t px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => goTo(currentIndex - 1)}
            disabled={isFirst}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground disabled:opacity-30 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Previous
          </button>

          {isLast ? (
            <Link
              href={`/courses/${courseSlug}`}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Finish lesson
            </Link>
          ) : (
            <button
              onClick={() => goTo(currentIndex + 1)}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
