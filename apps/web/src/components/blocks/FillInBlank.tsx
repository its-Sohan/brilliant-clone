"use client"

import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import type { BlockProps, BlockRenderer } from "./types"

interface FillSolution {
  answer: string | number
  tolerance?: number
}

export const fillInBlank: BlockRenderer = {
  type: "FILL_IN_BLANK",
  component: FillInBlankBlock,
}

function FillInBlankBlock({ block, onComplete }: BlockProps) {
  const [value, setValue] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    const sol = block.solution as FillSolution | null
    const trimmed = value.trim()

    if (!sol) {
      setIsCorrect(true)
    } else if (typeof sol.answer === "number") {
      const parsed = parseFloat(trimmed)
      const tol = sol.tolerance ?? 0
      setIsCorrect(!isNaN(parsed) && Math.abs(parsed - sol.answer) <= tol)
    } else {
      setIsCorrect(trimmed.toLowerCase() === sol.answer.toLowerCase())
    }

    setSubmitted(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (submitted) {
        onComplete({ isCorrect, answer: value })
      } else {
        handleSubmit()
      }
    }
  }

  const handleContinue = () => {
    onComplete({ isCorrect, answer: value })
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-xl border p-6 text-center space-y-4">
          {isCorrect ? (
            <div className="space-y-2">
              <CheckCircle className="mx-auto size-10 text-green-500" />
              <p className="font-semibold text-green-600 dark:text-green-400">Correct!</p>
              <p className="text-sm text-muted-foreground">
                Your answer: <span className="font-medium text-foreground">{value}</span>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <XCircle className="mx-auto size-10 text-destructive" />
              <p className="font-semibold text-destructive">Not quite</p>
              <p className="text-sm text-muted-foreground">
                Your answer: <span className="font-medium text-foreground">{value}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Correct answer:{" "}
                <span className="font-medium text-foreground">
                  {String((block.solution as FillSolution | null)?.answer ?? "")}
                </span>
              </p>
            </div>
          )}
          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Continue
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p className="text-base leading-relaxed">{block.content.prompt}</p>
      <div className="space-y-4">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer..."
          className="w-full rounded-xl border bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
        >
          Submit
        </button>
      </div>
    </div>
  )
}
