"use client"

import { useEffect } from "react"

export function CustomCursor() {
  useEffect(() => {
    const style = document.createElement("style")
    style.id = "custom-cursor-style"
    style.textContent = `* { cursor: url(/images/cursor.svg) 3 3, auto !important; }`
    document.head.appendChild(style)

    return () => {
      document.getElementById("custom-cursor-style")?.remove()
    }
  }, [])

  return null
}
