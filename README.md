# Chimba

A modern personal dashboard that brings recipe search, meal planning, goal tracking, and travel organization into a single, theme-aware React application.

Built with React 19, TypeScript, React Router data routers, Firebase, and the Edamam Recipe Search API.

> **Status:** In active development. Recipe search, authentication, and profile management are fully functional. Meal planner, goals, and travel modules are in design.

---

## Features

### Available

- **Recipe Search** — Query the Edamam recipe database with rich filtering across diets, allergens, cuisines, dish types, cooking time, calories, and any of 30+ individual nutrients. Paginated results use infinite scroll with rate-limit-aware back-off, and each recipe has a dedicated informational page with a full nutrition-facts panel.
- **Authentication** — Firebase email/password auth with register, login, logout, password change (reauthentication-gated), and account deletion. A dedicated guest account lets visitors explore the app without signing up.
- **User Profile** — Manage display name, password, and account state. Live-edit with optimistic UI patterns and clear error surfacing.
- **Theming** — Eight hand-crafted color themes (Dark, Light, Ocean, Forest, Desert, Arctic, Plains, Volcano). Theme preference is persisted to both `localStorage` and Firestore, and re-synced across sessions and devices.
- **Route-level error handling** — A single error component handles 404/401/403/429 and unexpected errors with actionable messaging and dev-mode diagnostics.

### In development

- **Meal Planner** — Weekly calendar view, recipe slotting, auto-generated grocery lists, saved-recipe collections, and meal-prep suggestions.
- **Goals** — Goal creation with subtasks, deadlines, categories, streaks, and progress insights.
- **Travel** — Trip itineraries, destination wishlists, budget tracking, and collaborative planning.

---

## Tech stack

| Area             | Stack                                                  |
| ---------------- | ------------------------------------------------------ |
| Framework        | React 19, TypeScript 5.9, Vite 7                       |
| Routing          | React Router v7 (data router with loaders and actions) |
| State            | React Context, Firestore live subscriptions            |
| Backend services | Firebase Auth, Cloud Firestore                         |
| External API     | Edamam Recipe Search                                   |
| Styling          | CSS Modules with HSL-based design tokens               |
| Icons            | Lucide React                                           |
| Loading UI       | react-loading-indicators                               |
| Tooling          | ESLint 9, typescript-eslint, Vite dev server           |

---

## Architecture highlights

- **Data router–first** — Route loaders gate access to protected pages and redirect based on auth state; route actions handle form submissions (login, register, profile updates, goal creation, recipe search). This keeps UI components declarative and pushes navigation concerns to the router.
- **Lazy Firestore subscriptions** — A single `UserDataContextProvider` manages reference-counted subscriptions to Firestore collections (grocery list, saved recipes, profile). Modules subscribe via `addDependency`/`removeDependency` hooks — subscriptions start on first use and stop when the last consumer unmounts, avoiding duplicated listeners and orphaned streams.
- **Structured error hierarchy** — `AppError` extends `Error` with a `code` and `cause`; `AuthError`, `FirestoreError`, `EdamamError`, and `ValidationError` specialize it. The route error boundary uses `instanceof` checks and error codes to render targeted messaging (e.g. rate-limit UI for Edamam 429s).
- **Type-safe environment config** — All Vite env vars are accessed through `getRequiredEnvVar`, which throws early with a descriptive error if a variable is missing. Types are declared in `vite-env.d.ts`.
- **Theme system** — CSS custom properties in HSL triples (e.g. `--color-focus: 236 100% 70%`) are composed via `hsl(var(--color-focus) / 0.5)` syntax, giving every component access to every theme token at any opacity without precomputed variants.
- **Infinite scroll with back-off** — The recipe search paginator uses `IntersectionObserver` plus a route action to fetch the next page. If Edamam returns a 429, the action returns an error payload instead of throwing, which triggers a rate-limit notice and a 60-second cool-down before retries are enabled.
- **Scroll restoration** — A custom `useScrollRestore` hook uses a ref map and `sessionStorage` to return users to the recipe card they were viewing after navigating back from a recipe detail page.

---

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- A Firebase project with Email/Password auth enabled and a Firestore database
- An Edamam developer account with a Recipe Search API key

### Installation

