ALTER TABLE "User" ADD COLUMN "email_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "email_verification_token" text;