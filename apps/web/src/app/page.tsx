import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Zap, BarChart3, GraduationCap, Target, Sparkles } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Hands-on lessons",
    desc: "Every concept has an interactive exercise. You learn by solving, not just reading.",
  },
  {
    icon: Zap,
    title: "Instant feedback",
    desc: "Know immediately if you're right or wrong, with step-by-step explanations.",
  },
  {
    icon: BarChart3,
    title: "Adaptive difficulty",
    desc: "Questions adjust to your skill level so you're always challenged, never overwhelmed.",
  },
  {
    icon: GraduationCap,
    title: "Built for all levels",
    desc: "From absolute beginner to advanced — meet yourself where you are.",
  },
  {
    icon: Target,
    title: "Track progress",
    desc: "See your improvement over time with clear metrics and milestones.",
  },
  {
    icon: Sparkles,
    title: "Always free to start",
    desc: "No credit card required. Jump into any course and begin learning today.",
  },
]

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 pt-20 pb-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-3xl relative">
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
            <Sparkles size={14} />
            Now in beta &middot; Start learning free
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
            Learn interactively.
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Think better.
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto leading-relaxed">
            Master math, programming, and science through hands-on lessons and
            real-time feedback. Built for how you actually learn.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8 text-base h-12 shadow-sm gap-2">
                <GraduationCap size={18} />
                Get started free
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 text-base h-12 gap-2">
                <Zap size={18} />
                Browse courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/20">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            {[
              { value: "100+", label: "Interactive courses", icon: Brain },
              { value: "50,000+", label: "Active learners", icon: GraduationCap },
              { value: "10 min", label: "Average daily session", icon: Target },
            ].map((s) => (
              <div key={s.label} className="space-y-2">
                <div className="flex justify-center">
                  <div className="inline-flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
                    <s.icon size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold tracking-tight">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border bg-card p-6 text-left transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="inline-flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-gradient-to-b from-primary to-primary/90 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to start learning?
          </h2>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-md mx-auto">
            Join thousands of learners mastering new skills every day.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="px-8 text-base h-12 shadow-sm gap-2">
                <Sparkles size={18} />
                Get started for free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 text-center text-sm text-muted-foreground">
        <p className="font-medium text-foreground/80">kakkoii</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} Kakkoii. Learning by doing.</p>
      </footer>
    </div>
  )
}