```bash
git clone https://github.com/MattyK513/chimba.git
cd chimba
npm install
```

### Environment variables

Create a `.env` file in the project root:

```
# Edamam Recipe Search API
VITE_EDAMAM_APP_ID=your-edamam-app-id
VITE_EDAMAM_APP_KEY=your-edamam-app-key

# Firebase project config
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id

# Firebase UID of the shared guest account
VITE_GUEST_ID=guest-user-uid
```

The guest account is a real Firebase user — create one manually in the Firebase console, note its UID, and put that UID in `VITE_GUEST_ID` so the app can recognize and lock down destructive actions for guests.

### Running locally

```bash
npm run dev        # start Vite dev server
npm run build      # type-check and build for production
npm run preview    # preview the production build locally
npm run lint       # run ESLint over src/
```

---

## Project structure

```
src/
├── App.tsx                       # Root component: providers + router
├── main.tsx                      # Entry point
├── router.tsx                    # Route tree (protected + public)
├── index.css                     # Global tokens and theme variables
│
├── components/                   # Shared components (layouts, navbar, spinner, error)
├── contexts/                     # AuthProvider, UserDataProvider, ThemeProvider
├── hooks/                        # useAuth, useUserData, useTheme, useGoals,
│                                 #   useMeals, useProfile, useInfiniteScroll,
│                                 #   useScrollRestore, useRateLimitCooldown
│
├── pages/
│   ├── Home/                     # Authenticated landing (feature cards)
│   ├── Landing/                  # Public welcome page
│   ├── About/                    # Developer / portfolio page
│   ├── Login/ Register/          # Auth forms and route actions
│   ├── Profile/                  # Account management
│   ├── Goals/ Travel/            # Placeholder pages for upcoming modules
│   └── Meals/
│       ├── Planner/              # WeeklyPlanner, GroceryList (placeholder)
│       └── RecipeSearch/
│           ├── RecipeSearch.tsx
│           ├── SearchSubcomponents/
│           └── ResultsSubcomponents/
│
├── services/
│   ├── auth.ts                   # Firebase Auth wrappers, error translation
│   ├── edamam.ts                 # Recipe search, pagination, nutrient sorting
│   └── firestore/                # Per-module Firestore subscriptions + writers
│
├── config/                       # firebase, edamam, env (typed getRequiredEnvVar)
├── constants/                    # Theme list, Edamam option catalogs
├── errors/                       # AppError hierarchy
├── cache/                        # In-memory recipe-id cache
├── utils/                        # formatTime, safeRedirect
└── types/                        # Domain types (React, Firebase, Edamam)
```

---

## Routing overview

The router has two top-level trees sharing the `/` path, plus a public `/about` route. Route loaders act as auth guards and decide which tree the user sees.

| Path                                    | Auth required | Notes                                                                  |
| --------------------------------------- | ------------- | ---------------------------------------------------------------------- |
| `/`                                     | Yes           | Home dashboard. Unauthenticated visitors are redirected to `/welcome`. |
| `/welcome`                              | No            | Public landing page. Authenticated users are bounced to `/`.           |
| `/about`                                | No            | Developer / portfolio page. Accessible to anyone.                      |
| `/login`, `/register`                   | No            | Auth forms. Preserve `?redirectTo=` through the flow.                  |
| `/goals`, `/travel`                     | Yes           | Placeholder pages for upcoming modules.                                |
| `/meal-planner`                         | Yes           | Meal planner shell (placeholder for the weekly view).                  |
| `/meal-planner/recipe-search`           | Yes           | Recipe search with filter panel and results.                           |
| `/meal-planner/recipe-search/:recipeId` | Yes           | Recipe detail with ingredients and nutrition facts.                    |
| `/profile`                              | Yes           | Account settings, theme picker, password change, account deletion.     |

---

## Contributing

This is a personal project, but the architecture is intentionally kept clean and extensible so that new modules can be dropped in with minimal ceremony:

1. Add a new service under `src/services/<module>.ts` (or a folder of Firestore helpers).
2. Add a subscription definition in `UserDataProvider`.
3. Create a `use<Module>` hook that adds/removes that dependency on mount/unmount.
4. Build the UI in `src/pages/<Module>/`.
5. Register the route (and optional action/loader) in `router.tsx`.

---

## License

MIT
