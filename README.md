# blubird

My personal website. There's a diary, a memories section for the people and things I like, and a school section that will have learning guides once I write them (it says coming soon for now).

Live at https://blubird.pages.dev, in English by default. The Japanese version is at [/ja](https://blubird.pages.dev/ja).

## How it's put together

It's Next.js 15 on Cloudflare Pages, through `@cloudflare/next-on-pages`.

Every page lives under `/en` or `/ja`. `middleware.ts` sends a bare `/` to whichever language you picked last.

The UI is built on [paiger](https://github.com/serialexperimentsrio/paiger), my React component library, so the tabs, tooltips and windows all come from there. It's installed from `vendor/paiger-0.5.0.tgz` rather than npm.

The dithered background is a WebGL shader in `src/components/special/Dither`.

Diary entries are plain text files in `public/diary/<lang>/`. Before each build, `scripts/generate-diary-manifests.mjs` writes a `manifest.json` next to them so the diary page knows which entries exist.

## Running it

```bash
bun install
bun dev
```
