// Load environment variables from .env
import dotenv from 'dotenv';
dotenv.config();

// Import Pool class from 'pg' (PostgreSQL client)
import pkg from 'pg';
const { Pool } = pkg;

// Create a connection pool to PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,       // DB server
  port: process.env.DB_PORT,       // Port (default = 5432)
  user: process.env.DB_USER,       // Username (usually 'postgres')
  password: process.env.DB_PASSWORD, // Your DB password
  database: process.env.DB_NAME    // Your app's DB name
});

export default pool; // Export for use in other files