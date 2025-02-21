CREATE TABLE "post_guests" (
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"group_size" integer NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "date_available" date NOT NULL;--> statement-breakpoint
ALTER TABLE "post_guests" ADD CONSTRAINT "post_guests_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_guests" ADD CONSTRAINT "post_guests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "users";