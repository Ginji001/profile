import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLang } from '../i18n'

type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
type ContributionData = { total: number; days: ContributionDay[] }
const levels: Record<ContributionDay['level'], string> = {
  0: 'bg-ink-100',
  1: 'bg-accent-100',
  2: 'bg-accent-300',
  3: 'bg-accent-400',
  4: 'bg-accent-500',
}

function formatDate(value: string, lang: 'ja' | 'en') {
  const date = new Date(`${value}T00:00:00`)
  return new Intl.DateTimeFormat(lang, { month: 'short', day: 'numeric' }).format(date)
}

export function ContributionGraph() {
  const { lang, t } = useLang()
  const [data, setData] = useState<ContributionData | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<{ rect: DOMRect; day: ContributionDay } | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}contributions.json`, { cache: 'no-cache' })
      .then((response) => (response.ok ? response.json() : null))
      .then((value: ContributionData | null) => {
        if (value && Array.isArray(value.days) && typeof value.total === 'number') setData(value)
      })
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    if (data && scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
  }, [data])

  const weeks = data ? Array.from({ length: Math.ceil(data.days.length / 7) }, (_, i) => data.days.slice(i * 7, i * 7 + 7)) : []

  return (
    <div className="rounded-3xl border border-ink-200/60 bg-profile-card p-5 shadow-softer">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-ink-700">
          Contributions
          {data && <span className="ml-2 text-xs font-bold text-ink-400">{data.total.toLocaleString(lang)} / year</span>}
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-[10px] text-ink-400">{t('graph.less')}</span>
          {([0, 1, 2, 3, 4] as const).map((level) => <span key={level} className={`h-2.5 w-2.5 rounded-[3px] ${levels[level]}`} />)}
          <span className="text-[10px] text-ink-400">{t('graph.more')}</span>
        </div>
      </div>

      {!data && (
        <div className="flex gap-[3px] overflow-hidden" aria-hidden="true">
          {Array.from({ length: 26 }).map((_, wi) => <div key={wi} className="flex shrink-0 flex-col gap-[3px]">{Array.from({ length: 7 }).map((__, di) => <span key={di} className="h-2.5 w-2.5 rounded-[3px] bg-ink-100" />)}</div>)}
        </div>
      )}

      {data && (
        <div ref={scrollRef} className="flex gap-[3px] overflow-x-auto no-scrollbar" role="img" aria-label={`GitHub contributions: ${data.total} in the last year`}>
          {weeks.map((week, wi) => {
            const distanceFromEnd = weeks.length - 1 - wi
            return (
              <div key={wi} className="flex shrink-0 flex-col gap-[3px]">
                {week.map((day) => (
                  <span
                    key={day.date}
                    title={`${day.count} ${t('graph.tooltip')} · ${formatDate(day.date, lang)}`}
                    style={{ animationDelay: `${distanceFromEnd * 6 + new Date(`${day.date}T00:00:00`).getDay() * 4}ms` }}
                    onMouseEnter={(event) => setHover({ rect: event.currentTarget.getBoundingClientRect(), day })}
                    onMouseLeave={() => setHover(null)}
                    className={`h-2.5 w-2.5 animate-cell-in rounded-[3px] ${levels[day.level]}`}
                  />
                ))}
              </div>
            )
          })}
        </div>
      )}

      {hover && createPortal(
        <div className="pointer-events-none fixed z-50 animate-tooltip-in-above whitespace-nowrap rounded-xl bg-ink-900 px-3 py-1.5 text-center shadow-soft" style={{ left: hover.rect.left + hover.rect.width / 2, top: hover.rect.top }}>
          <p className="text-xs font-bold text-white">{hover.day.count} {t('graph.tooltip')}</p>
          <p className="text-[10px] text-ink-300">{formatDate(hover.day.date, lang)}</p>
        </div>,
        document.body,
      )}
    </div>
  )
}
