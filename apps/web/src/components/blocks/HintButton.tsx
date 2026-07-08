"use client"

import { useState } from "react"
import { Lightbulb } from "lucide-react"

interface HintButtonProps {
  hints: string[]
  blockId: string
}

export function HintButton({ hints, blockId }: HintButtonProps) {
  const [revealed, setRevealed] = useState(0)

  if (!hints || hints.length === 0) return null

  const handleReveal = async () => {
    const next = revealed + 1
    setRevealed(next)

    try {
      await fetch("/api/progress/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockId }),
      })
    } catch {}
  }

  if (revealed >= hints.length) return null

  return (
    <div className="space-y-2">
      {revealed > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          <p className="font-medium text-xs text-amber-600 dark:text-amber-400 mb-1">Hint {revealed}/{hints.length}</p>
          <p>{hints[revealed - 1]}</p>
        </div>
      )}
      <button
        onClick={handleReveal}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Lightbulb size={14} />
        {revealed === 0 ? "Show hint" : "Another hint"}
      </button>
    </div>
  )
}
