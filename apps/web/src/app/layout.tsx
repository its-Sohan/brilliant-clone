import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { Navbar } from "@/components/Navbar"
import { CustomCursor } from "@/components/CustomCursor"
import { ClickSound } from "@/components/ClickSound"
import { ServiceWorker } from "@/components/ServiceWorker"

export const metadata: Metadata = {
  title: "Kakkoii — Learn by doing",
  description: "Guided interactive problem solving that's effective and fun.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased" style={{ colorScheme: "light dark" }}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <CustomCursor />
          <ServiceWorker />
          <ClickSound />
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
