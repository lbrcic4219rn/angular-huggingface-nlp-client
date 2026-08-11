# angular-huggingface-nlp-client

Text analysis client built with Angular and the Hugging Face inference API: four
NLP tools behind a token gated router, no backend.

Paste in some text and get back named entities, sentiment, a detected language,
or a similarity score between two documents. Every API call is recorded in a
session history view.

> Built as a university project for an advanced web development course.

## Features

| Feature | What it does |
| :--- | :--- |
| **Entity extraction** | Finds people, organisations and places in a text, with an adjustable confidence threshold. |
| **Sentiment analysis** | Scores English text from negative to positive. |
| **Language detection** | Identifies the language of a text across 20 languages. |
| **Text similarity** | Compares two texts and returns a semantic similarity score. |
| **Request history** | An HTTP interceptor logs every outgoing API call so you can review what was sent and when. |

Access to the analysis pages is gated behind a route guard: you need a valid API
token before the router will let you in.

## Tech stack

* **Angular 21** with modules, routing, route guards, and the built in control
  flow syntax (`@if` / `@for`)
* **TypeScript**
* **RxJS** for `Subject` based state, so the navbar reacts to token validity
* **Angular HttpClient** with a custom `HttpInterceptor` for request logging
* **Bootstrap 5** for layout and components

There is no server of its own. The browser calls Hugging Face directly, and each
capability is a separate model on their serverless inference API:

| Feature | Model |
| :--- | :--- |
| Entity extraction | `dslim/bert-base-NER` |
| Sentiment analysis | `distilbert-base-uncased-finetuned-sst-2-english` |
| Language detection | `papluca/xlm-roberta-base-language-detection` |
| Text similarity | `sentence-transformers/all-MiniLM-L6-v2` |

## Getting an API token

The app talks to Hugging Face, which requires a free access token.

1. Create an account at [huggingface.co/join](https://huggingface.co/join).
2. Create a token of type "Fine-grained" carrying the permission
   "Make calls to Inference Providers". This link preselects both settings:
   [create the token](https://huggingface.co/settings/tokens/new?ownUserPermissions=inference.serverless.write&tokenType=fineGrained).
3. Paste it into the home page of the running app and submit.

> A token with read access only is **not** enough. It authenticates
> successfully, but the API rejects every inference call with `403 Forbidden`.
> The app therefore validates a token by making one small inference request
> rather than by checking the account endpoint, so an unusable token is caught
> immediately instead of failing later on every feature page.

Once accepted, the token is kept in `localStorage` so it survives a page reload.
It travels in an `Authorization: Bearer` header, never as a URL parameter, so it
cannot show up in the request history. It is never committed to the repository,
since each user supplies their own.

> **Note:** this project originally used the [Dandelion](https://dandelion.eu/)
> API. Dandelion closed new signups and is being discontinued on 30 November
> 2026, so the app was ported to Hugging Face.

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

This builds with the correct base href and pushes
`dist/angular-huggingface-nlp-client` to the `gh-pages` branch. It requires
`npx angular-cli-ghpages`, installed on first run, and push access to the
repository.

## Project structure

```
src/app/
├── components/          # One component per feature, plus home, nav, history
├── services/
│   ├── api.service.ts        # Inference endpoints, response mapping, token state
│   ├── history.service.ts    # Request log held in memory
│   ├── logger.interceptor.ts # Records each outgoing request
│   └── notification.service.ts # Toast messages for errors and confirmations
├── guards/
│   └── auth.guard.ts    # Blocks feature routes until a token is set
├── models.ts            # Shared response interfaces
└── app-routing.module.ts
```
