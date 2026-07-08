import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { lessonId } = await request.json()

  const progress = await prisma.userLessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
    update: {
      status: "COMPLETED",
      completedAt: new Date(),
    },
    create: {
      userId: session.user.id,
      lessonId,
      status: "COMPLETED",
      completedAt: new Date(),
    },
  })

  return NextResponse.json(progress)
}
