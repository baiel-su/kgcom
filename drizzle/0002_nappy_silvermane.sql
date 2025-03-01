ALTER TABLE "post_guests" ADD CONSTRAINT "post_guests_post_id_user_id_pk" PRIMARY KEY("post_id","user_id");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "boom";