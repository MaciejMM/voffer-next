import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const runMigration = async () => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);

    console.log('Running migrations...');

    await migrate(db, { migrationsFolder: 'src/lib/db/migrations' });

    console.log('Migrations completed!');

    await pool.end();
};

runMigration().catch((err) => {
    console.error('Migration failed!');
    console.error(err);
    process.exit(1);
}); 