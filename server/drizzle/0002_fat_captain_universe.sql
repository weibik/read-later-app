ALTER TYPE "public"."status" ADD VALUE 'failed';--> statement-breakpoint
ALTER TABLE "bookmark_tags" ALTER COLUMN "bookmark_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bookmark_tags" ALTER COLUMN "tag_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "bookmark_tags" ADD CONSTRAINT "bookmark_tags_bookmark_id_bookmarks_id_fk" FOREIGN KEY ("bookmark_id") REFERENCES "public"."bookmarks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark_tags" ADD CONSTRAINT "bookmark_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;