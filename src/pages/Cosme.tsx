import { FlaskConical, ExternalLink } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { useLang } from '../i18n'

export function Cosme() {
  const { t } = useLang()

  return (
    <div className="mx-auto max-w-2xl px-5 pt-10 pb-6">
      <PageHeader eyebrow="Cosme" title={t('cosme.title')} description={t('cosme.description')} />
      <div className="flex flex-col gap-4">
        <Reveal direction="up">
          <div className="profile-dark-card flex items-center justify-between rounded-3xl p-6 text-white">
            <div><p className="profile-dark-accent text-xs font-bold tracking-wide">COSME INGREDIENT NOTE</p><p className="mt-1 text-xl font-black">{t('cosme.daily')}</p><p className="mt-1 text-xs text-zinc-300">{t('cosme.schedule')}</p></div>
            <FlaskConical size={36} className="shrink-0 text-zinc-200" />
          </div>
        </Reveal>

        <Reveal direction="left" delay={0.06}>
          <article className="rounded-3xl border border-ink-200/60 bg-profile-card p-5 shadow-softer">
            <h2 className="mb-3 text-base font-black text-ink-900">{t('cosme.xTitle')}</h2>
            <div className="mb-3 flex gap-3"><span className="min-w-0 rounded-2xl bg-accent-50 px-4 py-3 text-lg font-black text-accent-500">9:00</span><span className="min-w-0 rounded-2xl bg-accent-50 px-4 py-3 text-lg font-black text-accent-500">13:00</span><span className="min-w-0 rounded-2xl bg-accent-50 px-4 py-3 text-lg font-black text-accent-500">19:00</span></div>
            <p className="text-sm leading-6 text-ink-500">{t('cosme.xDesc')}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="https://x.com/emiya2170" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-3 py-1.5 text-xs font-bold text-white">@emiya2170<ExternalLink size={13} /></a>
              <a href="https://x.com/search?q=%23%E3%82%B3%E3%82%B9%E3%83%A1%E6%88%90%E5%88%86%E3%83%8E%E3%83%BC%E3%83%88&f=live" target="_blank" rel="noreferrer" className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-500">#コスメ成分ノート</a>
            </div>
          </article>
        </Reveal>

        <Reveal direction="right" delay={0.06}>
          <article className="rounded-3xl border border-ink-200/60 bg-profile-card p-5 shadow-softer">
            <h2 className="mb-2 text-base font-black text-ink-900">{t('cosme.igTitle')}</h2>
            <p className="text-sm leading-6 text-ink-500">{t('cosme.igDesc')}</p>
            <a href="https://www.instagram.com/g.mitui/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-3 py-1.5 text-xs font-bold text-white">@g.mitui<ExternalLink size={13} /></a>
          </article>
        </Reveal>

        <Reveal direction="left" delay={0.06}>
          <article className="rounded-3xl border border-ink-200/60 bg-profile-card p-5 shadow-softer">
            <h2 className="mb-2 text-base font-black text-ink-900">note</h2>
            <p className="text-sm leading-6 text-ink-500">{t('cosme.noteDesc')}</p>
            <a href="https://note.com/emiya001" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-3 py-1.5 text-xs font-bold text-white">emiya001<ExternalLink size={13} /></a>
          </article>
        </Reveal>
      </div>
    </div>
  )
}
