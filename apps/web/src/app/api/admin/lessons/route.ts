import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  const { courseId, title } = await request.json()
  if (!courseId || !title) {
    return NextResponse.json({ error: "courseId and title required" }, { status: 400 })
  }

  const last = await prisma.lesson.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
    select: { order: true },
  })

  const lesson = await prisma.lesson.create({
    data: {
      courseId,
      title,
      order: (last?.order ?? 0) + 1,
      estimatedMinutes: 10,
    },
  })

  // Create a starter text block
  await prisma.contentBlock.create({
    data: {
      lessonId: lesson.id,
      order: 1,
      blockType: "TEXT_EXPLANATION",
      content: { prompt: "Write your content here..." },
      difficulty: 5,
    },
  })

  return NextResponse.json(lesson, { status: 201 })
}

export async function PATCH(request: Request) {
  const { id, title, estimatedMinutes, order, conceptTags } = await request.json()

  const data: Record<string, unknown> = {}
  if (title !== undefined) data.title = title
  if (estimatedMinutes !== undefined) data.estimatedMinutes = estimatedMinutes
  if (order !== undefined) data.order = order
  if (conceptTags !== undefined) data.conceptTags = conceptTags

  const lesson = await prisma.lesson.update({ where: { id }, data })
  return NextResponse.json(lesson)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  await prisma.lesson.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
