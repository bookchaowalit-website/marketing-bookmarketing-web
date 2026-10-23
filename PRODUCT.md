# Bookmarketing (campaign desk demo) — Product truth

> Inferred from the code and copy (no user interview). Checked against the portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`, row `bookmarketing`) on 2026-10-23.

## What it is

A client-only editorial campaign desk over three synthetic campaign files. Each file has a hook, an audience and three channels (anchor, depth, return) that you step through and log. This is the small demo that marketing.bookchaowalit.com serves today. The canonical marketing product is a different repository, `bookchaowalit-website/marketing-campaign-platform` (a Go/Python/Next.js monorepo with an API and Postgres, owner decision #10); this repo is not it and shares no code with it.

## Who it is for

A portfolio visitor who wants to see how one book idea can be sequenced into a few publishing moves.

## What works today

1. Pick a campaign file; its title, audience and hook show.
2. Step through its three channels: each has an editorial task and a handoff proof. Log and open next marks a move done and opens the next one; Reset file clears that campaign.
3. Logged moves last for the visit only (React state).
4. Front-end and server errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No real campaigns, scheduling, SEO tracking, analytics or 45+ domain marketing operation (removed from the portfolio card in the 2026-10 review). The page says "synthetic campaign study, not live analytics".
- Nothing is saved; no API, MCP route or account.
- It is not marketing-campaign-platform: the API, database and scheduling live there, not here.

## Live URL and deploy state

- Live: https://marketing.bookchaowalit.com (HTTP 200 on 2026-10-23).
- The Vercel project `bookchaowalit-bookmarketing-frontend` (domain marketing.bookchaowalit.com) is Git-linked to this repository (`main`), so a push to `main` deploys to production. The CVE patch (commit 49c39f6) went out that way on 2026-10-23. The L2 push on 2026-10-23 may not have deployed because the Vercel free plan hit its daily deployment limit that day; the coordinator redeploys the latest green `main` once the window resets. `NEXT_PUBLIC_SENTRY_DSN` is set on the Vercel project (Sentry project `marketing-bookmarketing-web`, org `personal-yu0`).
- The portfolio card review asks the parent to reconcile which repo the bookmarketing card links; that is an owner decision, not something this repo changes.

## Boundaries

- Browser-only static page; no API routes, storage or network calls of its own.
