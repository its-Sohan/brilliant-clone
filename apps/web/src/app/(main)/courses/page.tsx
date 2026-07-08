import Link from "next/link"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

const domainColors: Record<string, string> = {
  Math: "from-blue-500/20 to-blue-500/5",
  Science: "from-emerald-500/20 to-emerald-500/5",
  "Computer Science": "from-purple-500/20 to-purple-500/5",
  "Data Analysis": "from-amber-500/20 to-amber-500/5",
}

const domainBadgeColors: Record<string, string> = {
  Math: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Science: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "Computer Science": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "Data Analysis": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { lessons: true } },
    },
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="mt-2 text-muted-foreground">
          Choose a course to start learning
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">No courses available yet.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group relative rounded-xl border bg-card overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div
                className={`h-24 bg-gradient-to-br ${domainColors[course.domain] ?? "from-muted to-muted/50"}`}
              />
              <div className="p-5">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${domainBadgeColors[course.domain] ?? "bg-muted text-muted-foreground"}`}
                >
                  {course.domain}
                </span>
                <h2 className="mt-2 text-lg font-semibold group-hover:text-primary transition-colors">
                  {course.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {course._count.lessons} lesson{course._count.lessons !== 1 ? "s" : ""} &middot; Difficulty {course.difficulty}/5
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12">
        <Link href="/">
          <Button variant="outline">&larr; Back home</Button>
        </Link>
      </div>
    </div>
  )
}
