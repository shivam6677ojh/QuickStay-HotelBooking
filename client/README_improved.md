# QuickStay — Client (Improved README)

This file is an improved client README. If you want this to replace `client/README.md` I can update the file in-place.

## Summary
QuickStay client (React + Vite) — how to run, build, and configure Clerk and API connectivity.

## Environment variables (full example)
```
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
# Optional (if used by client):
# VITE_SOME_THIRD_PARTY=...
```

## Quick start
```powershell
cd client
npm install
npm run dev
```

## Checking auth wiring
- On sign-in, check browser console for: `Auth token getter configured`.
- Open DevTools -> Network -> click an API request -> check Headers -> Request Headers -> Authorization.

## Notes
- Admin role setup: add `{ "role": "admin" }` to user public metadata in Clerk.
- If you want me to replace `client/README.md` with this improved version, reply `replace client readme` and I'll perform the replacement.
