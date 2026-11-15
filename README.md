# Mohith N — Portfolio

A minimal, static-first portfolio for backend and systems engineering work. The site uses Astro and Tailwind CSS, with small framework-free scripts only where interaction is useful.

Requires Node.js 22.19 or newer. Run `nvm use` to select the version recorded in `.nvmrc`.

## What is included

- Evidence-led work, project, open-source, research, and writing sections
- Detailed case studies for the WAL engine and distributed job queue
- A printable HTML résumé at `/resume`
- Dark/light themes with OS preference detection and persistence
- A short-lived Canvas hero treatment that respects reduced motion
- Canonical metadata, structured data, social previews, sitemap, robots, and a real 404 page

## Commands

```bash
npm install          # install dependencies
npm run dev          # start Astro locally
npm run sync:resume  # regenerate portfolio data from ResumeX YAML
npm run check        # run Astro and TypeScript checks
npm run build        # build the static site to dist/
npm run check:links  # validate external links in the built homepage
npm run verify       # run checks and a production build
```

npm is the only supported package manager. Commit `package-lock.json` together with any `package.json` change.

## Content workflow

ResumeX is the source of truth for résumé facts. By default, the sync script reads:

```text
../../projects/resumex/data/mohith
```

Override that location when needed:

```bash
RESUMEX_DATA_DIR=/absolute/path/to/data/mohith npm run sync:resume
```

The shared schema in `src/data/resumex-schema.ts` validates the snapshot before sync writes and when the site loads it during build. Errors identify invalid field paths. Extra fields are accepted, unknown publishers are rejected, and the phone number is omitted from the snapshot. The generated snapshot is written to `src/data/resume.generated.json`. Hand-picked ResumeX ids and their order live in `src/data/curation.ts`; portfolio-specific presentation copy, writing links, and case-study framing live in `src/data/portfolio.ts`.

## Structure

```text
scripts/                    ResumeX sync and link validation
src/components/sections/    Homepage sections
src/components/layout/      Cursor, navigation, theme control, and footer
src/components/visuals/     Lightweight Canvas hero field
src/data/                   Generated facts, schema, curation, and presentation model
src/lib/                    Pure formatting and selection helpers
src/layouts/                Shared metadata and page shell
src/pages/                  Homepage, résumé, case studies, and 404
src/styles/                 Global tokens, type, motion, and utilities
public/                     Brand, crawl, and host configuration files
```

## Deployment

The output is fully static. Build with `npm run build` and publish `dist/` on any static host. The included `_headers` file is understood by hosts such as Cloudflare Pages and Netlify; configure equivalent headers in the platform dashboard when using another provider.
