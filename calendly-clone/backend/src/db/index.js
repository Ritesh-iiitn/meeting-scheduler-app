const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Supabase and Render require SSL for remote connections.
const isProduction = process.env.NODE_ENV === 'production' || 
  process.env.DATABASE_URL?.includes('onrender') || 
  process.env.DATABASE_URL?.includes('supabase');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};