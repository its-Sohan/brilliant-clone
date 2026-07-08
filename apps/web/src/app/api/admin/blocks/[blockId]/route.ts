import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ blockId: string }> }
) {
  const { blockId } = await params
  const body = await request.json()

  const data: Record<string, unknown> = {}
  if (body.content !== undefined) data.content = body.content
  if (body.solution !== undefined) data.solution = body.solution
  if (body.hints !== undefined) data.hints = body.hints
  if (body.difficulty !== undefined) data.difficulty = body.difficulty
  if (body.conceptTags !== undefined) data.conceptTags = body.conceptTags

  const block = await prisma.contentBlock.update({
    where: { id: blockId },
    data,
  })

  return NextResponse.json(block)
}
