import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { Session } from '@supabase/supabase-js'
import { supabase, isDemoMode } from '@/lib/supabase'
import { startCloudSync } from '@/lib/cloudSync'

/**
 * Gates the app behind Supabase auth when configured; in demo mode
 * (no env vars) the game starts instantly with local persistence.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(!isDemoMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) startCloudSync(session.user.id)
  }, [session])

  if (isDemoMode || session) return <>{children}</>

  if (checking) {
    return (
      <div className="bg-arena flex min-h-dvh items-center justify-center">
        <p className="pulse-slow font-display uppercase tracking-[0.3em] text-muted">loading save…</p>
      </div>
    )
  }

  const submit = async () => {
    if (!supabase || busy) return
    setBusy(true)
    setError(null)
    const fn =
      mode === 'signin'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password })
    const { error } = await fn
    if (error) setError(error.message)
    setBusy(false)
  }

  return (
    <div className="bg-arena flex min-h-dvh items-center justify-center px-4">
      <motion.div
        className="glass w-full max-w-sm p-6"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
      >
        <p className="font-display text-3xl uppercase tracking-wide text-body">
          BRAIN<span className="text-acid">FART</span>
        </p>
        <p className="mt-1 text-sm text-muted">Roll ideas. Claim XP. Level up.</p>

        <div className="mt-6 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-line bg-black/30 px-4 py-2.5 text-sm text-body outline-none placeholder:text-muted/60 focus:border-acid/50"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="password"
            className="w-full rounded-xl border border-line bg-black/30 px-4 py-2.5 text-sm text-body outline-none placeholder:text-muted/60 focus:border-acid/50"
          />
          {error && <p className="text-xs text-epic">{error}</p>}
          <button className="btn-acid w-full !py-2.5" onClick={submit} disabled={busy}>
            {busy ? '…' : mode === 'signin' ? 'ENTER THE GAME' : 'CREATE MY SAVE'}
          </button>
          <button
            className="w-full text-center text-xs text-muted hover:text-body"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          >
            {mode === 'signin' ? 'New player? Create an account' : 'Have a save? Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
