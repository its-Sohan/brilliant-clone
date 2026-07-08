import Link from "next/link"
import { prisma } from "@/lib/db"
import { BarChart3, Code2, Beaker, BookOpen, ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

const domainIcons: Record<string, typeof BookOpen> = {
  Math: BarChart3,
  "Computer Science": Code2,
  Science: Beaker,
}

const domainColors: Record<string, string> = {
  Math: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "Computer Science": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Science: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
}

function DomainIcon({ domain }: { domain: string }) {
  const Icon = domainIcons[domain] ?? BookOpen
  return <Icon size={20} />
}

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: [{ domain: "asc" }, { difficulty: "asc" }],
    include: { _count: { select: { lessons: true } } },
  })

  // Group by domain
  const grouped: Record<string, typeof courses> = {}
  for (const c of courses) {
    if (!grouped[c.domain]) grouped[c.domain] = []
    grouped[c.domain].push(c)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="mt-1.5 text-muted-foreground">
            Explore interactive courses across math, programming, science, and more
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-12">
        {Object.entries(grouped).map(([domain, domainCourses]) => (
          <section key={domain}>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center size-9 rounded-lg bg-muted text-foreground">
                <DomainIcon domain={domain} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{domain}</h2>
                <p className="text-sm text-muted-foreground">
                  {domainCourses.length} course{domainCourses.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {domainCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group relative rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center size-12 rounded-xl bg-muted shrink-0 group-hover:bg-primary/10 transition-colors">
                      <DomainIcon domain={domain} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                        {course.title}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {course.difficulty === 1 ? "Beginner" : course.difficulty === 2 ? "Intermediate" : "Advanced"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {course._count.lessons} lesson{course._count.lessons !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="mt-1 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
