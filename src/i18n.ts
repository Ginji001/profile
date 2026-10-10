import { createContext, useContext } from 'react'

export type Lang = 'ja' | 'en'
export type LocalizedText = { ja: string; en: string }
export const LANGS: Lang[] = ['ja', 'en']
export const STORAGE_KEY = 'lang'

export const messages: Record<string, Record<Lang, string>> = {
  'home.languageLabel': { ja: '言語', en: 'Language' },
  'home.visits': { ja: '累計アクセス', en: 'Total visits' },
  'graph.less': { ja: '少', en: 'Less' },
  'graph.more': { ja: '多', en: 'More' },
  'graph.tooltip': { ja: '件', en: 'contributions' },
  'section.more': { ja: 'もっと見る', en: 'See more' },
  'product.title': { ja: '作ったもの', en: 'Things I made' },
  'product.description': { ja: 'いままでに作ってきたもの。', en: "Things I've built so far." },
  'product.live': { ja: '公開中', en: 'Live' },
  'product.open': { ja: 'アプリを開く', en: 'Open app' },
  'product.code': { ja: 'Code', en: 'Code' },
  'product.own': { ja: '非公式', en: 'Unofficial' },
  'cosme.title': { ja: '発信していること', en: 'What I post' },
  'me.title': { ja: '自分自身', en: 'About me' },
  'me.description': { ja: '私について。', en: 'A bit about me.' },
  'me.skills': { ja: 'Skills', en: 'Skills' },
  'me.likes': { ja: '好きなもの', en: 'Likes' },
  'me.hobby': { ja: '趣味', en: 'Hobbies' },
  'me.studying': { ja: '勉強中', en: 'Studying for' },
  'me.setup': { ja: '使ってる環境', en: 'Setup' },
  'me.main': { ja: 'メイン', en: 'Main' },
  'me.server': { ja: 'サーバー', en: 'Server' },
  'links.title': { ja: 'リンク集', en: 'Links' },
  'links.description': { ja: '各種SNS・外部サービスへの入口。', en: 'Where to find me on social media and other services.' },
  'notFound.title': { ja: 'ページが見つかりません', en: 'Page not found' },
  'notFound.home': { ja: 'ホームへ戻る', en: 'Back to Home' },
}

export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'ja' || saved === 'en') return saved
  } catch {
    // Keep the browser language fallback when storage is unavailable.
  }
  return navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en'
}

export type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
  l: (text: LocalizedText | string) => string
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)

export function useLang() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLang must be used inside LanguageProvider')
  return value
}
