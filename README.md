# michaellemke.info

[![Deploy to Firebase Hosting](https://github.com/decart83/MichaelLemke.info/actions/workflows/firebase-hosting-deploy.yml/badge.svg)](https://github.com/decart83/MichaelLemke.info/actions/workflows/firebase-hosting-deploy.yml)

Personal site for **Michael Lemke** — a fast, modern, no-build static site.

**Live:** <https://michaellemke.info> · **Preview:** <https://decart83.github.io/MichaelLemke.info/>

## Stack

Hand-authored static HTML + modern CSS (custom properties, Grid, `clamp()`) with a small amount of vanilla JS — no framework and no build step. Native system font stack, dark mode via `prefers-color-scheme`. Hosted on Firebase Hosting and auto-deployed with GitHub Actions.

## Structure

```
index.html · career.html · projects.html      pages
p_*.html                                       project detail pages
styles.css                                     design system
main.js                                         nav, hero rotator, JSON rendering
experience.json                                 roles + inlined SVG logo data URIs
projects.json                                   project cards + detail links
images/                                         logos, portfolio thumbnails
firebase.json                                   Firebase Hosting config
.github/workflows/firebase-hosting-deploy.yml   CI deploy
```

## Editing content

Experience and projects are data-driven — edit `experience.json` and `projects.json`; the pages render the cards, timeline, and gallery from them. No markup changes needed to add a role or project.

## Run locally

`fetch()` needs HTTP, so serve the folder rather than opening files directly:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy

Push to `master` and the GitHub Action deploys to Firebase automatically. For full details — hosting facts, the one-time secret setup, manual deploys, and troubleshooting — see **[HOSTING.md](HOSTING.md)**.

## Docs

- **[HOSTING.md](HOSTING.md)** — hosting, DNS, and deploy instructions
- **[DESIGN_SPEC.md](DESIGN_SPEC.md)** — design system and architecture
