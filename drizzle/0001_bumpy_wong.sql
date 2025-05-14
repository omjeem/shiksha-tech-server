ALTER TYPE "public"."schoolStaffRoleEnum" ADD VALUE 'STUDENT';--> statement-breakpoint
ALTER TYPE "public"."schoolStaffRoleEnum" ADD VALUE 'PARENTS';--> statement-breakpoint
ALTER TABLE "section" DROP CONSTRAINT "unique_section";--> statement-breakpoint
ALTER TABLE "section" ADD CONSTRAINT "unique_section" UNIQUE("sectionName","classId");