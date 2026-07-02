import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Quest, TitleKit } from '@/lib/types'
import { generateTitles } from '@/lib/api'
import { buildCaption, canNativeShare, copyText, nativeShare, openInstagram } from '@/lib/share'
import { useGame } from '@/store/gameStore'

interface Props {
  quest: Quest
  /** pre-forged kit (from Title Forge) — skips the API round-trip */
  kit?: TitleKit | null
}

/**
 * The IG handoff: caption copied to clipboard → Instagram opens (deep link
 * on mobile, web fallback) → "did it post?" captures the link back, which
 * feeds the conquest map.
 */
export function ShareToIG({ quest, kit }: Props) {
  const notify = useGame((s) => s.notify)
  const setPostUrl = useGame((s) => s.setPostUrl)
  const [busy, setBusy] = useState(false)
  const [shared, setShared] = useState(false)
  const [link, setLink] = useState('')

  const getCaption = async (): Promise<string> => {
    if (kit) return buildCaption(kit)
    const { kit: fresh } = await generateTitles(
      `${quest.idea.title} — filmed at ${quest.idea.location_suggestion}`,
    )
    return buildCaption(fresh)
  }

  const post = async () => {
    if (busy) return
    setBusy(true)
    try {
      const caption = await getCaption()
      const copied = await copyText(caption)
      notify(copied ? 'Caption copied — paste it in Instagram 📋' : 'Caption ready — copy blocked by browser')
      setShared(true)
      openInstagram()
    } finally {
      setBusy(false)
    }
  }

  const share = async () => {
    const caption = await getCaption()
    const ok = await nativeShare(caption)
    if (ok) setShared(true)
  }

  const saveLink = () => {
    const url = link.trim()
    if (!url) return
    setPostUrl(quest.id, url.startsWith('http') ? url : `https://${url}`)
    setShared(false)
    setLink('')
  }

  if (quest.post_url) {
    return (
      <a
        href={quest.post_url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-acid underline underline-offset-2"
      >
        ✓ Posted — view on IG ↗
      </a>
    )
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2">
        <button className="btn-acid flex-1 !py-2 text-xs" onClick={post} disabled={busy}>
          {busy ? 'PREPPING…' : '📸 POST TO IG'}
        </button>
        {canNativeShare() && (
          <button className="btn-ghost !py-2 text-xs" onClick={share} title="Native share sheet">
            ⤴
          </button>
        )}
      </div>
      {shared && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
          <p className="text-xs text-muted">Did it post? Drop the link — it feeds the map.</p>
          <div className="flex gap-2">
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveLink()}
              placeholder="instagram.com/p/…"
              className="min-w-0 flex-1 rounded-xl border border-line bg-black/30 px-3 py-2 text-sm text-body outline-none placeholder:text-muted/60 focus:border-acid/50"
            />
            <button className="btn-ghost !py-2 text-xs" onClick={saveLink}>
              SAVE
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
