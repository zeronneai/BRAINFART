import type { ReactNode } from 'react'

interface Props {
  icon?: string
  title: string
  subtitle?: string
  action?: ReactNode
}

export function EmptyState({ icon = '💨', title, subtitle, action }: Props) {
  return (
    <div className="glass flex flex-col items-center gap-2 px-6 py-12 text-center">
      <span className="text-3xl">{icon}</span>
      <p className="font-display text-lg uppercase tracking-wide text-body">{title}</p>
      {subtitle && <p className="max-w-xs text-sm text-muted">{subtitle}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
