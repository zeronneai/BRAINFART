import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'
import { RARITIES } from '@/lib/rarity'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Quest } from '@/lib/types'
import { cn, monthLabel, toDayKey } from '@/lib/utils'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function CalendarScreen() {
  const quests = useGame((s) => s.quests)
  const scheduleQuest = useGame((s) => s.scheduleQuest)
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selected, setSelected] = useState<string | null>(null) // questId being placed
  const today = toDayKey()

  const open = quests.filter((q) => q.state !== 'completed')
  const unscheduled = open.filter((q) => !q.scheduled_date)

  const cells = useMemo(() => {
    const first = new Date(year, month, 1)
    const days = new Date(year, month + 1, 0).getDate()
    const lead = first.getDay()
    const out: Array<string | null> = Array.from({ length: lead }, () => null)
    for (let d = 1; d <= days; d++) {
      out.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
    }
    return out
  }, [year, month])

  const byDay = useMemo(() => {
    const map = new Map<string, Quest[]>()
    for (const q of open) {
      if (!q.scheduled_date) continue
      map.set(q.scheduled_date, [...(map.get(q.scheduled_date) ?? []), q])
    }
    return map
  }, [open])

  const step = (dir: 1 | -1) => {
    const d = new Date(year, month + dir, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth())
  }

  const place = (dayKey: string) => {
    if (!selected) return
    scheduleQuest(selected, dayKey)
    setSelected(null)
  }

  const onDrop = (e: React.DragEvent, dayKey: string) => {
    e.preventDefault()
    const questId = e.dataTransfer.getData('text/quest-id')
    if (questId) scheduleQuest(questId, dayKey)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl uppercase tracking-wide text-body">Calendar</h1>
        <div className="flex items-center gap-2">
          <button className="btn-ghost !px-3 !py-1" onClick={() => step(-1)} aria-label="Previous month">
            ‹
          </button>
          <span className="display-num w-32 text-center text-sm text-body">{monthLabel(year, month)}</span>
          <button className="btn-ghost !px-3 !py-1" onClick={() => step(1)} aria-label="Next month">
            ›
          </button>
        </div>
      </div>

      {/* unscheduled tray */}
      <div className="glass p-3">
        <p className="hud-label mb-2">
          Unscheduled quests {selected && <span className="text-acid">— now tap a date</span>}
        </p>
        {unscheduled.length === 0 ? (
          <p className="text-xs text-muted">Everything's on the board. No quests scheduled, main character? Roll more.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {unscheduled.map((q) => {
              const def = RARITIES[q.idea.rarity]
              return (
                <button
                  key={q.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/quest-id', q.id)}
                  onClick={() => setSelected(selected === q.id ? null : q.id)}
                  className={cn(
                    'max-w-full truncate rounded-chip border px-2.5 py-1 text-[11px] font-semibold transition-transform active:scale-95',
                    selected === q.id && 'ring-2 ring-acid',
                  )}
                  style={{
                    color: def.color,
                    borderColor: `color-mix(in srgb, ${def.color} 45%, transparent)`,
                    background: `color-mix(in srgb, ${def.color} 10%, transparent)`,
                  }}
                  title="Drag onto a date, or tap then tap a date"
                >
                  {q.idea.title}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* month grid */}
      <div className="glass p-3">
        <div className="mb-1 grid grid-cols-7">
          {WEEKDAYS.map((d, i) => (
            <span key={i} className="hud-label text-center !text-[9px]">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((dayKey, i) =>
            dayKey === null ? (
              <div key={`x${i}`} />
            ) : (
              <div
                key={dayKey}
                onClick={() => place(dayKey)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, dayKey)}
                className={cn(
                  'min-h-[3.4rem] rounded-lg border border-transparent p-1 transition-colors sm:min-h-[4.4rem]',
                  dayKey === today && 'border-acid/40 bg-acid-dim/40',
                  selected && 'cursor-pointer border-dashed border-line-2 hover:border-acid hover:bg-acid-dim',
                )}
              >
                <span
                  className={cn(
                    'display-num text-[11px]',
                    dayKey === today ? 'text-acid' : 'text-muted',
                  )}
                >
                  {Number(dayKey.slice(-2))}
                </span>
                <div className="mt-0.5 space-y-0.5">
                  <AnimatePresence>
                    {(byDay.get(dayKey) ?? []).map((q) => {
                      const def = RARITIES[q.idea.rarity]
                      return (
                        <motion.button
                          key={q.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            // tap a placed quest to pick it back up
                            scheduleQuest(q.id, null)
                            setSelected(q.id)
                          }}
                          className="block w-full truncate rounded px-1 py-0.5 text-left text-[9px] font-semibold leading-tight"
                          style={{
                            color: def.color,
                            background: `color-mix(in srgb, ${def.color} 14%, transparent)`,
                          }}
                          title={`${q.idea.title} — tap to move`}
                        >
                          {q.idea.title}
                        </motion.button>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {open.length === 0 && (
        <EmptyState
          icon="🗓"
          title="No quests scheduled, main character"
          subtitle="Accept quests from your rolls, then drag them onto shoot days."
        />
      )}
    </div>
  )
}
