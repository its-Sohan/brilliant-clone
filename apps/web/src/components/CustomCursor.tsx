"use client"

import { useEffect, useState } from "react"

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [clicking, setClicking] = useState(false)
  const [visible, setVisible] = useState(false)
  const [color, setColor] = useState("oklch(0.205 0.042 265.755)")

  useEffect(() => {
    const c = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim()
    if (c) setColor(c)

    const style = document.createElement("style")
    style.id = "custom-cursor-style"
    style.textContent = "* { cursor: none !important; }"
    document.head.appendChild(style)

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      if (!visible) setVisible(true)
    }
    const down = () => setClicking(true)
    const up = () => setClicking(false)
    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    document.addEventListener("mousemove", move)
    document.addEventListener("mousedown", down)
    document.addEventListener("mouseup", up)
    document.documentElement.addEventListener("mouseleave", leave)
    document.documentElement.addEventListener("mouseenter", enter)

    return () => {
      document.getElementById("custom-cursor-style")?.remove()
      document.removeEventListener("mousemove", move)
      document.removeEventListener("mousedown", down)
      document.removeEventListener("mouseup", up)
      document.documentElement.removeEventListener("mouseleave", leave)
      document.documentElement.removeEventListener("mouseenter", enter)
    }
  }, [visible])

  return (
    <>
      {/* Outer ring */}
      <div
        className="pointer-events-none fixed z-[9999]"
        style={{
          left: pos.x - 16,
          top: pos.y - 16,
          width: clicking ? 24 : 32,
          height: clicking ? 24 : 32,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          opacity: visible ? 1 : 0,
          transition: "width 0.15s, height 0.15s, opacity 0.2s",
        }}
      />
      {/* Inner dot */}
      <div
        className="pointer-events-none fixed z-[9999]"
        style={{
          left: pos.x - 3,
          top: pos.y - 3,
          width: clicking ? 4 : 6,
          height: clicking ? 4 : 6,
          borderRadius: "50%",
          backgroundColor: color,
          opacity: visible ? 1 : 0,
          transition: "width 0.1s, height 0.1s, opacity 0.2s",
        }}
      />
    </>
  )
}
