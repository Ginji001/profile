import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { useLang } from '../i18n'
import { content } from '../content'

export function Me() {
  const { t, lang } = useLang()
  return (
    <div className="mx-auto max-w-2xl px-5 pt-10 pb-6">
      <PageHeader eyebrow="Me" title={t('me.title')} description={t('me.description')} />
      <div className="flex flex-col gap-4">
        <Reveal direction="left">
          <div className="flex items-center gap-4 rounded-3xl border border-ink-200/60 bg-profile-card p-5 shadow-softer">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-accent-300 to-accent-500 text-2xl font-black text-white" aria-hidden="true">{content.profile.name.ja.slice(0, 1)}</div>
            <div><h2 className="text-xl font-black text-ink-900">{`${content.profile.name.ja} / ${content.profile.name.en}`}</h2><p className="text-sm text-ink-500">{lang === 'ja' ? content.profile.role.ja : content.profile.role.en}</p></div>
          </div>
        </Reveal>
        <Reveal direction="up" delay={0.06}>
          <section className="rounded-3xl border border-ink-200/60 bg-profile-card p-5 shadow-softer"><h2 className="mb-2 text-base font-black text-ink-900">About</h2><p className="text-sm leading-7 text-ink-500">{lang === 'ja' ? content.me.about.ja : content.me.about.en}</p></section>
        </Reveal>
        <Reveal direction="right" delay={0.06}>
          <section className="rounded-3xl border border-ink-200/60 bg-profile-card p-5 shadow-softer">
            <p className="mb-2 text-xs font-bold text-ink-400">{t('me.skills')}</p><TagList values={content.me.skills} />
            <p className="mb-2 mt-5 text-xs font-bold text-ink-400">{t('me.likes')}</p><TagList values={content.me.likes[lang]} />
            <p className="mb-2 mt-5 text-xs font-bold text-ink-400">{t('me.hobby')}</p><TagList values={content.me.hobbies[lang]} />
            <p className="mb-2 mt-5 text-xs font-bold text-ink-400">{t('me.studying')}</p><TagList values={content.me.studying[lang]} />
          </section>
        </Reveal>
        <Reveal direction="left" delay={0.06}>
          <section className="rounded-3xl border border-ink-200/60 bg-profile-card p-5 shadow-softer">
            <h2 className="mb-3 text-base font-black text-ink-900">{t('me.setup')}</h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm"><dt className="text-ink-400">{t('me.main')}</dt><dd className="font-medium text-ink-700">{content.me.setup.main[lang]}</dd><dt className="text-ink-400">{t('me.server')}</dt><dd className="font-medium text-ink-700">{content.me.setup.server[lang]}</dd></dl>
          </section>
        </Reveal>
      </div>
    </div>
  )
}

function TagList({ values }: { values: string[] }) {
  return <div className="flex flex-wrap gap-1.5">{values.map((value) => <span key={value} className="rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-medium text-ink-700">{value}</span>)}</div>
}
