import routes from './data/routes.json'
import { TAB_ORDER, type Tab } from './types'

export const TAB_PATHS: Record<Tab, string> = routes

export function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/'
}

export function tabFromPath(pathname: string): Tab | null {
  const normalized = normalizePath(pathname)
  return TAB_ORDER.find((tab) => TAB_PATHS[tab] === normalized) ?? null
}
