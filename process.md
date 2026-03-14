# DevPulse — Progress Tracker

## Stack
- Frontend: React + Vite + TypeScript + Tailwind v4
- Backend: Node.js + Express + TypeScript
- Database: MongoDB Atlas + Mongoose
- State: Redux Toolkit (RTK)
- Server State: TanStack Query v5
- Validation: Zod v4
- Forms: React Hook Form + zodResolver
- Charts: Recharts
- HTTP: Axios

## Folder Structure
```
devPulse/
├── frontend/          ← React + Vite
└── backend/           ← Express + Node
```

## Backend Progress
### ✅ Done
- [x] Express server setup (`src/server.ts`)
- [x] MongoDB connection with retry logic (`src/db/dbConnection.ts`)
  - Google DNS fix (8.8.8.8, 8.8.4.4)
  - IPv4 forced (family: 4)
  - Retry 3 times with 3s delay
  - Graceful shutdown (SIGINT, SIGTERM)
  - Connection pool (min: 2, max: 10)
- [x] Global middleware (cors, helmet, morgan, express.json)
- [x] 404 handler
- [x] Global error handler
- [x] Health check route GET /

### 🔄 Next Up
- [ ] Step 1 — Zod schemas (src/schemas/)
  - sessionSchema
  - goalSchema
  - skillSchema
  - loginSchema
  - registerSchema
- [ ] Step 2 — Mongoose models (src/models/)
  - User.ts
  - Session.ts
  - Goal.ts
  - Skill.ts
- [ ] Step 3 — Auth middleware (src/middleware/)
  - authenticate.ts (JWT verify)
  - validate.ts (Zod middleware factory)
  - errorHandler.ts
- [ ] Step 4 — Auth routes + controller
  - POST /api/auth/register
  - POST /api/auth/login
  - GET  /api/auth/me
- [ ] Step 5 — Session routes + controller
  - GET    /api/sessions
  - POST   /api/sessions
  - DELETE /api/sessions/:id
- [ ] Step 6 — Goal routes + controller
  - GET   /api/goals
  - POST  /api/goals
  - PATCH /api/goals/:id
  - DELETE /api/goals/:id
- [ ] Step 7 — Skill routes + controller
  - GET   /api/skills
  - POST  /api/skills (upsert)
  - PATCH /api/skills/:id/levelup

## Frontend Progress
### ✅ Done
- [x] Vite + React + TypeScript setup
- [x] Tailwind v4 installed (@tailwindcss/vite)
- [x] All dependencies installed

### 🔄 Next Up (after backend done)
- [ ] Folder structure + providers (main.tsx)
- [ ] Redux store + slices (authSlice, uiSlice, filterSlice)
- [ ] React Router setup
- [ ] Auth pages (Login, Register)
- [ ] TanStack Query hooks
- [ ] Pages (Dashboard, LogSession, Goals, Skills)
- [ ] Optimization (React.memo, useMemo, useCallback, lazy)

## Key Files
| File | Purpose |
|---|---|
| `backend/src/server.ts` | Express app entry |
| `backend/src/db/dbConnection.ts` | MongoDB connection |
| `backend/.env` | PORT, MONGO_URI, JWT_SECRET, NODE_ENV |

## Key Decisions Made
- DNS fix: setServers(["8.8.8.8", "8.8.4.4"]) + family:4
- Zod schemas live in /shared — used by both frontend and backend
- RTK for client state only, TanStack Query for server state
- JWT stored in httpOnly cookie (not localStorage)
- Tailwind v4 — no config file needed, just @import "tailwindcss"

## How To Start Each Session
Paste this at the top of new chat:
"Continue DevPulse — [paste relevant section from this file]"
```

---

**Save it as `PROGRESS.md` in your root:**
```
devPulse/
├── frontend/
├── backend/
└── PROGRESS.md    ← here