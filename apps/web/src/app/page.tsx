import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 pt-16 pb-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Learn interactively.
            <br />
            <span className="text-primary">Think better.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto">
            Master math, programming, and science through hands-on lessons and
            real-time feedback. Built for how you actually learn.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8 text-base">
                Get started free
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 text-base">
                Browse courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div>
              <p className="text-3xl font-bold">100+</p>
              <p className="mt-1 text-sm text-muted-foreground">Interactive courses</p>
            </div>
            <div>
              <p className="text-3xl font-bold">50,000+</p>
              <p className="mt-1 text-sm text-muted-foreground">Active learners</p>
            </div>
            <div>
              <p className="text-3xl font-bold">10 min</p>
              <p className="mt-1 text-sm text-muted-foreground">Average daily session</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Kakkoii?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto">
            We believe the best way to learn is by doing — not watching.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Hands-on lessons",
              desc: "Every concept has an interactive exercise. You learn by solving, not just reading.",
            },
            {
              title: "Instant feedback",
              desc: "Know immediately if you're right or wrong, with step-by-step explanations.",
            },
            {
              title: "Adaptive difficulty",
              desc: "Questions adjust to your skill level so you're always challenged, never overwhelmed.",
            },
            {
              title: "Built for all levels",
              desc: "From absolute beginner to advanced — meet yourself where you are.",
            },
            {
              title: "Track progress",
              desc: "See your improvement over time with clear metrics and milestones.",
            },
            {
              title: "Always free to start",
              desc: "No credit card required. Jump into any course and begin learning today.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border p-6 text-left">
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to start learning?
          </h2>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-md mx-auto">
            Join thousands of learners mastering new skills every day.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="px-8 text-base">
                Get started for free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Kakkoii. Learning by doing.</p>
      </footer>
    </div>
  )
}
