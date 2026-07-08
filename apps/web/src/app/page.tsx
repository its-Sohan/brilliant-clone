import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Learn interactively. Think better.
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Master math, science, and computer science through hands-on lessons and
        real-time feedback.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/signup">
          <Button size="lg">Get started</Button>
        </Link>
        <Link href="/courses">
          <Button variant="outline" size="lg">
            Browse courses
          </Button>
        </Link>
      </div>
    </div>
  )
}
