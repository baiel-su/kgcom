import { relations } from "drizzle-orm/relations";
import { users, posts, postGuests } from "./schema";

export const postsRelations = relations(posts, ({one, many}) => ({
	user: one(users, {
		fields: [posts.userId],
		references: [users.id]
	}),
	postGuests: many(postGuests),
}));

export const usersRelations = relations(users, ({many}) => ({
	posts: many(posts),
	postGuests: many(postGuests),
}));

export const postGuestsRelations = relations(postGuests, ({one}) => ({
	post: one(posts, {
		fields: [postGuests.postId],
		references: [posts.id]
	}),
	user: one(users, {
		fields: [postGuests.userId],
		references: [users.id]
	}),
}));