# Glow Effects

Glow Effects is a mobile-first React application for browsing a creator feed backed by the Mecenate test API. The current build includes a registration stub, a paginated feed, post detail pages, comments, optimistic like updates, and a WebSocket client that keeps feed state in sync in real time.

## What the app does

- Shows a registration screen at `/` and routes users into the feed flow.
- Loads posts from the Mecenate API with infinite scroll.
- Filters feed items by access tier: `all`, `free`, and `paid`.
- Opens individual posts at `/posts/:id`.
- Locks paid posts behind a donation CTA in the detail view.
- Loads comments lazily and paginates them on demand.
- Sends new comments through the REST API and relies on WebSocket events to update the UI.
- Optimistically toggles likes in both the feed and post detail views.
- Includes committed Capacitor Android and iOS shells for mobile packaging.

## Tech stack

- React 18 + TypeScript
- Vite
- TanStack Query
- React Router
- Tailwind CSS
- shadcn/ui and Radix UI
- Capacitor for Android and iOS packaging
- Vitest for tests

## Project structure

```text
src/
  api/           REST client helpers for posts and comments
  components/    Feed UI, shared layout pieces, and shadcn/ui primitives
  hooks/         React Query hooks and WebSocket cache wiring
  lib/           Small utilities such as token generation
  pages/         Route-level screens
  services/      WebSocket service
  types/         API and event contracts
android/         Capacitor Android project
ios/             Capacitor iOS project
```

## Routes

- `/` - registration screen with client-side validation only
- `/feed` - main feed with tier filters and infinite scroll
- `/posts/:id` - post detail page with like and comments flows

## API and realtime behavior

The app currently talks to hardcoded Mecenate test endpoints:

- REST base URL: `https://k8s.mectest.ru/test-app`
- WebSocket URL: `wss://k8s.mectest.ru/test-app/ws`

Important implementation details:

- The app does not have a login API yet.
- On first load it generates a UUID and stores it in `localStorage` under the `token` key.
- Every REST request sends that value as `Authorization: Bearer <token>`.
- The same token is passed to the WebSocket connection as a query parameter.
- Like updates and new comments are merged into the React Query cache from WebSocket events.

## Local development

### Prerequisites

- Node.js 20+ recommended
- npm

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

### Run tests

```bash
npm run test
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Mobile workflow

The repository already contains native Capacitor projects in `android/` and `ios/`.

Typical workflow:

```bash
npm run build
npx cap sync
npx cap open android
npx cap open ios
```

Capacitor metadata is defined in `capacitor.config.ts`:

- App ID: `com.mecenate.test`
- App name: `Mecenate Test`
- Web build directory: `dist`

## Available scripts

- `npm run dev` - start Vite in development mode
- `npm run build` - create a production build
- `npm run build:dev` - create a development-mode build
- `npm run lint` - run ESLint
- `npm run preview` - preview the built app locally
- `npm run test` - run Vitest once
- `npm run test:watch` - run Vitest in watch mode

## Current limitations

- The registration page is a UI-only flow and does not create real accounts.
- API and WebSocket endpoints are hardcoded instead of being injected with environment variables.
- The automated test suite is minimal and currently covers only a placeholder example test.
- The app mixes mock presentation assets with live API data to provide avatars and cover images in the feed.

## Notes for future work

- Move API and WebSocket URLs to environment-based configuration.
- Replace the registration stub with real authentication.
- Expand automated coverage around feed fetching, optimistic updates, and realtime events.
- Remove mock media dependencies once the backend provides complete asset data.
