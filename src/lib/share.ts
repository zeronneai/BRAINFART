/**
 * Instagram share flow. Direct video upload isn't possible for personal
 * accounts via API — the correct pattern is: copy the full caption to the
 * clipboard, then hand off to the IG app (deep link) or instagram.com.
 */

import type { TitleKit } from './types'

export function buildCaption(kit: TitleKit): string {
  const bait = kit.comment_baits[0] ? `\n\n📌 ${kit.comment_baits[0]}` : ''
  return `${kit.titles[0] ?? ''}\n\n${kit.caption}${bait}`
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // clipboard API can be unavailable (http, permissions) — legacy fallback
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}

export function canNativeShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}

export async function nativeShare(text: string): Promise<boolean> {
  try {
    await navigator.share({ text })
    return true
  } catch {
    return false
  }
}

/** Try the IG app deep link; fall back to instagram.com in a new tab. */
export function openInstagram(): void {
  const fallback = () => window.open('https://www.instagram.com/', '_blank', 'noopener')
  const isMobile = /iphone|ipad|android/i.test(navigator.userAgent)
  if (!isMobile) {
    fallback()
    return
  }
  const start = Date.now()
  // if the deep link works the page is backgrounded and the timer never fires in time
  const timer = setTimeout(() => {
    if (Date.now() - start < 1600 && !document.hidden) fallback()
  }, 1200)
  window.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) clearTimeout(timer)
    },
    { once: true },
  )
  window.location.href = 'instagram://camera'
}
