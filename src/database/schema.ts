import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { attendenceEnum, classNameEnum, schoolBoardEnum, schoolStaffRoleEnum } from './enums';

/**
 * Common timestamp fields applied to all tables
 * - updated_at: Tracks when a record was last modified
 * - created_at: Records when the entry was first created (automatically set)
 * - deleted_at: Used for soft deletion pattern (null indicates active record)
 */
const timeStamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

/**
 * School Table: Primary entity representing an educational institution
 * 
 * This is the root table in the schema hierarchy. All other entities
 * (students, staff, classes, etc.) belong to a school.
 */
export const schoolTable = pgTable('school', {
  id: uuid().primaryKey(),
  serial: serial(),
  schoolName: varchar({ length: 255 }).notNull(),
  address: varchar({ length: 255 }).notNull(),
  websiteLink: varchar({ length: 255 }),
  contactNumber: varchar({ length: 15 }),
  contactEmail: varchar({ length: 255 }).notNull().unique(),
  superAdminName: varchar({ length: 255 }).notNull(),
  superAdminPassword: varchar({ length: 255 }).notNull(),
  superAdminEmail: varchar({ length: 255 }).unique().notNull(),
  superAdminContact: varchar({ length: 15 }),
  totalStudents: integer().default(0),
  totalTeachers: integer().default(0),
  totalClasses: integer().default(0),
  isDeleted: boolean().default(false),
  isVerified: boolean().default(false),
  board: schoolBoardEnum("board").notNull(),
  otherBoard: varchar({ length: 255 }),
  ...timeStamps
});

/**
 * Class Table: Represents grade levels within a school
 * 
 * Relationships:
 * - Many-to-One with School: Each class belongs to one school
 *   (schoolId references schoolTable.id with cascade delete)
 * - One-to-Many with ClassSection: A class can have multiple sections
 * - One-to-Many with ClassSubject: A class can have multiple subjects
 * - One-to-Many with ClassFees: Fee structure is defined per class
 * - One-to-Many with Student: A class can have multiple students
 */
export const classTable = pgTable('class', {
  id: uuid().primaryKey(),
  serial: serial(),
  schoolId: uuid()
    .references(() => schoolTable.id, { onDelete: 'cascade' })
    .notNull(),
  clasName: classNameEnum("className").notNull(),
  totalSection: integer().notNull(),
  totalStudent: integer().notNull(),
  ...timeStamps
});

/**
 * Student Table: Represents students enrolled in a school
 * 
 * Relationships:
 * - Many-to-One with School: Each student belongs to exactly one school
 *   (schoolId references schoolTable.id with cascade delete)
 * - Many-to-One with Class: Each student is assigned to a class
 *   (classId references classTable.id)
 * - One-to-Many with Attendance: A student can have multiple attendance records
 * - One-to-Many with DueFees: A student can have multiple due fee records
 * - One-to-Many with FeesPayment: A student can make multiple fee payments
 */
