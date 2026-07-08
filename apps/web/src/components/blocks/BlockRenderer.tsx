"use client"

import { textExplanation } from "./TextExplanation"
import { multipleChoice } from "./MultipleChoice"
import type { BlockData, BlockResult } from "./types"

const renderers = [textExplanation, multipleChoice]
const rendererMap = Object.fromEntries(renderers.map((r) => [r.type, r.component]))

export function BlockRenderer({ block, onComplete }: { block: BlockData; onComplete: (result: BlockResult) => void }) {
  const Component = rendererMap[block.blockType]

  if (!Component) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <p className="text-sm text-destructive">Unknown block type: <span className="font-mono">{block.blockType}</span></p>
      </div>
    )
  }

  return <Component block={block} onComplete={onComplete} />
}
