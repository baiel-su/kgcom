import {
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  address: text("address").notNull(),
  password: text("password").notNull(),
  phone: varchar("phone", { length: 15 }).notNull(), // Change to varchar
  lastActivityDate: date("last_activity_date").defaultNow(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  gender: varchar("gender", { length: 255 }).notNull(),
  address: text("address").notNull(),
  max_guests: integer("max_guests").notNull(),
  guests: jsonb("users").notNull().default([]), // The maximum number of guests allowed by the post creator
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

