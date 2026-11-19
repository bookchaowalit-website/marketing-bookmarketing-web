# BookMarketing — design direction

## Product surface

A design study for sequencing a book campaign around one clear promise. Pick one of three synthetic
campaign files and log each channel move (anchor, depth, return). Progress lasts for the visit only.

## System (2026-11-19)

The site uses the shared **App shell** (`app/app-shell.css`, `components/app-shell.tsx`, see
`APP-SHELL.md`), copied byte-identical from productivity-ideas-web. Colours are the shell's `--as-*`
tokens in light and dark (the cream/red theme, its 3.4–3.9:1 text and the hard-coded #e2dbcb,
#e7e0d3 and #47815b are gone); `.bm-*` additions in `app/globals.css` reuse them. Typography is Geist
via `next/font`, with Thai system fonts (Noto Sans Thai, Leelawadee UI, Thonburi) before the
generic fallback.

- Sidebar: the three campaign files with the number of moves logged; on phones a scrollable row of
  pills replaces the old hidden nav.
- Head: campaign title and audience, Log next move (the one filled button) and Reset file (with Undo).
- The hook, a progress card (role="progressbar"), then the moves as rows with a round check (44px),
  and a status pill in words: Logged, Next up, To do — never colour alone. Results are announced
  in a polite live region.
- Footer back to bookchaowalit.com; `/more-projects` redirects there; sitemap/robots on
  marketing.bookchaowalit.com.
- Floor: text >= 12px, controls >= 44px, 3px focus ring, 4.5:1 text, 3:1 control edges, no horizontal scroll at 320px.
