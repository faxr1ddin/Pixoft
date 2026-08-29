# Pixoft API

Backend for a job marketplace (Bernam.go). An admin sends a job advertisement
to a Telegram bot; an AI parser extracts it into a structured vacancy, which is
served over a REST API to the mobile app.

## Stack

- **NestJS** (TypeScript) — REST API + Telegram bot in one modular monolith
- **Prisma + PostgreSQL** — data layer
- **Telegraf** — Telegram bot (admin interface)
- **Google Gemini** (free tier) — AI extraction, behind a swappable `AiParser` port
- **Docker + GitHub Actions + GHCR** — build once in CI, the server pulls & runs

## Flow

```
Admin → Telegram bot → AiParser (Gemini) → structured vacancy → PostgreSQL → REST API → app
```

One advertisement becomes one vacancy. A vacancy holds one or more **roles**,
each with its own gender / age / salary / requirements; company, locations,
schedule, benefits and contacts are shared across the roles.

## API

Public reads; writes require HTTP Basic auth (admin).

| Method | Path | Auth |
|---|---|---|
| GET | `/api/v1/vacancies` | public |
| GET | `/api/v1/vacancies/:id` | public |
| POST | `/api/v1/vacancies` | admin |
| PATCH | `/api/v1/vacancies/:id` | admin |
| DELETE | `/api/v1/vacancies/:id` | admin (soft delete) |
| GET | `/api/health` | public |

Swagger UI at `/docs` (Basic-auth protected).

## Telegram bot (admin only)

- Send ad **text or an image** → auto-posts the vacancy, replies with its number
- `/list` — recent vacancies with their numbers
- `/delete` → prompts for the number → soft-deletes it
- `/cancel`, `/help`

## Structure

```
src/
├── ai/          AiParser port + Gemini impl, extraction prompt, normalization
├── bot/         Telegram service, ad → DTO mapper
├── vacancies/   controller, service, DTOs, select constants
├── common/      auth, exception filter, guards
├── health/      health check
└── prisma/      PrismaService
```

## Local development

```bash
cp .env.example .env      # fill DATABASE_URL, GEMINI_API_KEY, TELEGRAM_BOT_TOKEN, ADMIN_IDS
npm install
npx prisma db push
npm run start:dev
```

## Deploy

Push to `main` → GitHub Actions builds the image, pushes to GHCR, and the
droplet pulls & restarts via `docker compose`. Secrets (DB, Gemini, bot token,
admin credentials) live only in the server's `.env`.
