CREATE TYPE "public"."status" AS ENUM('pending', 'complete');--> statement-breakpoint
CREATE TABLE "bookmark_tags" (
	"bookmark_id" integer,
	"tag_id" integer,
	CONSTRAINT "bookmark_tags_bookmark_id_tag_id_pk" PRIMARY KEY("bookmark_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" "status" NOT NULL,
	"title" text,
	"description" text,
	"image" text,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
