import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ ok: true })
  }

  const { blockId } = await request.json()

  // Track hint usage - in production we'd store this
  // For now, just acknowledge it
  return NextResponse.json({ ok: true })
}
