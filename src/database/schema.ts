import {
  date,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  full_name: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  lastActivityDate: date("last_activity_date").defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }), // Post creator
  gender: varchar("gender", { length: 255 }).notNull(),
  address: text("address").notNull(),
  max_guests: integer("max_guests").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  hostDate: date("host_date").notNull().defaultNow(),
  iftarType: text("iftar_type").notNull(),
});

export const postGuests = pgTable(
  "post_guests",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade", onUpdate: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }), // Users who join the post (excluding creator)
    groupSize: integer("group_size").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.postId, table.userId] })]
);
