import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGame } from '@/store/gameStore'
import { fetchTrendRadar } from '@/lib/api'
import { LoadingBrew } from '@/components/ui/LoadingBrew'
import { formatDayKey, toDayKey } from '@/lib/utils'

export function TrendRadarScreen() {
  const briefing = useGame((s) => s.briefing)
  const setBriefing = useGame((s) => s.setBriefing)
  const setTrendSeed = useGame((s) => s.setTrendSeed)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const stale = !briefing || briefing.date !== toDayKey()

  useEffect(() => {
    if (!stale || loading) return
    setLoading(true)
    fetchTrendRadar()
      .then(({ briefing }) => setBriefing(briefing))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stale])

  const rollFrom = (seed: string) => {
    setTrendSeed(seed)
    navigate('/')
  }

  if (loading && !briefing) {
    return (
      <div className="pt-16">
        <LoadingBrew />
        <p className="text-center text-xs text-muted">scanning the timeline…</p>
      </div>
    )
  }

  if (!briefing) return null

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl uppercase tracking-wide text-body">
          Trend Radar <span className="text-rare">📡</span>
        </h1>
        <span className="hud-label">refreshed daily</span>
      </div>

      {/* seasonal alert */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass border-legendary/40 p-4"
        style={{ boxShadow: '0 0 30px rgba(255,197,59,0.15)' }}
      >
        <p className="hud-label !text-legendary">⚠ Seasonal alert</p>
        <p className="mt-1.5 text-sm leading-snug text-body">{briefing.seasonal_alert}</p>
      </motion.div>

      {/* top trends */}
      <section>
        <h2 className="hud-label mb-3">Top 5 in your lane</h2>
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
                <span className="display-num mt-0.5 text-lg text-rare">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base uppercase leading-tight text-body">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted">{t.summary}</p>
                  <p className="mt-1.5 text-xs text-body/80">
                    <span className="text-acid">Your angle:</span> {t.why_relevant}
                  </p>
                  {t.source && (
                    <p className="mt-1 truncate text-[10px] text-muted/60">src: {t.source}</p>
                  )}
                </div>
              </div>
              <button className="btn-ghost mt-3 w-full !border-rare/40 !py-2 text-xs !text-rare" onClick={() => rollFrom(t.title)}>
                🎲 ROLL IDEAS FROM THIS
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* upcoming dates */}
      <section>
        <h2 className="hud-label mb-3">Next 14 days — plan ahead</h2>
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
