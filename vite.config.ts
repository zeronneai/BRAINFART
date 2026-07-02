import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { devApiPlugin } from './vite-plugin-dev-api'

export default defineConfig(({ mode }) => {
  // load .env (incl. non-VITE_ vars) into process.env so the dev-run /api
  // handlers can read ANTHROPIC_API_KEY / SUPABASE_* exactly like on Vercel
  const env = loadEnv(mode, process.cwd(), '')
  for (const [k, v] of Object.entries(env)) {
    if (process.env[k] === undefined) process.env[k] = v
  }

  return {
    plugins: [react(), devApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
