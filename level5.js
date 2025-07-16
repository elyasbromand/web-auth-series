// Level 5: Environmental Variables (.env)
// Using dotenv to secure sensitive data

import express from "express";
import session from "express-session";
import env from "dotenv";
import pg from "pg";

const app = express();
env.config(); // Load variables from .env

// Session configuration using .env
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// PostgreSQL config using .env variables
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();
