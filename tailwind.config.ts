import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--c-ink)',
        panel: 'var(--c-panel)',
        'panel-2': 'var(--c-panel-2)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        line: 'var(--c-line)',
        'line-2': 'var(--c-line-2)',
        acid: 'var(--c-acid)',
        'acid-dim': 'var(--c-acid-dim)',
        body: 'var(--c-body)',
        muted: 'var(--c-muted)',
        common: 'var(--c-common)',
        rare: 'var(--c-rare)',
        epic: 'var(--c-epic)',
        legendary: 'var(--c-legendary)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
      borderRadius: {
        card: 'var(--r-card)',
        chip: 'var(--r-chip)',
      },
    },
  },
  plugins: [],
} satisfies Config
