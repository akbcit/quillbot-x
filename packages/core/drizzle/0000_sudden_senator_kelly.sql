CREATE TABLE IF NOT EXISTS "posts" (
	"title" varchar(256) NOT NULL,
	"author_email" varchar(256) NOT NULL,
	"author_full_name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"post" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"author_pic" text,
	"post_thumb" text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_idx" ON "posts" ("title");