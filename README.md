# Secure Note-Taking API

Express + TypeScript + MongoDB (Mongoose) backend with JWT auth, RBAC, pagination, indexes, and aggregations.

## Prerequisites

- Node.js 18+
- MongoDB running locally

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

On startup the server reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` and creates the admin if missing.

- API: `http://localhost:5000`
- Manual seed (optional): `npm run seed:admin`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled `dist/` |
| `npm run seed:admin` | Ensure seed admin exists (same as startup check) |

## Main endpoints

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | JWT login |
| CRUD | `/api/notes` | Own notes (admin sees all) |
| CRUD | `/api/users` | Admin only |
| GET | `/api/users/by-interests` | Aggregation: group by interests |
| CRUD | `/api/posts` | Public list; auth to create |
| GET | `/api/posts/by-user/:userId` | Aggregation: `$lookup` posts for user |

Pagination: `?page=1&limit=10` on list endpoints.
