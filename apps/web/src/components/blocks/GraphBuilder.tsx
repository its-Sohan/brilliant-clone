"use client"

import { useState, useCallback, useRef } from "react"
import { CheckCircle2, XCircle, Trash2 } from "lucide-react"
import type { BlockProps, BlockRenderer } from "./types"

interface GraphContent {
  prompt: string
  target: string
  domain: [number, number]
  range: [number, number]
}

interface GraphSolution {
  points: [number, number][]
  tolerance: number
}

interface Point {
  x: number
  y: number
}

export const graphBuilder: BlockRenderer = {
  type: "GRAPH_BUILDER",
  component: GraphBuilderBlock,
}

const GRID_SIZE = 20
const PADDING = 40
const SVG_SIZE = 400
const AXIS_RANGE = 5

function toScreen(value: number, axisRange: number, padding: number, size: number): number {
  const plotSize = size - padding * 2
  return padding + ((value + axisRange) / (axisRange * 2)) * plotSize
}

function toData(screen: number, axisRange: number, padding: number, size: number): number {
  const plotSize = size - padding * 2
  return ((screen - padding) / plotSize) * (axisRange * 2) - axisRange
}

export function GraphBuilderBlock({ block, onComplete }: BlockProps) {
  const content = block.content as GraphContent
  const solution = block.solution as GraphSolution | null
  const svgRef = useRef<SVGSVGElement>(null)

  const [points, setPoints] = useState<Point[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null)

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (submitted) return
      const svg = svgRef.current
      if (!svg) return

      const rect = svg.getBoundingClientRect()
      const sx = e.clientX - rect.left
      const sy = e.clientY - rect.top

      const dx = toData(sx, AXIS_RANGE, PADDING, SVG_SIZE)
      const dy = -toData(sy, AXIS_RANGE, PADDING, SVG_SIZE)

      setPoints((prev) => {
        const rounded = prev.map((p) => ({ x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 }))
        rounded.push({ x: Math.round(dx * 10) / 10, y: Math.round(dy * 10) / 10 })
        rounded.sort((a, b) => a.x - b.x)
        return rounded
      })
    },
    [submitted]
  )

  const handleDragStart = useCallback((idx: number) => {
    if (submitted) return
    setDraggingIdx(idx)
  }, [submitted])

  const handleDragMove = useCallback(
    (e: React.MouseEvent) => {
      if (draggingIdx === null || !svgRef.current || submitted) return
      const rect = svgRef.current.getBoundingClientRect()
      const sx = e.clientX - rect.left
      const sy = e.clientY - rect.top

      const dx = Math.round(toData(sx, AXIS_RANGE, PADDING, SVG_SIZE) * 10) / 10
      const dy = Math.round(-toData(sy, AXIS_RANGE, PADDING, SVG_SIZE) * 10) / 10

      setPoints((prev) =>
        prev.map((p, i) => (i === draggingIdx ? { x: dx, y: dy } : p))
      )
    },
    [draggingIdx, submitted]
  )

  const handleDragEnd = useCallback(() => {
    setDraggingIdx(null)
  }, [])

  const clearPoints = useCallback(() => {
    if (!submitted) setPoints([])
  }, [submitted])

  const handleSubmit = useCallback(() => {
    if (!solution || points.length < 2) return

    const tol = solution.tolerance ?? 0.5
    let allCorrect = true

    for (const [sx, sy] of solution.points) {
      // Find the closest user point within tolerance
      const closest = points.reduce(
        (best, p) => {
          const dist = Math.abs(p.x - sx)
          return dist < best.dist ? { dist, y: p.y } : best
        },
        { dist: Infinity, y: 0 }
      )

      if (closest.dist > 0.5 || Math.abs(closest.y - sy) > tol) {
        allCorrect = false
        break
      }
    }

    setIsCorrect(allCorrect)
    setSubmitted(true)
  }, [solution, points])

  const linePath =
    points.length >= 2
      ? points
          .map((p, i) => {
            const sx = toScreen(p.x, AXIS_RANGE, PADDING, SVG_SIZE)
            const sy = toScreen(-p.y, AXIS_RANGE, PADDING, SVG_SIZE)
            return `${i === 0 ? "M" : "L"}${sx},${sy}`
          })
          .join(" ")
      : ""

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p className="text-base leading-relaxed">{content.prompt}</p>
      <p className="text-sm font-mono text-muted-foreground">Target: <span className="text-foreground">{content.target}</span></p>

      {submitted ? (
        <div className="rounded-xl border p-6 text-center space-y-4">
          {isCorrect ? (
            <div className="space-y-2">
              <CheckCircle2 className="mx-auto size-10 text-green-500" />
              <p className="font-semibold text-green-600 dark:text-green-400">Correct!</p>
            </div>
          ) : (
            <div className="space-y-2">
              <XCircle className="mx-auto size-10 text-destructive" />
              <p className="font-semibold text-destructive">Not quite</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Solution points:</p>
                {solution?.points.map(([x, y], i) => (
                  <p key={i} className="font-mono text-xs">
                    ({x}, {y})
                  </p>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => onComplete({ isCorrect })}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Continue
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <svg
              ref={svgRef}
              width={SVG_SIZE}
              height={SVG_SIZE}
              viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
              className="cursor-crosshair rounded-xl border bg-background"
              onClick={handleClick}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              {/* Grid */}
              {Array.from({ length: AXIS_RANGE * 2 + 1 }, (_, i) => {
                const pos = toScreen(i - AXIS_RANGE, AXIS_RANGE, PADDING, SVG_SIZE)
                return (
                  <g key={i}>
                    <line x1={pos} y1={PADDING} x2={pos} y2={SVG_SIZE - PADDING} stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />
                    <line x1={PADDING} y1={pos} x2={SVG_SIZE - PADDING} y2={pos} stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />
                  </g>
                )
              })}

              {/* Axes */}
              <line x1={PADDING} y1={SVG_SIZE / 2} x2={SVG_SIZE - PADDING} y2={SVG_SIZE / 2} stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5} />
              <line x1={SVG_SIZE / 2} y1={PADDING} x2={SVG_SIZE / 2} y2={SVG_SIZE - PADDING} stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5} />

              {/* Axis labels */}
              {Array.from({ length: AXIS_RANGE * 2 + 1 }, (_, i) => {
                const v = i - AXIS_RANGE
                if (v === 0) return null
                const pos = toScreen(v, AXIS_RANGE, PADDING, SVG_SIZE)
                return (
                  <g key={i}>
                    <text x={pos} y={SVG_SIZE / 2 + 15} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.5}>
                      {v}
                    </text>
                    <text x={SVG_SIZE / 2 + 8} y={pos + 3} textAnchor="start" fontSize={10} fill="currentColor" fillOpacity={0.5}>
                      {v}
                    </text>
                  </g>
                )
              })}

              {/* User line */}
              {points.length >= 2 && (
                <path d={linePath} fill="none" stroke="var(--primary, #456DFF)" strokeWidth={2.5} strokeLinejoin="round" />
              )}

              {/* User points */}
              {points.map((p, i) => {
                const sx = toScreen(p.x, AXIS_RANGE, PADDING, SVG_SIZE)
                const sy = toScreen(-p.y, AXIS_RANGE, PADDING, SVG_SIZE)
                return (
                  <g
                    key={i}
                    onMouseDown={() => handleDragStart(i)}
                    style={{ cursor: submitted ? "default" : "grab" }}
                  >
                    <circle cx={sx} cy={sy} r={6} fill="var(--primary, #456DFF)" fillOpacity={0.2} stroke="var(--primary, #456DFF)" strokeWidth={2} />
                    <text x={sx + 10} y={sy - 6} fontSize={10} fill="currentColor" fillOpacity={0.6}>
                      ({p.x}, {p.y})
                    </text>
                  </g>
                )
              })}

              {/* Empty state */}
              {points.length === 0 && (
                <text x={SVG_SIZE / 2} y={SVG_SIZE / 2 - 20} textAnchor="middle" fontSize={13} fill="currentColor" fillOpacity={0.3}>
                  Click on the grid to place points
                </text>
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={clearPoints}
              disabled={points.length === 0}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-opacity"
            >
              <Trash2 size={14} />
              Clear
            </button>
            <button
              onClick={handleSubmit}
              disabled={points.length < 2}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  )
}
