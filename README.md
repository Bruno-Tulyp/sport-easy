# SportEasy

SportEasy is a lightweight team and match management application (API + web UI) used to manage teams, invitations and match participation.

## Quick start

Prerequisites:

- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/)

1. Copy environment file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
pnpm install
```

3. Start database services:

```bash
docker compose up -d
```

4. Run database migrations:

```bash
pnpm db:migrate
```

To reset and seed the database:

```bash
pnpm db:reset
```

5. Start the development server:

```bash
pnpm dev
```

The app is available at http://localhost:3000 by default.

## API

Base path: `/api` (for example: `http://localhost:3000/api`)

- `GET /api/hello` — health check — returns a simple welcome message.
- `*/api/auth/*` — authentication handled by `better-auth` (sign in, sign up, session, sign out).

### Teams

- `GET /api/teams` — List teams for the authenticated user.
- `GET /api/teams/:teamSlug` — Get team details and members for `:teamSlug`.
- `POST /api/teams` — Create a new team. JSON body:

```json
{
  "team": { "name": "My Team", "location": "City" },
  "user": { "role": "coach" }
}
```

`role` must be one of: `coach`, `player`, `staff`.

### Invitations

- `GET /api/invitations` — List invitations for the authenticated user.
- `POST /api/invitations` — Create/send an invitation (team admins only). JSON body:

```json
{
  "teamId": "00000000-0000-0000-0000-000000000000",
  "email": "person@example.com",
  "permission": "member",
  "role": "player"
}
```

`teamId` must be a UUID. `permission` must be `admin` or `member`. `role` must be one of: `coach`, `player`, `staff`.

- `POST /api/invitations/:id/accept` — Accept an invitation by `:id`.
- `POST /api/invitations/:id/decline` — Decline an invitation by `:id`.

### Matches

- `GET /api/matches` — List matches (optional `teamSlug` query parameter).
- `GET /api/matches/:matchSlug` — Get match details, participants, and your reply for `:matchSlug`.
- `POST /api/matches` — Create a new match (team admins only). JSON body:

```json
{
  "teamId": "00000000-0000-0000-0000-000000000000",
  "description": "Optional description or null",
  "location": "Stadium",
  "opponent": "Opponent Club",
  "startDate": "2026-06-01T10:00:00Z",
  "endDate": "2026-06-01T12:00:00Z",
  "meetingDate": "2026-06-01T09:30:00Z"
}
```

Dates should be ISO-8601 strings (parseable by `new Date(...)`). `teamId` must be a UUID.

- `POST /api/matches/:matchSlug/:reply` — Update your participation reply for a match. No JSON body required; `:reply` must be one of: `accepted`, `declined`, `awaiting`.

## Notes

- All routes under `/api` require authentication (except the health check). Use the `better-auth` endpoints for session management.
