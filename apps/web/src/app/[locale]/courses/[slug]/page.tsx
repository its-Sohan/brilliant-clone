import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CourseProgress } from "./CourseProgress"
import { ArrowLeft, BookOpen, Clock, BarChart3 } from "lucide-react"

export const revalidate = 60

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

  let streak = 0
  if (session?.user?.id) {
    const allProgress = await prisma.userLessonProgress.findMany({
      where: { userId: session.user.id, status: "COMPLETED", completedAt: { not: null } },
      select: { completedAt: true },
      orderBy: { completedAt: "desc" },
    })
    const dates = [
      ...new Set(
        allProgress.map((p) => {
          const d = new Date(p.completedAt!)
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
        })
      ),
    ]
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`
    let checkDate = todayStr
    if (!dates.includes(todayStr) && dates.includes(yesterdayStr)) {
      checkDate = yesterdayStr
    } else if (!dates.includes(todayStr) && !dates.includes(yesterdayStr)) {
      checkDate = ""
    }
    if (checkDate) {
      const check = new Date(checkDate)
      for (let i = 0; i < 365; i++) {
        const str = `${check.getFullYear()}-${String(check.getMonth() + 1).padStart(2, "0")}-${String(check.getDate()).padStart(2, "0")}`
        if (dates.includes(str)) {
          streak++
          check.setDate(check.getDate() - 1)
        } else break
      }
    }
  }

  const totalLessons = course.lessons.length
  const totalMinutes = course.lessons.reduce((s, l) => s + l.estimatedMinutes, 0)

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Back to courses
      </Link>

      <div className="mt-6 mb-10">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
          <BarChart3 size={12} className="mr-1.5" />
          {course.domain}
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{course.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen size={16} />
            {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={16} />
            ~{totalMinutes} min
          </span>
          <span>Difficulty {course.difficulty}/5</span>
          {completedCount > 0 && (
            <span className="text-primary font-medium">
              {completedCount} completed
            </span>
          )}
        </div>
      </div>

      <CourseProgress
        lessons={course.lessons}
        slug={slug}
        completedIds={Array.from(completedIds)}
        initialStreak={streak}
      />
    </div>
  )
}
