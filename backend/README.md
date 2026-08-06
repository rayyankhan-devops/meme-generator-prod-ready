# Random Meme Generator - Backend API

Express.js server exposing a single endpoint to return a random meme from MySQL database.

## Setup & Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment configuration:**
   Copy `.env.example` to `.env` and adjust MySQL credentials:
   ```bash
   cp .env.example .env
   ```

3. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

## Single API Endpoint

- `GET /api/meme/random`
  - Fetches a random record from MySQL `memes` table (`SELECT * FROM memes ORDER BY RAND() LIMIT 1`).
  - If MySQL is offline, gracefully returns a fallback meme object with status flag.
