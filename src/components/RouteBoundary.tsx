import { Component, Suspense, type ReactNode } from 'react'
import { COPY } from '@/lib/copy'

/** In-world skeleton — navigation always paints something immediately. */
export function RouteSkeleton() {
  return (
    <div className="animate-pulse space-y-6 pt-2" aria-hidden>
      <div className="h-8 w-40 rounded-xl bg-white/[0.06]" />
      <div className="glass h-32" />
      <div className="glass h-24" />
      <div className="glass h-24" />
    </div>
  )
}

interface State {
  error: Error | null
}

class Catcher extends Component<{ children: ReactNode; onRetry: () => void }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error('[route crash]', error)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="glass mt-8 flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="text-4xl">💀</span>
          <p className="font-display text-2xl uppercase tracking-wide text-body">{COPY.error.title}</p>
          <p className="max-w-xs text-sm text-muted">{COPY.error.subtitle}</p>
          <button
            className="btn-acid mt-4"
            onClick={() => {
              this.setState({ error: null })
              this.props.onRetry()
            }}
          >
            {COPY.error.retry}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

/**
 * Per-route guard: an uncaught error in one tab renders the in-world
 * "game over" screen instead of blanking the whole app; Suspense shows a
 * skeleton within a frame. Remount via `key` on route change resets both.
 */
export function RouteBoundary({ children }: { children: ReactNode }) {
  return (
    <Catcher onRetry={() => window.location.reload()}>
      <Suspense fallback={<RouteSkeleton />}>{children}</Suspense>
    </Catcher>
  )
}
