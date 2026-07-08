import Link from "next/link"
import { prisma } from "@/lib/db"
import { BookOpen, ChevronRight, Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { lessons: true } } },
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-sm text-muted-foreground">Manage your course content</p>
        </div>
      </div>

      <div className="space-y-3">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/admin/courses/${course.slug}`}
            className="flex items-center justify-between rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
                <BookOpen size={20} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{course.title}</p>
                <p className="text-xs text-muted-foreground">
                  {course.domain} &middot; {course._count.lessons} lessons &middot; Difficulty {course.difficulty}
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
