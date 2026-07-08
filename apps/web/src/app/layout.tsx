import type { Metadata } from "next"
import "./globals.css"

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
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  )
}
