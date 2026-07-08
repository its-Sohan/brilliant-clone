import Link from "next/link"
import { notFound } from "next/navigation"
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
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to courses
      </Link>

      <div className="mt-8 mb-12">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
          {course.domain}
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{course.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {course.lessons.length} lesson{course.lessons.length !== 1 ? "s" : ""} &middot; Difficulty {course.difficulty}/5
        </p>
      </div>

      <div className="space-y-3">
        {course.lessons.map((lesson, i) => (
          <Link
            key={lesson.id}
            href={`/courses/${course.slug}/${lesson.id}`}
            className="group flex items-center gap-5 rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium group-hover:text-primary transition-colors">{lesson.title}</p>
              <p className="text-sm text-muted-foreground">
                {lesson.estimatedMinutes} min &middot; {lesson._count.blocks} exercise{lesson._count.blocks !== 1 ? "s" : ""}
              </p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 text-muted-foreground/40 group-hover:text-primary transition-colors">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}
