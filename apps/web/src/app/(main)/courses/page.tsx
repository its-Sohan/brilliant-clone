import Link from "next/link"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { lessons: true } },
    },
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
      <p className="mt-2 text-muted-foreground">
        Choose a course to start learning
      </p>

      {courses.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No courses available yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group rounded-xl border p-6 transition-colors hover:border-primary hover:bg-muted/30"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {course.domain}
                  </span>
                  <h2 className="mt-1 text-lg font-semibold group-hover:text-primary transition-colors">
                    {course.title}
                  </h2>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium">
                  {course.difficulty}
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {course._count.lessons} lesson{course._count.lessons !== 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12">
        <Link href="/">
          <Button variant="outline">Back home</Button>
        </Link>
      </div>
    </div>
  )
}
