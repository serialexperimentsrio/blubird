import fs from 'fs/promises'
import path from 'path'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const lang = (searchParams.get('lang') || 'en').replace(/[^a-z]/g, '')
    const dir = path.join(process.cwd(), 'public', 'diary', lang)
    const all = await fs.readdir(dir)
    const files = all.filter((f) => !f.startsWith('.'))
    return new Response(JSON.stringify({ files }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ files: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
