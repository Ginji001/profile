// Fetch the public GitHub contributions calendar without a token and write its daily counts.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const user = process.env.GH_USER || 'Ginji001'
const outputs = process.argv.slice(2)
if (outputs.length === 0) outputs.push('site/contributions.json')

const response = await fetch(`https://github.com/users/${user}/contributions`, {
  headers: { 'User-Agent': 'profile-page' },
})
if (!response.ok) throw new Error(`GitHub contributions could not be fetched: ${response.status}`)
const html = await response.text()

const days = [...html.matchAll(/<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*\bdata-level="(\d)"[^>]*><\/td>\s*<tool-tip\b[^>]*>([\s\S]*?)<\/tool-tip>/g)]
  .map((match) => {
    const label = match[3].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
    const countMatch = label.match(/([\d,]+)\s+contributions?\b/i)
    const count = countMatch ? Number(countMatch[1].replace(/,/g, '')) : /no contributions/i.test(label) ? 0 : null
    if (count === null) throw new Error(`Could not read contribution count for ${match[1]}: ${label}`)
    return { date: match[1], count, level: Number(match[2]) }
  })
  .sort((a, b) => a.date.localeCompare(b.date))

if (days.length < 300) throw new Error(`Too few contribution days were found: ${days.length}`)
const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in the last year/i)
const total = totalMatch ? Number(totalMatch[1].replace(/,/g, '')) : days.reduce((sum, day) => sum + day.count, 0)
const data = JSON.stringify({ user, total, from: days[0].date, to: days.at(-1).date, updated: new Date().toISOString(), days })

for (const output of outputs) {
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, data)
  console.log(`Wrote ${days.length} contribution days to ${output}`)
}
