# ZERP Frontend Template

Production-ready Next.js template for `zerp-tenant`, `zerp-client`, and `zerp-admin` apps.

## Stack

- Next.js (App Router) + TypeScript
- Material UI (MIT/free)
- NextAuth + Keycloak
- TanStack Query
- Locale prefix i18n (`/tr`, `/en`)
- Role-based guards
- Vitest + React Testing Library
- Docker deployment

## Quick Start

```bash
corepack enable
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Environment

```bash
cp .env.example .env.local
```

Set these before running auth flow:

- `NEXTAUTH_SECRET`
- `KEYCLOAK_ISSUER`
- `KEYCLOAK_CLIENT_ID`
- `KEYCLOAK_CLIENT_SECRET`
- `JWE_SECRET`

## App Variants

Switch variant with env value:

```bash
NEXT_PUBLIC_APP_VARIANT=tenant # tenant | client | admin
```

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`
- `pnpm format`
- `pnpm format:write`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:watch`

## Docker

```bash
docker build -t zerp-template .
docker run --rm -p 3000:3000 --env-file .env.local zerp-template
```

## Copying for New Apps

1. Copy this template to a new folder (e.g. `zerp-tenant`).
2. Set `NEXT_PUBLIC_APP_VARIANT`.
3. Customize module pages/API clients.
