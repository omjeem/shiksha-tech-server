ALTER TABLE "section" ALTER COLUMN "totalStudent" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "section" ALTER COLUMN "classMonitorId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "section" ALTER COLUMN "classTeacherId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "section" ADD CONSTRAINT "unique_section" UNIQUE("sectionName","schoolId");