/** @format */
import { drizzle } from 'drizzle-orm/postgres-js';

let db: any;
let dbConnected = false; // Flag to track DB connection state

// Validate the DATABASE_URL environment variable
const databaseUrl = process.env.DATABASE_URL!;

if (!databaseUrl) {
  console.error('Error: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

// Initialize the database connection
export const initializeDb = () => {
  if (dbConnected) {
    console.log('⚠️ Database is already connected.');
    return db;
  }

  try {
    // @ts-ignore
    db = drizzle(databaseUrl);
    dbConnected = true; // Set the connection status flag to true
    console.log('✅ Database connected successfully.');
    return db;
  } catch (error: any) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

export { db, dbConnected };
