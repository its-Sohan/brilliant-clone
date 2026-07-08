import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { ArrowLeft, FileText, ChevronRight, Plus } from "lucide-react"

export const dynamic = "force-dynamic"

async function createLesson(formData: FormData) {
  "use server"
  const courseId = formData.get("courseId") as string
  const title = formData.get("title") as string
  if (!courseId || !title) return

  const last = await prisma.lesson.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
    select: { order: true },
  })

  const lesson = await prisma.lesson.create({
    data: {
      courseId,
      title,
      order: (last?.order ?? 0) + 1,
      estimatedMinutes: 10,
    },
  })

  await prisma.contentBlock.create({
    data: {
      lessonId: lesson.id,
      order: 1,
      blockType: "TEXT_EXPLANATION",
      content: { prompt: "Write your content here..." },
      difficulty: 5,
    },
  })
}

async function deleteLesson(formData: FormData) {
  "use server"
  const id = formData.get("id") as string
  if (!id) return
  await prisma.lesson.delete({ where: { id } })
}

export default async function AdminCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: { _count: { select: { blocks: true } } },
      },
    },
  })

  if (!course) notFound()

  return (
    <div className="p-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Courses
      </Link>

      <div className="flex items-center justify-between mt-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-sm text-muted-foreground">{course.domain} &middot; {course.lessons.length} lessons</p>
        </div>
        <form action={createLesson}>
          <input type="hidden" name="courseId" value={course.id} />
          <div className="flex items-center gap-2">
            <input
              name="title"
              placeholder="New lesson title"
              required
              className="rounded-lg border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-2">
        {course.lessons.map((lesson, i) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between rounded-xl border bg-card p-4"
          >
            <Link
              href={`/admin/courses/${slug}/lessons/${lesson.id}`}
              className="flex items-center gap-4 flex-1 min-w-0"
            >
              <div className="flex items-center justify-center size-9 rounded-full bg-muted text-sm font-medium shrink-0">
                {i + 1}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{lesson.title}</p>
                <p className="text-xs text-muted-foreground">
                  {lesson._count.blocks} blocks &middot; {lesson.estimatedMinutes} min
                  {lesson.conceptTags.length > 0 && <> &middot; {lesson.conceptTags.join(", ")}</>}
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-2 shrink-0">
              <form action={deleteLesson}>
                <input type="hidden" name="id" value={lesson.id} />
                <button
                  type="submit"
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  onClick={(e) => { if (!confirm("Delete lesson?")) e.preventDefault() }}
                >
                  Delete
                </button>
              </form>
              <ChevronRight size={18} className="text-muted-foreground/40" />
            </div>
          </div>
        ))}

        {course.lessons.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No lessons yet. Create one above.</p>
        )}
      </div>
    </div>
  )
}
