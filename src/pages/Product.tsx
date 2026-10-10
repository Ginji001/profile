import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { GithubLogo } from '../components/BrandIcons'
import { useLang } from '../i18n'
import { isHydrated } from '../hydration'
import { products } from '../data/products'

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
