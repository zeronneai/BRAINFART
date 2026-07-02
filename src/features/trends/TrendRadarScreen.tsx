import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useGame } from '@/store/gameStore'
import { fetchTrendRadar } from '@/lib/api'
import { LoadingBrew } from '@/components/ui/LoadingBrew'
import { EmptyState } from '@/components/ui/EmptyState'
import { COPY } from '@/lib/copy'
import { formatDayKey, toDayKey } from '@/lib/utils'

export function TrendRadarScreen() {
  const cachedBriefing = useGame((s) => s.briefing)
  const setBriefing = useGame((s) => s.setBriefing)
  const setTrendSeed = useGame((s) => s.setTrendSeed)
  const navigate = useNavigate()
  const day = toDayKey()

  const { data: briefing, isPending, isError, refetch } = useQuery({
    queryKey: ['trend-radar', day],
    queryFn: async () => (await fetchTrendRadar()).briefing,
    staleTime: 12 * 3_600_000, // one real generation per day
    // persisted copy renders instantly across reloads
    initialData: cachedBriefing?.date === day ? cachedBriefing : undefined,
  })

  // keep the store copy fresh — challenges derive event retos from it
  useEffect(() => {
    if (briefing) setBriefing(briefing)
  }, [briefing, setBriefing])

  const rollFrom = (seed: string) => {
    setTrendSeed(seed)
    navigate('/')
  }

  if (isPending) {
    return (
      <div className="pt-16">
        <LoadingBrew />
        <p className="text-center text-xs text-muted">{COPY.radar.scanning}</p>
      </div>
    )
  }

  if (isError || !briefing) {
    return (
      <EmptyState
        icon="📡"
        title="Radar is down"
        subtitle="Couldn't reach the trend feed."
        action={
          <button className="btn-acid" onClick={() => refetch()}>
            {COPY.error.retry}
          </button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl uppercase tracking-wide text-body">{COPY.radar.title}</h1>
        <span className="hud-label">{COPY.radar.refreshed}</span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass border-legendary/40 p-4"
        style={{ boxShadow: '0 0 30px rgba(255,197,59,0.15)' }}
      >
        <p className="hud-label !text-legendary">{COPY.radar.alert}</p>
        <p className="mt-1.5 text-sm leading-snug text-body">{briefing.seasonal_alert}</p>
      </motion.div>

      <section>
        <h2 className="hud-label mb-3">{COPY.radar.topTrends}</h2>
        <div className="space-y-3">
          {briefing.trends.map((t, i) => (
            <motion.div
              key={t.title}
              className="glass p-4"
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="flex items-start gap-3">
                <span className="display-num mt-0.5 text-lg text-acid">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base uppercase leading-tight text-body">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted">{t.summary}</p>
                  <p className="mt-1.5 text-xs text-body/80">
                    <span className="text-acid">{COPY.radar.yourAngle}:</span> {t.why_relevant}
                  </p>
                  {t.source && <p className="mt-1 truncate text-[10px] text-muted/60">src: {t.source}</p>}
                </div>
              </div>
              <button
                className="btn-ghost mt-3 w-full !border-acid/40 !py-2 text-xs !text-acid"
                onClick={() => rollFrom(t.title)}
              >
                {COPY.radar.rollFromThis}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="hud-label mb-3">{COPY.radar.nextDays}</h2>
        <div className="space-y-2">
          {briefing.upcoming_dates.map((d, i) => (
            <motion.button
              key={d.date + d.label}
              onClick={() => rollFrom(`${d.label} (${formatDayKey(d.date)}): ${d.content_angle}`)}
              className="glass flex w-full items-center gap-3 p-3 text-left transition-colors hover:border-line-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
            >
              <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl border border-line bg-black/30">
                <span className="hud-label !text-[7px]">{formatDayKey(d.date).split(' ')[0]}</span>
                <span className="display-num text-base leading-none text-body">
                  {formatDayKey(d.date).split(' ')[1]}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-body">{d.label}</p>
                <p className="truncate text-xs text-muted">{d.content_angle}</p>
              </div>
              <span className="ml-auto text-muted">→</span>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  )
}
