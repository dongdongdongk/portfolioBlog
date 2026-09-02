'use client'

import { useEffect, useRef } from 'react'

const SYMBOLS = [
  '♩',
  '♪',
  '♫',
  '♬',
  '♭',
  '♮',
  '♯',
  '/>',
  '</>',
  '{}',
  '()',
  '=>',
  'fn',
  'const',
  'let',
  '[]',
  '//',
]

interface Item {
  x: number
  y: number
  char: string
  vy: number
  settled: boolean
  bouncing: boolean
  bounceVy: number
  col: number
  fontSize: number
}

export default function FallingSymbols() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const itemsRef = useRef<Item[]>([])
  const colHeightsRef = useRef<number[]>([])
  const rafRef = useRef<number>(0)
  const lastSpawnRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const COL_W = 38
    const SIZE = 13
    const GAP = 6
    const GRAVITY = 0.04
    const BOUNCE_DAMPEN = 0.35

    const init = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      canvas.width = W * devicePixelRatio
      canvas.height = H * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
      const cols = Math.floor(W / COL_W)
      colHeightsRef.current = new Array(cols).fill(0)
      itemsRef.current = []
      lastSpawnRef.current = 0
    }

    const spawn = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      const heights = colHeightsRef.current
      // pick a column that still has room
      const available = heights.map((h, i) => ({ h, i })).filter(({ h }) => h < H - SIZE * 2)
      if (available.length === 0) return

      const { i: col } = available[Math.floor(Math.random() * available.length)]
      const x = col * COL_W + COL_W / 2 + (Math.random() - 0.5) * 8
      const char = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      itemsRef.current.push({
        x,
        y: -SIZE,
        char,
        vy: 0.2 + Math.random() * 0.3,
        settled: false,
        bouncing: false,
        bounceVy: 0,
        col,
        fontSize: SIZE + Math.floor(Math.random() * 4),
      })
    }

    const draw = (ts: number) => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      if (ts - lastSpawnRef.current > 1200) {
        spawn()
        lastSpawnRef.current = ts
      }

      const heights = colHeightsRef.current

      for (const item of itemsRef.current) {
        if (!item.settled) {
          // apply gravity
          item.vy += GRAVITY
          item.y += item.vy

          const col = Math.max(0, Math.min(item.col, heights.length - 1))
          const floor = H - heights[col]
          const landY = floor - item.fontSize / 2

          if (item.y >= landY) {
            item.y = landY
            const reboundVy = item.vy * BOUNCE_DAMPEN
            if (reboundVy > 0.6) {
              // bounce
              item.vy = -reboundVy
            } else {
              // settle
              item.settled = true
              item.vy = 0
              heights[col] += item.fontSize + GAP
            }
          }
        }

        // musical notes → slightly lighter, code → slightly darker
        const isMusic = ['♩', '♪', '♫', '♬', '♭', '♮', '♯'].includes(item.char)
        const alpha = item.settled ? (isMusic ? 0.75 : 0.9) : 0.35
        ctx.font = `${item.settled ? '600' : '400'} ${item.fontSize}px ui-monospace, monospace`
        ctx.fillStyle = `rgba(15,23,42,${alpha})`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(item.char, item.x, item.y)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    init()
    rafRef.current = requestAnimationFrame(draw)

    const onResize = () => init()
    window.addEventListener('resize', onResize)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}
