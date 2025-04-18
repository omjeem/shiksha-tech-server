ALTER TABLE "student" DROP CONSTRAINT "student_email_unique";--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "email_unique" UNIQUE("email","schoolId");