# Contributing to Vidhikosh

Vidhikosh grows through pull requests. You don't need to touch any code to add or fix a term — everything lives in one file: [`data/terms.json`](data/terms.json).

## Before you add a term — a note on copyright

**Do not copy-paste definitions from Black's Law Dictionary, LexisNexis, paid CLAT/exam-prep glossaries, or any other copyrighted source.** Even a sentence or two, copied verbatim, is a copyright violation and will not be merged.

Safe sources to build a definition *from* (in your own words):
- Bare Acts and statutory text (Indian legislation is not copyrighted)
- Court judgments (public domain)
- Wikipedia / Wiktionary (CC-BY-SA — paraphrase and it's fine, since our content is also CC-BY-SA — see [LICENSE](LICENSE))
- Your own class notes and understanding of the concept

Write the definition the way you'd explain it to a first-year student, then cite the statute section it comes from in `statute_reference`.

## Adding a new term

1. Open `data/terms.json`.
2. Pick (or create) a category in the `categories` array. Use one of the existing `code` values if it fits.
3. Add a new object to the `terms` array, following this schema:

```json
{
  "id": "kebab-case-unique-id",
  "code": "CATEGORYCODE.NN",
  "term": "Term Name",
  "category": "CATEGORYCODE",
  "definition": "A plain-English definition in your own words, 1-3 sentences.",
  "statute_reference": "Section X, Name of Act, Year",
  "example": "One sentence showing the term used in a realistic scenario.",
  "related_terms": ["id-of-related-term-1", "id-of-related-term-2"]
}
```

Field notes:
- `id` — lowercase, hyphenated, must be unique across the file. This is used in shareable links (`#term=your-id`).
- `code` — `CATEGORY.NN`, where `NN` is the next free number within that category (check existing entries).
- `related_terms` — optional, but strongly encouraged. Use existing `id`s. Cross-links are most of what makes a dictionary useful.
- `statute_reference` — if the term isn't tied to a specific statute (e.g. a legal maxim or a case-law concept), say so explicitly, e.g. `"Developed through judicial interpretation"`.

4. Validate that `terms.json` is still valid JSON before opening a PR (most editors flag this automatically; you can also paste it into [jsonlint.com](https://jsonlint.com)).
5. Open a pull request. In the description, note where you sourced the definition from (which statute section, which judgment, etc.) so it can be checked.

## Editing or correcting an existing term

Same process — edit the relevant object in `data/terms.json` and open a PR explaining what was wrong and what changed (a superseded statute reference, an inaccurate example, etc.).

## Adding a new category

If a term doesn't fit any existing category, add a new entry to the `categories` array with a short `code`, a `name`, and a `color` (any hex value — used for the category's accent color in the UI). Keep category codes short (3-5 letters).

## What we're not accepting right now

- Non-Indian jurisdiction terms (unless explicitly noted as comparative)
- Definitions without a `statute_reference` or judicial-interpretation note
- Bulk imports scraped from another glossary or dictionary site

## Local development

No build step is required. Clone the repo and serve the folder with any static server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. (Opening `index.html` directly as a `file://` URL won't work — the browser blocks the `fetch` of `data/terms.json` under that protocol.)
