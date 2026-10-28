# Nextwork tutorial and reflection prototype

This is a redesigned tutorial experience built with Next.js, React, and TypeScript. It includes step checklists, annotated code blocks, screenshots, and written or voice reflections.

## What works

The tutorial page calls **one AI endpoint**, `/api/rewrite`, to turn a voice transcript into a short narrative. Voice capture uses the browser's speech-recognition API where supported. If rewriting fails, the original transcript stays in the reflection field and a status message explains the failure.

`/api/analyze`, `/api/questions`, and `/api/feedback` are reference endpoints for the interview-coach tutorial. They are **not connected to a multi-step workflow in this interface**. All four handlers validate requests, bound request size, handle missing configuration, limit provider timeouts, and validate response shapes. No live provider call or production deployment is implied by local tests.

## Run

Use Node.js 22 or later. Install with `npm ci`, put a newly issued `GROQ_API_KEY` in an untracked `.env.local`, then run `npm run dev`. Never commit a key.

`npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` check the project. Tests mock the provider; they do not spend API credits or send personal transcripts externally. Google font downloads may require network access during builds.

This remains a prototype. A public production deployment also needs provider-side quotas and appropriate abuse/rate controls; the validation added here is not authentication or rate limiting.
