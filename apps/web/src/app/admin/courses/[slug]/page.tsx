import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { ArrowLeft, FileText, ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

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

      <h1 className="text-2xl font-bold tracking-tight mt-4 mb-1">{course.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">{course.domain} &middot; {course.lessons.length} lessons</p>

      <div className="space-y-2">
        {course.lessons.map((lesson, i) => (
          <Link
            key={lesson.id}
            href={`/admin/courses/${slug}/lessons/${lesson.id}`}
            className="flex items-center justify-between rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center size-9 rounded-full bg-muted text-sm font-medium">
                {i + 1}
              </div>
              <div>
                <p className="font-medium">{lesson.title}</p>
                <p className="text-xs text-muted-foreground">
                  {lesson._count.blocks} blocks &middot; {lesson.estimatedMinutes} min
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted-foreground/40" />
          </Link>
        ))}
      </div>
    </div>
  )
}
