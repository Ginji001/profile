import { useEffect, useState } from 'react'
import { isScalar, type Document } from 'yaml'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { validateContent, type ContentIssue } from './validateContent.mjs'

const TOKEN_URL = 'https://github.com/settings/personal-access-tokens/new?name=' + encodeURIComponent('プロフィール編集ページ') + '&description=' + encodeURIComponent('ginji001.github.io/profile/edit から content.yaml を更新する') + '&target_name=Ginji001&expires_in=366&contents=write&actions=read'
const TOKEN_KEY = 'ginji-profile-edit-token'
const API = 'https://api.github.com/repos/Ginji001/profile'
const MANUAL = 'https://github.com/Ginji001/profile/blob/main/%E7%B7%A8%E9%9B%86%E3%81%AE%E3%81%97%E3%81%8B%E3%81%9F.md'
const ICONS = ['github', 'x', 'instagram', 'note']
type Path = (string | number)[]
type Issue = ContentIssue

function b64ToUtf8(input: string) {
  const bytes = Uint8Array.from(atob(input.replace(/\s/g, '')), (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}
function utf8ToB64(input: string) {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary)
}
function pathKey(path: Path) { return path.join('.') }
function getAt(data: any, path: Path): any { return path.reduce((value, part) => value?.[part], data) }
function apiHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
}

const sections: { title: string; fields: { label: string; path: Path; kind?: 'textarea' | 'url' | 'boolean' }[] }[] = [
  { title: 'プロフィール', fields: [
    { label: '表示名', path: ['profile', 'name', 'ja'] }, { label: 'Name', path: ['profile', 'name', 'en'] },
    { label: '肩書き', path: ['profile', 'role', 'ja'] }, { label: 'Role', path: ['profile', 'role', 'en'] },
    { label: '自己紹介', path: ['profile', 'homeAbout', 'ja'], kind: 'textarea' }, { label: 'About', path: ['profile', 'homeAbout', 'en'], kind: 'textarea' },
    { label: '最新情報の見出し', path: ['profile', 'latest', 'label', 'ja'] }, { label: 'Latest label', path: ['profile', 'latest', 'label', 'en'] },
    { label: '最新情報のタイトル', path: ['profile', 'latest', 'title', 'ja'] }, { label: 'Latest title', path: ['profile', 'latest', 'title', 'en'] },
    { label: '最新情報の予定', path: ['profile', 'latest', 'schedule', 'ja'] }, { label: 'Latest schedule', path: ['profile', 'latest', 'schedule', 'en'] },
  ] },
  { title: 'Me', fields: [
    { label: '自己紹介', path: ['me', 'about', 'ja'], kind: 'textarea' }, { label: 'About', path: ['me', 'about', 'en'], kind: 'textarea' },
    { label: '使っているもの（主な環境）日本語', path: ['me', 'setup', 'main', 'ja'] }, { label: 'Main setup', path: ['me', 'setup', 'main', 'en'] },
    { label: '使っているもの（サーバー）日本語', path: ['me', 'setup', 'server', 'ja'] }, { label: 'Server setup', path: ['me', 'setup', 'server', 'en'] },
  ] },
  { title: 'Cosme', fields: [
    { label: 'ブランド名', path: ['cosme', 'brand'] }, { label: '毎日の投稿数（日本語）', path: ['cosme', 'daily', 'ja'] }, { label: 'Daily', path: ['cosme', 'daily', 'en'] },
    { label: '投稿スケジュール（日本語）', path: ['cosme', 'schedule', 'ja'] }, { label: 'Schedule', path: ['cosme', 'schedule', 'en'] },
    { label: '紹介文', path: ['cosme', 'description', 'ja'], kind: 'textarea' }, { label: 'Description', path: ['cosme', 'description', 'en'], kind: 'textarea' },
    { label: 'Xの見出し（日本語）', path: ['cosme', 'x', 'title', 'ja'] }, { label: 'X title', path: ['cosme', 'x', 'title', 'en'] },
    { label: 'Xの紹介文', path: ['cosme', 'x', 'description', 'ja'], kind: 'textarea' }, { label: 'X description', path: ['cosme', 'x', 'description', 'en'], kind: 'textarea' },
    { label: 'Xのアカウント名', path: ['cosme', 'x', 'account'] }, { label: 'XのURL', path: ['cosme', 'x', 'url'], kind: 'url' },
    { label: 'Xのタグ', path: ['cosme', 'x', 'tag'] }, { label: 'XタグのURL', path: ['cosme', 'x', 'tagUrl'], kind: 'url' },
    { label: 'Instagramの見出し（日本語）', path: ['cosme', 'instagram', 'title', 'ja'] }, { label: 'Instagram title', path: ['cosme', 'instagram', 'title', 'en'] },
    { label: 'Instagramの紹介文', path: ['cosme', 'instagram', 'description', 'ja'], kind: 'textarea' }, { label: 'Instagram description', path: ['cosme', 'instagram', 'description', 'en'], kind: 'textarea' },
    { label: 'Instagramのアカウント名', path: ['cosme', 'instagram', 'account'] }, { label: 'InstagramのURL', path: ['cosme', 'instagram', 'url'], kind: 'url' },
    { label: 'noteの名前', path: ['cosme', 'note', 'name'] }, { label: 'noteの紹介文', path: ['cosme', 'note', 'description', 'ja'], kind: 'textarea' }, { label: 'note description', path: ['cosme', 'note', 'description', 'en'], kind: 'textarea' },
    { label: 'noteのアカウント名', path: ['cosme', 'note', 'account'] }, { label: 'noteのURL', path: ['cosme', 'note', 'url'], kind: 'url' },
  ] },
]

