import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { lessons: true } },
    },
  })

  return NextResponse.json(courses)
}
