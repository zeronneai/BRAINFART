import { useNavigate } from 'react-router-dom'
import { Sheet } from '@/components/ui/Sheet'
import { useGame } from '@/store/gameStore'
import { ZONE_LABELS, type SpotDef } from '@/lib/spots'
import { formatDayKey } from '@/lib/utils'

interface Props {
  spot: SpotDef | null
  onClose: () => void
}

/** Bottom sheet for a tapped map pin. */
export function SpotSheet({ spot, onClose }: Props) {
  const navigate = useNavigate()
  const spotStates = useGame((s) => s.spotStates)
  const quests = useGame((s) => s.quests)
  const setTrendSeed = useGame((s) => s.setTrendSeed)

  const runtime = spot ? spotStates[spot.id] : undefined
  const state = runtime?.state ?? 'suggested'
  const linkedQuest = runtime?.quest_id ? quests.find((q) => q.id === runtime.quest_id) : undefined

  const rollHere = () => {
    if (!spot) return
    setTrendSeed(`Film at ${spot.name} (${spot.category}, ${ZONE_LABELS[spot.zone]})`, spot.id)
    onClose()
    navigate('/')
  }

  return (
    <Sheet open={spot !== null} onClose={onClose} title={spot?.name}>
      {spot && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-chip border border-line px-2.5 py-1 text-xs font-semibold text-muted">
              {spot.category}
            </span>
            <span className="rounded-chip border border-line px-2.5 py-1 text-xs font-semibold text-muted">
              {ZONE_LABELS[spot.zone]}
            </span>
            {state === 'conquered' && (
              <span className="holo rounded-chip border border-legendary/50 px-2.5 py-1 text-xs font-bold text-legendary">
                ★ CONQUERED
              </span>
            )}
            {state === 'active' && (
              <span className="rounded-chip border border-acid/50 bg-acid-dim px-2.5 py-1 text-xs font-bold text-acid">
                ⚔ ACTIVE QUEST
              </span>
            )}
          </div>

          {state === 'conquered' && runtime?.conquered_at && (
            <div className="rounded-xl border border-line bg-black/25 p-4">
              <p className="hud-label mb-1">Conquered</p>
              <p className="text-sm text-body">{formatDayKey(runtime.conquered_at.slice(0, 10))}</p>
              {linkedQuest && (
                <p className="mt-2 text-sm text-muted">🎬 {linkedQuest.idea.title}</p>
              )}
              {linkedQuest?.post_url && (
                <a
                  href={linkedQuest.post_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm text-acid underline underline-offset-2"
                >
                  View the post ↗
                </a>
              )}
            </div>
          )}

          {state === 'active' && linkedQuest && (
            <div className="rounded-xl border border-line bg-black/25 p-4">
              <p className="hud-label mb-1">Linked quest</p>
              <p className="text-sm text-body">{linkedQuest.idea.title}</p>
              <button
                className="btn-ghost mt-3 w-full !py-2 text-xs"
                onClick={() => {
                  onClose()
                  navigate('/quests')
                }}
              >
                OPEN QUEST LOG
              </button>
            </div>
          )}

          <button className="btn-acid w-full !py-3" onClick={rollHere}>
            🎲 ROLL IDEAS FOR THIS SPOT
          </button>
        </div>
      )}
    </Sheet>
  )
}
