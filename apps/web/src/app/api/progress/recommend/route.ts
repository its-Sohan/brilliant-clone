import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { isInZone, updateSkill, MAX_SKILL, MIN_SKILL } from "@/lib/adaptive"
import { isMastered } from "@/lib/bkt"

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  let skillLevel = 5.0
  let masteredTags = new Set<string>()
  let weakestTags: { conceptTag: string; pKnown: number }[] = []
  let totalAttempts = 0

  if (userId) {
    // Get user skill level
    const sl = await prisma.userSkillLevel.findUnique({ where: { userId } })
    if (sl) skillLevel = sl.skillLevel

    // Get mastered concepts
    const skills = await prisma.skillProficiency.findMany({
      where: { userId },
      orderBy: { pKnown: "asc" },
    })

    for (const s of skills) {
      totalAttempts += s.numAttempts
      if (isMastered(s.pKnown)) {
        masteredTags.add(s.conceptTag)
      } else {
        weakestTags.push({ conceptTag: s.conceptTag, pKnown: s.pKnown })
      }
    }
  }

  // Get all content blocks with their difficulty and concept tags
  const blocks = await prisma.contentBlock.findMany({
    where: { blockType: { not: "TEXT_EXPLANATION" } },
    select: {
      id: true,
      difficulty: true,
      conceptTags: true,
      blockType: true,
      lesson: { select: { title: true, course: { select: { slug: true } } } },
    },
  })

  // Pick blocks in the user's zone
  const inZone = blocks
    .filter((b) => isInZone(b.difficulty, skillLevel))
    .slice(0, 5)
    .map((b) => ({
      id: b.id,
      difficulty: b.difficulty,
      blockType: b.blockType,
      conceptTags: b.conceptTags,
      lessonTitle: b.lesson.title,
    }))

  // Daily challenge: a block from an unmastered concept with difficulty near max
  const dailyChallenge = blocks
    .filter((b) => b.conceptTags.some((t) => !masteredTags.has(t)) && b.difficulty >= Math.min(skillLevel + 1, MAX_SKILL))
    .sort(() => Math.random() - 0.5)
    .slice(0, 1)
    .map((b) => ({
      id: b.id,
      difficulty: b.difficulty,
      blockType: b.blockType,
      conceptTags: b.conceptTags,
    }))

  return NextResponse.json({
    skillLevel,
    totalAttempts,
    weakestConcepts: weakestTags.slice(0, 5),
    recommendedBlocks: inZone,
    dailyChallenge: dailyChallenge[0] ?? null,
    masteredCount: masteredTags.size,
    zoneRange: `${Math.max(MIN_SKILL, Math.round(skillLevel - 1))}–${Math.min(MAX_SKILL, Math.round(skillLevel + 1))}`,
  })
}
