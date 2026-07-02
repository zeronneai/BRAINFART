import { cn } from '@/lib/utils'

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} title={`Difficulty ${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9L12 2.6z"
            fill={i <= value ? 'var(--c-acid)' : 'rgba(255,255,255,0.12)'}
          />
        </svg>
      ))}
    </span>
  )
}
