import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * Dev-only bridge that runs the real /api/*.ts serverless handlers inside the
 * Vite dev server. Without this, `fetch('/api/...')` hits the SPA fallback and
 * the app can never reach Anthropic in local dev. With it, generation is wired
 * end-to-end in dev exactly as it is on Vercel — same handler, same env.
 */
export function devApiPlugin(): Plugin {
  return {
    name: 'brainfart-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = req.url ?? ''
        if (!url.startsWith('/api/')) return next()

        const route = url.split('?')[0].replace(/\/$/, '')
        const file = `.${route}.ts` // e.g. ./api/generate-ideas.ts

        // read + parse JSON body
        const raw = await new Promise<string>((resolve) => {
          let data = ''
          req.on('data', (c) => (data += c))
          req.on('end', () => resolve(data))
        })
        let body: unknown = {}
        try {
          body = raw ? JSON.parse(raw) : {}
        } catch {
          body = {}
        }

        // adapt Node req/res to the Vercel handler contract the handlers expect
        const vReq = {
          method: req.method,
          headers: req.headers,
          body,
          query: {},
        }
        const vRes = {
          statusCode: 200,
          status(code: number) {
            this.statusCode = code
            return this
          },
          setHeader(k: string, v: string) {
            res.setHeader(k, v)
            return this
          },
          json(obj: unknown) {
            res.statusCode = this.statusCode
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(obj))
            return this
          },
          end(s?: string) {
            res.statusCode = this.statusCode
            res.end(s)
            return this
          },
        }

        try {
          const mod = await server.ssrLoadModule(file)
          const handler = mod.default
          if (typeof handler !== 'function') {
            res.statusCode = 404
            res.end(JSON.stringify({ error: `no handler for ${route}` }))
            return
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await handler(vReq as any, vRes as any)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'handler crashed' }))
        }
      })
    },
  }
}
