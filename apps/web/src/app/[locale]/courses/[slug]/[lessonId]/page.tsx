import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { LessonViewer } from "./LessonViewer"
import type { BlockData } from "@/components/blocks/types"

export const dynamic = "force-dynamic"

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; lessonId: string }>
  searchParams: Promise<{ block?: string }>
}) {
  const { slug, lessonId } = await params
  const { block } = await searchParams

  const [course, raw] = await Promise.all([
    prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: { orderBy: { order: "asc" }, select: { id: true, order: true } },
      },
    }),
    prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        blocks: { orderBy: { order: "asc" } },
      },
    }),
  ])

  if (!course || !raw || raw.courseId !== course.id) {
    notFound()
  }

  const lesson = {
    id: raw.id,
    title: raw.title,
    estimatedMinutes: raw.estimatedMinutes,
    blocks: raw.blocks.map((b) => ({
      id: b.id,
      lessonId: b.lessonId,
      order: b.order,
      blockType: b.blockType,
      content: b.content as BlockData["content"],
      solution: b.solution as BlockData["solution"],
      hints: b.hints as BlockData["hints"],
    })),
  }

  const currentOrder = course.lessons.find((l) => l.id === lessonId)?.order ?? 0
  const nextLesson = course.lessons.find((l) => l.order === currentOrder + 1)

  const initialBlockIndex = block ? parseInt(block) : 0

  return (
    <LessonViewer
      lesson={lesson}
      courseTitle={course.title}
      courseSlug={slug}
      nextLessonId={nextLesson?.id ?? null}
      initialBlockIndex={isNaN(initialBlockIndex) ? 0 : initialBlockIndex}
    />
  )
}
