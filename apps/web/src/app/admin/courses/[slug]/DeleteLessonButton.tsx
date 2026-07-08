"use client"

import { useRouter } from "next/navigation"

export function DeleteLessonButton({ lessonId }: { lessonId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Delete lesson? This cannot be undone.")) return

    await fetch("/api/admin/lessons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lessonId }),
    })

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
    >
      Delete
    </button>
  )
}
