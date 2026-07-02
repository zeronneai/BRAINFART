import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGame } from '@/store/gameStore'
import { QuestCard } from './QuestCard'
import { CalendarBoard } from '@/features/calendar/CalendarBoard'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

type Tab = 'active' | 'available' | 'completed' | 'schedule'

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'active', label: 'Active' },
  { key: 'available', label: 'Open' },
  { key: 'completed', label: 'Done' },
  { key: 'schedule', label: '🗓' },
]

export function QuestLogScreen() {
  const quests = useGame((s) => s.quests)
  const [tab, setTab] = useState<Tab>('active')

  const grouped = useMemo(() => {
    const active = quests.filter((q) => ['active', 'filmed', 'posted'].includes(q.state))
    const available = quests.filter((q) => q.state === 'available')
    const completed = quests.filter((q) => q.state === 'completed')
    return { active, available, completed }
  }, [quests])

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl uppercase tracking-wide text-body">Quest Log</h1>
        <span className="display-num text-xs text-muted">{grouped.completed.length} cleared</span>
      </div>

      <div className="glass flex gap-1 !rounded-chip p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex-1 rounded-chip py-2 text-xs font-bold uppercase tracking-wider transition-colors',
              tab === t.key ? 'bg-acid text-ink' : 'text-muted hover:text-body',
            )}
          >
            {t.label}
            {t.key !== 'schedule' && (
              <span className="ml-1.5 opacity-60">{grouped[t.key].length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'schedule' ? (
        <CalendarBoard />
      ) : grouped[tab].length === 0 ? (
        tab === 'active' ? (
          <EmptyState
            icon="⚔️"
            title="No active quests"
            subtitle="Roll some ideas and accept a quest to start earning XP."
            action={
              <Link to="/" className="btn-acid inline-block">
                GO ROLL
              </Link>
            }
          />
        ) : tab === 'available' ? (
          <EmptyState
            icon="🌵"
            title="Nothing waiting"
            subtitle="Daily quests drop here every morning. Come back tomorrow — or roll your own."
          />
        ) : (
          <EmptyState
            icon="🏆"
            title="No victories yet"
            subtitle="Your completed quests will pile up here. Get filming, main character."
          />
        )
      ) : (
        <div className="space-y-3">
          {grouped[tab].map((q) => (
            <QuestCard key={q.id} quest={q} />
          ))}
        </div>
      )}
    </div>
  )
}
