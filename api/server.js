const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5000;

// ──────────────────────────────────────────────
//  PostgreSQL connection pool
//  DATABASE_URL is injected from .env via docker-compose
// ──────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ──────────────────────────────────────────────
//  Retry logic — handles slow Postgres startup
//  Retries up to MAX_RETRIES with RETRY_DELAY_MS gap
// ──────────────────────────────────────────────
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

async function connectWithRetry(attempt = 1) {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    console.log(`✅  Database connected (attempt ${attempt})`);
  } catch (err) {
    if (attempt >= MAX_RETRIES) {
      console.error("❌  Max retries reached. Could not connect to database:", err.message);
      process.exit(1);
    }
    console.warn(`⏳  DB not ready (attempt ${attempt}/${MAX_RETRIES}), retrying in ${RETRY_DELAY_MS}ms…`);
    await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
    return connectWithRetry(attempt + 1);
  }
}

// ──────────────────────────────────────────────
//  Routes
// ──────────────────────────────────────────────

// GET /health — live database connectivity check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

// GET /
app.get("/", (req, res) => {
  res.json({ service: "express-api", version: "1.0.0" });
});

// ──────────────────────────────────────────────
//  Start server after DB is ready
// ──────────────────────────────────────────────
async function start() {
  await connectWithRetry();
  app.listen(PORT, () => {
    console.log(`🚀  Express API running on port ${PORT}`);
  });
}

start();
