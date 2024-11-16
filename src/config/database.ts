/** @format */
// import { sql } from 'drizzle-orm';
import { db, dbConnected, initializeDb } from './db';

export async function testConnection() {
    if (!dbConnected) {
        initializeDb(); // Ensure the DB is connected before testing
    }

    try {
        // const result = await db.execute(sql `SELECT 1;`);
        console.log('Connection successful: 💞💞');
    } catch (error:any) {
        console.error('❌ Error during DB connection test:', error.message);
    }
}

export const isDbConnected = () => dbConnected; // Function to check DB connection status