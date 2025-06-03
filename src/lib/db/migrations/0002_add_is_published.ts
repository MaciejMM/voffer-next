import { sql } from 'drizzle-orm';
import { pgTable, boolean } from 'drizzle-orm/pg-core';

export async function up(db: any) {
    await db.execute(sql`
        ALTER TABLE freights
        ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
    `);
}

export async function down(db: any) {
    await db.execute(sql`
        ALTER TABLE freights
        DROP COLUMN is_published;
    `);
} 