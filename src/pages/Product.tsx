import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { GithubLogo } from '../components/BrandIcons'
import { useLang } from '../i18n'
import { isHydrated } from '../hydration'

const products = [
  {
    emoji: '🧴', name: { ja: 'スキンケア帳', en: 'Skincare Book' },
    description: {
      ja: '化粧品の登録と、曜日ごとの朝・夜ルーティンを管理する無料のPWA。成分の重なりや、刺激が出やすいとされる組み合わせも表示。',
      en: 'A free PWA to register your cosmetics and plan morning and night routines by weekday. It also flags overlapping ingredients and combinations said to irritate.',
    }, tags: ['PWA', 'Skincare'], live: true,
    app: 'https://ginji001.github.io/skincare-pwa/', code: 'https://github.com/Ginji001/skincare-pwa',
  },
  {
    emoji: '🏋️', name: { ja: '筋トレ記録', en: 'Workout Log' },
    description: {
      ja: 'ジムのトレーニングを記録して、次回の重量を自動で入れる筋トレPWA。テンプレートからメニューを作れ、ログイン不要でデータは端末の中だけ。',
      en: 'A workout PWA for the gym that fills in your next weights automatically. Start from a template; no login, data stays on your device.',
    }, tags: ['PWA', 'Workout'], live: true,
    app: 'https://ginji001.github.io/kintore-log/', code: 'https://github.com/Ginji001/kintore-log',
  },
  {
    emoji: '📒', name: { ja: '日本化粧品検定1級 学習ノート', en: 'Japan Cosmetic Exam Lv.1 Study Notes' },
    description: {
      ja: '学習計画、問題ごとの記録と正答率、間違いノート、直前暗記カードをまとめた受験勉強用のPWA。',
      en: 'A study PWA for the exam: study plan, per-question records and accuracy, a mistakes notebook, and last-minute flashcards.',
    }, tags: ['PWA'], live: true,
    app: 'https://ginji001.github.io/cosme-kentei-note/', code: 'https://github.com/Ginji001/cosme-kentei-note', unofficial: true,
  },
  {
    emoji: '🧪', name: { ja: '化粧品成分検定1級 学習ノート', en: 'Cosmetic Ingredient Exam Lv.1 Study Notes' },
    description: {
      ja: '成分のまとめ、問題演習の記録と正答率、直前暗記カードをまとめた受験勉強用のPWA。',
      en: 'A study PWA with ingredient notes, practice-question records and accuracy, and last-minute flashcards.',
    }, tags: ['PWA'], live: true,
    app: 'https://ginji001.github.io/seibun-kentei-note/', code: 'https://github.com/Ginji001/seibun-kentei-note', unofficial: true,
  },
]

export function Product() {
  const { t, l } = useLang()

  return (
    <div className="mx-auto max-w-2xl px-5 pt-10 pb-6">
      <PageHeader eyebrow="Product" title={t('product.title')} description={t('product.description')} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {products.map((product, i) => (
          <Reveal key={product.app} direction="up" delay={(i % 2) * 0.06}>
            <motion.div initial={isHydrated() ? { opacity: 0, y: 24 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, delay: (i % 2) * 0.06 }} className="h-full rounded-3xl border border-ink-200/60 bg-profile-card p-5 shadow-softer">
              <div className="mb-2 flex items-center gap-2"><span className="text-2xl">{product.emoji}</span><h2 className="font-black text-ink-900">{l(product.name)}</h2></div>
              <p className="mb-3 text-sm leading-6 text-ink-500">{l(product.description)}</p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {product.tags.map((tag) => <span key={tag} className="rounded-full bg-accent-50 px-2.5 py-1 text-[10px] font-bold text-accent-500">{tag}</span>)}
                {'unofficial' in product && product.unofficial && <span className="rounded-full bg-accent-50 px-2.5 py-1 text-[10px] font-bold text-accent-500">{t('product.own')}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={product.app} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-accent-600">{t('product.open')}<ExternalLink size={13} /></a>
                <a href={product.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-profile-card px-3 py-1.5 text-xs font-bold text-ink-500 transition hover:border-accent-300 hover:text-accent-500"><GithubLogo size={13} />{t('product.code')}</a>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-xs font-bold text-ink-400">ほかのリポジトリは <a href="https://github.com/Ginji001?tab=repositories" target="_blank" rel="noreferrer" className="text-accent-500">GitHub</a> へ。</p>
    </div>
  )
}
