"use client"

import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import type { BlockProps, BlockRenderer } from "./types"

export const multipleChoice: BlockRenderer = {
  type: "MULTIPLE_CHOICE",
  component: MultipleChoiceBlock,
}

export function MultipleChoiceBlock({ block, onComplete }: BlockProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const correctIndex = (block.solution as { correctIndex?: number } | null)?.correctIndex ?? -1
  const isCorrect = selected === correctIndex

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
  }

  const handleContinue = () => {
    onComplete({ isCorrect, answer: selected })
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-xl border p-6 text-center space-y-4">
          {isCorrect ? (
            <div className="space-y-2">
              <CheckCircle className="mx-auto size-10 text-green-500" />
              <p className="font-semibold text-green-600 dark:text-green-400">Correct!</p>
            </div>
          ) : (
            <div className="space-y-2">
              <XCircle className="mx-auto size-10 text-destructive" />
              <p className="font-semibold text-destructive">Not quite</p>
              <p className="text-sm text-muted-foreground">
                The correct answer was: <span className="font-medium text-foreground">{block.content.options?.[correctIndex]}</span>
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
      <div className="space-y-3">
        {block.content.options?.map((option, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full rounded-xl border p-4 text-left transition-all ${
              selected === i
                ? "border-primary bg-primary/5 shadow-sm"
                : "hover:border-muted-foreground/30 hover:bg-muted/30"
            }`}
          >
            <span className="text-sm">
              <span className="inline-flex mr-3 h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selected === null}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
      >
        Submit
      </button>
    </div>
  )
}
