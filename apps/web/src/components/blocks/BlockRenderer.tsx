"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"
import { HintButton } from "./HintButton"
import type { BlockData, BlockResult } from "./types"

const TextExplanation = dynamic(() => import("./TextExplanation").then((m) => ({ default: m.TextExplanationBlock })), { ssr: false })
const MultipleChoice = dynamic(() => import("./MultipleChoice").then((m) => ({ default: m.MultipleChoiceBlock })), { ssr: false })
const FillInBlank = dynamic(() => import("./FillInBlank").then((m) => ({ default: m.FillInBlankBlock })), { ssr: false })
const DragAndDropBlock = dynamic(() => import("./DragAndDrop").then((m) => ({ default: m.DragAndDropBlock })), { ssr: false })
const GraphBuilderBlock = dynamic(() => import("./GraphBuilder").then((m) => ({ default: m.GraphBuilderBlock })), { ssr: false })
const SimulationBlock = dynamic(() => import("./Simulation").then((m) => ({ default: m.SimulationBlock })), { ssr: false })
const CodeChallengeBlock = dynamic(() => import("./CodeChallenge").then((m) => ({ default: m.CodeChallengeBlock })), { ssr: false })

const rendererMap: Record<string, React.ComponentType<{ block: BlockData; onComplete: (result: BlockResult) => void }>> = {
  TEXT_EXPLANATION: TextExplanation,
  MULTIPLE_CHOICE: MultipleChoice,
  FILL_IN_BLANK: FillInBlank,
  DRAG_AND_DROP: DragAndDropBlock,
  GRAPH_BUILDER: GraphBuilderBlock,
  SIMULATION: SimulationBlock,
  CODE_CHALLENGE: CodeChallengeBlock,
}

// A/B test: assign user to variant group based on localStorage
function getVariantGroup(): "A" | "B" {
  if (typeof window === "undefined") return "A"
  try {
    let group = localStorage.getItem("kakkoii_variant")
    if (group !== "A" && group !== "B") {
      group = Math.random() < 0.5 ? "A" : "B"
      localStorage.setItem("kakkoii_variant", group)
    }
    return group as "A" | "B"
  } catch {
    return "A"
  }
}

export function BlockRenderer({ block, onComplete }: { block: BlockData; onComplete: (result: BlockResult) => void }) {
  const variantGroup = useMemo(() => getVariantGroup(), [])
  const Component = rendererMap[block.blockType]

  // A/B test filter: skip variant blocks that don't match user's group
  const blockVariant = (block as BlockData & { variantGroup?: string | null }).variantGroup
  if (blockVariant && blockVariant !== variantGroup) {
    return null
  }

  const hints = (block.hints as { items: string[] } | null)?.items ?? []

  if (!Component) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <p className="text-sm text-destructive">Unknown block type: <span className="font-mono">{block.blockType}</span></p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Component block={block} onComplete={onComplete} />
      <HintButton hints={hints} blockId={block.id} />
    </div>
  )
}
