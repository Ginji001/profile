import { FlaskConical, ExternalLink } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { useLang } from '../i18n'
import { content } from '../content'

export function Cosme() {
  const { t, lang } = useLang()
  const c = content.cosme
  const l = (value: { ja: string; en: string }) => value[lang]

  return (
    <div className="mx-auto max-w-2xl px-5 pt-10 pb-6">
      <PageHeader eyebrow="Cosme" title={t('cosme.title')} description={l(c.description)} />
      <div className="flex flex-col gap-4">
        <Reveal direction="up">
          <div className="profile-dark-card flex items-center justify-between rounded-3xl p-6 text-white">
            <div><p className="profile-dark-accent text-xs font-bold tracking-wide">{c.brand}</p><p className="mt-1 text-xl font-black">{l(c.daily)}</p><p className="mt-1 text-xs text-zinc-300">{l(c.schedule)}</p></div>
            <FlaskConical size={36} className="shrink-0 text-zinc-200" />
          </div>
        </Reveal>

        <Reveal direction="left" delay={0.06}>
          <article className="rounded-3xl border border-ink-200/60 bg-profile-card p-5 shadow-softer">
            <h2 className="mb-3 text-base font-black text-ink-900">{l(c.x.title)}</h2>
            <div className="mb-3 flex gap-3">{c.x.times.map((time) => <span key={time} className="min-w-0 rounded-2xl bg-accent-50 px-4 py-3 text-lg font-black text-accent-500">{time}</span>)}</div>
            <p className="text-sm leading-6 text-ink-500">{l(c.x.description)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={c.x.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-3 py-1.5 text-xs font-bold text-white">{c.x.account}<ExternalLink size={13} /></a>
              <a href={c.x.tagUrl} target="_blank" rel="noreferrer" className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-500">{c.x.tag}</a>
            </div>
          </article>
        </Reveal>

        <Reveal direction="right" delay={0.06}>
          <article className="rounded-3xl border border-ink-200/60 bg-profile-card p-5 shadow-softer">
            <h2 className="mb-2 text-base font-black text-ink-900">{l(c.instagram.title)}</h2>
            <p className="text-sm leading-6 text-ink-500">{l(c.instagram.description)}</p>
            <a href={c.instagram.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-3 py-1.5 text-xs font-bold text-white">{c.instagram.account}<ExternalLink size={13} /></a>
          </article>
        </Reveal>

        <Reveal direction="left" delay={0.06}>
          <article className="rounded-3xl border border-ink-200/60 bg-profile-card p-5 shadow-softer">
            <h2 className="mb-2 text-base font-black text-ink-900">{c.note.name}</h2>
            <p className="text-sm leading-6 text-ink-500">{l(c.note.description)}</p>
            <a href={c.note.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-3 py-1.5 text-xs font-bold text-white">{c.note.account}<ExternalLink size={13} /></a>
          </article>
        </Reveal>
      </div>
    </div>
  )
}
