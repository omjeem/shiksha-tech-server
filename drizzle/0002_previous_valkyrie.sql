ALTER TABLE "school" ALTER COLUMN "websiteLink" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "school" ALTER COLUMN "contactNumber" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "school" ALTER COLUMN "superAdminContact" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "school" ADD CONSTRAINT "school_websiteLink_unique" UNIQUE("websiteLink");--> statement-breakpoint
ALTER TABLE "school" ADD CONSTRAINT "school_contactNumber_unique" UNIQUE("contactNumber");--> statement-breakpoint
ALTER TABLE "school" ADD CONSTRAINT "school_superAdminContact_unique" UNIQUE("superAdminContact");