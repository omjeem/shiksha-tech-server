ALTER TABLE "student" ALTER COLUMN "classId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "student" ALTER COLUMN "sectionId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN "dob" date;