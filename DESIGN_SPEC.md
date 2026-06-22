# michaellemke.info — Design Specification

_Version 1.0 — June 2026_

## 1. Goal & approach

Rebuild michaellemke.info as a fast, modern, low-maintenance **static site** that presents Michael Lemke's experience, projects, and point of view. The current site is a dated Bootstrap template (multi-page, jQuery-driven, animated typing hero). The replacement keeps the same three-section information architecture but moves to a clean, content-first design with a modern build and zero runtime framework overhead.

**Recommended stack: hand-authored static HTML + modern CSS, no build step.** This is the most maintainable option for a personal site, deploys directly to GitHub Pages, and requires no toolchain to edit. If component reuse becomes painful, the fallback is **Astro** (component-based, still ships zero JS by default) — but we start without it.

Principles: content first, fast (no jQuery/Bootstrap, <100KB initial load), accessible (semantic HTML, WCAG AA contrast), responsive (mobile-first), and easy to update (experience and projects live in simple data, not buried in markup).

## 2. Information architecture

Three top-level pages, matching today's structure but modernized:

- **Home (`index.html`)** — hero, short intro, featured experience, featured projects, contact.
- **Career (`career.html`)** — full experience timeline pulled from LinkedIn (roles, companies, dates, logos), plus education and skills.
- **Projects (`projects.html`)** — project gallery with detail links (IL School Financials, Pilot Light, Chicago Crime, WebEpoxy, and new entries).

Global header with sticky nav (Home / Career / Projects) and a footer with social links (LinkedIn, GitHub, X/Twitter, Tableau).

## 3. Layout

Mobile-first, single-column on small screens; max content width ~1100px centered on desktop with generous whitespace.

**Home**
1. **Hero** — name, one-line positioning statement (replacing the animated "A MANAGER / A DEVELOPER…" typer with a single strong headline plus an optional subtle rotating word), and two CTAs (View Work, Get in touch).
2. **Intro** — 2–3 sentence summary of who Michael is and what he does now (Strategy & Operations, Solution Engineering at Snowflake).
3. **Experience highlights** — 3 most recent/notable roles as cards with company logo, title, dates.
4. **Featured projects** — 3-card grid with thumbnail, title, one-line description, links.
5. **Contact** — email + social.

**Career** — vertical timeline; each entry shows logo, company, title, dates, and 1–2 line description. Education and a compact skills list below.

**Projects** — responsive card grid (3 / 2 / 1 columns); each card links to a detail page or external work.

## 4. Visual design system

**Typography** — native **system font stack** (San Francisco / Segoe UI / Roboto), set once via the `--font` custom property. Chosen over a hosted webfont for zero render-blocking requests, nothing extra to host on the static server, and instant first paint. Body 16–18px, 1.6 line-height; large, confident headings with restrained weight contrast.

**Color** — light theme by default with optional dark mode via `prefers-color-scheme`. Neutral base (near-white background, near-black text) with a single accent for links/CTAs. Suggested accent: a deep teal/blue that reads as data/technical without being generic corporate blue. All combinations meet WCAG AA.

Define everything as CSS custom properties so the palette and spacing scale can be changed in one place:

```css
:root {
  --bg: #ffffff;
  --surface: #f6f7f9;
  --text: #16181d;
  --muted: #5b6470;
  --accent: #0b7285;      /* deep teal */
  --accent-strong: #095c6b;
  --border: #e4e7ec;
  --radius: 12px;
  --space: clamp(1rem, 2vw, 2rem);
  --maxw: 1100px;
}
@media (prefers-color-scheme: dark) {
  :root { --bg:#0f1115; --surface:#171a21; --text:#e8eaed; --muted:#9aa3af; --border:#262b34; }
}
```

**Components** — sticky nav, hero, card (experience/project), timeline entry, button (primary/ghost), footer with social icons. Cards get subtle border + shadow on hover. Inline SVG icons (no icon-font dependency).

**Imagery** — company logos served as optimized SVG/PNG from `/images/logos/`, project thumbnails from `/images/portfolio/`. Lazy-load below-the-fold images.

## 5. Content model

Experience and projects are stored as small JSON data files so updates don't require touching markup. The build/template reads these to render cards and the timeline.

`data/experience.json`
```json
[
  {
    "company": "Snowflake",
    "title": "Strategy & Operations, Solution Engineering",
    "start": "2023",
    "end": "Present",
    "logo": "images/logos/snowflake.svg",
    "summary": "GTM strategy and operations for the Solution Engineering org."
  }
]
```

`data/projects.json`
```json
[
  {
    "title": "IL School Financials",
    "thumb": "images/portfolio/il_warning.png",
    "summary": "Data visualization project.",
    "link": "https://public.tableau.com/...",
    "detail": "p_il_financials.html"
  }
]
```

With the no-build approach, a tiny vanilla-JS loader renders these on page load; with the Astro fallback they're imported at build time (zero client JS). LinkedIn data (roles, dates, logos) populates `experience.json`.

## 6. Tech & performance

No jQuery, no Bootstrap. Modern CSS (Grid, Flexbox, custom properties, `clamp()` for fluid type/spacing). Minimal vanilla JS only for nav toggle, dark-mode, and JSON rendering. Uses the native system font stack — no webfont requests. Targets: Lighthouse 95+ across the board, total initial transfer under ~100KB, no layout shift.

## 7. Repository & deployment

The starter ships a **flat layout** — all assets at repo root — which keeps the static host (and any simple deploy) trivial and avoids path issues. Company logos are inlined as data URIs inside `experience.json` so there are no separate image files to manage; project thumbnails reference the existing images already hosted at michaellemke.info.

```
/
├── index.html
├── career.html
├── projects.html
├── styles.css
├── main.js
├── experience.json      (roles + inlined logo data URIs)
├── projects.json
└── DESIGN_SPEC.md
```

Deployment: the live site runs on an external PHP-capable host (GitHub Pages is currently disabled), with this repo as source. Push to a branch, open a PR, review, merge, then deploy the static files to the host. If you later move to GitHub Pages, add a `CNAME` file (`michaellemke.info`) and enable Pages on the default branch. If folders are preferred later (e.g. `css/`, `js/`, `assets/`), they can be reintroduced once a build step or git-based deploy is in place.

## 8. Migration & rollout

1. Stand up the new homepage + shared header/footer/CSS as a starter (this delivery).
2. Populate `experience.json` from LinkedIn and finalize the Career timeline.
3. Port existing project detail pages into the new template.
4. Review on a branch / preview, then merge to publish.
5. Remove legacy Bootstrap/jQuery assets once parity is confirmed.

## 9. Decisions & open items

Decided: **WebEpoxy callout removed.** **Font = native system stack** (no hosted webfont).

Open:
- Hosting confirmed as an external PHP host (GitHub Pages disabled). Deploy path from GitHub to that host is still manual.
- Education details on the Career page (Northern Michigan University — degree/years) are placeholder, pending content.
- Optional later: port the legacy project detail pages into the new template.
