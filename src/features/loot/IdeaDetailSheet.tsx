import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Idea, IdeaScript } from '@/lib/types'
import { Sheet } from '@/components/ui/Sheet'
import { CopyButton } from '@/components/ui/CopyButton'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { Stars } from '@/components/ui/Stars'
import { useGame } from '@/store/gameStore'
import { generateScript } from '@/lib/api'
import { captionForIdea, formatScript, openInstagramProfile } from '@/lib/share'
import { FORMAT_LABELS } from '@/lib/creatorDNA'
import { COPY } from '@/lib/copy'

interface Props {
  idea: Idea | null
  onClose: () => void
}

/** Full production sheet: THE IDEA · SCRIPT · CAPTION + sticky action row. */
export function IdeaDetailSheet({ idea, onClose }: Props) {
  const attachScript = useGame((s) => s.attachScript)
  const handle = useGame((s) => s.profile.instagramHandle)
  const [script, setScript] = useState<IdeaScript | null>(idea?.script ?? null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    setScript(idea?.script ?? null)
  }, [idea])

  if (!idea) return <Sheet open={false} onClose={onClose} />

  const doGenerate = async () => {
    setGenerating(true)
    try {
      const s = await generateScript(idea)
      setScript(s)
      attachScript(idea.id, s)
    } finally {
      setGenerating(false)
    }
  }

  const caption = captionForIdea({ ...idea, script })

  return (
    <Sheet open={idea !== null} onClose={onClose} title={idea.title}>
      <div className="space-y-6 pb-24">
        {/* ── THE IDEA ── */}
        <section className="space-y-3">
          <p className="hud-label">{COPY.detail.theIdea}</p>
          <div className="flex flex-wrap items-center gap-2">
            <RarityBadge rarity={idea.rarity} />
            <span className="rounded-chip border border-line px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              {FORMAT_LABELS[idea.format]}
            </span>
            <Stars value={idea.difficulty} />
            <span className="display-num text-xs text-acid">+{idea.xp_reward} XP</span>
          </div>
          <p className="text-sm text-body/85">
            <span className="text-acid">{COPY.loot.whyNow}:</span> {idea.why_now}
          </p>
          <p className="text-sm text-muted">📍 {idea.location_suggestion}</p>
        </section>

        {/* ── THE SCRIPT ── */}
        <section className="space-y-3">
          <p className="hud-label">{COPY.detail.script}</p>
          {script ? (
            <div className="space-y-2.5">
              <ScriptBeat label={COPY.detail.hook} text={script.hook} accent />
              <ScriptBeat label={COPY.detail.setup} text={script.setup} />
              <div className="rounded-xl border border-line bg-black/25 p-3">
                <p className="hud-label mb-1.5">{COPY.detail.escalation}</p>
                <ol className="space-y-1.5">
                  {script.beats.map((b, i) => (
                    <li key={i} className="flex gap-2 text-sm text-body/90">
                      <span className="display-num text-acid">{i + 1}</span>
                      {b}
                    </li>
                  ))}
                </ol>
              </div>
              <ScriptBeat label={COPY.detail.payoff} text={script.payoff} />
              <ScriptBeat label={COPY.detail.pinnedComment} text={script.pinned_comment} />
            </div>
          ) : generating ? (
            <div className="rounded-xl border border-line bg-black/25 p-6 text-center">
              <motion.p
                className="hud-label !text-acid"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                {COPY.detail.generating}
              </motion.p>
            </div>
          ) : (
            <button className="btn-ghost w-full !border-acid/40 !py-3 !text-acid" onClick={doGenerate}>
              {COPY.detail.generateScript}
            </button>
          )}
        </section>

        {/* ── THE CAPTION ── */}
        <section className="space-y-3">
          <p className="hud-label">{COPY.detail.copyBlock}</p>
          <pre className="whitespace-pre-wrap rounded-xl border border-line bg-black/40 p-3 font-body text-xs leading-relaxed text-body/90">
            {caption}
          </pre>
        </section>
      </div>

      {/* ── sticky action row ── */}
      <div className="surface-modal sticky bottom-0 -mx-6 -mb-6 flex gap-2 border-t border-line px-6 py-3">
        <CopyButton
          text={script ? formatScript(idea, script) : caption}
          label={COPY.detail.copyScript}
          toast={COPY.detail.scriptCopied}
          className="flex-1"
        />
        <CopyButton
          text={caption}
          label={COPY.detail.copyCaption}
          toast={COPY.detail.captionCopied}
          variant="acid"
          className="flex-1"
        />
        <button
          className="btn-ghost !py-2.5 text-xs"
          onClick={() => openInstagramProfile(handle)}
          title={COPY.detail.openIG}
        >
          📷
        </button>
      </div>
    </Sheet>
  )
}

function ScriptBeat({ label, text, accent }: { label: string; text: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-black/25 p-3">
      <p className={`hud-label mb-1 ${accent ? '!text-acid' : ''}`}>{label}</p>
      <p className="text-sm text-body/90">{text}</p>
    </div>
  )
}
