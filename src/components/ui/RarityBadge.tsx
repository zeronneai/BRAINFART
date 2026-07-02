import type { Rarity } from '@/lib/types'
import { RARITIES } from '@/lib/rarity'
import { cn } from '@/lib/utils'

export function RarityBadge({ rarity, className }: { rarity: Rarity; className?: string }) {
  const def = RARITIES[rarity]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-chip border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]',
        rarity === 'legendary' && 'holo',
        className,
      )}
      style={{
        color: def.color,
        borderColor: `color-mix(in srgb, ${def.color} 45%, transparent)`,
        background: `color-mix(in srgb, ${def.color} 10%, transparent)`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: def.color, boxShadow: `0 0 8px ${def.glow}` }}
      />
      {def.label}
    </span>
  )
}
