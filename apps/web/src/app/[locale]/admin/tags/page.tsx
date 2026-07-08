import { prisma } from "@/lib/db"
import { Tags, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function TagsPage() {
  const lessons = await prisma.lesson.findMany({ select: { conceptTags: true, title: true } })
  const blocks = await prisma.contentBlock.findMany({ select: { conceptTags: true } })

  const tagMap = new Map<string, { lessons: string[]; blocks: number }>()

  for (const l of lessons) {
    for (const t of l.conceptTags) {
      if (!tagMap.has(t)) tagMap.set(t, { lessons: [], blocks: 0 })
      tagMap.get(t)!.lessons.push(l.title)
    }
  }

  for (const b of blocks) {
    for (const t of b.conceptTags) {
      if (!tagMap.has(t)) tagMap.set(t, { lessons: [], blocks: 0 })
      tagMap.get(t)!.blocks++
    }
  }

  const tags = Array.from(tagMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))

  return (
    <div className="p-6">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} />
        Admin
      </Link>

      <div className="flex items-center gap-3 mt-4 mb-6">
        <div className="inline-flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
          <Tags size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tags</h1>
          <p className="text-sm text-muted-foreground">{tags.length} concept tags across all courses</p>
        </div>
      </div>

      <div className="space-y-2">
        {tags.map(([tag, info]) => (
          <div key={tag} className="rounded-xl border bg-card p-4 flex items-center justify-between">
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {tag}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                {info.lessons.length} lesson{info.lessons.length !== 1 ? "s" : ""}
                {info.blocks > 0 && <> &middot; {info.blocks} block{info.blocks !== 1 ? "s" : ""}</>}
              </p>
            </div>
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">Used in</summary>
              <ul className="mt-1 space-y-0.5">
                {info.lessons.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </details>
          </div>
        ))}

        {tags.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No tags found.</p>
        )}
      </div>
    </div>
  )
}
