import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params
  const { orders } = await request.json() as { orders: { id: string; order: number }[] }

  await Promise.all(
    orders.map((o) =>
      prisma.lesson.update({
        where: { id: o.id },
        data: { order: o.order },
      })
    )
  )

  return NextResponse.json({ ok: true })
}
