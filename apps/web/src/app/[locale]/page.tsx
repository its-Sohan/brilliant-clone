import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Zap, BarChart3, GraduationCap, Target, Sparkles } from "lucide-react"

const features = [
  { icon: Brain, key: "handsOn" },
  { icon: Zap, key: "feedback" },
  { icon: BarChart3, key: "adaptive" },
  { icon: GraduationCap, key: "levels" },
  { icon: Target, key: "tracking" },
  { icon: Sparkles, key: "free" },
]

export default async function Home() {
  const t = await getTranslations()

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 pt-20 pb-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-3xl relative">
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
            <Sparkles size={14} />
            {t("hero.badge")}
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
            {t("hero.title")}
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("hero.subtitle")}
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto leading-relaxed">
            {t("hero.desc")}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8 text-base h-12 shadow-sm gap-2">
                <GraduationCap size={18} />
                {t("hero.cta")}
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 text-base h-12 gap-2">
                <Zap size={18} />
                {t("hero.browse")}
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
              { value: "100+", key: "stats.courses" },
              { value: "50,000+", key: "stats.learners" },
              { value: "10 min", key: "stats.session" },
            ].map((s) => (
              <div key={s.key} className="space-y-2">
                <div className="flex justify-center">
                  <div className="inline-flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
                    <Brain size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold tracking-tight">{s.value}</p>
                <p className="text-sm text-muted-foreground">{t(s.key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("features.title")}</h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto">{t("features.subtitle")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.key} className="group rounded-xl border bg-card p-6 text-left transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="inline-flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold text-lg">{t(`features.${f.key}`)}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(`features.${f.key}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-gradient-to-b from-primary to-primary/90 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("cta.title")}</h2>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-md mx-auto">{t("cta.desc")}</p>
          <div className="mt-8">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="px-8 text-base h-12 shadow-sm gap-2">
                <Sparkles size={18} />
                {t("cta.button")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 text-center text-sm text-muted-foreground">
        <p className="font-medium text-foreground/80">kakkoii</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} Kakkoii. {t("footer.tagline")}</p>
      </footer>
    </div>
  )
}
