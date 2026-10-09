import { useEffect, useRef, useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BottomNav } from './components/BottomNav'
import { Home } from './pages/Home'
import { Product } from './pages/Product'
import { Cosme } from './pages/Cosme'
import { Me } from './pages/Me'
import { Links } from './pages/Links'
import { NotFound } from './pages/NotFound'
import { isHydrated, markHydrated } from './hydration'
import { TAB_ORDER, type Tab } from './types'
import { normalizePath, tabFromPath, TAB_PATHS } from './routes'

const pages: Record<Tab, ComponentType<{ onNavigate: (tab: Tab) => void }>> = {
  product: Product,
  cosme: Cosme,
  home: Home,
  me: Me,
  links: Links,
}

function tabIndex(tab: Tab | null) {
  return TAB_ORDER.indexOf(tab ?? 'home')
}

export default function App({ initialTab }: { initialTab: Tab | null }) {
  const [tab, setTab] = useState<Tab | null>(initialTab)
  const prevIndex = useRef(tabIndex(tab))

  useEffect(() => markHydrated(), [])

  useEffect(() => {
    const { pathname, search, hash } = window.location
    if (tab && pathname !== normalizePath(pathname)) {
      window.history.replaceState(null, '', normalizePath(pathname) + search + hash)
    }
  }, [tab])

  useEffect(() => {
    const onPopState = () => {
      const next = tabFromPath(window.location.pathname)
      setTab((current) => {
        prevIndex.current = tabIndex(current)
        return next
      })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const direction = Math.sign(tabIndex(tab) - prevIndex.current)
  const handleChange = (next: Tab) => {
    if (next === tab) return
    prevIndex.current = tabIndex(tab)
    setTab(next)
    window.history.pushState(null, '', TAB_PATHS[next])
  }
  const Page = tab ? pages[tab] : NotFound

  return (
    <div className="relative min-h-dvh overflow-hidden bg-ink-50">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_0%,var(--color-accent-100),transparent_45%),radial-gradient(circle_at_100%_20%,var(--color-accent-50),transparent_40%)] opacity-70 blur-3xl" />
      <AnimatePresence mode="wait" custom={direction}>
        <motion.main
          key={tab ?? 'not-found'}
          custom={direction}
          initial={isHydrated() ? { opacity: 0, x: direction * 24 } : false}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 min-h-dvh pb-32"
        >
          <Page onNavigate={handleChange} />
        </motion.main>
      </AnimatePresence>
      <BottomNav active={tab} onChange={handleChange} />
    </div>
  )
}
