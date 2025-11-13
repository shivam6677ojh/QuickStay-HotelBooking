# QuickStay — Server

This document explains how to set up, run, and deploy the QuickStay backend (server).

## Overview
The server is a Node.js / Express application that provides REST API endpoints for hotels, rooms, bookings and users. It uses MongoDB for data storage and Clerk for authentication.

## Prerequisites
- Node.js 18+ and npm
- MongoDB (local or hosted Atlas)
- Clerk account (server-side keys for verifying tokens)

## Environment variables
Create a `.env` file in the `server/` directory and add the required variables. Typical variables used in this project include:

```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/quickstay
CLERK_API_KEY=sk_test_...         # or CLERK_SECRET_KEY depending on your setup
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NODE_ENV=development
```

Notes:
- Verify which Clerk variable your code expects (`CLERK_API_KEY`, `CLERK_SECRET_KEY`, or `CLERK_JWT_VERIFICATION_KEY`) by checking `server/configs` or `server/server.js`.
- Cloudinary variables are only required if the project uploads images.

## Install
From the `server/` directory:

```powershell
npm install
```

## Run (development)

```powershell
npm run server
```

This runs `nodemon server.js` and restarts on changes.

## Run (production)

```powershell
npm start
```

## API base URL
By default the server listens on `http://localhost:3000` and the API in the client expects `http://localhost:3000/api` — confirm `server.js` mount path.

## Authentication (Clerk)
- The backend uses Clerk for authentication and role checks. Server middleware validates incoming tokens and may read user public metadata to determine `role: admin` or `owner`.
- Make sure to provide the server-side Clerk key(s) in the environment and configure Clerk webhooks if the project needs to sync user data.

## Admin setup
- To create an admin locally for testing, open your Clerk dashboard, select the user, and set public metadata to include `{ "role": "admin" }`.
  - To create an admin locally for testing, open your Clerk dashboard, select the user, and set public metadata to include `{ "role": "admin" }`.
  - Alternatively, run the helper script to set the DB role (not recommended for production):

```powershell
cd server
node server/scripts/setAdmin.js <clerk_user_id>
```

Quick operational promotion endpoint
----------------------------------

For quick initial setup you can also use the HTTP endpoint (not recommended for long-term use):

POST /api/admin/promote
- Requires the requester to be authenticated (Clerk) and supply the server-side `ADMIN_PROMOTE_TOKEN`.
- Body: { "token": "<value>" } or header `x-admin-token: <value>`

This endpoint will set the authenticated user's DB role to `admin`. Protect the `ADMIN_PROMOTE_TOKEN` and remove or disable this endpoint after you have at least one admin user configured in Clerk.

## Troubleshooting
- 401 Unauthorized errors:
  - Ensure the client is sending an Authorization header (`Bearer <token>`). The token should be produced by Clerk on the client and verified by the server's Clerk middleware.
  - Confirm server environment variables include the correct Clerk secret key to validate tokens.

- Database connection errors:
  - Verify `MONGO_URI` is correct and the database is accessible from your machine.

## Useful commands
- Install deps: `npm install`
- Dev server (with nodemon): `npm run server`
- Start production server: `npm start`

## Deploy
- You can deploy the server to Heroku, Render, Fly, or a VPS. Set environment variables on the platform.
- Ensure the frontend `VITE_API_URL` points to the deployed server URL and that CORS is configured on the server.

---
If you want, I can also add a `.env.example` file listing all environment variables found in the repo, or create a simple `deploy.md` with Vercel/Render/Heroku steps configured for this project.