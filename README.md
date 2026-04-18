# AI Clinic Management SaaS

Production-ready MERN application for clinic operations with role-based dashboards, analytics, and Stripe-backed subscription flows.

## Overview

This repository contains:

- `client/`: React + Vite frontend
- `server/`: Express + MongoDB API
- Root scripts to run both services together

Core capabilities:

- JWT authentication with refresh tokens
- Role-based access control (admin, doctor, receptionist, patient)
- Patient and appointment management
- Prescription and diagnosis workflows
- Analytics endpoints and dashboards
- Stripe subscription checkout and webhook handling

## Tech Stack

- Frontend: React 19, React Router, Redux Toolkit, Tailwind CSS, Vite
- Backend: Node.js, Express, MongoDB (Mongoose), Joi validation
- Auth/Security: JWT, helmet, rate limiting, hpp, xss-clean, CORS
- Billing: Stripe subscriptions

## Monorepo Layout

```text
.
|- client/
|- server/
|- components/
|- public/
|- README.md
|- SETUP_GUIDE.md
|- JWT_AUTH_GUIDE.md
|- vercel.json
```

## Quick Start

### 1) Install dependencies

At the repository root:

```bash
pnpm install
pnpm --dir server install
pnpm --dir client install
```

### 2) Configure environment files

Backend:

```bash
cd server
cp .env.example .env
```

Frontend:

```bash
cd client
cp .env.example .env
```

### 3) Run in development

From root:

```bash
pnpm run dev
```

This starts:

- Frontend on `http://localhost:5173`
- Backend on `http://localhost:5000`

## Root Scripts

```bash
pnpm run dev           # Run client + server concurrently
pnpm run dev:server    # Run server only
pnpm run dev:client    # Run client only
pnpm run build         # Build frontend (client)
pnpm run start         # Start server in production mode
pnpm run lint          # Lint workspace
```

## Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/mern-boilerplate

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_REFRESH_EXPIRE=30d

CORS_ORIGIN=http://localhost:5173
APP_URL=http://localhost:5173

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_BASIC=
STRIPE_PRICE_PRO=
STRIPE_SUCCESS_URL=http://localhost:5173/subscription?status=success
STRIPE_CANCEL_URL=http://localhost:5173/subscription?status=cancelled
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=MERN Boilerplate
VITE_APP_ENV=development
```

## API Base URL

All API routes are mounted under:

```text
/api/v1
```

Key route groups currently wired in the server:

- `/auth`
- `/users`
- `/doctors`
- `/receptionists`
- `/patients`
- `/analytics`

Health check:

```text
GET /api/v1/health
```

## Stripe Subscriptions

Webhook endpoint is configured on the backend at:

```text
POST /api/v1/users/subscription/webhook
```

Important notes:

- Use the exact Stripe webhook secret in `STRIPE_WEBHOOK_SECRET`
- Ensure your deployed webhook points to the backend URL
- Keep price IDs (`STRIPE_PRICE_BASIC`, `STRIPE_PRICE_PRO`) synced with Stripe

## Deployment

This repository includes `vercel.json` configured to:

- Build the frontend from `client/`
- Publish `client/dist`
- Rewrite app routes to `index.html` for SPA routing

Typical production setup:

- Frontend: Vercel
- Backend: Render/Railway/Fly/any Node host
- Database: MongoDB Atlas

## Additional Documentation

- `SETUP_GUIDE.md`: step-by-step local setup and troubleshooting
- `JWT_AUTH_GUIDE.md`: authentication architecture and flow
- `server/README.md`: backend-specific details
- `client/README.md`: frontend-specific details

## Troubleshooting

- App loads but API calls fail: verify `VITE_API_URL` and backend port
- CORS errors: match `CORS_ORIGIN` with your frontend origin
- Stripe checkout issues: verify secret key, webhook secret, and price IDs
- Mongo connection errors: validate `MONGODB_URI` and Atlas network access

## License

MIT (see package metadata). Adjust as needed for your project policy.