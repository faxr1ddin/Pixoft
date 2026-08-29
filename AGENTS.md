# Agent guide

Pixoft API — a **NestJS + Prisma + PostgreSQL** backend with a Telegram bot
(Telegraf) and an AI job-ad parser (Google Gemini behind a swappable `AiParser`
port). See `README.md` for the full picture.

## Conventions

- Clean layering: `ai/` (extraction), `bot/` (Telegram), `vacancies/` (domain +
  REST), `common/` (auth, filters, guards). Business logic never lives in bot
  handlers or controllers.
- The app depends on the `AiParser` interface, not on Gemini directly — keep new
  providers behind it.
- Secrets come only from environment variables; never hardcode them. `.env` is
  gitignored; `.env.example` documents the keys.
- One advertisement → one vacancy with a `roles[]` relation (per-role
  gender/age/salary/requirements); shared fields stay on the vacancy.
- The parser is conservative: extract only what the ad states, never invent.

## Workflow

- `npm run build` must pass before committing.
- Schema changes apply via `prisma db push` on container start; run
  `npx prisma generate` after editing `schema.prisma`.
- Deploy is automatic on push to `main` (GitHub Actions → GHCR → droplet pull).
