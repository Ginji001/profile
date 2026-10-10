import { isMap, isScalar, isSeq, parseDocument } from 'yaml'

export function validateContent(source) {
  const doc = parseDocument(source, { prettyErrors: false })
  const issues = []
  if (doc.errors.length) {
    for (const error of doc.errors) {
      issues.push({ path: [], message: `YAMLの書き方を確認してください（${error.message}）` })
    }
    return { issues, document: doc }
  }

  const data = doc.toJS()
  const nodeAt = (path) => doc.getIn(path, true)
  const issue = (path, message) => issues.push({ path, message })
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
  function stringArray(path) {
    if (!arr(path)) return
    const values = path.reduce((o, k) => o?.[k], data)
    if (Array.isArray(values)) values.forEach((v, i) => { if (typeof v !== 'string' || !v.trim()) issue([...path, i], 'リストの各項目は空でない文字列にしてください') })
  }
  function url(path) {
    if (!str(path)) return
    const value = path.reduce((o, k) => o?.[k], data)
    try { const parsed = new URL(value); if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error() }
    catch { issue(path, `${path.join('.')} は https:// または http:// から始まるURLにしてください`) }
  }

  if (obj(['profile'])) {
    localized(['profile', 'name']); localized(['profile', 'role']); localized(['profile', 'homeAbout']); stringArray(['profile', 'homeTags'])
    if (obj(['profile', 'latest'])) { localized(['profile', 'latest', 'label']); localized(['profile', 'latest', 'title']); localized(['profile', 'latest', 'schedule']) }
  }
  if (obj(['me'])) {
    localized(['me', 'about']); stringArray(['me', 'skills'])
    for (const key of ['likes', 'hobbies', 'studying']) { obj(['me', key]); stringArray(['me', key, 'ja']); stringArray(['me', key, 'en']) }
    if (obj(['me', 'setup'])) { localized(['me', 'setup', 'main']); localized(['me', 'setup', 'server']) }
  }
  if (arr(['links'])) (data.links ?? []).forEach((item, i) => {
    const p = ['links', i]; for (const key of ['name', 'handle', 'color', 'icon']) str([...p, key]); url([...p, 'url'])
    if (item?.icon && !['github', 'x', 'instagram', 'note', 'none'].includes(item.icon)) issue([...p, 'icon'], 'iconは github / x / instagram / note / none のいずれかにしてください')
  })
  if (obj(['cosme'])) {
    str(['cosme', 'brand']); localized(['cosme', 'daily']); localized(['cosme', 'schedule']); localized(['cosme', 'description'])
    if (obj(['cosme', 'x'])) { localized(['cosme', 'x', 'title']); stringArray(['cosme', 'x', 'times']); localized(['cosme', 'x', 'description']); str(['cosme', 'x', 'account']); str(['cosme', 'x', 'tag']); url(['cosme', 'x', 'url']); url(['cosme', 'x', 'tagUrl']) }
    for (const key of ['instagram', 'note']) if (obj(['cosme', key])) { if (key === 'instagram') localized(['cosme', key, 'title']); else str(['cosme', key, 'name']); localized(['cosme', key, 'description']); str(['cosme', key, 'account']); url(['cosme', key, 'url']) }
  }
  if (arr(['products'])) (data.products ?? []).forEach((item, i) => {
    const p = ['products', i]; str([...p, 'emoji']); localized([...p, 'name']); localized([...p, 'description']); stringArray([...p, 'tags'])
    const live = nodeAt([...p, 'live']); if (!live) issue([...p, 'live'], 'live がありません'); else if (!isScalar(live) || typeof live.value !== 'boolean') issue([...p, 'live'], 'live は true または false にしてください')
    url([...p, 'app']); url([...p, 'code'])
    const unofficial = nodeAt([...p, 'unofficial']); if (unofficial && (!isScalar(unofficial) || typeof unofficial.value !== 'boolean')) issue([...p, 'unofficial'], 'unofficial は true または false にしてください')
  })
  if (obj(['otherRepositories'])) { localized(['otherRepositories', 'text']); localized(['otherRepositories', 'label']); url(['otherRepositories', 'url']) }
  return { issues, document: doc }
}
