import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function CoursePage({
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
        include: {
          _count: { select: { blocks: true } },
        },
      },
    },
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/courses"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; Back to courses
      </Link>

      <div className="mt-6">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {course.domain}
        </span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{course.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {course.lessons.length} lesson{course.lessons.length !== 1 ? "s" : ""} &middot; Difficulty: {course.difficulty}/5
        </p>
      </div>

      <div className="mt-10 space-y-3">
        {course.lessons.map((lesson, i) => (
          <Link
            key={lesson.id}
            href={`/courses/${course.slug}/${lesson.id}`}
            className="flex items-center gap-4 rounded-xl border p-4 transition-colors hover:border-primary hover:bg-muted/30"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{lesson.title}</p>
              <p className="text-sm text-muted-foreground">
                {lesson.estimatedMinutes} min &middot; {lesson._count.blocks} exercise{lesson._count.blocks !== 1 ? "s" : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
