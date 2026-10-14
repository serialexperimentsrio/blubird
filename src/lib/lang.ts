export const LANGS = ['en', 'ja'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'ja'

export const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang)

export const siteTitle = (lang: Lang) => (lang === 'ja' ? '理央の世界〜!' : "RIO'S WORLD!")