function friendly(message?: string) { return message?.replace(/^[A-Za-z0-9_.]+ ?は ?/, '') }

function Field({ label, path, kind, data, issues, onChange }: { label: string; path: Path; kind?: 'textarea' | 'url' | 'boolean'; data: any; issues: Issue[]; onChange: (path: Path, value: string | boolean) => void }) {
  const value = getAt(data, path)
  const message = friendly(issues.find((issue) => pathKey(issue.path) === pathKey(path))?.message)
  return <label className="edit-field">
    <span>{label}</span>
    {kind === 'boolean' ? <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(path, event.target.checked)} /> : kind === 'textarea' ?
      <textarea rows={3} value={value ?? ''} onChange={(event) => onChange(path, event.target.value)} /> :
      <input type={kind === 'url' ? 'url' : 'text'} value={value ?? ''} onChange={(event) => onChange(path, event.target.value)} />}
    {message && <span className="edit-error" role="alert">{message}</span>}
  </label>
}

export default function EditPage() {
  const [token, setToken] = useState('')
  const [keySaved, setKeySaved] = useState(false)
  const [doc, setDoc] = useState<Document | null>(null)
  const [data, setData] = useState<any>(null)
  const [sha, setSha] = useState('')
  const [issues, setIssues] = useState<Issue[]>([])
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [actionStatus, setActionStatus] = useState('')
  const [revision, setRevision] = useState(0)
  const [newLinkIcons, setNewLinkIcons] = useState<number[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY) ?? ''
    if (saved) { setToken(saved); setKeySaved(true); void load(saved) }
  }, [])
  useEffect(() => {
    const old = document.querySelector('meta[name="robots"]')
    const meta = old ?? document.createElement('meta')
    meta.setAttribute('name', 'robots'); meta.setAttribute('content', 'noindex, nofollow')
    if (!old) document.head.append(meta)
    return () => { if (!old) meta.remove() }
  }, [])

  async function load(activeToken: string) {
    setBusy(true); setMessage('内容を読み込んでいます…')
    try {
      const response = await fetch(`${API}/contents/content.yaml?ref=main`, { headers: apiHeaders(activeToken) })
      if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? '鍵を確認してください。読み込み権限がありません。' : `読み込みに失敗しました（${response.status}）`)
      const body = await response.json()
      const source = b64ToUtf8(body.content)
      const result = validateContent(source)
      setDoc(result.document); setData(result.document.toJS()); setSha(body.sha); setIssues(result.issues)
      setMessage('最新の内容を読み込みました')
    } catch (error) { setMessage(error instanceof Error ? error.message : '読み込みに失敗しました') }
    finally { setBusy(false) }
  }

  function update(path: Path, value: string | boolean) {
    if (!doc) return
    const node = doc.getIn(path, true)
    if (isScalar(node)) node.value = value
    else doc.setIn(path, value)
    setData(doc.toJS()); setRevision((n) => n + 1); setMessage('')
  }
  function changeStringArray(path: Path, index: number, value: string) { update([...path, index], value) }
  function mutateList(path: Path, operation: 'add' | 'remove' | 'up' | 'down', index: number, value?: unknown) {
    if (!doc) return
    const seq: any = doc.getIn(path, true)
    if (!seq?.items) return
    if (operation === 'add') seq.add(doc.createNode(value ?? '新しい項目'))
    if (operation === 'remove') seq.delete(index)
    if (operation === 'up' && index > 0) [seq.items[index - 1], seq.items[index]] = [seq.items[index], seq.items[index - 1]]
    if (operation === 'down' && index < seq.items.length - 1) [seq.items[index + 1], seq.items[index]] = [seq.items[index], seq.items[index + 1]]
    setData(doc.toJS()); setRevision((n) => n + 1); setMessage('')
  }
  function mutateLinkList(operation: 'add' | 'remove' | 'up' | 'down', index: number, value?: unknown) {
    mutateList(['links'], operation, index, value)
    setNewLinkIcons((indices) => {
      if (operation === 'add') return [...indices, data.links.length]
      if (operation === 'remove') return indices.filter((item) => item !== index).map((item) => item > index ? item - 1 : item)
      if (operation === 'up') return indices.map((item) => item === index ? index - 1 : item === index - 1 ? index : item)
      if (operation === 'down') return indices.map((item) => item === index ? index + 1 : item === index + 1 ? index : item)
      return indices
    })
  }

  async function save() {
    if (!doc || !token || !sha) return
    const source = doc.toString({ lineWidth: 0, flowCollectionPadding: false })
    const validation = validateContent(source)
    setIssues(validation.issues)
    if (validation.issues.length) { setMessage('入力内容を確認してください'); document.querySelector('.edit-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return }
    setBusy(true); setMessage('保存しています…'); setActionStatus('')
    try {
      const response = await fetch(`${API}/contents/content.yaml`, { method: 'PUT', headers: { ...apiHeaders(token), 'Content-Type': 'application/json' }, body: JSON.stringify({ message: '編集ページから内容を更新', content: utf8ToB64(source), sha, branch: 'main' }) })
      if (response.status === 409) { setMessage('別の場所で更新されています。読み込み直してください'); return }
      if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? '保存できませんでした。鍵の権限を確認してください。' : `保存に失敗しました（${response.status}）`)
      const result = await response.json(); setSha(result.content?.sha ?? sha)
      setMessage('保存しました。公開まで1〜2分かかります。')
      try {
        const runs = await fetch(`${API}/actions/runs?branch=main&per_page=1`, { headers: apiHeaders(token) })
        if (runs.ok) {
          const json = await runs.json(); const run = json.workflow_runs?.[0]
          if (run) setActionStatus(`公開処理：${run.status === 'completed' ? (run.conclusion === 'success' ? '完了' : '確認が必要です') : '実行中'}`)
        }
      } catch { /* Actions permission is optional. */ }
    } catch (error) { setMessage(error instanceof Error ? error.message : '保存に失敗しました') }
    finally { setBusy(false) }
  }

  function storeKey() {
    const clean = token.trim()
    if (!clean) { setMessage('鍵を貼り付けてください'); return }
    localStorage.setItem(TOKEN_KEY, clean); setToken(clean); setKeySaved(true); setMessage('この端末に鍵を保存しました'); void load(clean)
  }
  function forgetKey() {
    localStorage.removeItem(TOKEN_KEY); setToken(''); setKeySaved(false); setDoc(null); setData(null); setSha(''); setMessage('この端末から鍵を削除しました')
  }

  const formReady = keySaved && data && doc
  const editInputClass = 'w-full rounded-2xl border border-ink-200 bg-profile-card px-4 py-3 text-base text-ink-800 shadow-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100'

  return <main className="edit-page relative z-10 mx-auto min-h-dvh max-w-3xl px-4 pb-36 pt-8 sm:px-6 sm:pt-12" data-revision={revision}>
    <header className="mb-6 rounded-[28px] border border-ink-200/70 bg-profile-card/90 p-5 shadow-soft sm:p-7">
      <p className="mb-1 text-sm font-bold tracking-wide text-accent-500">GINJI'S PROFILE</p>
      <h1 className="text-2xl font-black text-ink-900 sm:text-3xl">プロフィール編集</h1>
      {formReady && <p className="mt-3 text-sm leading-relaxed text-ink-600">項目を書き換えて「保存して公開」を押してください。</p>}
    </header>
    {!keySaved ? <section className="rounded-[28px] border border-ink-200/70 bg-profile-card/90 p-5 shadow-soft sm:p-7">
      <h2 className="text-xl font-extrabold">編集用の鍵を設定</h2>
      <p className="mt-3 leading-relaxed text-ink-600">最初に一度だけ、GitHubで編集用の鍵を作ってここに貼り付けます。鍵はこの端末のブラウザだけに保存されます。</p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-ink-600">
        <li>下の「GitHubで鍵を作る」を押す（名前・期限・権限は入力済みで開きます）</li>
        <li><b>Repository access</b> で <b>Only select repositories</b> を選び、<b>profile</b> を選ぶ</li>
        <li>一番下の <b>Generate token</b> を押し、出てきた鍵をコピーする（一度しか表示されません）</li>
        <li>この画面に戻って貼り付け、「この端末に鍵を保存」を押す</li>
      </ol>
      <a className="mt-4 flex min-h-12 w-full items-center justify-center rounded-2xl border border-accent-500 px-5 font-extrabold text-accent-600" href={TOKEN_URL} target="_blank" rel="noreferrer">GitHubで鍵を作る</a>
      <a className="mt-3 inline-block text-sm font-bold text-accent-600 underline underline-offset-4" href={MANUAL} target="_blank" rel="noreferrer">詳しい手順</a>
      <label className="edit-field mt-5"><span>編集用の鍵</span><input className={editInputClass} type="password" autoComplete="off" value={token} onChange={(event) => setToken(event.target.value)} placeholder="GitHubの鍵を貼り付け" /></label>
      <button type="button" onClick={storeKey} disabled={busy} className="mt-4 min-h-14 w-full rounded-2xl bg-accent-500 px-5 font-extrabold text-white shadow-soft disabled:opacity-50">この端末に鍵を保存</button>
      {message && <p className="mt-3 text-sm text-ink-600" role="status">{message}</p>}
    </section> : <>
      <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-ink-200/70 bg-profile-card/80 px-4 py-3">
        <p className="text-sm text-ink-600">鍵はこの端末に保存されています</p><button type="button" onClick={forgetKey} className="shrink-0 rounded-xl border border-ink-200 px-3 py-2 text-sm font-bold text-ink-700">この端末から鍵を消す</button>
      </div>
      {message && <p className="mb-4 rounded-2xl bg-profile-card px-4 py-3 text-sm font-bold text-ink-700" role="status">{message}</p>}
      {actionStatus && <p className="mb-4 rounded-2xl bg-profile-card px-4 py-3 text-sm text-ink-700" role="status">{actionStatus}</p>}
      {busy && !data ? <div className="rounded-2xl bg-profile-card p-6 text-ink-600">読み込み中…</div> : data && <>
        {sections.filter((section) => section.title === 'プロフィール').map((section) => <section key={section.title} className="mb-5 rounded-[28px] border border-ink-200/70 bg-profile-card/90 p-5 shadow-soft sm:p-7">
          <h2 className="mb-4 border-b border-ink-100 pb-3 text-xl font-extrabold">{section.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">{section.fields.map((field) => <Field key={pathKey(field.path)} {...field} data={data} issues={issues} onChange={update} />)}</div>
        </section>)}
        <section className="mb-5 rounded-[28px] border border-ink-200/70 bg-profile-card/90 p-5 shadow-soft sm:p-7"><h2 className="mb-4 border-b border-ink-100 pb-3 text-xl font-extrabold">Homeのタグ</h2>
          <ArrayEditor title="タグ" path={['profile', 'homeTags']} data={data} issues={issues} onEdit={changeStringArray} onMutate={mutateList} />
        </section>
        {sections.filter((section) => section.title === 'Me').map((section) => <section key={section.title} className="mb-5 rounded-[28px] border border-ink-200/70 bg-profile-card/90 p-5 shadow-soft sm:p-7">
          <h2 className="mb-4 border-b border-ink-100 pb-3 text-xl font-extrabold">{section.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">{section.fields.map((field) => <Field key={pathKey(field.path)} {...field} data={data} issues={issues} onChange={update} />)}</div>
          <div className="mt-5"><ArrayEditor title="スキル" path={['me', 'skills']} data={data} issues={issues} onEdit={changeStringArray} onMutate={mutateList} /></div>
          {(['likes', 'hobbies', 'studying'] as const).map((list) => <div className="mt-5 grid gap-5 sm:grid-cols-2" key={list}>{(['ja', 'en'] as const).map((lang) => <ArrayEditor key={lang} title={`${{ likes: '好きなこと', hobbies: '趣味', studying: '勉強中' }[list]}（${lang === 'ja' ? '日本語' : 'English'}）`} path={['me', list, lang]} data={data} issues={issues} onEdit={changeStringArray} onMutate={mutateList} />)}</div>)}
        </section>)}
        <section className="mb-5 rounded-[28px] border border-ink-200/70 bg-profile-card/90 p-5 shadow-soft sm:p-7"><h2 className="mb-4 border-b border-ink-100 pb-3 text-xl font-extrabold">Links</h2>
          {(data.links ?? []).map((link: any, i: number) => <div key={i} className="mb-4 rounded-2xl border border-ink-200 p-4"><div className="mb-3 flex items-center justify-between"><strong>リンク {i + 1}</strong><RowActions index={i} count={data.links.length} path={['links']} onMutate={(_, operation, itemIndex) => mutateLinkList(operation, itemIndex)} /></div><div className="grid gap-3 sm:grid-cols-2">{(['name', 'handle', 'url'] as const).map((key) => <Field key={key} label={{ name: '表示名', handle: 'アカウント名', url: 'URL' }[key]} path={['links', i, key]} kind={key === 'url' ? 'url' : undefined} data={data} issues={issues} onChange={update} />)}{newLinkIcons.includes(i) && <label className="edit-field"><span>アイコン</span><select className={editInputClass} value={link.icon} onChange={(event) => update(['links', i, 'icon'], event.target.value)}>{ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}<option value="none">なし</option></select></label>}</div></div>)}
          <button type="button" className="edit-add" onClick={() => mutateLinkList('add', 0, { name: '新しいリンク', handle: '', url: 'https://', color: 'from-neutral-700 to-neutral-500', icon: 'github' })}><Plus size={18} />リンクを追加</button>
        </section>
        <section className="mb-5 rounded-[28px] border border-ink-200/70 bg-profile-card/90 p-5 shadow-soft sm:p-7"><h2 className="mb-4 border-b border-ink-100 pb-3 text-xl font-extrabold">Cosme</h2>
          <div className="grid gap-4 sm:grid-cols-2">{sections.find((section) => section.title === 'Cosme')?.fields.map((field) => <Field key={pathKey(field.path)} {...field} data={data} issues={issues} onChange={update} />)}</div>
          <ArrayEditor title="Xの投稿時間" path={['cosme', 'x', 'times']} data={data} issues={issues} onEdit={changeStringArray} onMutate={mutateList} />
        </section>
        <section className="mb-5 rounded-[28px] border border-ink-200/70 bg-profile-card/90 p-5 shadow-soft sm:p-7"><h2 className="mb-4 border-b border-ink-100 pb-3 text-xl font-extrabold">作ったもの</h2>
          {(data.products ?? []).map((_: any, i: number) => <div key={i} className="mb-4 rounded-2xl border border-ink-200 p-4"><div className="mb-3 flex items-center justify-between"><strong>作ったもの {i + 1}</strong><RowActions index={i} count={data.products.length} path={['products']} onMutate={mutateList} /></div><div className="grid gap-3 sm:grid-cols-2">{[
            { label: '絵文字', path: ['products', i, 'emoji'] }, { label: '名前（日本語）', path: ['products', i, 'name', 'ja'] }, { label: 'Name', path: ['products', i, 'name', 'en'] },
            { label: '説明（日本語）', path: ['products', i, 'description', 'ja'], kind: 'textarea' as const }, { label: 'Description', path: ['products', i, 'description', 'en'], kind: 'textarea' as const },
            { label: 'アプリURL', path: ['products', i, 'app'], kind: 'url' as const }, { label: 'コードURL', path: ['products', i, 'code'], kind: 'url' as const },
          ].map((field) => <Field key={pathKey(field.path)} {...field} data={data} issues={issues} onChange={update} />)}<Field label="公開中" path={['products', i, 'live']} kind="boolean" data={data} issues={issues} onChange={update} /></div><div className="mt-4"><ArrayEditor title="タグ" path={['products', i, 'tags']} data={data} issues={issues} onEdit={changeStringArray} onMutate={mutateList} /></div></div>)}
          <button type="button" className="edit-add" onClick={() => mutateList(['products'], 'add', 0, { emoji: '✨', name: { ja: '新しい作品', en: 'New project' }, description: { ja: '説明', en: 'Description' }, tags: ['PWA'], live: true, app: 'https://example.com/', code: 'https://github.com/' })}><Plus size={18} />作ったものを追加</button>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">{[
            { label: 'ほかのリポジトリへの案内（日本語）', path: ['otherRepositories', 'text', 'ja'] }, { label: 'Other repositories text', path: ['otherRepositories', 'text', 'en'] },
            { label: 'リンク名（日本語）', path: ['otherRepositories', 'label', 'ja'] }, { label: 'Link label', path: ['otherRepositories', 'label', 'en'] },
            { label: 'リポジトリ一覧URL', path: ['otherRepositories', 'url'], kind: 'url' as const },
          ].map((field) => <Field key={pathKey(field.path)} {...field} data={data} issues={issues} onChange={update} />)}</div>
        </section>
      </>}
    </>}
    {formReady && <div className="edit-save-dock"><button type="button" onClick={save} disabled={busy} className="mx-auto flex min-h-14 w-full max-w-3xl items-center justify-center rounded-2xl bg-accent-500 px-5 text-lg font-extrabold text-white shadow-soft disabled:opacity-50">{busy ? '保存中…' : '保存して公開'}</button></div>}
  </main>
}

