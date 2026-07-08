"use client"

import type { BlockProps, BlockRenderer } from "./types"

export const textExplanation: BlockRenderer = {
  type: "TEXT_EXPLANATION",
  component: TextExplanationBlock,
}

function TextExplanationBlock({ block, onComplete }: BlockProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="whitespace-pre-line leading-relaxed text-base">{block.content.prompt}</p>
      </div>
      <button
        onClick={() => onComplete({ isCorrect: true })}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Continue
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>
  )
}
