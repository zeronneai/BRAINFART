interface Props {
  name: 'home' | 'quests' | 'radar' | 'vault' | 'calendar' | 'map' | 'profile'
  active?: boolean
}

const PATHS: Record<Props['name'], string> = {
  home: 'M12 3l9 8h-2v9h-5v-6H10v6H5v-9H3l9-8z',
  quests: 'M9 2h6v2h4v18H5V4h4V2zm0 4H7v14h10V6h-2v2H9V6zm1 6l2 2 4-4 1.4 1.4L12 16.8 8.6 13.4 10 12z',
  radar: 'M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2zm0 5a5 5 0 1 0 5 5h-2a3 3 0 1 1-3-3V7zm1 4.6L20 4l1 1-7.6 7a1.5 1.5 0 1 1-.4-.4z',
  vault: 'M4 4h16v16H4V4zm2 2v12h12V6H6zm6 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
  calendar: 'M7 2v2H4v18h16V4h-3V2h-2v2H9V2H7zM6 8h12v12H6V8zm2 2v2h2v-2H8zm4 0v2h2v-2h-2z',
  map: 'M9 2l6 2 5.5-1.8V19L15 21l-6-2-5.5 1.8V4L9 2zm1 2.4v13.2l4 1.3V5.7l-4-1.3zM12 7a3 3 0 0 1 3 3c0 2-3 5-3 5s-3-3-3-5a3 3 0 0 1 3-3z',
  profile: 'M12 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5H4z',
}

export function NavIcon({ name, active }: Props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path d={PATHS[name]} fill={active ? 'var(--c-acid)' : 'var(--c-muted)'} />
    </svg>
  )
}
