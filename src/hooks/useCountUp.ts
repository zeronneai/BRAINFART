import { useEffect, useRef, useState } from 'react'

/** Animates a number toward `target` with ease-out — used for XP counters. */
export function useCountUp(target: number, durationMs = 900): number {
  const [display, setDisplay] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef<number>()

  useEffect(() => {
    const from = fromRef.current
    if (from === target) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      const value = Math.round(from + (target - from) * eased)
      setDisplay(value)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      fromRef.current = target
    }
  }, [target, durationMs])

  return display
}
