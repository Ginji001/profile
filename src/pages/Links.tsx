import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { GithubLogo, XLogo } from '../components/BrandIcons'
import { Link2 } from 'lucide-react'
import { useLang } from '../i18n'
import { content } from '../content'

export function Links() {
  const { t } = useLang()
  return (
    <div className="mx-auto max-w-2xl px-5 pt-10 pb-6">
      <PageHeader eyebrow="Links" title={t('links.title')} description={t('links.description')} />
      <div className="flex flex-col gap-3">
        {content.links.map(({ name, handle, url, color, icon }, index) => (
          <Reveal key={name} direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 0.04}>
            <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-3xl border border-ink-200/60 bg-profile-card p-3 shadow-softer transition hover:border-accent-300 active:scale-[0.98]">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white`}>{icon === 'github' ? <GithubLogo size={22} /> : icon === 'x' ? <XLogo size={22} /> : icon === 'instagram' ? <InstagramMark size={22} /> : icon === 'note' ? <NoteMark size={22} /> : <Link2 size={22} />}</span>
              <span><b className="block font-black text-ink-900">{name}</b><small className="text-sm text-ink-500">{handle}</small></span>
              <span className="ml-auto text-ink-400">↗</span>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function InstagramMark({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none"/></svg>
}

function NoteMark({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 20V8a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v12"/></svg>
}
