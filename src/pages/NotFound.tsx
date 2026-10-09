import { PageHeader } from '../components/PageHeader'
import { useLang } from '../i18n'
import type { Tab } from '../types'

export function NotFound({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const { t } = useLang()
  return (
    <div className="mx-auto max-w-2xl px-5 pt-10 pb-6">
      <PageHeader eyebrow="404" title={t('notFound.title')} description="" />
      <button type="button" onClick={() => onNavigate('home')} className="rounded-full bg-accent-500 px-4 py-2 text-sm font-bold text-white">{t('notFound.home')}</button>
    </div>
  )
}
