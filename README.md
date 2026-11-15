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
npm run sync:writing # refresh the writing snapshot from RSS
npm run sync:resume  # regenerate portfolio data from ResumeX YAML
npm run sync:resume:check # check the committed snapshot without writing
npm run check        # run Astro and TypeScript checks
npm run build        # build the static site to dist/
npm run check:links  # validate external links in the built homepage
npm run verify       # run checks and a production build
```

npm is the only supported package manager. Commit `package-lock.json` alongside dependency changes; script-only changes do not require a lockfile edit.

## Content workflow

ResumeX is the source of truth for résumé facts. By default, the sync script reads:

```text
../../projects/resumex/data/mohith
```

Override that location when needed:

```bash
RESUMEX_DATA_DIR=/absolute/path/to/data/mohith npm run sync:resume
```

Run `npm run sync:resume:check` to validate the YAML and compare its exact serialized output with the committed snapshot without writing files. It exits zero when current and non-zero on errors or differences. Set `RESUMEX_DATA_DIR` for a nonstandard checkout, as above.

The shared schema in `src/data/resumex-schema.ts` validates the snapshot before sync writes and when the site loads it during build. Errors identify invalid field paths. Extra fields are accepted, unknown publishers are rejected, and the phone number is omitted from the snapshot. The generated snapshot is written to `src/data/resume.generated.json`. Hand-picked ResumeX ids and their order live in `src/data/curation.ts`; portfolio-specific presentation copy lives in `src/data/portfolio.ts`. Case-study prose lives in `src/content/case-studies/`: each document has `projectId` and `eyebrow` frontmatter and a challenge paragraph body. Case-study order, `introBulletId`, and `decisionIds` remain in `src/data/curation.ts`. Hero, about, and footer editorial copy lives in `src/data/site-copy.ts`.

After publishing a post, run `npm run sync:writing` to refresh the three newest posts from https://blog.mohith16.com/rss.xml. Set `WRITING_FEED` to an HTTP(S) URL, a local path, or a file URL to use another feed. The validated snapshot is committed at `src/data/writing.generated.json` and validated again when the site loads, so builds do not fetch the feed.

## Structure

```text
scripts/                    ResumeX and writing sync, and link validation
src/components/sections/    Homepage sections
src/components/layout/      Cursor, navigation, theme control, and footer
src/components/visuals/     Lightweight Canvas hero field
src/content.config.ts       Case-study content schema
src/content/case-studies/   Case-study prose documents
src/data/                   Generated facts, schema, curation, and presentation model
src/data/site-copy.ts       Hero, about, and footer editorial copy
src/lib/                    Pure formatting and selection helpers
src/layouts/                Shared metadata and page shell
src/pages/                  Homepage, résumé, case studies, and 404
src/styles/                 Global tokens, type, motion, and utilities
public/                     Brand, crawl, and host configuration files
```

## Deployment

GitHub Actions runs `npm ci` and `npm run verify` on pull requests and pushes to main. CI does not run `sync:resume:check` because the sibling ResumeX data is absent.

The output is fully static. Build with `npm run build` and publish `dist/` on any static host. The included `_headers` file is understood by hosts such as Cloudflare Pages and Netlify; configure equivalent headers in the platform dashboard when using another provider.
