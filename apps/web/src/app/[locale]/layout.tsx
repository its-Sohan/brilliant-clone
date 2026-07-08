import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { Providers } from "@/components/Providers"
import { Navbar } from "@/components/Navbar"
import { CustomCursor } from "@/components/CustomCursor"
import { ClickSound } from "@/components/ClickSound"
import { ServiceWorker } from "@/components/ServiceWorker"

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <CustomCursor />
        <ServiceWorker />
        <ClickSound />
        <Navbar />
        <main className="flex-1">{children}</main>
      </Providers>
    </NextIntlClientProvider>
  )
}
