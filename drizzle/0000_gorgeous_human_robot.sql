CREATE TABLE "food_menu" (
	"food_store_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"item_name" varchar(255) NOT NULL,
	"description" text,
	"price" varchar(50) NOT NULL,
	"image" text,
	CONSTRAINT "food_menu_food_store_id_user_id_pk" PRIMARY KEY("food_store_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "food_stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"store_name" varchar(255) NOT NULL,
	"description" text,
	"address" text NOT NULL,
	"phone" varchar(15) NOT NULL,
	"image" text,
	"instagram_link" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "food_stores_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "post_guests" (
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"group_size" integer NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "post_guests_post_id_user_id_pk" PRIMARY KEY("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"gender" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"max_guests" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"host_date" date DEFAULT now() NOT NULL,
	"iftar_type" text NOT NULL,
	CONSTRAINT "posts_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"phone" varchar(15) NOT NULL,
	"last_activity_date" date DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "food_menu" ADD CONSTRAINT "food_menu_food_store_id_food_stores_id_fk" FOREIGN KEY ("food_store_id") REFERENCES "public"."food_stores"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "food_menu" ADD CONSTRAINT "food_menu_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "food_stores" ADD CONSTRAINT "food_stores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "post_guests" ADD CONSTRAINT "post_guests_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "post_guests" ADD CONSTRAINT "post_guests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;