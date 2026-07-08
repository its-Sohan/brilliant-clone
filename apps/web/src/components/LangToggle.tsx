"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { Globe } from "lucide-react"

export function LangToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggle = () => {
    const newLocale = locale === "en" ? "bn" : "en"
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.replace(newPath)
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title={locale === "en" ? "Switch to Bangla" : "ইংরেজিতে সুইচ করুন"}
    >
      <Globe size={14} />
      {locale === "en" ? "বাংলা" : "English"}
    </button>
  )
}
