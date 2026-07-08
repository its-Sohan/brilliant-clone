import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { blockId, isCorrect, input } = await request.json()

  const response = await prisma.userResponse.create({
    data: {
      userId: session.user.id,
      blockId,
      isCorrect,
      ...(input !== undefined ? { input } : {}),
    },
  })

  return NextResponse.json(response)
}
