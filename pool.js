const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional:
  // ssl: { rejectUnauthorized: false } // for Heroku or secured environments
});

module.exports = { pool };