export const studentTable = pgTable('student', {
  id: uuid().primaryKey(),
  serial: serial(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  schoolId: uuid()
    .references(() => schoolTable.id, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid().references(() => classTable.id),
  isDeleted: boolean().default(false),
  admissionClass: integer().notNull(),
  admissionSection: varchar({ length: 5 }).notNull(),
  admissionYear: integer().notNull(),
  ...timeStamps
});

/**
 * School Staff Table: Represents faculty and administrative staff
 * 
 * Relationships:
 * - Many-to-One with School: Each staff member belongs to one school
 *   (schoolId references +.id with cascade delete)
 * - One-to-Many with ClassSection: A staff member can be a class teacher for multiple sections
 * - One-to-Many with ClassSubject: A staff member can teach multiple subjects
 * - One-to-Many with ClassSubjectTeacher: Tracks specific teacher assignments to subjects
 */
export const schoolStaffTable = pgTable('schoolStaff', {
  id: uuid().primaryKey(),
  serial: serial(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  schoolId: uuid()
    .references(() => schoolTable.id, { onDelete: 'cascade' })
    .notNull(),
  role: schoolStaffRoleEnum("schoolStaffRole").notNull(),
  joiningDate: date().notNull(),
  salary: integer().notNull(),
  isDeleted: boolean().default(false),
  ...timeStamps
});

/**
 * Class Section Table: Represents divisions within a class (e.g., Class 10-A, 10-B)
 * 
 * Relationships:
 * - Many-to-One with School: Each section belongs to one school
 *   (schoolId references schoolTable.id with cascade delete)
 * - Many-to-One with Class: Each section belongs to one class
 *   (classId references classTable.id with cascade delete)
 * - Many-to-One with Student: Each section has a class monitor
 *   (classMonitorId references studentTable.id)
 * - Many-to-One with SchoolStaff: Each section has a class teacher
 *   (classTeacherId references schoolStaffTable.id)
 * - One-to-Many with ClassSubject: Section-specific subjects
 * - One-to-Many with DueFees: Section-specific fee records
 * - One-to-Many with FeesPayment: Section-specific payment records
 */
export const classSectionTable = pgTable('classSection', {
  id: uuid().primaryKey(),
  serial: serial(),
  schoolId: uuid()
    .references(() => schoolTable.id, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classTable.id, { onDelete: 'cascade' })
    .notNull(),
  sectionName: varchar({ length: 5 }).notNull(),
  totalStudent: integer().notNull(),
  classMonitorId: uuid()
    .references(() => studentTable.id)
    .notNull(),
  classTeacherId: uuid()
    .references(() => schoolStaffTable.id)
    .notNull(),
  ...timeStamps
});

/**
 * Attendance Table: Tracks daily student attendance
 * 
 * Relationships:
 * - Many-to-One with Student: Each attendance record belongs to one student
 *   (studentId references studentTable.id)
 * - Many-to-One with School: Each attendance record is associated with one school
 *   (schoolId references schoolTable.id with cascade delete)
 */
export const attendenceTable = pgTable('attendenceTable', {
  id: uuid().primaryKey(),
  serial: serial(),
  studentId: uuid()
    .references(() => studentTable.id)
    .notNull(),
  classId: uuid().references(() => classTable.id),
  sectionId: uuid().references(() => classSectionTable.id),
  schoolId: uuid()
    .references(() => schoolTable.id, { onDelete: 'cascade' })
    .notNull(),
  date: date().notNull(),
  status: attendenceEnum().notNull(),
  ...timeStamps
});

/**
 * Class Subject Table: Represents subjects taught in specific classes/sections
 * 
 * Relationships:
 * - Many-to-One with School: Each subject entry belongs to one school
 *   (schoolId references schoolTable.id with cascade delete)
 * - Many-to-One with Class: Each subject is taught in a specific class
 *   (classId references classTable.id with cascade delete)
 * - Many-to-One with ClassSection: Optional - subject may be specific to a section
 *   (sectionId references classSectionTable.id)
 * - Many-to-One with SchoolStaff: Each subject has a designated teacher
 *   (teacherId references schoolStaffTable.id)
 * - One-to-Many with ClassSubjectTeacher: Tracks teacher assignments for this subject
 */
export const classSubjectTable = pgTable('classSubject', {
  id: uuid().primaryKey(),
  serial: serial(),
  schoolId: uuid()
    .references(() => schoolTable.id, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classTable.id, { onDelete: 'cascade' })
    .notNull(),
  sectionId: uuid().references(() => classSectionTable.id),
  subjectName: varchar({ length: 255 }).notNull(),
  subjectCode: varchar({ length: 10 }).notNull(),
  teacherId: uuid()
    .references(() => schoolStaffTable.id)
    .notNull(),
  ...timeStamps
});

/**
 * Class Subject Teacher Table: Junction table establishing many-to-many relationship
 * between teachers and subjects within specific class/section contexts
 * 
 * Relationships:
 * - Many-to-One with School: Each relationship belongs to one school
 *   (schoolId references schoolTable.id with cascade delete)
 * - Many-to-One with Class: Each relationship is within a specific class
 *   (classId references classTable.id with cascade delete)
 * - Many-to-One with ClassSection: Optional - may be specific to a section
 *   (sectionId references classSectionTable.id)
 * - Many-to-One with ClassSubject: References the specific subject
 *   (subjectId references classSubjectTable.id with cascade delete)
 * - Many-to-One with SchoolStaff: References the specific teacher
 *   (teacherId references schoolStaffTable.id with cascade delete)
 */
export const classSubjectTeacherTable = pgTable('classSubjectTeacher', {
  id: uuid().primaryKey(),
  serial: serial(),
  schoolId: uuid()
    .references(() => schoolTable.id, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classTable.id, { onDelete: 'cascade' })
    .notNull(),
  sectionId: uuid().references(() => classSectionTable.id),
  subjectId: uuid()
    .references(() => classSubjectTable.id, { onDelete: 'cascade' })
    .notNull(),
  teacherId: uuid()
    .references(() => schoolStaffTable.id, { onDelete: 'cascade' })
    .notNull(),
  ...timeStamps
});

/**
 * Class Fees Table: Defines fee structure for each class
 * 
 * Relationships:
 * - Many-to-One with School: Each fee structure belongs to one school
 *   (schoolId references schoolTable.id with cascade delete)
 * - Many-to-One with Class: Each fee structure is for a specific class
 *   (classId references classTable.id with cascade delete)
 * - One-to-Many with DueFees: Records of pending fees based on this structure
 * - One-to-Many with FeesPayment: Payment records against this fee structure
 */
export const classFeesTable = pgTable('fees', {
  id: uuid().primaryKey(),
  serial: serial(),
  schoolId: uuid()
    .references(() => schoolTable.id, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classTable.id, { onDelete: 'cascade' })
    .notNull(),
  tutionFees: integer().default(0),
  admissionFees: integer().default(0),
  examinationFees: integer().default(0),
  sportsFees: integer().default(0),
  libraryFees: integer().default(0),
  computerFees: integer().default(0),
  transportFees: integer().default(0),
  ...timeStamps
});

/**
 * Due Fees Table: Tracks outstanding fee balances for students
 * 
 * Relationships:
 * - Many-to-One with Student: Each due fee record belongs to one student
 *   (studentId references studentTable.id with cascade delete)
 * - Many-to-One with School: Each due fee record is associated with one school
 *   (schoolId references schoolTable.id with cascade delete)
 * - Many-to-One with Class: Each due fee is for a specific class
 *   (classId references classTable.id with cascade delete)
 * - Many-to-One with ClassSection: Each due fee is for a specific section
 *   (sectionId references classSectionTable.id with cascade delete)
 * - Many-to-One with ClassFees: References the fee structure this is based on
 *   (feesId references classFeesTable.id with cascade delete)
 */
export const dueFeesTable = pgTable('dueFees', {
  id: uuid().primaryKey(),
  serial: serial(),
  studentId: uuid()
    .references(() => studentTable.id, { onDelete: 'cascade' })
    .notNull(),
  schoolId: uuid()
    .references(() => schoolTable.id, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classTable.id, { onDelete: 'cascade' })
    .notNull(),
  sectionId: uuid()
    .references(() => classSectionTable.id, { onDelete: 'cascade' })
    .notNull(),
  feesId: uuid()
    .references(() => classFeesTable.id, { onDelete: 'cascade' })
    .notNull(),
  amountLeft: integer().notNull(),
  ...timeStamps
});

/**
 * Fees Payment Table: Records fee payments made by students
 * 
 * Relationships:
 * - Many-to-One with Student: Each payment belongs to one student
 *   (studentId references studentTable.id with cascade delete)
 * - Many-to-One with School: Each payment is associated with one school
 *   (schoolId references schoolTable.id with cascade delete)
 * - Many-to-One with Class: Each payment is for a specific class
 *   (classId references classTable.id with cascade delete)
 * - Many-to-One with ClassSection: Each payment is for a specific section
 *   (sectionId references classSectionTable.id with cascade delete)
 * - Many-to-One with ClassFees: References the fee structure this payment is against
 *   (feesId references classFeesTable.id with cascade delete)
 */
export const feesPaymentTable = pgTable('feesPayment', {
  id: uuid().primaryKey(),
  serial: serial(),
  studentId: uuid()
    .references(() => studentTable.id, { onDelete: 'cascade' })
    .notNull(),
  schoolId: uuid()
    .references(() => schoolTable.id, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classTable.id, { onDelete: 'cascade' })
    .notNull(),
  sectionId: uuid()
    .references(() => classSectionTable.id, { onDelete: 'cascade' })
    .notNull(),
  feesId: uuid()
    .references(() => classFeesTable.id, { onDelete: 'cascade' })
    .notNull(),
  amountPaid: integer().notNull(),
  ...timeStamps
});

/**
 * Define explicit Drizzle ORM relations between tables
 * 
 * These relation definitions allow for type-safe queries using Drizzle ORM
 * and enable proper JOIN operations between tables.
 */

// School Relations
export const schoolRelations = relations(schoolTable, ({ one, many }: { one: any; many: any }) => ({
  // One school has many students
  students: many(studentTable),

  // One school has many staff members
  staffMembers: many(schoolStaffTable),

  // One school has many classes
  classes: many(classTable),

  // One school has many class sections (through classes)
  classSections: many(classSectionTable),

  // One school has many attendance records
  attendanceRecords: many(attendenceTable),

  // One school has many class subjects
  classSubjects: many(classSubjectTable),

  // One school has many class-subject-teacher assignments
  classSubjectTeachers: many(classSubjectTeacherTable),

  // One school has many class fee structures
  classFees: many(classFeesTable),

  // One school has many due fee records
  dueFees: many(dueFeesTable),

  // One school has many fee payment records
  feePayments: many(feesPaymentTable),
}));

// Class Relations
export const classRelations = relations(classTable, ({ one, many }: { one: any; many: any }) => ({
  // Many classes belong to one school
  school: one(schoolTable, {
    fields: [classTable.schoolId],
    references: [schoolTable.id],
  }),

  // One class has many students
  students: many(studentTable),

  // One class has many sections
  sections: many(classSectionTable),

  // One class has many subjects
  subjects: many(classSubjectTable),

  // One class has a fee structure
  fees: many(classFeesTable),

  // One class has many due fee records
  dueFees: many(dueFeesTable),

  // One class has many fee payment records
  feePayments: many(feesPaymentTable),
}));

// Student Relations
export const studentRelations = relations(studentTable, ({ one, many }: { one: any; many: any }) => ({
  // Many students belong to one school
  school: one(schoolTable, {
    fields: [studentTable.schoolId],
    references: [schoolTable.id],
  }),

  // Many students are assigned to one class
  class: one(classTable, {
    fields: [studentTable.classId],
    references: [classTable.id],
  }),

  // One student can be a class monitor for multiple sections
  monitoringSections: many(classSectionTable, { relationName: "classMonitor" }),

  // One student has many attendance records
  attendanceRecords: many(attendenceTable),

  // One student has many due fee records
  dueFees: many(dueFeesTable),

  // One student has many fee payment records
  feePayments: many(feesPaymentTable),
}));

// School Staff Relations
export const schoolStaffRelations = relations(schoolStaffTable, ({ one, many }: { one: any; many: any }) => ({
  // Many staff members belong to one school
  school: one(schoolTable, {
    fields: [schoolStaffTable.schoolId],
    references: [schoolTable.id],
  }),

  // One staff member can be a class teacher for multiple sections
  teachingSections: many(classSectionTable, { relationName: "classTeacher" }),

  // One staff member can teach multiple subjects
  teachingSubjects: many(classSubjectTable, { relationName: "subjectTeacher" }),

  // One staff member can have multiple subject assignments
  subjectTeacherAssignments: many(classSubjectTeacherTable),
}));

// Class Section Relations
export const classSectionRelations = relations(classSectionTable, ({ one, many }: { one: any; many: any }) => ({
  // Many sections belong to one school
  school: one(schoolTable, {
    fields: [classSectionTable.schoolId],
    references: [schoolTable.id],
  }),

  // Many sections belong to one class
  class: one(classTable, {
    fields: [classSectionTable.classId],
    references: [classTable.id],
  }),

  // Many sections have one class monitor (student)
  classMonitor: one(studentTable, {
    fields: [classSectionTable.classMonitorId],
    references: [studentTable.id],
    relationName: "classMonitor",
  }),

  // Many sections have one class teacher (staff)
  classTeacher: one(schoolStaffTable, {
    fields: [classSectionTable.classTeacherId],
    references: [schoolStaffTable.id],
    relationName: "classTeacher",
  }),

  // One section can have many section-specific subjects
  subjects: many(classSubjectTable),

  // One section has many due fee records
  dueFees: many(dueFeesTable),

  // One section has many fee payment records
  feePayments: many(feesPaymentTable),
}));

// Attendance Relations
export const attendanceRelations = relations(attendenceTable, ({ one }: { one: any }) => ({
  // Many attendance records belong to one school
  school: one(schoolTable, {
    fields: [attendenceTable.schoolId],
    references: [schoolTable.id],
  }),

  // Many attendance records belong to one student
  student: one(studentTable, {
    fields: [attendenceTable.studentId],
    references: [studentTable.id],
  }),
}));

// Class Subject Relations
export const classSubjectRelations = relations(classSubjectTable, ({ one, many }: { one: any; many: any }) => ({
  // Many subjects belong to one school
  school: one(schoolTable, {
    fields: [classSubjectTable.schoolId],
    references: [schoolTable.id],
  }),

  // Many subjects belong to one class
  class: one(classTable, {
    fields: [classSubjectTable.classId],
    references: [classTable.id],
  }),

  // Many subjects may be specific to one section (optional)
  section: one(classSectionTable, {
    fields: [classSubjectTable.sectionId],
    references: [classSectionTable.id],
  }),

  // Many subjects are taught by one teacher
  teacher: one(schoolStaffTable, {
    fields: [classSubjectTable.teacherId],
    references: [schoolStaffTable.id],
    relationName: "subjectTeacher",
  }),

  // One subject can have multiple teacher assignments
  teacherAssignments: many(classSubjectTeacherTable),
}));

// Class Subject Teacher Relations (Junction Table)
export const classSubjectTeacherRelations = relations(classSubjectTeacherTable, ({ one }: { one: any }) => ({
  // Many assignments belong to one school
  school: one(schoolTable, {
    fields: [classSubjectTeacherTable.schoolId],
    references: [schoolTable.id],
  }),

  // Many assignments belong to one class
  class: one(classTable, {
    fields: [classSubjectTeacherTable.classId],
    references: [classTable.id],
  }),

  // Many assignments may be specific to one section (optional)
  section: one(classSectionTable, {
    fields: [classSubjectTeacherTable.sectionId],
    references: [classSectionTable.id],
  }),

  // Many assignments are for one subject
  subject: one(classSubjectTable, {
    fields: [classSubjectTeacherTable.subjectId],
    references: [classSubjectTable.id],
  }),

  // Many assignments are for one teacher
  teacher: one(schoolStaffTable, {
    fields: [classSubjectTeacherTable.teacherId],
    references: [schoolStaffTable.id],
  }),
}));

// Class Fees Relations
export const classFeesRelations = relations(classFeesTable, ({ one, many }: { one: any; many: any }) => ({
  // Many fee structures belong to one school
  school: one(schoolTable, {
    fields: [classFeesTable.schoolId],
    references: [schoolTable.id],
  }),

  // Many fee structures belong to one class
  class: one(classTable, {
    fields: [classFeesTable.classId],
    references: [classTable.id],
  }),

  // One fee structure has many due fee records
  dueFees: many(dueFeesTable),

  // One fee structure has many fee payment records
  feePayments: many(feesPaymentTable),
}));

// Due Fees Relations
export const dueFeesRelations = relations(dueFeesTable, ({ one }: { one: any }) => ({
  // Many due fee records belong to one student
  student: one(studentTable, {
    fields: [dueFeesTable.studentId],
    references: [studentTable.id],
  }),

  // Many due fee records belong to one school
  school: one(schoolTable, {
    fields: [dueFeesTable.schoolId],
    references: [schoolTable.id],
  }),

  // Many due fee records belong to one class
  class: one(classTable, {
    fields: [dueFeesTable.classId],
    references: [classTable.id],
  }),

  // Many due fee records belong to one section
  section: one(classSectionTable, {
    fields: [dueFeesTable.sectionId],
    references: [classSectionTable.id],
  }),

  // Many due fee records are based on one fee structure
  fees: one(classFeesTable, {
    fields: [dueFeesTable.feesId],
    references: [classFeesTable.id],
  }),
}));

// Fees Payment Relations
export const feesPaymentRelations = relations(feesPaymentTable, ({ one }: { one: any }) => ({
  // Many payment records belong to one student
  student: one(studentTable, {
    fields: [feesPaymentTable.studentId],
    references: [studentTable.id],
  }),

  // Many payment records belong to one school
  school: one(schoolTable, {
    fields: [feesPaymentTable.schoolId],
    references: [schoolTable.id],
  }),

  // Many payment records belong to one class
  class: one(classTable, {
    fields: [feesPaymentTable.classId],
    references: [classTable.id],
  }),

  // Many payment records belong to one section
  section: one(classSectionTable, {
    fields: [feesPaymentTable.sectionId],
    references: [classSectionTable.id],
  }),

  // Many payment records are against one fee structure
  fees: one(classFeesTable, {
    fields: [feesPaymentTable.feesId],
    references: [classFeesTable.id],
  }),
}));
