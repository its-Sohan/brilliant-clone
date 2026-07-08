import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { updateSM2 } from "@/lib/sm2"

// GET /api/progress/review — list items due for review
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json([])
  }

  const items = await prisma.spacedRepetition.findMany({
    where: {
      userId: session.user.id,
      nextReview: { lte: new Date() },
    },
    orderBy: { nextReview: "asc" },
  })

  return NextResponse.json(
    items.map((i) => ({ conceptTag: i.conceptTag, easeFactor: i.easeFactor, interval: i.interval, nextReview: i.nextReview }))
  )
}

// POST /api/progress/review — submit a review quality rating
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { conceptTag, quality }: { conceptTag: string; quality: number } = await request.json()

  const existing = await prisma.spacedRepetition.findUnique({
    where: { userId_conceptTag: { userId: session.user.id, conceptTag } },
  })

  const prev = existing
    ? { easeFactor: existing.easeFactor, interval: existing.interval, repetitions: existing.repetitions }
    : { easeFactor: 2.5, interval: 0, repetitions: 0 }

  const updated = updateSM2(prev, quality)

  await prisma.spacedRepetition.upsert({
    where: { userId_conceptTag: { userId: session.user.id, conceptTag } },
    update: {
      easeFactor: updated.easeFactor,
      interval: updated.interval,
      repetitions: updated.repetitions,
      nextReview: updated.nextReview,
      lastReview: new Date(),
    },
    create: {
      userId: session.user.id,
      conceptTag,
      easeFactor: updated.easeFactor,
      interval: updated.interval,
      repetitions: updated.repetitions,
      nextReview: updated.nextReview,
    },
  })

  return NextResponse.json({ ok: true })
}
