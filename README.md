# AllInOne — E-Commerce Admin Dashboard

Modern admin dashboard for managing an e-commerce store. Built with **React + Vite + Tailwind CSS**.

Supports **English / Arabic (i18n)**, **Dark Mode**, and connects to a REST API backend.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Routing](#routing)
- [API Layer](#api-layer)
- [Internationalization (i18n)](#internationalization-i18n)
- [Dark Mode](#dark-mode)
- [Theming & Design System](#theming--design-system)
- [Key Modules](#key-modules)
- [Scripts](#scripts)
- [Conventions for Developers](#conventions-for-developers)
- [Deployment](#deployment)

---

## Overview

This is the **admin panel** for the AllInOne / ShopEase e-commerce platform.  
Admins can manage products, orders, users, categories, coupons, reviews, and view real-time dashboard analytics.

| Area | Description |
|------|-------------|
| Auth | Login, Forgot Password (OTP flow) |
| Dashboard | Revenue, orders, customers, charts, activity feed |
| Products | CRUD, quick edit, featured toggle, image gallery |
| Orders | Status tracking & management |
| Users | Customer / admin management |
| Categories | Category management |
| Coupons | Discount coupons |
| Reviews | Product reviews moderation |
| Settings / Profile | Account & app settings |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routing | React Router DOM v6 |
| Forms | React Hook Form |
| HTTP Client | Axios |
| Auth Storage | js-cookie |
| Charts | Recharts |
| Icons | Lucide React + react-icons |
| i18n | i18next + react-i18next |
| Notifications | react-toastify |
| Image Upload | Cloudinary (client preset or backend FormData) |

---

## Features

- **Protected routes** — only authenticated admins can access the dashboard
- **Role check** — login rejects non-admin accounts
- **Dashboard analytics** — stats cards, sales chart, order status breakdown, top products, recent activity
- **Products** — list, search, filter, sort, pagination, create/edit/view, quick edit modal, featured toggle, multi-image upload
- **Dark mode** — system-wide theme toggle
- **i18n** — English & Arabic with RTL-ready structure
- **Responsive layout** — sidebar + topbar, mobile-friendly
- **Toast notifications** for success / error feedback

---

## Project Structure

```text
admin-dashboard/
├── public/                 # Static assets (favicon, icons)
├── src/
│   ├── api/                # Axios instance + API helpers
│   │   ├── axios.js        # Base client + auth interceptors
│   │   ├── auth.api.js     # Login, forgot-password OTP
│   │   ├── user.api.js
│   │   └── cloudinary.js   # Optional client-side Cloudinary upload
│   ├── assets/             # Images / SVGs
│   ├── components/
│   │   ├── auth/           # LoginForm, LoginBanner
│   │   ├── dashboard/      # StatCard, charts, tables, QuickInsights…
│   │   ├── layout/         # DashboardLayout, Sidebar, Topbar
│   │   ├── products/       # ProductFormFields, QuickEditModal, DeleteConfirmModal
│   │   ├── categories/
│   │   ├── coupons/
│   │   ├── reviews/
│   │   ├── users/
│   │   └── ui/             # Button, Input, Modal, Pagination, PageLoader…
│   ├── context/
│   │   └── AuthContext.jsx # Auth state, login/logout
│   ├── data/               # Static helpers (dashboardData, sidebarLinks, categories)
│   ├── i18n/
│   │   ├── index.js
│   │   └── locales/        # en.json, ar.json
│   ├── pages/              # Route-level pages
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx             # Routes + ToastContainer
│   ├── main.jsx            # Entry (Router + AuthProvider + i18n)
│   └── index.css           # Tailwind + theme tokens + animations
├── .env                    # Local env (not committed)
├── index.html
├── package.json
├── vite.config.js
└── vercel.json             # SPA rewrite for Vercel (optional)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm / yarn)
- Running backend API (see `VITE_API_URL`)

### Install

```bash
cd admin-dashboard
npm install
```

### Run (development)

```bash
npm run dev
```

App runs at `http://localhost:5173` by default.

### Build (production)

```bash
npm run build
npm run preview   # optional local preview of the build
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=https://your-api-domain.com/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend base URL used by Axios |
| `VITE_CLOUDINARY_CLOUD_NAME` | Optional* | Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Optional* | Unsigned upload preset |

\* Product create/update primarily sends **FormData** to the backend (backend handles storage).  
Client-side Cloudinary helpers exist for optional flows.

> Never commit real secrets. Use `.env.example` for documentation only.

---

## Authentication

### Flow

1. User submits email + password on `/login`
2. `AuthContext.loginUser` calls the auth API
3. On success, token & user are stored in cookies:
   - `allinone_token`
   - `allinone_user`
4. Axios attaches `Authorization: Bearer <token>` on every request
5. Non-admin users are rejected on the client after login
6. `ProtectedRoute` redirects unauthenticated users to `/login`
7. On **401**, interceptors clear cookies and redirect to login

### Key files

- `src/context/AuthContext.jsx`
- `src/api/auth.api.js`
- `src/api/axios.js`
- `src/routes/ProtectedRoute.jsx`
- `src/pages/Login.jsx`
- `src/pages/ForgotPassword.jsx` (email → OTP → new password)

---

## Routing

Defined in `src/App.jsx`.

| Path | Access | Page |
|------|--------|------|
| `/login` | Public | Login |
| `/forgot-password` | Public | Forgot password |
| `/dashboard` | Protected | Main dashboard |
| `/dashboard/products` | Protected | Products list |
| `/dashboard/products/new` | Protected | Create product |
| `/dashboard/products/edit/:id` | Protected | Edit product |
| `/dashboard/products/:id/view` | Protected | Product details |
| `/dashboard/orders` | Protected | Orders |
| `/dashboard/users` | Protected | Users |
| `/dashboard/categories` | Protected | Categories |
| `/dashboard/coupons` | Protected | Coupons |
| `/dashboard/reviews` | Protected | Reviews |
| `/dashboard/carts` | Protected | Carts |
| `/dashboard/wishlists` | Protected | Wishlists |
| `/dashboard/notifications` | Protected | Notifications |
| `/dashboard/settings` | Protected | Settings |
| `/dashboard/profile` | Protected | Profile |
| `*` | — | Redirect → `/dashboard` |

---

## API Layer

### Axios instance (`src/api/axios.js`)

- `baseURL` from `VITE_API_URL`
- `withCredentials: true`
- Request interceptor: injects Bearer token from cookies
- Response interceptor: handles 401 (logout + redirect)

### Typical product endpoints used

| Method | Endpoint | Notes |
|--------|----------|--------|
| `GET` | `/products/search` | Search, filter, pagination |
| `GET` | `/products/:id` | Single product |
| `POST` | `/products` | Create (multipart FormData) |
| `PATCH` | `/products/update/:id` | Update (multipart FormData) |
| `GET` | `/orders/admin` | Admin orders |
| `GET` | `/users/all` | Users list |

### Product images (important)

Create / Update product sends **multipart FormData**:

- New files: `data.append("images", file)`
- Removed images (edit): `data.append("deletedImages", JSON.stringify([...public_ids]))`

Do **not** send only Cloudinary URLs in JSON for these endpoints unless the backend is changed to accept that format.

---

## Internationalization (i18n)

- Library: **i18next** + **react-i18next**
- Locales: `src/i18n/locales/en.json`, `src/i18n/locales/ar.json`
- Init: `src/i18n/index.js` (imported in `main.jsx`)

### Usage

```jsx
import { useTranslation } from "react-i18next";

const { t, i18n } = useTranslation();
t("auth.welcomeBack");
i18n.changeLanguage("ar"); // or "en"
```

Keep keys consistent between `en.json` and `ar.json`.  
Prefer nested keys (`auth.login`, `navigation.dashboard`).

---

## Dark Mode

Dark mode is implemented project-wide (theme toggle in layout / settings).

Guidelines for new UI:

- Prefer semantic Tailwind classes that work in both themes (`bg-white dark:bg-slate-900`, `text-gray-900 dark:text-gray-100`, borders, etc.)
- Avoid hard-coded one-off colors that break in dark mode
- Test cards, tables, modals, and form controls in both themes

---

## Theming & Design System

Defined mainly in `src/index.css` via Tailwind `@theme`:

```css
@theme {
  --color-primary-50: #eef2ff;
  --color-primary-500: #4f46e5;
  --color-primary-600: #4338ca;
  --color-sidebar: #0f172a;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
}
```

### UI conventions

| Element | Preferred style |
|---------|-----------------|
| Cards | `rounded-2xl border border-gray-100 shadow-sm` |
| Primary button | Indigo (`bg-indigo-600 hover:bg-indigo-700`) |
| Inputs | `rounded-xl`, focus ring indigo |
| Status badges | Soft pastel backgrounds per status |
| Page padding | `p-4 sm:p-6` |

Reusable pieces live under `src/components/ui/`.

---

## Key Modules

### Dashboard (`src/pages/Dashboard.jsx`)

- Fetches orders, products, users in parallel
- Filters by month / year
- Builds stats, series, top products, status breakdown via `src/data/dashboardData.js`
- Widgets: `StatCard`, `SalesOverviewChart`, `TopProductsList`, `RecentOrdersTable`, `OrderStatusDonut`, `RecentActivityFeed`, `QuickInsights`

### Products

| File | Role |
|------|------|
| `pages/Products.jsx` | List, search, filters, pagination, actions |
| `pages/ProductForm.jsx` | Create & full edit (FormData) |
| `pages/ProductView.jsx` | Read-only product detail |
| `components/products/ProductFormFields.jsx` | Shared form fields + gallery |
| `components/products/QuickEditModal.jsx` | Modal quick edit (same FormData pattern) |
| `components/products/DeleteConfirmModal.jsx` | Delete confirmation |

### Layout

- `DashboardLayout` wraps authenticated pages
- `Sidebar` — navigation links from `data/sidebarLinks.js`
- `Topbar` — user menu, theme, language

---

## Scripts

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build → dist/
npm run preview   # Preview production build
npm run lint      # ESLint
```

---

## Conventions for Developers

1. **New pages** go in `src/pages/` and are registered in `App.jsx` behind `ProtectedRoute` when private.
2. **Shared UI** goes in `src/components/ui/`.
3. **Feature components** go under `src/components/<feature>/`.
4. **API calls** stay in `src/api/` or page-level with the shared `api` instance — avoid raw `fetch` for authenticated routes.
5. **Forms**: prefer `react-hook-form` + shared `Input` / field components.
6. **Toasts**: use `react-toastify` for user-facing success/error messages.
7. **i18n**: no hard-coded user-visible strings when a key already exists; add keys to both locale files.
8. **Images on products**: always use FormData for create/update unless the backend contract changes.
9. **Cookies**: token key is `allinone_token` — keep interceptors in sync if renamed.
10. **Keep routes consistent** (prefer lowercase paths; avoid duplicate path variants).

---

## Deployment

### Vercel

`vercel.json` is included for SPA fallback (client-side routing).

1. Connect the repo to Vercel
2. Set environment variables in the Vercel project settings
3. Build command: `npm run build`
4. Output directory: `dist`

### Other hosts

Any static host works after `npm run build`.  
Ensure all routes rewrite to `index.html` for client-side routing.

---

## License

Private / internal project — AllInOne e-commerce admin dashboard.

---

**Maintainer note:** This README is the onboarding reference for the frontend admin app. Update it when routes, env vars, or API contracts change.
