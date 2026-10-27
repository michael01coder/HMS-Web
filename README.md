# HMS Cloud UI

React + TypeScript + Tailwind. `npm install` then `npm run dev` (set `VITE_API_URL` in `.env`).

```
src/
  app/          App routes + navigation.tsx (single source of routes, roles, department modules)
  config/       roles, department -> module access, env, constants
  context/      AuthContext (session, staff profile, permission checks)
  services/     one file per backend area; all API calls and business rules live here
  hooks/        useLoad, useStaffMap
  lib/          http client, session, formatting, name resolver
  types/        shared domain types
  components/   ui primitives, layout, generic CRUD/Link pages
  features/     auth, dashboard, onboarding, staff, departments, attendance, leave,
                shifts, swaps, hotel, frontdesk, operations
```
Department access rules: `src/config/departmentAccess.ts`.
