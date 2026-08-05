# Afritek Auth Frontend

Production-ready React authentication module connected to the Afritek Auth API.

## Stack

- React 19 + Vite
- React Router v7
- React Hook Form + Zod
- TanStack Query
- Axios (token refresh queue)
- Context API
- Tailwind CSS
- Framer Motion
- Lucide React
- React Hot Toast

## Setup

```bash
cd afritek-auth-frontend
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment

```env
VITE_API_BASE_URL=https://afritek-mdr1.vercel.app/api/v1/auth
VITE_APP_NAME=Afritek
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Features

- Login / Register / Logout
- Automatic token refresh with request queue
- Persistent session (remember me)
- Forgot / Reset password
- Email verification
- Profile update
- Change password
- Delete account
- Protected & guest routes
- Dark premium UI, accessible, responsive

## Project structure

```text
src/
├── api/           # Axios instance + auth API
├── components/    # UI primitives & guards
├── context/       # AuthProvider
├── hooks/         # useAuth, useProtectedRoute
├── layouts/       # Auth & App shells
├── pages/         # Auth & profile pages
├── routes/        # AppRoutes
├── services/      # Token service
└── utils/         # Storage, constants, validation
```
```
