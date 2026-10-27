# Express + PostgreSQL Starter

A minimal Express app (EJS views, `pg` connection pool, express-validator) wired up to a local PostgreSQL database. Copy it, rename the database, and start building.

## Prerequisites

- Node.js (v20.6+ recommended)
- PostgreSQL running locally (e.g. Postgres.app on macOS, with the server started)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a database** (use lowercase names with underscores)

   ```bash
   createdb my_project
   ```

3. **Create your `.env` file**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and set your database URL:

   ```
   DATABASE_URL=postgresql://YOUR_USER@localhost:5432/my_project
   ```

   Add `:password` after the username only if your role has one. `.env` is git-ignored, so never commit it.

4. **Create the tables and seed data**

   The populate script takes the database URL as an argument, so it is independent of the project's `.env`:

   ```bash
   node db/populatedb.js postgresql://YOUR_USER@localhost:5432/my_project
   ```

   You should see `seeding...` then `done`. Running it again adds the seed rows a second time, so drop the table first if you want a clean start.

5. **Start the app**

   ```bash
   npm start
   ```

   Visit http://localhost:3000.

## Project structure

```
app.js                  Express setup, middleware, listen
routes/                 Maps paths to controller functions
controllers/            Handles req/res, validation, calls queries
db/pool.js              pg connection pool (reads DATABASE_URL)
db/queries.js           SQL lives here, wrapped in async functions
db/populatedb.js        One-off script to create tables and seed data
views/                  EJS templates
```

## Useful commands

| Command | What it does |
|---|---|
| `psql -d my_project` | Open a psql shell in your database |
| `\dt` | List tables (inside psql) |
| `\l` | List databases (inside psql) |
| `\c other_db` | Switch database (inside psql) |
| `\q` | Quit psql |

## Gotchas checklist

- Handlers take `(req, res)` in that order.
- Query functions must `return rows;`, and handlers calling them must be `async` and `await` them.
- Always pass user input to SQL as placeholders (`$1`, `$2`), never by string concatenation.
- Save all files before restarting the server.
- Register fixed routes (like `/new`) before parameterised ones (like `/item/:id`).

## Deploying to Render

1. Push the repo to GitHub (check `.env` is not included).
2. In Render, create a **PostgreSQL** instance and note its **Internal** and **External** URLs.
3. Seed it from your machine using the External URL (in quotes):

   ```bash
   node db/populatedb.js "<external-database-url>?sslmode=require"
   ```

4. Create a **Web Service** from the repo in the same region as the database:
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment variable: `DATABASE_URL` = the **Internal** database URL
5. Check the service **Logs** tab if anything fails.
