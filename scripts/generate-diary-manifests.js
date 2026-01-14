#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const diaryRoot = path.join(process.cwd(), 'public', 'diary')
if (!fs.existsSync(diaryRoot)) {
  console.log('No diary folder found, nothing to do.')
  process.exit(0)
}

const langs = fs.readdirSync(diaryRoot).filter((d) =>
  fs.statSync(path.join(diaryRoot, d)).isDirectory()
)

const ALLOWED_EXT = ['.txt', '.md', '.markdown']

for (const lang of langs) {
  const dir = path.join(diaryRoot, lang)
  const files = fs.readdirSync(dir)
    .filter((f) => !f.startsWith('.'))
    .filter((f) => f.toLowerCase() !== 'manifest.json')
    .filter((f) => ALLOWED_EXT.includes(path.extname(f).toLowerCase()))
    .sort()
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ files }, null, 2))
}
console.log('Diary manifests generated.')
