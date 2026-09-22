import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from 'dotenv';
config({ path: '../.env' });

const db = drizzle(process.env.DATABASE_URL!);

export default db
