ALTER TABLE "posts" ADD COLUMN "gender" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "max_guests" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "users" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "guest_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "title";