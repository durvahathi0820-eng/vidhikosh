# Vidhikosh (विधिकोश)

An open, community-maintained glossary of Indian legal terms — built by a law student, for law students. No backend, no database, no build step: static HTML/CSS/JS reading from a single JSON file, hosted free on GitHub Pages.

**Live site:** _add your GitHub Pages URL here once deployed_

## Features (v1 / MVP)

- Instant search across term, definition, and category
- Filter by subject (Constitutional Law, Criminal Law & Procedure, Contract Law, Civil Procedure, Torts, Legal Maxims)
- Alphabetical index of all terms
- Each entry includes: plain-English definition, statutory reference, an example of usage, and "see also" cross-links to related terms
- Shareable, linkable entries — every term has its own URL (`#term=habeas-corpus`)
- Fully static — free to host, fork, and run locally with zero setup beyond a static server

## Tech stack

Plain HTML, CSS, and vanilla JavaScript. No frameworks, no npm install, no build pipeline — anyone can fork this and understand the whole codebase in a few minutes.

```
legal-dictionary/
├── index.html          # page structure
├── css/style.css        # all styling
├── js/app.js             # search, filter, routing, rendering
├── data/terms.json       # all dictionary content lives here
├── CONTRIBUTING.md       # how to add or fix a term
└── README.md
```

## Running locally

```bash
git clone https://github.com/<your-username>/vidhikosh.git
cd vidhikosh
python3 -m http.server 8000
```

Open `http://localhost:8000`. (You need a local server — not a `file://` URL — because the browser blocks `fetch()` of local JSON under the `file://` protocol.)

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under "Build and deployment," set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save. Your site will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## Adding content

All dictionary content lives in `data/terms.json`. See [CONTRIBUTING.md](CONTRIBUTING.md) for the schema, sourcing rules (important — copyright), and PR process. The seed data (~30 terms) is meant as a scaffold and a style example, not a finished product — the goal is for contributors to grow this.

## Roadmap / ideas beyond v1

- [ ] Jurisdiction tagging, if comparative (non-Indian) terms are ever added
- [ ] Fuzzy search (e.g. Fuse.js) to tolerate typos and partial matches
- [ ] Dark mode
- [ ] A small Node/Python script that validates `terms.json` (unique ids, valid category codes, no broken `related_terms` references) and runs as a GitHub Action on every PR
- [ ] Downloadable/offline JSON export
- [ ] Recently-added terms feed on the home state

## License

- **Code** (HTML/CSS/JS): MIT — see [LICENSE](LICENSE).
- **Content** (`data/terms.json`): CC-BY-SA 4.0. Definitions must be original phrasing or paraphrased from public-domain/CC-compatible sources (statutes, judgments, Wikipedia) — see [CONTRIBUTING.md](CONTRIBUTING.md) for details. Do not copy from copyrighted legal dictionaries.

## Disclaimer

Vidhikosh is a student-run reference tool, not legal advice. Definitions are simplified for learning purposes and statutory references should always be verified against the current Bare Act.
