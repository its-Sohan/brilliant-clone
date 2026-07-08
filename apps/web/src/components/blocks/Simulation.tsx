"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Play, RotateCcw, CheckCircle2 } from "lucide-react"
import type { BlockProps, BlockRenderer } from "./types"

interface SimulationContent {
  prompt: string
  type: string
}

export const simulation: BlockRenderer = {
  type: "SIMULATION",
  component: SimulationBlock,
}

const BAR_WIDTH = 40
const BAR_GAP = 20
const CHART_HEIGHT = 200
const CHART_WIDTH = 160

function SimulationBlock({ block, onComplete }: BlockProps) {
  const content = block.content as SimulationContent
  const [results, setResults] = useState<{ heads: number; tails: number; total: number; history: number[] }>({
    heads: 0,
    tails: 0,
    total: 0,
    history: [],
  })
  const [completed, setCompleted] = useState(false)
  const [animating, setAnimating] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const flip = useCallback(() => {
    const isHeads = Math.random() < 0.5
    setResults((prev) => ({
      heads: prev.heads + (isHeads ? 1 : 0),
      tails: prev.tails + (isHeads ? 0 : 1),
      total: prev.total + 1,
      history: [...prev.history, isHeads ? 1 : 0],
    }))
  }, [])

  const runBatch = useCallback(() => {
    setAnimating(true)
    let count = 0
    intervalRef.current = setInterval(() => {
      flip()
      count++
      if (count >= 40) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = null
        setAnimating(false)
      }
    }, 30)
  }, [flip])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setAnimating(false)
    setResults({ heads: 0, tails: 0, total: 0, history: [] })
    setCompleted(false)
  }, [])

  const proportion = results.total > 0 ? results.heads / results.total : 0.5
  const maxCount = Math.max(results.heads, results.tails, 1)

  const headsBarH = (results.heads / maxCount) * CHART_HEIGHT
  const tailsBarH = (results.tails / maxCount) * CHART_HEIGHT

  const handleFinish = () => {
    setCompleted(true)
  }

  if (completed) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-xl border p-6 text-center space-y-4">
          <CheckCircle2 className="mx-auto size-10 text-green-500" />
          <p className="font-semibold text-lg">Simulation complete!</p>
          <p className="text-sm text-muted-foreground">
            After {results.total} flips: {results.heads} heads ({((results.heads / results.total) * 100).toFixed(1)}%)
          </p>
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
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p className="text-base leading-relaxed">{content.prompt}</p>

      {/* Stats */}
      <div className="flex items-center justify-center gap-8 text-center">
        <div>
          <p className="text-2xl font-bold text-blue-500">{results.heads}</p>
          <p className="text-xs text-muted-foreground">Heads</p>
        </div>
        <div className="text-3xl text-muted-foreground/30">:</div>
        <div>
          <p className="text-2xl font-bold text-amber-500">{results.tails}</p>
          <p className="text-xs text-muted-foreground">Tails</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex justify-center">
        <svg width={CHART_WIDTH + 60} height={CHART_HEIGHT + 40} viewBox={`0 0 ${CHART_WIDTH + 60} ${CHART_HEIGHT + 40}`}>
          {/* Bars */}
          <rect x={20 + (BAR_WIDTH + BAR_GAP) * 0} y={CHART_HEIGHT - headsBarH} width={BAR_WIDTH} height={headsBarH}
            rx={4} fill="#3B82F6" opacity={0.8} />
          <rect x={20 + (BAR_WIDTH + BAR_GAP) * 1} y={CHART_HEIGHT - tailsBarH} width={BAR_WIDTH} height={tailsBarH}
            rx={4} fill="#F59E0B" opacity={0.8} />

          {/* Baseline */}
          <line x1={10} y1={CHART_HEIGHT} x2={CHART_WIDTH + 30} y2={CHART_HEIGHT}
            stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />

          {/* Labels */}
          <text x={20 + BAR_WIDTH / 2} y={CHART_HEIGHT + 18} textAnchor="middle" fontSize={12} fill="currentColor" fillOpacity={0.6}>H</text>
          <text x={20 + BAR_WIDTH + BAR_GAP + BAR_WIDTH / 2} y={CHART_HEIGHT + 18} textAnchor="middle" fontSize={12} fill="currentColor" fillOpacity={0.6}>T</text>
        </svg>
      </div>

      {/* Proportion line */}
      {results.total > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Proportion of heads: <span className="font-mono font-medium text-foreground">{(proportion * 100).toFixed(1)}%</span>
          <span className="text-muted-foreground/50 ml-2">(target: 50%)</span>
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={flip}
          disabled={animating}
          className="inline-flex items-center gap-2 rounded-lg border bg-card px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-muted transition-colors disabled:opacity-50"
        >
          <Play size={14} />
          Flip
        </button>
        <button
          onClick={runBatch}
          disabled={animating}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Play size={14} />
          Flip x40
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {/* Finish */}
      {results.total >= 10 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={handleFinish}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <CheckCircle2 size={16} />
            Finish simulation
          </button>
        </div>
      )}
    </div>
  )
}
