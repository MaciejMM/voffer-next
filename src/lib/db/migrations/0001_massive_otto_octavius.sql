ALTER TABLE "freights" ALTER COLUMN "raw_form_data" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "freights" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "freights" DROP COLUMN "capacity";--> statement-breakpoint
ALTER TABLE "freights" DROP COLUMN "loading_meters";--> statement-breakpoint
ALTER TABLE "freights" DROP COLUMN "reference_number";--> statement-breakpoint
ALTER TABLE "freights" DROP COLUMN "requirements";--> statement-breakpoint
ALTER TABLE "freights" DROP COLUMN "loading_place";--> statement-breakpoint
ALTER TABLE "freights" DROP COLUMN "unloading_place";--> statement-breakpoint
ALTER TABLE "freights" DROP COLUMN "status";