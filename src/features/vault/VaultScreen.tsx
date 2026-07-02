import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGame } from '@/store/gameStore'
import { IdeaCard } from '@/features/loot/IdeaCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { ACTIVE_DNA } from '@/lib/creatorDNA'
import { RARITY_ORDER } from '@/lib/rarity'
import type { FormatKey, Rarity } from '@/lib/types'
import { cn } from '@/lib/utils'

export function VaultScreen() {
  const ideas = useGame((s) => s.ideas)
  const acceptQuest = useGame((s) => s.acceptQuest)
  const trashIdea = useGame((s) => s.trashIdea)
  const [query, setQuery] = useState('')
  const [format, setFormat] = useState<FormatKey | 'all'>('all')
  const [rarity, setRarity] = useState<Rarity | 'all'>('all')

  const banked = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ideas
      .filter((i) => i.status === 'banked')
      .filter((i) => format === 'all' || i.format === format)
      .filter((i) => rarity === 'all' || i.rarity === rarity)
      .filter(
        (i) =>
          !q ||
          i.title.toLowerCase().includes(q) ||
          i.location_suggestion.toLowerCase().includes(q) ||
          i.why_now.toLowerCase().includes(q),
      )
      .sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity))
  }, [ideas, query, format, rarity])

  const chip = (active: boolean) =>
    cn(
      'rounded-chip border px-2.5 py-1 text-[11px] font-semibold transition-colors',
      active ? 'border-acid bg-acid-dim text-acid' : 'border-line text-muted hover:text-body',
    )

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl uppercase tracking-wide text-body">The Vault 🏦</h1>
        <span className="display-num text-xs text-muted">{banked.length} banked</span>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search banked ideas…"
        className="w-full rounded-xl border border-line bg-black/25 px-4 py-2.5 text-sm text-body outline-none placeholder:text-muted/60 focus:border-acid/50"
      />

      <div className="flex flex-wrap gap-1.5">
        <button className={chip(format === 'all')} onClick={() => setFormat('all')}>
          All formats
        </button>
        {ACTIVE_DNA.formats.map((f) => (
          <button
            key={f.key}
            className={chip(format === f.key)}
            onClick={() => setFormat(format === f.key ? 'all' : f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button className={chip(rarity === 'all')} onClick={() => setRarity('all')}>
          All rarities
        </button>
        {(['legendary', 'epic', 'rare', 'common'] as Rarity[]).map((r) => (
          <button
            key={r}
            className={chip(rarity === r)}
            onClick={() => setRarity(rarity === r ? 'all' : r)}
          >
            {r}
          </button>
        ))}
      </div>

      {banked.length === 0 ? (
        <EmptyState
          icon="🏦"
          title="Vault's empty"
          subtitle="Bank ideas you're not ready to film yet — they'll wait here, gathering interest."
          action={
            <Link to="/" className="btn-acid inline-block">
              ROLL SOMETHING
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {banked.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onAccept={acceptQuest} onTrash={trashIdea} />
          ))}
        </div>
      )}
    </div>
  )
}
