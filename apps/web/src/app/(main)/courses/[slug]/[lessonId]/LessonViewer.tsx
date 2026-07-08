"use client"

import { useState, useCallback, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { BlockRenderer } from "@/components/blocks/BlockRenderer"
import { useLessonProgress } from "@/lib/useLessonProgress"
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
  nextLessonId: string | null
  initialBlockIndex: number
}

export function LessonViewer({ lesson, courseTitle, courseSlug, nextLessonId, initialBlockIndex }: LessonViewerProps) {
  const { data: session } = useSession()
  const { completed, markComplete } = useLessonProgress(lesson.id)
  const [currentIndex, setCurrentIndex] = useState(initialBlockIndex)
  const [visited, setVisited] = useState<Set<number>>(new Set([initialBlockIndex]))
  const [finishing, setFinishing] = useState(false)

  const totalBlocks = lesson.blocks.length
  const currentBlock = lesson.blocks[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === totalBlocks - 1

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set("block", String(currentIndex))
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, "", newUrl)
  }, [currentIndex])

  const handleComplete = useCallback(
    async (result: BlockResult) => {
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
        } catch {}
      }

      if (isLast) {
        setFinishing(true)
        await markComplete()
      } else {
        setCurrentIndex((i) => {
          const next = i + 1
          setVisited((prev) => new Set(prev).add(next))
          return next
        })
      }
    },
    [currentBlock?.id, isLast, lesson.id, markComplete, session?.user]
  )

  const goTo = (index: number) => {
    setCurrentIndex(index)
    setVisited((prev) => new Set(prev).add(index))
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && !isLast) {
        goTo(currentIndex + 1)
      }
      if (e.key === "ArrowLeft" && !isFirst) {
        goTo(currentIndex - 1)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [currentIndex, isFirst, isLast])

  const completedCount = visited.size

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
          {lesson.blocks.map((block, i) => {
            const isVisited = visited.has(i)
            return (
              <button
                key={block.id}
                onClick={() => goTo(i)}
                className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors flex items-center gap-2 ${
                  i === currentIndex
                    ? "bg-primary/10 text-primary font-medium"
                    : isVisited
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center size-5 rounded-full text-[10px] shrink-0 ${
                    isVisited
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="truncate">
                  {block.blockType === "TEXT_EXPLANATION" ? "Read" : "Exercise"}
                </span>
              </button>
            )
          })}
        </div>
        <div className="border-t p-3">
          <div className="text-xs text-muted-foreground">
            {completedCount}/{totalBlocks} completed
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <div className="md:hidden border-b px-4 py-3">
          <Link href={`/courses/${courseSlug}`} className="text-xs text-muted-foreground">
            &larr; {courseTitle}
          </Link>
          <p className="text-sm font-medium mt-1">{lesson.title}</p>
        </div>

        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalBlocks) * 100}%` }}
          />
        </div>

        <div className="flex-1 flex items-start justify-center px-4 py-12 md:py-16">
          {finishing ? (
            <div className="text-center py-20 space-y-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Lesson complete!</h2>
              <p className="text-sm text-muted-foreground">Great work finishing this lesson.</p>
              <div className="flex items-center justify-center gap-3">
                {nextLessonId && (
                  <Link
                    href={`/courses/${courseSlug}/${nextLessonId}`}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    Next lesson
                  </Link>
                )}
                <Link
                  href={`/courses/${courseSlug}`}
                  className="inline-flex items-center justify-center rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Back to course
                </Link>
              </div>
            </div>
          ) : currentBlock ? (
            <div className="w-full max-w-2xl">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {currentIndex + 1} / {totalBlocks}
                </span>
                <span className="text-xs text-muted-foreground">
                  {completedCount} done
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

        {!finishing && (
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
              <button
                onClick={() => { setFinishing(true); markComplete() }}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                Finish lesson
              </button>
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
        )}
      </div>
    </div>
  )
}
