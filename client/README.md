# QuickStay — Client

This is the QuickStay frontend (React + Vite). This README replaces the generic Vite template README and includes quick start, environment, and auth wiring notes specific to this project.

## Summary
QuickStay client (React, Vite, Tailwind) — how to run the dev server, build for production, and configure Clerk and backend connectivity.

## Environment variables (example)
Create a `.env` (or set environment variables in your hosting platform) with at least:

```
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
# Optional (if used by client):
# VITE_SOME_THIRD_PARTY=...
```

Notes:
- `VITE_API_URL` should point to the server API base (contains `/api` endpoints).
- `VITE_CLERK_PUBLISHABLE_KEY` is the Clerk publishable key used by the client.

## Quick start (development)
Open PowerShell and run:

```powershell
cd client
npm install
npm run dev
```

The dev server runs with Vite and HMR enabled. By default it serves on `http://localhost:5173` unless configured otherwise.

## Build for production
```powershell
cd client
npm run build
```
The output will be in `dist/` which you can serve with a static host or integrate into your deployment pipeline.

## Auth wiring & troubleshooting (Clerk + API token)
This project uses Clerk for authentication. The client must obtain a Clerk-issued JWT and include it in requests to protected API endpoints.

- On client boot the app registers a token getter (check `src/components/AuthSetup.jsx`).
- After sign-in, open the browser console and look for the log: `Auth token getter configured` — that confirms the client registered Clerk's `getToken`.
- To verify an API request contains the token: open DevTools → Network → select a request → Headers → Request Headers → `Authorization: Bearer <token>`.

If you see 401 Unauthorized responses on booking or dashboard pages:
- Confirm the client console shows `Auth token getter configured`.
- Verify `VITE_API_URL` is correct and the server is running.
- If you use dev helpers, note there is a development bypass that may be active — ensure it's disabled in production.

## Admin role setup (Clerk)
To enable admin-only routes, set user public metadata in Clerk. For example, in the Clerk dashboard set user public metadata to include:

```json
{ "role": "admin" }
```

The backend checks this public metadata to grant admin access to `/owner` routes.

## Notes & next steps
- If you want me to replace this file with additional instructions (deploy targets, environment examples, or remove dev bypass notes), tell me what to include.
- For production: remove any dev bypasses, ensure server env vars (Clerk server key, MONGO_URI, CLOUDINARY keys) are set, and validate Clerk role metadata for admin users.

## Contact
If something breaks, paste console logs and server error output and I will help debug.
