# NLP Toolkit

A single-page Angular application that puts a friendly UI in front of the
[Hugging Face](https://huggingface.co/) inference API. Paste in some text and get
back named entities, sentiment, detected language, or a similarity score between
two documents — with every API call recorded in a session history view.

> Built as a university project for an advanced web development course.

## Features

| Feature | What it does |
| --- | --- |
| **Entity extraction** | Finds people, organisations and places in a text, with an adjustable confidence threshold. |
| **Sentiment analysis** | Scores English text from negative to positive. |
| **Language detection** | Identifies the language of a text across 20 languages. |
| **Text similarity** | Compares two texts and returns a semantic similarity score. |
| **Request history** | An HTTP interceptor logs every outgoing API call so you can review what was sent and when. |

Access to the analysis pages is gated behind a route guard: you need a valid API
token before the router will let you in.

## Tech stack

- **Angular 21** with modules, routing, route guards, and the built-in control flow syntax (`@if` / `@for`)
- **TypeScript**
- **RxJS** — `Subject`-based state for token validity
- **Angular HttpClient** with a custom `HttpInterceptor` for request logging
- **Bootstrap 5** for layout and components

Each capability is a separate model on Hugging Face's serverless inference API:

| Feature | Model |
| --- | --- |
| Entity extraction | `dslim/bert-base-NER` |
| Sentiment analysis | `distilbert-base-uncased-finetuned-sst-2-english` |
| Language detection | `papluca/xlm-roberta-base-language-detection` |
| Text similarity | `sentence-transformers/all-MiniLM-L6-v2` |

## Getting an API token

The app talks to Hugging Face, which requires a free access token:

1. Create an account at [huggingface.co/join](https://huggingface.co/join).
2. Create a **fine-grained** token with the **"Make calls to Inference
   Providers"** permission. This link pre-selects both settings:
   [create the token](https://huggingface.co/settings/tokens/new?ownUserPermissions=inference.serverless.write&tokenType=fineGrained).
3. Paste it into the home page of the running app and submit.

> A plain read-only token is **not** enough. It authenticates successfully but
> the API rejects every inference call with `403 Forbidden`, so the app checks
> for the inference permission before accepting a token.

The token is validated against the account endpoint before it is accepted, then
kept in `localStorage` so it survives a page reload. It is sent as an
`Authorization: Bearer` header, never as a URL parameter, so it does not appear
in the request history. It is never committed to the repo — each user supplies
their own.

> **Note:** this project originally used the [Dandelion](https://dandelion.eu/)
> API. Dandelion is being discontinued on 30 November 2026 and has already closed
> new sign-ups, so the app was ported to Hugging Face.

## Running locally

Requires Node.js 20.19+, 22.12+, or 24+ (Angular 21).

```bash
npm install
npm start
```

Then open `http://localhost:4200/`.

To produce an optimized build in `dist/`:

```bash
npm run build
```

## Deploying to GitHub Pages

```bash
npm run deploy
```

This builds with the correct `--base-href` and pushes `dist/domaci` to the
`gh-pages` branch. Requires `npx angular-cli-ghpages` (installed on first run)
and push access to the repository.

## Project structure

```
src/app/
├── components/          # One component per feature, plus home, nav, history
├── services/
│   ├── api.service.ts        # All inference endpoints + token state
│   ├── history.service.ts    # In-memory request log
│   └── logger.interceptor.ts # Records each outgoing request
├── guards/
│   └── auth.guard.ts    # Blocks feature routes until a token is set
├── models.ts            # Shared response interfaces
└── app-routing.module.ts
```
