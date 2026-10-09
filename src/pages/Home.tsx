import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Boxes, FlaskConical, UserRound, Link2, ExternalLink } from 'lucide-react'
import { ContributionGraph } from '../components/ContributionGraph'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { GithubLogo, XLogo } from '../components/BrandIcons'
import { LinkIconButton } from '../components/LinkIconButton'
import { LanguageToggle } from '../components/LanguageToggle'
import { useLang } from '../i18n'
import { isHydrated } from '../hydration'
import type { Tab } from '../types'

function useVisitCounter() {
  const [visits, setVisits] = useState<number | null>(null)

  useEffect(() => {
    const endpoint = 'https://thidwave-pc.tail103e61.ts.net/counter'
    const today = new Date().toISOString().slice(0, 10)
    let hit = true
    try {
      hit = localStorage.getItem('visited') !== today
    } catch {
      // Count this request when local storage is unavailable.
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 5000)
    fetch(endpoint + (hit ? '?hit=1' : ''), { cache: 'no-store', signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((value: { total?: number } | null) => {
        if (!value || typeof value.total !== 'number') return
        if (hit) {
          try {
            localStorage.setItem('visited', today)
          } catch {
            // The total can still be shown if persistence is unavailable.
          }
        }
        setVisits(value.total)
      })
      .catch(() => undefined)
      .finally(() => window.clearTimeout(timeout))
    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  return visits
}

export function Home({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const { t, lang } = useLang()
  const visits = useVisitCounter()

  return (
    <div className="mx-auto max-w-2xl px-5 pt-10 pb-6">
      <motion.div
        initial={isHydrated() ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <div className="mb-5 flex justify-end"><LanguageToggle /></div>
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-accent-300 via-accent-400 to-accent-500 text-2xl font-black text-white shadow-soft" aria-hidden="true">銀</div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-ink-900">銀次 <span className="font-medium text-ink-400">/</span> Ginji</h1>
            <p className="text-sm font-bold text-ink-500">{t('home.role')}</p>
          </div>
        </div>
        {visits !== null && <span className="inline-flex items-center gap-1.5 rounded-full bg-profile-card px-3.5 py-1.5 text-xs font-bold text-ink-500 shadow-softer">{t('home.visits')} <b className="text-ink-900">{visits.toLocaleString(lang)}</b></span>}
      </motion.div>

      <div className="mb-4"><ContributionGraph /></div>

      <Reveal direction="up" className="mb-12">
        <a href="https://x.com/emiya2170" target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-3xl border border-ink-200/60 bg-profile-card p-4 shadow-softer transition hover:border-accent-300">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-300 to-accent-500 text-white"><FlaskConical size={28} /></span>
          <span>
            <span className="block text-xs font-bold text-accent-500">{t('home.latestK')}</span>
            <span className="mt-0.5 block font-black text-ink-900">{t('home.latestT')}</span>
            <span className="text-sm text-ink-500">{t('home.latestS')}</span>
          </span>
          <ExternalLink size={15} className="ml-auto shrink-0 text-ink-300" />
        </a>
      </Reveal>

      <section className="mb-14">
        <Reveal direction="left"><SectionHeader eyebrow="Product" title={lang === 'ja' ? '作ったもの' : 'Things I made'} icon={<Boxes size={18} className="text-accent-400" />} onMore={() => onNavigate('product')} /></Reveal>
        <Reveal direction="left" delay={0.08}>
          <button type="button" onClick={() => onNavigate('product')} className="block w-full rounded-3xl border border-ink-200/60 bg-profile-card p-5 text-left shadow-softer transition active:scale-[0.98]">
            <div className="mb-2 flex items-center gap-2"><span className="text-2xl">🧴</span><span className="font-black text-ink-900">スキンケア帳</span></div>
            <p className="mb-3 text-sm text-ink-500">{lang === 'ja' ? '化粧品の登録と、曜日ごとの朝・夜ルーティンを管理する無料のPWA。成分の重なりや、刺激が出やすいとされる組み合わせも表示。' : 'A free PWA to register your cosmetics and plan morning and night routines by weekday. It also flags overlapping ingredients and combinations said to irritate.'}</p>
            <div className="flex flex-wrap gap-1.5"><span className="rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-bold text-accent-500">PWA</span><span className="rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-bold text-accent-500">Skincare</span></div>
          </button>
        </Reveal>
      </section>

      <section className="mb-14">
        <Reveal direction="right"><SectionHeader eyebrow="Cosme" title={t('cosme.title')} icon={<FlaskConical size={18} className="text-accent-400" />} onMore={() => onNavigate('cosme')} /></Reveal>
        <Reveal direction="right" delay={0.08}>
          <button type="button" onClick={() => onNavigate('cosme')} className="profile-dark-card flex w-full items-center justify-between rounded-3xl p-6 text-left text-white transition active:scale-[0.98]">
            <span><span className="profile-dark-accent block text-xs font-bold tracking-wide">COSME INGREDIENT NOTE</span><span className="mt-1 block text-xl font-black">{t('cosme.daily')}</span><span className="mt-1 block text-xs text-zinc-300">{t('cosme.schedule')}</span></span>
            <FlaskConical size={36} className="shrink-0 text-zinc-200" />
          </button>
        </Reveal>
      </section>

      <section className="mb-14">
        <Reveal direction="left"><SectionHeader eyebrow="Me" title={t('me.title')} icon={<UserRound size={18} className="text-accent-400" />} onMore={() => onNavigate('me')} /></Reveal>
        <Reveal direction="left" delay={0.08}>
          <button type="button" onClick={() => onNavigate('me')} className="block w-full rounded-3xl border border-ink-200/60 bg-profile-card p-5 text-left shadow-softer transition active:scale-[0.98]">
            <p className="text-sm leading-7 text-ink-500">{t('me.about')}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">{['PWA', 'JavaScript', 'GitHub Pages', 'Claude', '化粧品成分'].map((tag) => <span key={tag} className="rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-medium text-ink-700">{tag}</span>)}</div>
          </button>
        </Reveal>
      </section>

      <section className="mb-8">
        <Reveal direction="right"><SectionHeader eyebrow="Links" title={t('links.title')} icon={<Link2 size={18} className="text-accent-400" />} onMore={() => onNavigate('links')} /></Reveal>
        <Reveal direction="right" delay={0.08}>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            <LinkIconButton href="https://github.com/Ginji001" color="from-neutral-700 to-neutral-500" name="GitHub" handle="Ginji001" Icon={GithubLogo} />
            <LinkIconButton href="https://x.com/emiya2170" color="from-sky-500 to-blue-500" name="X" handle="@emiya2170" Icon={XLogo} />
            <LinkIconButton href="https://www.instagram.com/g.mitui/" color="from-orange-300 to-orange-700" name="Instagram" handle="@g.mitui" Icon={InstagramMark} />
            <LinkIconButton href="https://note.com/emiya001" color="from-emerald-400 to-emerald-600" name="note" handle="emiya001" Icon={NoteMark} />
          </div>
        </Reveal>
      </section>
    </div>
  )
}

function InstagramMark({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none"/></svg>
}

function NoteMark({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 20V8a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v12"/></svg>
}
