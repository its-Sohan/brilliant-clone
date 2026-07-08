import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  // Per-block stats
  const blocks = await prisma.contentBlock.findMany({
    where: { blockType: { not: "TEXT_EXPLANATION" } },
    include: {
      responses: { select: { isCorrect: true, timeMs: true } },
      lesson: { select: { title: true, course: { select: { slug: true, title: true } } } },
    },
  })

  const blockStats = blocks.map((b) => {
    const total = b.responses.length
    const correct = b.responses.filter((r) => r.isCorrect).length
    const avgTime = total > 0 ? Math.round(b.responses.reduce((s, r) => s + (r.timeMs ?? 0), 0) / total) : 0
    return {
      blockId: b.id,
      blockType: b.blockType,
      lessonTitle: b.lesson.title,
      courseTitle: b.lesson.course.title,
      difficulty: b.difficulty,
      totalAttempts: total,
      firstTrySuccess: total > 0 ? Math.round((correct / total) * 100) : 0,
      avgTimeMs: avgTime,
    }
  })

  // Per-lesson completion stats
  const lessons = await prisma.lesson.findMany({
    include: {
      _count: { select: { blocks: true } },
      userProgress: { select: { status: true } },
      course: { select: { slug: true } },
    },
  })

  const lessonStats = lessons.map((l) => {
    const completed = l.userProgress.filter((p) => p.status === "COMPLETED").length
    const started = l.userProgress.length
    return {
      lessonId: l.id,
      lessonTitle: l.title,
      totalBlocks: l._count.blocks,
      startedCount: started,
      completedCount: completed,
      completionRate: started > 0 ? Math.round((completed / started) * 100) : 0,
    }
  })

  // Response timeline (last 14 days)
  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

  const recentResponses = await prisma.userResponse.findMany({
    where: { createdAt: { gte: fourteenDaysAgo } },
    select: { createdAt: true, isCorrect: true },
    orderBy: { createdAt: "asc" },
  })

  const dayMap = new Map<string, { total: number; correct: number }>()
  for (const r of recentResponses) {
    const day = r.createdAt.toISOString().split("T")[0]
    if (!dayMap.has(day)) dayMap.set(day, { total: 0, correct: 0 })
    const d = dayMap.get(day)!
    d.total++
    if (r.isCorrect) d.correct++
  }

  const timeline = Array.from(dayMap.entries()).map(([date, data]) => ({
    date,
    attempts: data.total,
    correct: data.correct,
    accuracy: Math.round((data.correct / data.total) * 100),
  }))

  return NextResponse.json({
    blockStats,
    lessonStats,
    timeline,
    totalResponses: recentResponses.length,
  })
}
