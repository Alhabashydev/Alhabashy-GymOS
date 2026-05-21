# GymOS

A premium dark mobile-first personal gym workout tracker built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts, and LocalStorage.

## Features

- Workout days and editable exercise plan
- Set-by-set gym mode with weight, reps, completed state, and set notes
- Exercise notes during workouts
- Active workout persistence through refresh
- Simple rest timer
- Completed workout history
- Body weight tracker with a simple Recharts line chart
- Settings for unit and rest timer
- Export/import JSON backup
- Reset data with confirmation

## What GymOS does not include

- No login
- No backend
- No database
- No AI
- No automatic suggestions
- No PR detection
- No advanced analytics
- No social features

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Storage

GymOS stores data in the browser using these LocalStorage keys:

- `gymos_workout_days`
- `gymos_sessions`
- `gymos_active_session`
- `gymos_body_weight`
- `gymos_settings`

## Design

The UI follows the Alhabashy Portfolio V3-inspired dark system: deep black surfaces, warm off-white text, subtle glass cards, soft white borders, Syne headings, DM Sans UI text, and restrained sage green accents.


## Multi-page routing

GymOS now uses React Router with real app URLs:

- `/` — Dashboard
- `/plan` — Workout plan
- `/plan/day/:dayId` — Workout day detail
- `/train` — Training mode
- `/history` — Workout history
- `/weight` — Body weight tracker
- `/settings` — Settings

A sticky header back button appears on every non-home page. It uses browser history when available and falls back safely to the correct parent page, so direct links and refreshed pages still work.

The project includes Vercel and Netlify SPA fallback config so direct route refreshes work after deployment.
