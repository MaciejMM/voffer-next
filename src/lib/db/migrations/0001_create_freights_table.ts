import { sql } from 'drizzle-orm';
import { pgTable, uuid, text, jsonb, timestamp, boolean } from 'drizzle-orm/pg-core';

export const freights = pgTable('freights', {
    id: uuid('id').primaryKey().defaultRandom(),
    transeuId: text('transeu_id'),
    capacity: text('capacity'),
    loadingMeters: text('loading_meters'),
    referenceNumber: text('reference_number'),
    requirements: jsonb('requirements'),
    loadingPlace: jsonb('loading_place'),
    unloadingPlace: jsonb('unloading_place'),
    status: text('status'),
    rawFormData: jsonb('raw_form_data'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: text('user_id'),
    isActive: boolean('is_active').default(true)
});

export async function up(db: any) {
    await db.schema.createTable(freights);
}

export async function down(db: any) {
    await db.schema.dropTable(freights);
} 