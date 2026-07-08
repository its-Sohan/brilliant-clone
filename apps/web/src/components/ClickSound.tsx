"use client"

import { useEffect, useRef } from "react"

export function ClickSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const ctx = new AudioContext()
    ctxRef.current = ctx

    const playClick = () => {
      if (ctx.state === "suspended") ctx.resume()

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = "sine"
      osc.frequency.setValueAtTime(1800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04)

      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.06)
    }

    document.addEventListener("mousedown", playClick)

    return () => {
      document.removeEventListener("mousedown", playClick)
      ctx.close()
    }
  }, [])

  return null
}
