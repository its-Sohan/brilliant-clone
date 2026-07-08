import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  // Get all unique concept tags from lessons and content blocks
  const lessons = await prisma.lesson.findMany({ select: { conceptTags: true } })
  const blocks = await prisma.contentBlock.findMany({ select: { conceptTags: true } })

  const tagSet = new Set<string>()
  for (const l of lessons) l.conceptTags.forEach((t) => tagSet.add(t))
  for (const b of blocks) b.conceptTags.forEach((t) => tagSet.add(t))

  const tags = Array.from(tagSet).sort()
  return NextResponse.json(tags)
}
