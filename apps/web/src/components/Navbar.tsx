"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          kakkoii
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/courses">
            <Button variant="ghost" size="sm">Courses</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">Progress</Button>
          </Link>
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted transition-colors outline-none">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs">
                    {session.user.name?.charAt(0)?.toUpperCase() ?? session.user.email?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">
                  {session.user.name ?? session.user.email?.split("@")[0] ?? "User"}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {session.user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
