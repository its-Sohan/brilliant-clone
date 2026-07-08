import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Courses</h1>
      <p className="mt-2 text-muted-foreground">
        No courses yet. Check back soon!
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button variant="outline">Back home</Button>
        </Link>
      </div>
    </div>
  )
}
