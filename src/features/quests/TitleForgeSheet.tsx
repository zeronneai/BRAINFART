import { useState } from 'react'
import { Sheet } from '@/components/ui/Sheet'
import type { Quest, TitleKit } from '@/lib/types'
import { generateTitles } from '@/lib/api'
import { LoadingBrew } from '@/components/ui/LoadingBrew'

interface Props {
  open: boolean
  onClose: () => void
  quest: Quest
}

/** Paste what you filmed → get hooks, comment-bait questions, and a caption. */
export function TitleForgeSheet({ open, onClose, quest }: Props) {
  const [description, setDescription] = useState('')
  const [kit, setKit] = useState<TitleKit | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const forge = async () => {
    setLoading(true)
    setKit(null)
    const text = description.trim() || `${quest.idea.title} — filmed at ${quest.idea.location_suggestion}`
    const { kit } = await generateTitles(text)
    setKit(kit)
    setLoading(false)
  }

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(text)
    setTimeout(() => setCopied(null), 1200)
  }

  return (
    <Sheet open={open} onClose={onClose} title="Title Forge 🪄">
      <div className="space-y-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder={`What actually happened on camera?\ne.g. "${quest.idea.title} — the manager joined in and gave everyone free food"`}
          className="w-full rounded-xl border border-line bg-black/30 px-3 py-2.5 text-sm text-body outline-none placeholder:text-muted/60 focus:border-acid/50"
        />
        <button className="btn-acid w-full !py-2.5 text-sm" onClick={forge} disabled={loading}>
          {loading ? 'FORGING…' : 'FORGE TITLES'}
        </button>

        {loading && <LoadingBrew />}

        {kit && (
          <div className="space-y-4">
            <div>
              <p className="hud-label mb-2">Hooks — tap to copy</p>
              <div className="space-y-1.5">
                {kit.titles.map((t) => (
                  <button
                    key={t}
                    onClick={() => copy(t)}
                    className="block w-full rounded-xl border border-line bg-black/25 px-3 py-2 text-left text-sm text-body transition-colors hover:border-acid/40"
                  >
                    {copied === t ? '✓ copied' : t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="hud-label mb-2">Pinned-comment bait</p>
              <div className="space-y-1.5">
                {kit.comment_baits.map((c) => (
                  <button
                    key={c}
                    onClick={() => copy(c)}
                    className="block w-full rounded-xl border border-line bg-black/25 px-3 py-2 text-left text-sm text-muted transition-colors hover:border-acid/40 hover:text-body"
                  >
                    {copied === c ? '✓ copied' : c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="hud-label mb-2">Caption</p>
              <button
                onClick={() => copy(kit.caption)}
                className="block w-full rounded-xl border border-line bg-black/25 px-3 py-2 text-left text-sm text-muted transition-colors hover:border-acid/40 hover:text-body"
              >
                {copied === kit.caption ? '✓ copied' : kit.caption}
              </button>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  )
}
