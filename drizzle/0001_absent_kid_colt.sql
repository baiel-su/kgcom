ALTER TABLE "food_menu" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "food_menu" ADD CONSTRAINT "food_menu_id_unique" UNIQUE("id");