import fs from 'fs/promises'
import path from 'path'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const lang = (searchParams.get('lang') || 'en').replace(/[^a-z]/g, '')
    // Allow filenames with spaces and common characters. We'll canonicalize
    // using `path.basename` to prevent directory traversal and then validate
    // the extension. Avoid aggressive character stripping which breaks names
    // like "2026-01-13 copy 5.txt".
    const rawFile = searchParams.get('file') || ''
    const file = path.basename(decodeURIComponent(rawFile))

    if (!file) {
      return new Response('Not found', { status: 404 })
    }

    const allowedExt = ['.txt', '.md', '.markdown']
    const ext = path.extname(file).toLowerCase()
    if (!allowedExt.includes(ext)) {
      return new Response('Forbidden', { status: 403 })
    }

    const dir = path.join(process.cwd(), 'public', 'diary', lang)
    const full = path.join(dir, file)
    const normalized = path.normalize(full)

    if (!normalized.startsWith(dir)) {
      return new Response('Forbidden', { status: 403 })
    }

    let data = await fs.readFile(normalized, 'utf8')
    data = data.replace(/\r\n/g, '\n')
    return new Response(data, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
