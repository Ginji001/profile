import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.resolve(process.argv[2] || '')
const ssrEntry = path.resolve(process.argv[3] || '')
if (!process.argv[2] || !process.argv[3]) {
  console.error('usage: node scripts/prerender.mjs <dist dir> <ssr entry .js>')
  process.exit(1)
}

const basePath = '/profile'
const routes = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'routes.json'), 'utf-8'))
const templatePath = path.join(distDir, 'index.html')
const template = fs.readFileSync(templatePath, 'utf-8')
const rootPlaceholder = '<div id="root"></div>'
if (!template.includes(rootPlaceholder)) throw new Error(`prerender: expected ${rootPlaceholder} in ${templatePath}`)
const { render } = await import(pathToFileURL(ssrEntry).href)

function write(relFile, html) {
  const dest = path.join(distDir, relFile)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, template.replace(rootPlaceholder, `<div id="root">${html}</div>`))
  console.log(`prerender: wrote ${relFile}`)
}

for (const [tab, routePath] of Object.entries(routes)) {
  const { html, notFound } = render(routePath)
  if (notFound) throw new Error(`prerender: ${routePath} for ${tab} did not resolve to a tab`)
  const localPath = routePath.replace(new RegExp(`^${basePath}`), '').replace(/^\/+|\/+$/g, '')
  write(localPath ? `${localPath}/index.html` : 'index.html', html)
}

const unknown = render(`${basePath}/not-a-real-route`)
if (!unknown.notFound) throw new Error('prerender: expected the unknown route to be not found')
write('404.html', unknown.html)
