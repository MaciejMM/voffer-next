import { pgTable, serial, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { text, uuid, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  kindeId: varchar('kinde_id', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  title: varchar('title', { length: 50 }).notNull(),
  role: varchar('role', { length: 20 }).notNull(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
});

export const freights = pgTable('freights', {
    id: uuid('id').primaryKey().defaultRandom(),
    transeuId: text('transeu_id'),
    rawFormData: jsonb('raw_form_data').notNull(),
    userId: text('user_id').notNull(),
    isActive: boolean('is_active').default(true),
    isPublished: boolean('is_published').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Type definitions
export type Freight = typeof freights.$inferSelect;
export type NewFreight = typeof freights.$inferInsert; 