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

export const foodStores = pgTable("food_stores", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }), // Post creator
  store_name: varchar("store_name", { length: 255 }).notNull(),
  description: text("description"),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  image: text("image"),
  instagramLink: text("instagram_link"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
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

export const foodMenu = pgTable(
  "food_menu",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(), // Unique identifier for each menu item
    foodStoreId: uuid("food_store_id")
      .notNull()
      .references(() => foodStores.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    itemName: varchar("item_name", { length: 255 }).notNull(),
    description: text("description"),
    price: varchar("price", { length: 50 }).notNull(),
    image: text("image"),
  }
);