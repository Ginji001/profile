import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LanguageContext, STORAGE_KEY, detectLang, messages, type Lang } from '../i18n'

export function LanguageProvider({ children, initialLang = 'ja' }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    const detected = detectLang()
    if (detected !== initialLang) setLangState(detected)
  }, [initialLang])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // The selection remains active for this visit when storage is unavailable.
    }
  }, [])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key: string) => messages[key]?.[lang] ?? key,
      l: (text: { ja: string; en: string } | string) =>
        typeof text === 'string' ? text : text[lang],
    }),
    [lang, setLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

