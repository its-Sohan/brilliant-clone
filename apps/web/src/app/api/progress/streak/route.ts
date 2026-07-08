import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ streak: 0 })
  }

  const progress = await prisma.userLessonProgress.findMany({
    where: {
      userId: session.user.id,
      status: "COMPLETED",
      completedAt: { not: null },
    },
    select: { completedAt: true },
    orderBy: { completedAt: "desc" },
  })

  if (progress.length === 0) {
    return NextResponse.json({ streak: 0 })
  }

  const dates = [
    ...new Set(
      progress.map((p) => {
        const d = new Date(p.completedAt!)
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      })
    ),
  ]

  let streak = 0
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  // Check if today or yesterday is in the dates
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`

  let checkDate = todayStr
  if (!dates.includes(todayStr) && dates.includes(yesterdayStr)) {
    checkDate = yesterdayStr
  } else if (!dates.includes(todayStr) && !dates.includes(yesterdayStr)) {
    return NextResponse.json({ streak: 0 })
  }

  const check = new Date(checkDate)
  for (let i = 0; i < 365; i++) {
    const str = `${check.getFullYear()}-${String(check.getMonth() + 1).padStart(2, "0")}-${String(check.getDate()).padStart(2, "0")}`
    if (dates.includes(str)) {
      streak++
      check.setDate(check.getDate() - 1)
    } else {
      break
    }
  }

  return NextResponse.json({ streak })
}
