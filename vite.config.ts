import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

export default defineConfig({
  base: '/profile/',
  publicDir: 'site',
  plugins: [
    {
      name: 'profile-content-yaml',
      transform(_code, id) {
        if (!id.endsWith('/content.yaml')) return null
        const source = readFileSync(id, 'utf8')
        return `const content = ${JSON.stringify(parse(source))}; export default content;`
      },
    },
    react(),
    tailwindcss(),
    {
      name: 'profile-preview-clean-routes',
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          if (!request.url) return next()
          const url = new URL(request.url, 'http://localhost')
          if (url.pathname === '/profile') {
            request.url = `/profile/index.html${url.search}`
          } else if (['/profile/product', '/profile/cosme', '/profile/me', '/profile/links'].includes(url.pathname)) {
            request.url = `${url.pathname}/index.html${url.search}`
          }
          next()
        })
      },
    },
  ],
  envDir: false,
})
