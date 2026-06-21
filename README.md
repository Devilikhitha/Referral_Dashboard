# Go Business — Referral Dashboard

A secure, responsive referral management dashboard built with React + Vite.

## Features

- **Authentication** — JWT-based login via API, stored in `jwt_token` cookie
- **Protected Routes** — Dashboard & detail pages require authentication
- **Referrals Overview** — Metrics, service summary, and referral link/code sharing
- **Referrals Table** — Search, sort (by date), and client-side pagination (10/page)
- **Referral Detail** — Deep-link to individual referral by ID
- **Accessible** — ARIA labels, role="alert" for errors, keyboard navigation on table rows
- **Responsive** — Works on mobile and desktop

## Tech Stack

- React 18 + React Router v6
- Vite (build tool)
- js-cookie (cookie management)
- Vanilla CSS with design tokens (no CSS framework)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Test Credentials

```
Email:    admin@example.com
Password: admin123
```

## Build & Deploy (Vercel)

```bash
npm run build
```

Then deploy the `dist/` folder to Vercel, or connect your GitHub repo and Vercel will auto-detect Vite.

**Vercel settings:**
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

Add a `vercel.json` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Project Structure

```
src/
├── App.jsx                  # BrowserRouter + Routes
├── main.jsx                 # Entry point (renders <App /> only)
├── index.css                # Global styles & design tokens
├── components/
│   ├── Navbar.jsx
│   └── Footer.jsx
└── pages/
    ├── LoginPage.jsx
    ├── DashboardPage.jsx
    ├── ReferralDetailPage.jsx
    └── NotFoundPage.jsx
```

## API Reference

| Purpose | Endpoint |
|---|---|
| Login | `POST /api/auth/signin` |
| All referrals | `GET /api/referrals` |
| Search | `GET /api/referrals?search=<query>` |
| Sort | `GET /api/referrals?sort=asc|desc` |
| Detail | `GET /api/referrals?id=<id>` |

Base URL: `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com`
