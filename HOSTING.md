# Hosting & Deployment

Everything about where michaellemke.info lives and how to ship changes.

## Where the site is hosted

The live site is served by **Firebase Hosting** (Google).

| | |
|---|---|
| **Firebase project** | `michaellemkeinfo` (display name "MichaelLemkeInfo") |
| **Live URL** | https://michaellemke.info |
| **Preview URL** | https://decart83.github.io/MichaelLemke.info/ (GitHub Pages, `redesign-2026` branch) |
| **Source repo** | https://github.com/decart83/MichaelLemke.info (`master`) |
| **Hosting config** | `firebase.json` (serves the repo root) |

### How this was confirmed

DNS for `michaellemke.info` resolves to Firebase Hosting:

- **A records:** `151.101.1.195` and `151.101.65.195` — Firebase Hosting's published IPs (served via Fastly's edge).
- **Nameservers:** `ns-cloud-a1…a4.googledomains.com` — DNS is managed through Google.

Firebase Hosting is **static only** — it does not run PHP or any server code. (The old repo's `analyticstracking.php` / `contact-form.php` were dead leftovers from a previous template and have been removed.)

## How deployment works

Deployment is automated with GitHub Actions. On every push to `master`, the workflow `.github/workflows/firebase-hosting-deploy.yml` builds nothing (there's no build step) and deploys the repo to the Firebase **live** channel.

```yaml
on:
  push:
    branches: [master]
# uses FirebaseExtended/action-hosting-deploy@v0
# channelId: live   projectId: michaellemkeinfo
```

The action authenticates with a repository secret named **`FIREBASE_SERVICE_ACCOUNT_MICHAELLEMKEINFO`** (a Google service-account JSON key).

## One-time setup: add the deploy secret

The workflow can't deploy until this secret exists. Choose one option.

### Option A — automated (recommended)

From a terminal with the [Firebase CLI](https://firebase.google.com/docs/cli) installed and logged in:

```bash
npm install -g firebase-tools     # one-time
firebase login                    # opens your browser
cd /path/to/MichaelLemke.info
firebase init hosting:github      # creates the service account + adds the GitHub secret
```

When prompted to set up a workflow file, you can decline overwriting — the existing `firebase-hosting-deploy.yml` already uses the matching secret name. It will create the secret `FIREBASE_SERVICE_ACCOUNT_MICHAELLEMKEINFO` for you.

### Option B — manual

1. **Firebase Console** → ⚙ Project settings → **Service accounts** → **Generate new private key**. This downloads a JSON file. Keep it secret.
2. **GitHub repo** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
   - **Name:** `FIREBASE_SERVICE_ACCOUNT_MICHAELLEMKEINFO`
   - **Value:** paste the entire contents of the JSON file.

After the secret is in place, the next push to `master` deploys successfully. (Any run that fired before the secret existed will have failed at the deploy step — that's expected.)

## Deploying

### Automatic (normal workflow)

```bash
git add -A && git commit -m "..." && git push origin master
```

Watch progress under the repo's **Actions** tab. The status badge in `README.md` reflects the latest run.

### Manual (from your machine)

```bash
npm install -g firebase-tools     # one-time
firebase login                    # one-time
cd /path/to/MichaelLemke.info
firebase use michaellemkeinfo     # or: firebase use --add
firebase deploy --only hosting
```

## Run locally

The pages load `experience.json` / `projects.json` with `fetch()`, which requires HTTP (not `file://`):

```bash
python3 -m http.server 8000       # then open http://localhost:8000
```

## Project images

Project thumbnails load from `images/portfolio/*.png`. These screenshots are **not currently in the repo** (the live site was historically deployed from a different local copy). When a screenshot is missing, the card and detail page show a branded gradient placeholder instead of breaking.

To restore the real screenshots, add these files to `images/portfolio/` and push:

```
il_warning.png · il_teachers.png · chicago_crime.png · words.png · pilot.png · das_site.png
```

## Custom domain notes

`michaellemke.info` is already connected as a custom domain on the `michaellemkeinfo` Firebase project, so deploying that project updates the live domain directly — no DNS changes required. The A records above are Firebase's; leave them as-is. **Only deploy to the `michaellemkeinfo` project** — deploying a different project will not update the live domain.

## Troubleshooting

- **Action fails: "missing secret / permission denied"** — the `FIREBASE_SERVICE_ACCOUNT_MICHAELLEMKEINFO` secret is missing or invalid. Redo the one-time setup above.
- **Deploy succeeds but domain didn't change** — you deployed the wrong Firebase project; confirm `michaellemkeinfo` owns the custom domain (Firebase Console → Hosting).
- **Thumbnails missing** — add the PNGs to `images/portfolio/` (see above).
- **Local page shows no experience/projects** — you opened the file directly; serve over HTTP instead.
