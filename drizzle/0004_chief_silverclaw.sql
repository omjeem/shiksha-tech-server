ALTER TABLE "student" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN "srNo" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN "sectionId" uuid;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_sectionId_section_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."section"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "srNo_unique" UNIQUE("srNo","schoolId");--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "srNo_check" CHECK ("student"."srNo" > 0);