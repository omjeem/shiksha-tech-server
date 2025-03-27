CREATE TABLE "attendenceTable" (
	"id" uuid PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"studentId" uuid NOT NULL,
	"classId" uuid,
	"sectionId" uuid,
	"schoolId" uuid NOT NULL,
	"date" date NOT NULL,
	"status" "attendence" NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "fees" (
	"id" uuid PRIMARY KEY NOT NULL,
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
CREATE TABLE "classSection" (
	"id" uuid PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"schoolId" uuid NOT NULL,
	"classId" uuid NOT NULL,
	"sectionName" varchar(5) NOT NULL,
	"totalStudent" integer NOT NULL,
	"classMonitorId" uuid NOT NULL,
	"classTeacherId" uuid NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "classSubject" (
	"id" uuid PRIMARY KEY NOT NULL,
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
CREATE TABLE "classSubjectTeacher" (
	"id" uuid PRIMARY KEY NOT NULL,
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
CREATE TABLE "class" (
	"id" uuid PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"schoolId" uuid NOT NULL,
	"className" "className" NOT NULL,
	"totalSection" integer NOT NULL,
	"totalStudent" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "dueFees" (
	"id" uuid PRIMARY KEY NOT NULL,
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
CREATE TABLE "feesPayment" (
	"id" uuid PRIMARY KEY NOT NULL,
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
CREATE TABLE "schoolStaff" (
	"id" uuid PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"schoolId" uuid NOT NULL,
	"schoolStaffRole" "schoolStaffRole" NOT NULL,
	"joiningDate" date NOT NULL,
	"salary" integer NOT NULL,
	"isDeleted" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "schoolStaff_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "school" (
	"id" uuid PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"schoolName" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"websiteLink" varchar(255),
	"contactNumber" varchar(15),
	"contactEmail" varchar(255) NOT NULL,
	"superAdminName" varchar(255) NOT NULL,
	"superAdminPassword" varchar(255) NOT NULL,
	"superAdminEmail" varchar(255) NOT NULL,
	"superAdminContact" varchar(15),
	"totalStudents" integer DEFAULT 0,
	"totalTeachers" integer DEFAULT 0,
	"totalClasses" integer DEFAULT 0,
	"isDeleted" boolean DEFAULT false,
	"isVerified" boolean DEFAULT false,
	"board" "board" NOT NULL,
	"otherBoard" varchar(255),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "school_contactEmail_unique" UNIQUE("contactEmail"),
	CONSTRAINT "school_superAdminEmail_unique" UNIQUE("superAdminEmail")
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" uuid PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"schoolId" uuid NOT NULL,
	"classId" uuid,
	"isDeleted" boolean DEFAULT false,
	"admissionClass" integer NOT NULL,
	"admissionSection" varchar(5) NOT NULL,
	"admissionYear" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "student_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "attendenceTable" ADD CONSTRAINT "attendenceTable_studentId_student_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."student"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendenceTable" ADD CONSTRAINT "attendenceTable_classId_class_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendenceTable" ADD CONSTRAINT "attendenceTable_sectionId_classSection_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."classSection"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendenceTable" ADD CONSTRAINT "attendenceTable_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fees" ADD CONSTRAINT "fees_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fees" ADD CONSTRAINT "fees_classId_class_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classSection" ADD CONSTRAINT "classSection_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classSection" ADD CONSTRAINT "classSection_classId_class_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classSection" ADD CONSTRAINT "classSection_classMonitorId_student_id_fk" FOREIGN KEY ("classMonitorId") REFERENCES "public"."student"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classSection" ADD CONSTRAINT "classSection_classTeacherId_schoolStaff_id_fk" FOREIGN KEY ("classTeacherId") REFERENCES "public"."schoolStaff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classSubject" ADD CONSTRAINT "classSubject_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classSubject" ADD CONSTRAINT "classSubject_classId_class_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classSubject" ADD CONSTRAINT "classSubject_sectionId_classSection_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."classSection"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classSubject" ADD CONSTRAINT "classSubject_teacherId_schoolStaff_id_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."schoolStaff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classSubjectTeacher" ADD CONSTRAINT "classSubjectTeacher_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classSubjectTeacher" ADD CONSTRAINT "classSubjectTeacher_classId_class_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classSubjectTeacher" ADD CONSTRAINT "classSubjectTeacher_sectionId_classSection_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."classSection"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classSubjectTeacher" ADD CONSTRAINT "classSubjectTeacher_subjectId_classSubject_id_fk" FOREIGN KEY ("subjectId") REFERENCES "public"."classSubject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classSubjectTeacher" ADD CONSTRAINT "classSubjectTeacher_teacherId_schoolStaff_id_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."schoolStaff"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class" ADD CONSTRAINT "class_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dueFees" ADD CONSTRAINT "dueFees_studentId_student_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dueFees" ADD CONSTRAINT "dueFees_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dueFees" ADD CONSTRAINT "dueFees_classId_class_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dueFees" ADD CONSTRAINT "dueFees_sectionId_classSection_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."classSection"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dueFees" ADD CONSTRAINT "dueFees_feesId_fees_id_fk" FOREIGN KEY ("feesId") REFERENCES "public"."fees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feesPayment" ADD CONSTRAINT "feesPayment_studentId_student_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feesPayment" ADD CONSTRAINT "feesPayment_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feesPayment" ADD CONSTRAINT "feesPayment_classId_class_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feesPayment" ADD CONSTRAINT "feesPayment_sectionId_classSection_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."classSection"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feesPayment" ADD CONSTRAINT "feesPayment_feesId_fees_id_fk" FOREIGN KEY ("feesId") REFERENCES "public"."fees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schoolStaff" ADD CONSTRAINT "schoolStaff_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_schoolId_school_id_fk" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_classId_class_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE no action ON UPDATE no action;