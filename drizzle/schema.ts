import { pgTable, unique, uuid, varchar, text, date, timestamp, foreignKey, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fullName: varchar("full_name", { length: 255 }).notNull(),
	email: text().notNull(),
	password: text().notNull(),
	phone: varchar({ length: 15 }).notNull(),
	lastActivityDate: date("last_activity_date").defaultNow(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const posts = pgTable("posts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	address: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	gender: varchar({ length: 255 }).notNull(),
	maxGuests: integer("max_guests").notNull(),
	hostDate: date("host_date").defaultNow().notNull(),
	iftarType: text("iftar_type").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "posts_user_id_users_id_fk"
		}),
]);

export const postGuests = pgTable("post_guests", {
	postId: uuid("post_id").notNull(),
	userId: uuid("user_id").notNull(),
	groupSize: integer("group_size").notNull(),
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "post_guests_post_id_posts_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "post_guests_user_id_users_id_fk"
		}),
]);
