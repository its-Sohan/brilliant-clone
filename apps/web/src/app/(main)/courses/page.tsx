import Link from "next/link"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { BookOpen, ChevronRight, BarChart3, Code2, Beaker, Library } from "lucide-react"

export const dynamic = "force-dynamic"

const domainConfig: Record<string, { icon: typeof BookOpen; gradient: string; badge: string }> = {
  Math: {
    icon: BarChart3,
    gradient: "from-blue-500/20 to-blue-500/5",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  Science: {
    icon: Beaker,
    gradient: "from-emerald-500/20 to-emerald-500/5",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  "Computer Science": {
    icon: Code2,
    gradient: "from-purple-500/20 to-purple-500/5",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  "Data Analysis": {
    icon: BarChart3,
    gradient: "from-amber-500/20 to-amber-500/5",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
}

const fallbackConfig = {
  icon: BookOpen,
  gradient: "from-muted to-muted/50",
  badge: "bg-muted text-muted-foreground",
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
      <div className="flex items-center gap-3 mb-2">
        <div className="inline-flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
          <Library size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground text-sm">Choose a course to start learning</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="mt-16 text-center">
          <BookOpen className="mx-auto size-12 text-muted-foreground/40" />
          <p className="mt-4 text-muted-foreground">No courses available yet.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const cfg = domainConfig[course.domain] ?? fallbackConfig
            const Icon = cfg.icon
            return (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group relative rounded-xl border bg-card overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className={`h-24 bg-gradient-to-br ${cfg.gradient} flex items-start justify-end p-4`}>
                  <div className="rounded-lg bg-background/80 p-2 shadow-sm">
                    <Icon size={22} className="text-foreground/70" />
                  </div>
                </div>
                <div className="p-5">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.badge}`}
                  >
                    {course.domain}
                  </span>
                  <h2 className="mt-2 text-lg font-semibold group-hover:text-primary transition-colors">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
                    <BookOpen size={14} className="shrink-0" />
                    {course._count.lessons} lesson{course._count.lessons !== 1 ? "s" : ""}
                    <span className="text-muted-foreground/40">&middot;</span>
                    Difficulty {course.difficulty}/5
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <div className="mt-12">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ChevronRight size={16} className="rotate-180" />
            Back home
          </Button>
        </Link>
      </div>
    </div>
  )
}
