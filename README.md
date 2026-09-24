# CourtSide

A MERN sports court reservation project with a React client and an Express API. Visitors can browse courts and manage reservations; an admin route provides management views.

## What is in this repository

- `client/` - React UI with home, sign-in, reservations, and admin pages.
- `server/` - Express API with authentication, fields, and reservations routes backed by MongoDB through Mongoose.

## Run locally

1. Install dependencies in `client` and `server` with `npm install`.
2. Set `MONGO_URI` in `server/.env` to a MongoDB connection string. The server uses port 5000 unless `PORT` is set.
3. Run `npm start` in `server`, then `npm start` in `client`.

The repository is a project implementation. Check route configuration and your own environment before using it in production.
