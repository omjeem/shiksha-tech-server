CREATE TYPE "public"."attendenceEnum" AS ENUM('PRESENT', 'ABSENT', 'LEAVE', 'MEDICAL');--> statement-breakpoint
CREATE TYPE "public"."classNameEnum" AS ENUM('PLAYGROUP', 'NURSERY', 'LKG', 'UKG', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE');--> statement-breakpoint
CREATE TYPE "public"."schoolBoardEnum" AS ENUM('CBSE', 'ICSE', 'STATE', 'IB');--> statement-breakpoint
CREATE TYPE "public"."schoolStaffRoleEnum" AS ENUM('SUPER_ADMIN', 'TEACHER', 'ADMIN', 'ACCOUNTANT', 'MANAGER', 'LIBRARIAN', 'PEON', 'DRIVER', 'SECURITY', 'CLEANER', 'GATEKEEPER', 'GARDENER', 'COOK', 'HELPER');--> statement-breakpoint
CREATE TABLE "classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serial" serial NOT NULL,
	"schoolId" uuid NOT NULL,
	"className" "classNameEnum" NOT NULL,
	"totalSection" integer NOT NULL,
	"totalStudent" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "unique_class" UNIQUE("className","schoolId")
);
--> statement-breakpoint
CREATE TABLE "dues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serial" serial NOT NULL,
	"studentId" uuid NOT NULL,
	"schoolId" uuid NOT NULL,
	"classId" uuid NOT NULL,
	"sectionId" uuid NOT NULL,
	"feesId" uuid NOT NULL,
	"amountLeft" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "fees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serial" serial NOT NULL,
	"schoolId" uuid NOT NULL,
	"classId" uuid NOT NULL,
	"tutionFees" integer DEFAULT 0,
	"admissionFees" integer DEFAULT 0,
	"examinationFees" integer DEFAULT 0,
	"sportsFees" integer DEFAULT 0,
	"libraryFees" integer DEFAULT 0,
	"computerFees" integer DEFAULT 0,
	"transportFees" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serial" serial NOT NULL,
	"studentId" uuid NOT NULL,
	"schoolId" uuid NOT NULL,
	"classId" uuid NOT NULL,
	"sectionId" uuid NOT NULL,
	"feesId" uuid NOT NULL,
	"amountPaid" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "school" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serial" serial NOT NULL,
	"schoolName" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"websiteLink" varchar(255) NOT NULL,
	"contactNumber" varchar(15) NOT NULL,
	"contactEmail" varchar(255) NOT NULL,
	"superAdminName" varchar(255) NOT NULL,
	"superAdminPassword" varchar(255) NOT NULL,
	"superAdminEmail" varchar(255) NOT NULL,
	"superAdminContact" varchar(15) NOT NULL,
	"totalStudents" integer DEFAULT 0,
	"totalTeachers" integer DEFAULT 0,
	"totalClasses" integer DEFAULT 0,
	"isDeleted" boolean DEFAULT false,
	"isVerified" boolean DEFAULT false,
	"board" "schoolBoardEnum" NOT NULL,
	"otherBoard" varchar(255),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "school_websiteLink_unique" UNIQUE("websiteLink"),
	CONSTRAINT "school_contactNumber_unique" UNIQUE("contactNumber"),
	CONSTRAINT "school_contactEmail_unique" UNIQUE("contactEmail"),
	CONSTRAINT "school_superAdminEmail_unique" UNIQUE("superAdminEmail"),
	CONSTRAINT "school_superAdminContact_unique" UNIQUE("superAdminContact")
);
--> statement-breakpoint
CREATE TABLE "section" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serial" serial NOT NULL,
	"schoolId" uuid NOT NULL,
	"classId" uuid NOT NULL,
	"sectionName" varchar(5) NOT NULL,
	"totalStudent" integer DEFAULT 0 NOT NULL,
	"classMonitorId" uuid,
	"classTeacherId" uuid,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "unique_section" UNIQUE("sectionName","schoolId")
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serial" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"schoolId" uuid NOT NULL,
	"role" "schoolStaffRoleEnum" NOT NULL,
	"joiningDate" date NOT NULL,
	"salary" integer NOT NULL,
	"isDeleted" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "staff_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "staffAttendence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serial" serial NOT NULL,
	"staffId" uuid,
	"schoolId" uuid,
	"date" date NOT NULL,
	"status" "attendenceEnum" NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serial" serial NOT NULL,
	"srNo" integer NOT NULL,
	"name" varchar(255),
	"rollNo" integer,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"schoolId" uuid NOT NULL,
	"classId" uuid,
	"sectionId" uuid,
	"isDeleted" boolean DEFAULT false,
	"admissionClass" varchar(5),
	"admissionSection" varchar(5),
	"admissionDate" date,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "student_email_unique" UNIQUE("email"),
	CONSTRAINT "srNo_unique" UNIQUE("srNo","schoolId"),
	CONSTRAINT "srNo_check" CHECK ("student"."srNo" > 0)
);
--> statement-breakpoint
CREATE TABLE "studentAttendence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serial" serial NOT NULL,
	"studentId" uuid NOT NULL,
	"classId" uuid,
	"sectionId" uuid,
	"schoolId" uuid NOT NULL,
	"date" date NOT NULL,
	"status" "attendenceEnum" NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "subject" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serial" serial NOT NULL,
	"schoolId" uuid NOT NULL,
	"classId" uuid NOT NULL,
	"sectionId" uuid,
	"subjectName" varchar(255) NOT NULL,
	"subjectCode" varchar(10) NOT NULL,
	"teacherId" uuid NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "subjectTeacher" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serial" serial NOT NULL,
	"schoolId" uuid NOT NULL,
	"classId" uuid NOT NULL,
	"sectionId" uuid,
	"subjectId" uuid NOT NULL,
	"teacherId" uuid NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dues" ADD CONSTRAINT "dues_studentId_student_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dues" ADD CONSTRAINT "dues_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dues" ADD CONSTRAINT "dues_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dues" ADD CONSTRAINT "dues_sectionId_section_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dues" ADD CONSTRAINT "dues_feesId_fees_id_fk" FOREIGN KEY ("feesId") REFERENCES "public"."fees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fees" ADD CONSTRAINT "fees_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fees" ADD CONSTRAINT "fees_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_studentId_student_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_sectionId_section_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_feesId_fees_id_fk" FOREIGN KEY ("feesId") REFERENCES "public"."fees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section" ADD CONSTRAINT "section_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section" ADD CONSTRAINT "section_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section" ADD CONSTRAINT "section_classMonitorId_student_id_fk" FOREIGN KEY ("classMonitorId") REFERENCES "public"."student"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section" ADD CONSTRAINT "section_classTeacherId_staff_id_fk" FOREIGN KEY ("classTeacherId") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staffAttendence" ADD CONSTRAINT "staffAttendence_staffId_staff_id_fk" FOREIGN KEY ("staffId") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staffAttendence" ADD CONSTRAINT "staffAttendence_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_sectionId_section_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."section"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentAttendence" ADD CONSTRAINT "studentAttendence_studentId_student_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."student"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentAttendence" ADD CONSTRAINT "studentAttendence_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentAttendence" ADD CONSTRAINT "studentAttendence_sectionId_section_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."section"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentAttendence" ADD CONSTRAINT "studentAttendence_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject" ADD CONSTRAINT "subject_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject" ADD CONSTRAINT "subject_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject" ADD CONSTRAINT "subject_sectionId_section_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."section"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject" ADD CONSTRAINT "subject_teacherId_staff_id_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjectTeacher" ADD CONSTRAINT "subjectTeacher_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjectTeacher" ADD CONSTRAINT "subjectTeacher_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjectTeacher" ADD CONSTRAINT "subjectTeacher_sectionId_section_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."section"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjectTeacher" ADD CONSTRAINT "subjectTeacher_subjectId_subject_id_fk" FOREIGN KEY ("subjectId") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjectTeacher" ADD CONSTRAINT "subjectTeacher_teacherId_staff_id_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;