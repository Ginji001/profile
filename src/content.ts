import rawContent from '../content.yaml'

export type Localized = { ja: string; en: string }
export type ProfileContent = {
  profile: { name: Localized; role: Localized; homeTags: string[]; homeAbout: Localized; latest: { label: Localized; title: Localized; schedule: Localized } }
  me: { about: Localized; skills: string[]; likes: Record<'ja' | 'en', string[]>; hobbies: Record<'ja' | 'en', string[]>; studying: Record<'ja' | 'en', string[]>; setup: { main: Localized; server: Localized } }
  links: { name: string; handle: string; url: string; color: string; icon: 'github' | 'x' | 'instagram' | 'note' | 'none' }[]
  cosme: { brand: string; daily: Localized; schedule: Localized; description: Localized; x: { title: Localized; times: string[]; description: Localized; account: string; url: string; tag: string; tagUrl: string }; instagram: { title: Localized; description: Localized; account: string; url: string }; note: { name: string; description: Localized; account: string; url: string } }
  products: { emoji: string; name: Localized; description: Localized; tags: string[]; live: boolean; app: string; code: string; unofficial?: boolean }[]
  otherRepositories: { text: Localized; label: Localized; url: string }
}

export const content = rawContent as ProfileContent
