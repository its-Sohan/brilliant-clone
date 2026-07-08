import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { ArrowLeft, Eye, Send, Archive, RotateCcw } from "lucide-react"

export const dynamic = "force-dynamic"

async function updateStatus(formData: FormData) {
  "use server"
  const id = formData.get("id") as string
  const status = formData.get("status") as string
  if (!id || !status) return
  await prisma.lesson.update({ where: { id }, data: { status: status as "DRAFT" | "PUBLISHED" | "DEPRECATED" } })
  redirect(".")
}

export default async function AdminLessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { slug, lessonId } = await params
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: { select: { slug: true, title: true } },
      blocks: { orderBy: { order: "asc" } },
    },
  })

  if (!lesson || lesson.course.slug !== slug) notFound()

  const statusColors: Record<string, string> = {
    DRAFT: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    PUBLISHED: "bg-green-500/10 text-green-600 dark:text-green-400",
    DEPRECATED: "bg-red-500/10 text-red-600 dark:text-red-400",
  }

  return (
    <div className="p-6">
      <Link
        href={`/admin/courses/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        {lesson.course.title}
      </Link>

      <div className="flex items-center justify-between mt-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{lesson.title}</h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[lesson.status]}`}>
              {lesson.status}
            </span>
            <span className="text-xs text-muted-foreground">v{lesson.version}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{lesson.blocks.length} blocks &middot; {lesson.estimatedMinutes} min</p>
        </div>
        <div className="flex items-center gap-2">
          <form action={updateStatus}>
            <input type="hidden" name="id" value={lesson.id} />
            {lesson.status === "DRAFT" && (
              <button name="status" value="PUBLISHED" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                <Send size={14} />
                Publish
              </button>
            )}
            {lesson.status === "PUBLISHED" && (
              <button name="status" value="DEPRECATED" className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">
                <Archive size={14} />
                Deprecate
              </button>
            )}
            {lesson.status === "DEPRECATED" && (
              <button name="status" value="DRAFT" className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw size={14} />
                Revert to draft
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="space-y-4">
        {lesson.blocks.map((block, i) => (
          <div key={block.id} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center size-6 rounded-full bg-muted text-xs font-medium">{i + 1}</span>
                <span className="text-xs font-medium text-muted-foreground uppercase">{block.blockType.replace(/_/g, " ")}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${block.difficulty >= 7 ? "bg-red-500/10 text-red-600" : block.difficulty >= 4 ? "bg-amber-500/10 text-amber-600" : "bg-green-500/10 text-green-600"}`}>
                  D{block.difficulty}
                </span>
                {block.variantGroup && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono">
                    Variant {block.variantGroup}
                  </span>
                )}
              </div>
              <a
                href={`/courses/${slug}/${lessonId}?block=${i}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Eye size={14} />
                Preview
              </a>
            </div>
            <BlockPreview block={block} />
          </div>
        ))}
      </div>
    </div>
  )
}

function BlockPreview({ block }: { block: { blockType: string; content: unknown; conceptTags: string[]; variantGroup: string | null } }) {
  const content = block.content as { prompt?: string; options?: string[]; starterCode?: string }

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed line-clamp-3">
        {content.prompt ?? "(no content)"}
      </p>
      {content.options && (
        <div className="flex flex-wrap gap-1.5">
          {content.options.map((opt, i) => (
            <span key={i} className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs">
              {String.fromCharCode(65 + i)}. {opt}
            </span>
          ))}
        </div>
      )}
      {block.conceptTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {block.conceptTags.map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
