"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { CheckCircle2, XCircle, GripVertical } from "lucide-react"
import type { BlockProps, BlockRenderer } from "./types"

interface Zone {
  id: string
  label: string
}

interface Draggable {
  id: string
  label: string
  correctZone: string
}

interface DragContent {
  prompt: string
  zones: Zone[]
  draggables: Draggable[]
}

interface DragSolution {
  zones: Record<string, string[]>
}

function DraggableItem({ id, label, disabled }: { id: string; label: string; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id, disabled })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 }
    : undefined

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm shadow-sm touch-none ${
        isDragging ? "opacity-50" : ""
      } ${disabled ? "opacity-40 pointer-events-none" : "cursor-grab active:cursor-grabbing"}`}
      style={style}
    >
      <GripVertical size={14} className="text-muted-foreground/40 shrink-0" />
      {label}
    </div>
  )
}

function DroppableZone({ id, label, items, hasError }: { id: string; label: string; items: string[]; hasError: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[80px] rounded-xl border-2 border-dashed p-3 transition-colors ${
        isOver ? "border-primary bg-primary/5" : hasError ? "border-destructive/40 bg-destructive/5" : "border-muted-foreground/20"
      }`}
    >
      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center rounded-md border bg-background px-2.5 py-1 text-xs font-medium">
            {item}
          </span>
        ))}
        {items.length === 0 && (
          <span className="text-xs text-muted-foreground/50 italic">Drop items here</span>
        )}
      </div>
    </div>
  )
}

export const dragAndDrop: BlockRenderer = {
  type: "DRAG_AND_DROP",
  component: DragAndDropBlock,
}

export function DragAndDropBlock({ block, onComplete }: BlockProps) {
  const content = block.content as DragContent
  const solution = block.solution as DragSolution | null

  const [placements, setPlacements] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const placedIds = new Set(Object.keys(placements))
  const unplaced = content.draggables.filter((d) => !placedIds.has(d.id))

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const draggableId = String(active.id)
    const zoneId = String(over.id)

    setPlacements((prev) => ({ ...prev, [draggableId]: zoneId }))
  }, [])

  const handleDragStart = useCallback((event: DragEndEvent) => {
    const { active } = event
    const id = String(active.id)

    setPlacements((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const handleSubmit = () => {
    if (!solution) return

    let allCorrect = true
    for (const d of content.draggables) {
      const placedZone = placements[d.id]
      if (placedZone !== d.correctZone) {
        allCorrect = false
        break
      }
    }

    setIsCorrect(allCorrect)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-xl border p-6 text-center space-y-4">
          {isCorrect ? (
            <div className="space-y-2">
              <CheckCircle2 className="mx-auto size-10 text-green-500" />
              <p className="font-semibold text-green-600 dark:text-green-400">All correct!</p>
            </div>
          ) : (
            <div className="space-y-2">
              <XCircle className="mx-auto size-10 text-destructive" />
              <p className="font-semibold text-destructive">Not quite</p>
              <p className="text-sm text-muted-foreground">Some items are in the wrong zone.</p>
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
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p className="text-base leading-relaxed">{content.prompt}</p>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Unplaced items */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Drag these items:</p>
          <div className="flex flex-wrap gap-2">
            {unplaced.map((d) => (
              <DraggableItem key={d.id} id={d.id} label={d.label} disabled={submitted} />
            ))}
            {unplaced.length === 0 && (
              <span className="text-xs text-muted-foreground/50 italic">All items placed</span>
            )}
          </div>
        </div>

        {/* Zones */}
        <div className="grid gap-3 sm:grid-cols-2">
          {content.zones.map((zone) => {
            const items = content.draggables.filter((d) => placements[d.id] === zone.id).map((d) => d.label)
            const hasError = submitted && items.some((label) => {
              const d = content.draggables.find((x) => x.label === label)
              return d && placements[d.id] !== d.correctZone
            })
            return (
              <DroppableZone
                key={zone.id}
                id={zone.id}
                label={zone.label}
                items={items}
                hasError={false}
              />
            )
          })}
        </div>

      </DndContext>

      <button
        onClick={handleSubmit}
        disabled={Object.keys(placements).length !== content.draggables.length}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
      >
        Submit
      </button>
    </div>
  )
}