function RowActions({ index, count, path, onMutate }: { index: number; count: number; path: Path; onMutate: (path: Path, operation: 'add' | 'remove' | 'up' | 'down', index: number, value?: unknown) => void }) {
  return <div className="flex gap-1"><button aria-label="上へ" disabled={index === 0} onClick={() => onMutate(path, 'up', index)} className="edit-icon-button"><ArrowUp size={17} /></button><button aria-label="下へ" disabled={index === count - 1} onClick={() => onMutate(path, 'down', index)} className="edit-icon-button"><ArrowDown size={17} /></button><button aria-label="削除" onClick={() => onMutate(path, 'remove', index)} className="edit-icon-button text-red-600"><Trash2 size={17} /></button></div>
}
function ArrayEditor({ title, path, data, issues, onEdit, onMutate }: { title: string; path: Path; data: any; issues: Issue[]; onEdit: (path: Path, index: number, value: string) => void; onMutate: (path: Path, operation: 'add' | 'remove' | 'up' | 'down', index: number, value?: unknown) => void }) {
  const values: string[] = getAt(data, path) ?? []
  const pathIssues = issues.filter((item) => pathKey(item.path.slice(0, -1)) === pathKey(path))
  return <div><h3 className="mb-2 font-bold text-ink-700">{title}</h3><div className="space-y-2">{values.map((value, index) => <div key={index} className="flex items-start gap-2"><div className="min-w-0 flex-1"><input className="edit-array-input" value={value} onChange={(event) => onEdit(path, index, event.target.value)} aria-label={`${title} ${index + 1}`} />{pathIssues.find((item) => item.path.at(-1) === index) && <span className="edit-error" role="alert">{pathIssues.find((item) => item.path.at(-1) === index)?.message.replace(/^[A-Za-z0-9_.]+ ?は ?/, '')}</span>}</div><RowActions index={index} count={values.length} path={path} onMutate={onMutate} /></div>)}</div><button type="button" onClick={() => onMutate(path, 'add', 0)} className="edit-add"><Plus size={17} />追加</button></div>
}
