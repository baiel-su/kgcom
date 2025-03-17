CREATE TABLE "food_stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"address" text NOT NULL,
	"phone" varchar(15) NOT NULL,
	"image" text,
	"instagram_link" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "food_stores_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "menu" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"item_name" varchar(255) NOT NULL,
	"description" text,
	"price" varchar(50) NOT NULL,
	"image" text,
	CONSTRAINT "menu_store_id_user_id_pk" PRIMARY KEY("store_id","user_id"),
	CONSTRAINT "menu_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "food_stores" ADD CONSTRAINT "food_stores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "menu" ADD CONSTRAINT "menu_store_id_food_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."food_stores"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "menu" ADD CONSTRAINT "menu_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;