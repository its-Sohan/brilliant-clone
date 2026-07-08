import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CourseProgress } from "./CourseProgress"

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

  const session = await getServerSession(authOptions)
  let progress: { lessonId: string }[] = []

  if (session?.user?.id) {
    progress = await prisma.userLessonProgress.findMany({
      where: {
        userId: session.user.id,
        lessonId: { in: course.lessons.map((l) => l.id) },
        status: "COMPLETED",
      },
      select: { lessonId: true },
    })
  }

  const completedIds = new Set(progress.map((p) => p.lessonId))
  const completedCount = completedIds.size

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
          {course.lessons.length} lesson{course.lessons.length !== 1 ? "s" : ""}
          {completedCount > 0 && (
            <span className="ml-2 text-primary"> &middot; {completedCount} completed</span>
          )}
        </p>
      </div>

      <CourseProgress lessons={course.lessons} slug={slug} completedIds={Array.from(completedIds)} />
    </div>
  )
}
