import { readFileSync } from 'node:fs'
import { parseDocument, isMap, isSeq, isScalar } from 'yaml'

const file = 'content.yaml'
const source = readFileSync(file, 'utf8')
const doc = parseDocument(source, { prettyErrors: false })
if (doc.errors.length) {
  for (const error of doc.errors) {
    const line = (error.linePos?.[0]?.line ?? 1)
    console.error(`${file} の${line}行目：YAMLの書き方を確認してください（${error.message}）`)
  }
  process.exit(1)
}
const data = doc.toJS()
const errors = []
const nodeAt = (path) => doc.getIn(path, true)
const lineAt = (path) => {
  for (let depth = path.length; depth > 0; depth--) {
    const node = nodeAt(path.slice(0, depth))
    if (node?.range) return source.slice(0, node.range[0]).split('\n').length
  }
  return 1
}
const issue = (path, message) => errors.push(`${file} の${lineAt(path)}行目：${message}`)
function shape(path, kind) {
  const node = nodeAt(path)
  if (!node) { issue(path, `${path.join('.')} がありません`); return false }
  const ok = kind === 'object' ? isMap(node) : kind === 'array' ? isSeq(node) : kind === 'string' ? isScalar(node) && typeof node.value === 'string' && node.value.trim() !== '' : isScalar(node) && typeof node.value === 'boolean'
  if (!ok) issue(path, `${path.join('.')} は${kind === 'object' ? '項目' : kind === 'array' ? 'リスト' : kind === 'boolean' ? 'trueまたはfalse' : '文字列'}にしてください`)
  return ok
}
const str = (p) => shape(p, 'string')
const arr = (p) => shape(p, 'array')
const obj = (p) => shape(p, 'object')
function localized(path) { if (!obj(path)) return; str([...path, 'ja']); str([...path, 'en']) }
function stringArray(path) { if (arr(path) && Array.isArray(data?.[path[0]])) { const values = path.reduce((o, k) => o?.[k], data); values.forEach((v, i) => { if (typeof v !== 'string' || !v.trim()) issue([...path, i], 'リストの各項目は空でない文字列にしてください') }) } }
function url(path) {
  if (!str(path)) return
  const value = path.reduce((o, k) => o?.[k], data)
  try { const parsed = new URL(value); if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error() }
  catch { issue(path, `${path.join('.')} は https:// または http:// から始まるURLにしてください`) }
}

if (!obj(['profile'])) {} else {
  localized(['profile', 'name']); localized(['profile', 'role']); localized(['profile', 'homeAbout']); stringArray(['profile', 'homeTags']);
  if (obj(['profile', 'latest'])) { localized(['profile', 'latest', 'label']); localized(['profile', 'latest', 'title']); localized(['profile', 'latest', 'schedule']) }
}
if (obj(['me'])) {
  localized(['me', 'about']); stringArray(['me', 'skills']);
  for (const key of ['likes', 'hobbies', 'studying']) { obj(['me', key]); stringArray(['me', key, 'ja']); stringArray(['me', key, 'en']) }
  if (obj(['me', 'setup'])) { localized(['me', 'setup', 'main']); localized(['me', 'setup', 'server']) }
}
if (arr(['links'])) (data.links ?? []).forEach((item, i) => {
  const p = ['links', i]; for (const key of ['name', 'handle', 'color', 'icon']) str([...p, key]); url([...p, 'url'])
  if (item?.icon && !['github', 'x', 'instagram', 'note'].includes(item.icon)) issue([...p, 'icon'], 'iconは github / x / instagram / note のいずれかにしてください')
})
if (obj(['cosme'])) {
  str(['cosme', 'brand']); localized(['cosme', 'daily']); localized(['cosme', 'schedule']); localized(['cosme', 'description'])
  if (obj(['cosme', 'x'])) { localized(['cosme', 'x', 'title']); stringArray(['cosme', 'x', 'times']); localized(['cosme', 'x', 'description']); str(['cosme', 'x', 'account']); str(['cosme', 'x', 'tag']); url(['cosme', 'x', 'url']); url(['cosme', 'x', 'tagUrl']) }
  for (const key of ['instagram', 'note']) if (obj(['cosme', key])) { if (key === 'instagram') localized(['cosme', key, 'title']); else str(['cosme', key, 'name']); localized(['cosme', key, 'description']); str(['cosme', key, 'account']); url(['cosme', key, 'url']) }
}
if (arr(['products'])) (data.products ?? []).forEach((item, i) => {
  const p = ['products', i]; str([...p, 'emoji']); localized([...p, 'name']); localized([...p, 'description']); stringArray([...p, 'tags']);
  const live = nodeAt([...p, 'live']); if (!live) issue([...p, 'live'], 'live がありません'); else if (!isScalar(live) || typeof live.value !== 'boolean') issue([...p, 'live'], 'live は true または false にしてください')
  url([...p, 'app']); url([...p, 'code']);
  const unofficial = nodeAt([...p, 'unofficial']); if (unofficial && (!isScalar(unofficial) || typeof unofficial.value !== 'boolean')) issue([...p, 'unofficial'], 'unofficial は true または false にしてください')
})
if (obj(['otherRepositories'])) { localized(['otherRepositories', 'text']); localized(['otherRepositories', 'label']); url(['otherRepositories', 'url']) }

if (errors.length) { console.error(errors.join('\n')); process.exit(1) }
console.log('content.yaml の確認に成功しました')
