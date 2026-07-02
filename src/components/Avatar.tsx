import { HAIRS, SKIN_TONES, TOPS, type Character } from '@/lib/character'

interface Props {
  character: Character
  size?: number
  pose?: 'idle' | 'hype'
  comboAura?: boolean
}

/**
 * Layered sticker-style avatar, drawn as inline SVG so every part is
 * tintable. Layers: aura → torso/fit → head → face → hair → headwear →
 * accessory. `pose="hype"` swaps the face for the celebration look.
 */
export function Avatar({ character, size = 96, pose = 'idle', comboAura = false }: Props) {
  const skin = SKIN_TONES[character.base % SKIN_TONES.length]
  const hair = HAIRS[character.hair % HAIRS.length]
  const top = TOPS[character.top % TOPS.length]
  const shades = character.accessory === 4

  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden>
      {/* aura */}
      <circle cx="60" cy="62" r="54" fill={character.aura} opacity="0.14" />
      <circle cx="60" cy="62" r="42" fill={character.aura} opacity="0.12" />
      {comboAura && (
        <>
          <circle cx="60" cy="62" r="56" fill="none" stroke="#FF8A3D" strokeWidth="2.5" opacity="0.85" />
          <circle cx="60" cy="62" r="52" fill="none" stroke="#FFC53B" strokeWidth="1.5" opacity="0.6" />
        </>
      )}

      {/* hood behind the head */}
      {top.style === 'hoodie' && (
        <path d="M28 118 Q26 74 60 68 Q94 74 92 118 Z" fill={top.color} opacity="0.55" />
      )}

      {/* torso / fit */}
      <path d="M22 120 Q24 88 60 85 Q96 88 98 120 Z" fill={top.color} />
      {top.style === 'hoodie' && (
        <>
          <path d="M50 92 L50 104 M70 92 L70 104" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M44 90 Q60 100 76 90" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="3" />
        </>
      )}
      {top.style === 'jersey' && (
        <>
          <path d="M22 108 Q60 100 98 108" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="4" />
          <text x="60" y="112" textAnchor="middle" fontSize="14" fontWeight="900" fill="rgba(255,255,255,0.9)" fontFamily="Arial Black, sans-serif">
            10
          </text>
        </>
      )}
      {top.style === 'tee' && (
        <path d="M48 86 Q60 94 72 86" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="3" />
      )}

      {/* neck + head */}
      <rect x="52" y="70" width="16" height="16" rx="6" fill={skin} />
      <circle cx="32" cy="52" r="5.5" fill={skin} />
      <circle cx="88" cy="52" r="5.5" fill={skin} />
      <circle cx="60" cy="50" r="27" fill={skin} />

      {/* face */}
      {pose === 'idle' ? (
        <>
          {!shades && (
            <>
              <circle cx="50" cy="48" r="3" fill="#17131A" />
              <circle cx="70" cy="48" r="3" fill="#17131A" />
            </>
          )}
          <path d="M52 60 Q60 66 68 60" fill="none" stroke="#17131A" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          {!shades && (
            <>
              <path d="M45 48 L50 44 L55 48" fill="none" stroke="#17131A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M65 48 L70 44 L75 48" fill="none" stroke="#17131A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}
          <path d="M50 58 Q60 72 70 58 Z" fill="#17131A" />
          <path d="M55 63 Q60 68 65 63 Z" fill="#E86A6A" />
        </>
      )}
      {/* cheeks */}
      <circle cx="42" cy="57" r="3.5" fill="#E86A6A" opacity="0.35" />
      <circle cx="78" cy="57" r="3.5" fill="#E86A6A" opacity="0.35" />

      {/* hair (behind headwear) */}
      {character.hair % HAIRS.length === 1 && (
        <path d="M35 42 Q38 26 60 25 Q82 26 85 42 Q84 34 60 33 Q36 34 35 42 Z" fill={hair.color} />
      )}
      {character.hair % HAIRS.length === 2 && (
        <path d="M33 46 Q34 24 60 23 Q86 24 87 46 Q86 32 60 31 Q34 32 33 46 Z" fill={hair.color} />
      )}
      {character.hair % HAIRS.length === 3 && (
        <>
          <circle cx="42" cy="32" r="9" fill={hair.color} />
          <circle cx="60" cy="27" r="10" fill={hair.color} />
          <circle cx="78" cy="32" r="9" fill={hair.color} />
        </>
      )}
      {character.hair % HAIRS.length === 4 && (
        <path d="M36 40 L42 24 L50 36 L58 20 L66 36 L74 24 L84 40 Q76 30 60 30 Q44 30 36 40 Z" fill={hair.color} />
      )}
      {character.hair % HAIRS.length === 5 && (
        <path d="M33 58 Q30 26 60 24 Q90 26 87 58 L82 56 Q84 32 60 31 Q36 32 38 56 Z" fill={hair.color} />
      )}
      {character.hair % HAIRS.length === 6 && (
        <circle cx="60" cy="31" r="17" fill={hair.color} />
      )}
      {character.hair % HAIRS.length === 7 && (
        <path d="M34 44 Q36 24 60 23 Q84 24 86 44 Q82 31 60 30 Q38 31 34 44 Z" fill={hair.color} />
      )}

      {/* headwear */}
      {character.headwear % 4 === 1 && (
        <>
          <path d="M34 42 Q36 22 60 22 Q84 22 86 42 Z" fill="#22222E" />
          <path d="M60 40 L96 40 Q98 44 94 46 L60 46 Z" fill="#22222E" />
          <circle cx="60" cy="26" r="2.5" fill="var(--c-acid)" />
        </>
      )}
      {character.headwear % 4 === 2 && (
        <>
          <path d="M34 42 Q36 22 60 22 Q84 22 86 42 Z" fill="#2E2E3A" />
          <path d="M60 40 L24 40 Q22 44 26 46 L60 46 Z" fill="#2E2E3A" />
          <path d="M52 30 Q60 26 68 30" fill="none" stroke="var(--c-acid)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {character.headwear % 4 === 3 && (
        <>
          <path d="M34 44 Q34 20 60 20 Q86 20 86 44 Z" fill="#3D5410" />
          <rect x="33" y="38" width="54" height="9" rx="4.5" fill="#2E400C" />
        </>
      )}

      {/* shades */}
      {shades && (
        <>
          <rect x="40" y="42" width="17" height="11" rx="5" fill="#17131A" />
          <rect x="63" y="42" width="17" height="11" rx="5" fill="#17131A" />
          <path d="M57 46 L63 46" stroke="#17131A" strokeWidth="3" />
        </>
      )}

      {/* gear badge (bottom-right) */}
      {character.accessory === 1 && (
        <g transform="translate(84, 88)">
          <circle r="15" fill="var(--surface-2)" stroke="var(--c-line-2)" />
          <circle cx="0" cy="-4" r="5.5" fill="#C9CCD6" />
          <rect x="-2.5" y="0" width="5" height="10" rx="2" fill="#8B8FA3" />
        </g>
      )}
      {character.accessory === 2 && (
        <g transform="translate(84, 88)">
          <circle r="15" fill="var(--surface-2)" stroke="var(--c-line-2)" />
          <rect x="-9" y="-6" width="18" height="13" rx="3" fill="#C9CCD6" />
          <circle cx="1" cy="0.5" r="4" fill="#17131A" />
          <rect x="-8" y="-9" width="7" height="4" rx="1.5" fill="#C9CCD6" />
        </g>
      )}
      {character.accessory === 3 && (
        <g transform="translate(84, 88)">
          <circle r="15" fill="var(--surface-2)" stroke="var(--c-line-2)" />
          <rect x="-5" y="-9" width="10" height="18" rx="2.5" fill="#C9CCD6" />
          <rect x="-3.5" y="-7" width="7" height="12" rx="1" fill="#17131A" />
        </g>
      )}

      {/* hype sparkles */}
      {pose === 'hype' && (
        <>
          <path d="M22 30 l2.5 5 5 2.5 -5 2.5 -2.5 5 -2.5 -5 -5 -2.5 5 -2.5 Z" fill="var(--c-acid)" />
          <path d="M96 24 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 Z" fill="#FFC53B" />
        </>
      )}
    </svg>
  )
}
