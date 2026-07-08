import type { Metadata } from "next"
import Link from "next/link"
import { Settings, BookOpen, ArrowLeft, Tags } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin — Kakkoii",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r bg-muted/20">
        <div className="border-b p-4">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold">
            <Settings size={16} />
            Admin
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <Link href="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
            <BookOpen size={16} />
            Courses
          </Link>
          <Link href="/admin/tags" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
            <Tags size={16} />
            Tags
          </Link>
        </nav>
        <div className="border-t p-3">
          <Link href="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} />
            Back to app
          </Link>
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  )
}
