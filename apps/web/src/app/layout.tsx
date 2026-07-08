import type { Metadata } from "next"
import localFont from "next/font/local"
import { Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { Navbar } from "@/components/Navbar"
import { CustomCursor } from "@/components/CustomCursor"
import { ClickSound } from "@/components/ClickSound"

const quantico = localFont({
  src: [
    { path: "../../public/fonts/Quantico-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Quantico-Italic.ttf", weight: "400", style: "italic" },
    { path: "../../public/fonts/Quantico-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Quantico-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-quantico",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

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
    <html
      lang="en"
      className={`${quantico.variable} ${geistMono.variable} h-full antialiased`}
      style={{ colorScheme: "light dark" }}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <CustomCursor />
          <ClickSound />
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
