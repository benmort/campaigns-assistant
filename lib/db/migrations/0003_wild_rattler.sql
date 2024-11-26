CREATE TABLE IF NOT EXISTS "SystemPrompt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" json NOT NULL
);
