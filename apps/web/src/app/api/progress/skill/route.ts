import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { updateBKT, isMastered } from "@/lib/bkt"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { blockId, isCorrect, conceptTags }: { blockId: string; isCorrect: boolean; conceptTags: string[] } =
    await request.json()

  const results: { conceptTag: string; pKnown: number; mastered: boolean }[] = []

  for (const tag of conceptTags) {
    const existing = await prisma.skillProficiency.findUnique({
      where: { userId_conceptTag: { userId: session.user.id, conceptTag: tag } },
    })

    const current = existing
      ? { pKnown: existing.pKnown, pGuess: existing.pGuess, pSlip: existing.pSlip, pLearn: existing.pLearn }
      : { pKnown: 0.3, pGuess: 0.2, pSlip: 0.1, pLearn: 0.1 }

    const updated = updateBKT(current, isCorrect, existing?.numAttempts ?? 0, existing?.numCorrect ?? 0)

    await prisma.skillProficiency.upsert({
      where: { userId_conceptTag: { userId: session.user.id, conceptTag: tag } },
      update: {
        pKnown: updated.pKnown,
        numAttempts: updated.numAttempts,
        numCorrect: updated.numCorrect,
        lastUpdated: new Date(),
      },
      create: {
        userId: session.user.id,
        conceptTag: tag,
        pKnown: updated.pKnown,
        numAttempts: updated.numAttempts,
        numCorrect: updated.numCorrect,
      },
    })

    results.push({ conceptTag: tag, pKnown: updated.pKnown, mastered: isMastered(updated.pKnown) })
  }

  return NextResponse.json({ results })
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const skills = await prisma.skillProficiency.findMany({
    where: { userId: session.user.id },
    orderBy: { lastUpdated: "desc" },
  })

  return NextResponse.json(
    skills.map((s) => ({
      conceptTag: s.conceptTag,
      pKnown: s.pKnown,
      mastered: isMastered(s.pKnown),
      numAttempts: s.numAttempts,
      numCorrect: s.numCorrect,
    }))
  )
}
