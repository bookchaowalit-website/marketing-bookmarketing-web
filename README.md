# Bookmarketing (campaign desk demo)

A campaign desk over three synthetic campaign files: pick one, step through its anchor, depth and return channels, and log each move for this visit. This is the demo served at marketing.bookchaowalit.com; the real marketing product is marketing-campaign-platform.

Live: https://marketing.bookchaowalit.com (Vercel deploys every push to `main`).

## What it does not do

- No real campaigns, scheduling, analytics or saved progress. Not marketing-campaign-platform.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: campaign data and move-logging rules, home page render, Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (with a line-coverage gate) and the shared security
scan on every push and PR to `main`.

## Code map

- `lib/bookmarketing.ts`: the three synthetic campaigns, `findCampaign`, `logMove`, `nextChannel`, `resetProgress`, `actionLabel`.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped; off when `NEXT_PUBLIC_SENTRY_DSN` is unset.
