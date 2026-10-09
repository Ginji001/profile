import { createContext, useContext } from 'react'

export type Lang = 'ja' | 'en'
export type LocalizedText = { ja: string; en: string }
export const LANGS: Lang[] = ['ja', 'en']
export const STORAGE_KEY = 'lang'

export const messages: Record<string, Record<Lang, string>> = {
  'home.languageLabel': { ja: '言語', en: 'Language' },
  'home.role': { ja: 'つくる人 / コスメ成分ノート', en: 'Maker / Cosme Ingredient Notes' },
  'home.visits': { ja: '累計アクセス', en: 'Total visits' },
  'home.latestK': { ja: '毎日更新中', en: 'Posting daily' },
  'home.latestT': { ja: '#コスメ成分ノート', en: '#コスメ成分ノート' },
  'home.latestS': { ja: 'X 9:00 / 13:00 / 19:00', en: 'X at 9:00 / 13:00 / 19:00' },
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
  'cosme.description': {
    ja: '化粧品の成分を1つずつ、短いメモにして毎日発信しています。',
    en: 'Short notes on one cosmetic ingredient at a time, every day.',
  },
  'cosme.daily': { ja: '毎日 4 投稿', en: '4 posts a day' },
  'cosme.schedule': { ja: 'X 1日3回 ・ Instagram 毎朝9時', en: 'X 3 times a day · Instagram at 9:00' },
  'cosme.xTitle': { ja: 'X（1日3回）', en: 'X (3 times a day)' },
  'cosme.xDesc': {
    ja: '成分のメモをシリーズで投稿。タグ #コスメ成分ノート で過去の投稿をまとめて見られます。',
    en: 'A series of ingredient notes. Browse past posts with the tag #コスメ成分ノート.',
  },
  'cosme.igTitle': { ja: 'Instagram（毎朝9時）', en: 'Instagram (every morning at 9)' },
  'cosme.igDesc': { ja: '成分メモをカード画像にして、1日1枚投稿しています。', en: 'One ingredient note a day, as a card image.' },
  'cosme.noteDesc': { ja: '長めの文章はnoteに書いています。', en: 'Longer writing goes on note.' },
  'me.title': { ja: '自分自身', en: 'About me' },
  'me.description': { ja: '私について。', en: 'A bit about me.' },
  'me.about': {
    ja: '化粧品の成分と、身の回りを便利にするアプリづくりが好きです。筋トレも続けています。',
    en: 'I love cosmetic ingredients and building small apps that make everyday life easier. I keep up strength training, too.',
  },
  'me.skills': { ja: 'Skills', en: 'Skills' },
  'me.likes': { ja: '好きなもの', en: 'Likes' },
  'me.hobby': { ja: '趣味', en: 'Hobbies' },
  'me.studying': { ja: '勉強中', en: 'Studying for' },
  'me.setup': { ja: '使ってる環境', en: 'Setup' },
  'me.main': { ja: 'メイン', en: 'Main' },
  'me.server': { ja: 'サーバー', en: 'Server' },
  'me.serverValue': { ja: '自宅のWindows PC', en: 'Windows PC at home' },
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
