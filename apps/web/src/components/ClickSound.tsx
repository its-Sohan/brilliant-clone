"use client"

import { useEffect, useRef } from "react"

function generateClickBuffer(ctx: AudioContext, sampleRate: number) {
  const len = Math.floor(sampleRate * 0.015)
  const buf = ctx.createBuffer(1, len, sampleRate)
  const data = buf.getChannelData(0)

  for (let i = 0; i < len; i++) {
    const t = i / sampleRate
    const env = Math.exp(-t * 250)
    data[i] = (Math.random() * 2 - 1) * env * 0.4
  }

  return buf
}

export function ClickSound() {
  const ref = useRef<{ ctx: AudioContext; buf: AudioBuffer } | null>(null)

  useEffect(() => {
    const ctx = new AudioContext()
    const buf = generateClickBuffer(ctx, ctx.sampleRate)
    ref.current = { ctx, buf }

    const play = () => {
      if (ctx.state === "suspended") ctx.resume()

      const src = ctx.createBufferSource()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      src.buffer = buf
      filter.type = "bandpass"
      filter.frequency.value = 3000
      filter.Q.value = 1.5

      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02)

      src.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      src.start()
    }

    document.addEventListener("mousedown", play)
    document.addEventListener("touchstart", play, { passive: true })

    return () => {
      document.removeEventListener("mousedown", play)
      document.removeEventListener("touchstart", play)
      ctx.close()
    }
  }, [])

  return null
}
