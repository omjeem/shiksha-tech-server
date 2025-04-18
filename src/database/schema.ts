import {
  PgUUID,
  boolean,
  check,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import {
  Attendence_Enum,
  ClassName_Enum,
  SchoolBoard_Enum,
  SchoolStaffRole_Enum,
} from '../utils/interfaces';

export const classNameEnum = pgEnum(
  'classNameEnum',
  Object.values(ClassName_Enum) as [string, ...string[]],
);

export const schoolBoardEnum = pgEnum(
  'schoolBoardEnum',
  Object.values(SchoolBoard_Enum) as [string, ...string[]],
);

export const attendenceEnum = pgEnum(
  'attendenceEnum',
  Object.values(Attendence_Enum) as [string, ...string[]],
);

export const schoolStaffRoleEnum = pgEnum(
  'schoolStaffRoleEnum',
  Object.values(SchoolStaffRole_Enum) as [string, ...string[]],
);

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
};

/**
 * School Table: Primary entity representing an educational institution
 *
 * This is the root table in the schema hierarchy. All other entities
 * (students, staff, classes, etc.) belong to a school.
 */
export const school = pgTable('school', {
  id: uuid().primaryKey().defaultRandom(),
  serial: serial(),
  schoolName: varchar({ length: 255 }).notNull(),
  address: varchar({ length: 255 }).notNull(),
  websiteLink: varchar({ length: 255 }).unique().notNull(),
  contactNumber: varchar({ length: 15 }).unique().notNull(),
  contactEmail: varchar({ length: 255 }).notNull().unique(),
  superAdminName: varchar({ length: 255 }).notNull(),
  superAdminPassword: varchar({ length: 255 }).notNull(),
  superAdminEmail: varchar({ length: 255 }).notNull().unique(),
  superAdminContact: varchar({ length: 15 }).unique().notNull(),
  totalStudents: integer().default(0),
  totalTeachers: integer().default(0),
  totalClasses: integer().default(0),
  isDeleted: boolean().default(false),
  isVerified: boolean().default(false),
  board: schoolBoardEnum('board').notNull(),
  otherBoard: varchar({ length: 255 }),
  ...timeStamps,
});

/**
 * Class Table: Represents grade levels within a school
 *
 * Relationships:
 * - Many-to-One with School: Each class belongs to one school
 *   (schoolId references school.id with cascade delete)
 * - One-to-Many with ClassSection: A class can have multiple sections
 * - One-to-Many with ClassSubject: A class can have multiple subjects
 * - One-to-Many with ClassFees: Fee structure is defined per class
 * - One-to-Many with Student: A class can have multiple students
 */
export const classes = pgTable(
  'classes',
  {
    id: uuid().primaryKey().defaultRandom(),
    serial: serial(),
    schoolId: uuid()
      .references(() => school.id, { onDelete: 'cascade' })
      .notNull(),
    className: classNameEnum('className').notNull(),
    totalSection: integer().notNull(),
    totalStudent: integer().notNull(),
    ...timeStamps,
  },
  (table) => [unique('unique_class').on(table.className, table.schoolId)],
);

/**
 * Student Table: Represents students enrolled in a school
 *
 * Relationships:
 * - Many-to-One with School: Each student belongs to exactly one school
 *   (schoolId references school.id with cascade delete)
 * - Many-to-One with Class: Each student is assigned to a class
 *   (classId references classes.id)
 * - One-to-Many with Attendance: A student can have multiple attendance records
 * - One-to-Many with DueFees: A student can have multiple due fee records
 * - One-to-Many with FeesPayment: A student can make multiple fee payments
 */
export const student = pgTable(
  'student',
  {
    id: uuid().primaryKey().defaultRandom(),
    serial: serial(),
    srNo: integer().notNull(),
    name: varchar({ length: 255 }),
    rollNo: integer(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    schoolId: uuid()
      .references(() => school.id, { onDelete: 'cascade' })
      .notNull(),
    classId: uuid().references(() => classes.id),
    sectionId: uuid().references(() => section.id),
    isDeleted: boolean().default(false),
    admissionClass: varchar({ length: 5 }),
    admissionSection: varchar({ length: 5 }),
    admissionDate: date(),
    ...timeStamps,
  },
  (table) => [
    check('srNo_check', sql`${table.srNo} > 0`),
    unique('srNo_unique').on(table.srNo, table.schoolId),
  ],
);

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
export const staff = pgTable('staff', {
  id: uuid().primaryKey().defaultRandom(),
  serial: serial(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  schoolId: uuid()
    .references(() => school.id, { onDelete: 'cascade' })
    .notNull(),
  role: schoolStaffRoleEnum('role').notNull(),
  joiningDate: date().notNull(),
  salary: integer().notNull(),
  isDeleted: boolean().default(false),
  ...timeStamps,
});

/**
 * Class Section Table: Represents divisions within a class (e.g., Class 10-A, 10-B)
 *
 * Relationships:
 * - Many-to-One with School: Each section belongs to one school
 *   (schoolId references school.id with cascade delete)
 * - Many-to-One with Class: Each section belongs to one class
 *   (classId references classes.id with cascade delete)
 * - Many-to-One with Student: Each section has a class monitor
 *   (classMonitorId references student.id)
 * - Many-to-One with SchoolStaff: Each section has a class teacher
 *   (classTeacherId references staff.id)
 * - One-to-Many with ClassSubject: Section-specific subjects
 * - One-to-Many with DueFees: Section-specific fee records
 * - One-to-Many with FeesPayment: Section-specific payment records
 */
export const section: any = pgTable(
  'section',
  {
    id: uuid().primaryKey().defaultRandom(),
    serial: serial(),
    schoolId: uuid()
      .references(() => school.id, { onDelete: 'cascade' })
      .notNull(),
    classId: uuid()
      .references(() => classes.id, { onDelete: 'cascade' })
      .notNull(),
    sectionName: varchar({ length: 5 }).notNull(),
    totalStudent: integer().notNull().default(0),
    classMonitorId: uuid().references(() => student.id),
    classTeacherId: uuid().references(() => staff.id),
    ...timeStamps,
  },
  (table) => [unique('unique_section').on(table.sectionName, table.schoolId)],
);

/**
 * Attendance Table: Tracks daily student attendance
 *
 * Relationships:
 * - Many-to-One with Student: Each attendance record belongs to one student
 *   (studentId references student.id)
 * - Many-to-One with School: Each attendance record is associated with one school
 *   (schoolId references school.id with cascade delete)
 */
export const studentAttendence = pgTable('studentAttendence', {
  id: uuid().primaryKey().defaultRandom(),
  serial: serial(),
  studentId: uuid()
    .references(() => student.id)
    .notNull(),
  classId: uuid().references(() => classes.id),
  sectionId: uuid().references(() => section.id),
  schoolId: uuid()
    .references(() => school.id, { onDelete: 'cascade' })
    .notNull(),
  date: date().notNull(),
  status: attendenceEnum('status').notNull(),
  ...timeStamps,
});

export const staffAttendence = pgTable('staffAttendence', {
  id: uuid().primaryKey().defaultRandom(),
  serial: serial(),
  staffId: uuid().references(() => staff.id),
  schoolId: uuid().references(() => school.id, { onDelete: 'cascade' }),
  date: date().notNull(),
  status: attendenceEnum('status').notNull(),
  ...timeStamps,
});

/**
 * Class Subject Table: Represents subjects taught in specific classes/sections
 *
 * Relationships:
 * - Many-to-One with School: Each subject entry belongs to one school
 *   (schoolId references school.id with cascade delete)
 * - Many-to-One with Class: Each subject is taught in a specific class
 *   (classId references classes.id with cascade delete)
 * - Many-to-One with ClassSection: Optional - subject may be specific to a section
 *   (sectionId references section.id)
 * - Many-to-One with SchoolStaff: Each subject has a designated teacher
 *   (teacherId references staff.id)
 * - One-to-Many with ClassSubjectTeacher: Tracks teacher assignments for this subject
 */
export const subject = pgTable('subject', {
  id: uuid().primaryKey().defaultRandom(),
  serial: serial(),
  schoolId: uuid()
    .references(() => school.id, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classes.id, { onDelete: 'cascade' })
    .notNull(),
  sectionId: uuid().references(() => section.id),
  subjectName: varchar({ length: 255 }).notNull(),
  subjectCode: varchar({ length: 10 }).notNull(),
  teacherId: uuid()
    .references(() => staff.id)
    .notNull(),
  ...timeStamps,
});

/**
 * Class Subject Teacher Table: Junction table establishing many-to-many relationship
 * between teachers and subjects within specific class/section contexts
 *
 * Relationships:
 * - Many-to-One with School: Each relationship belongs to one school
 *   (schoolId references school.id with cascade delete)
 * - Many-to-One with Class: Each relationship is within a specific class
 *   (classId references classes.id with cascade delete)
 * - Many-to-One with ClassSection: Optional - may be specific to a section
 *   (sectionId references section.id)
 * - Many-to-One with ClassSubject: References the specific subject
 *   (subjectId references subject.id with cascade delete)
 * - Many-to-One with SchoolStaff: References the specific teacher
 *   (teacherId references staff.id with cascade delete)
 */
export const subjectTeacher = pgTable('subjectTeacher', {
  id: uuid().primaryKey().defaultRandom(),
  serial: serial(),
  schoolId: uuid()
    .references(() => school.id, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classes.id, { onDelete: 'cascade' })
    .notNull(),
  sectionId: uuid().references(() => section.id),
  subjectId: uuid()
    .references(() => subject.id, { onDelete: 'cascade' })
    .notNull(),
  teacherId: uuid()
    .references(() => staff.id, { onDelete: 'cascade' })
    .notNull(),
  ...timeStamps,
});

/**
 * Class Fees Table: Defines fee structure for each class
 *
 * Relationships:
 * - Many-to-One with School: Each fee structure belongs to one school
 *   (schoolId references school.id with cascade delete)
 * - Many-to-One with Class: Each fee structure is for a specific class
 *   (classId references classes.id with cascade delete)
 * - One-to-Many with DueFees: Records of pending fees based on this structure
 * - One-to-Many with FeesPayment: Payment records against this fee structure
 */
export const fees = pgTable('fees', {
  id: uuid().primaryKey().defaultRandom(),
  serial: serial(),
  schoolId: uuid()
    .references(() => school.id, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classes.id, { onDelete: 'cascade' })
    .notNull(),
  tutionFees: integer().default(0),
  admissionFees: integer().default(0),
  examinationFees: integer().default(0),
  sportsFees: integer().default(0),
  libraryFees: integer().default(0),
  computerFees: integer().default(0),
  transportFees: integer().default(0),
  ...timeStamps,
});

/**
 * Due Fees Table: Tracks outstanding fee balances for students
 *
 * Relationships:
 * - Many-to-One with Student: Each due fee record belongs to one student
 *   (studentId references student.id with cascade delete)
 * - Many-to-One with School: Each due fee record is associated with one school
 *   (schoolId references school.id with cascade delete)
 * - Many-to-One with Class: Each due fee is for a specific class
 *   (classId references classes.id with cascade delete)
 * - Many-to-One with ClassSection: Each due fee is for a specific section
 *   (sectionId references section.id with cascade delete)
 * - Many-to-One with ClassFees: References the fee structure this is based on
 *   (feesId references fees.id with cascade delete)
 */
export const dues = pgTable('dues', {
  id: uuid().primaryKey().defaultRandom(),
  serial: serial(),
  studentId: uuid()
    .references(() => student.id, { onDelete: 'cascade' })
    .notNull(),
  schoolId: uuid()
    .references(() => school.id, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classes.id, { onDelete: 'cascade' })
    .notNull(),
  sectionId: uuid()
    .references(() => section.id, { onDelete: 'cascade' })
    .notNull(),
  feesId: uuid()
    .references(() => fees.id, { onDelete: 'cascade' })
    .notNull(),
  amountLeft: integer().notNull(),
  ...timeStamps,
});

/**
 * Fees Payment Table: Records fee payments made by students
 *
 * Relationships:
 * - Many-to-One with Student: Each payment belongs to one student
 *   (studentId references student.id with cascade delete)
 * - Many-to-One with School: Each payment is associated with one school
 *   (schoolId references school.id with cascade delete)
 * - Many-to-One with Class: Each payment is for a specific class
 *   (classId references classes.id with cascade delete)
 * - Many-to-One with ClassSection: Each payment is for a specific section
 *   (sectionId references section.id with cascade delete)
 * - Many-to-One with ClassFees: References the fee structure this payment is against
 *   (feesId references fees.id with cascade delete)
 */
export const payment = pgTable('payment', {
  id: uuid().primaryKey().defaultRandom(),
  serial: serial(),
  studentId: uuid()
    .references(() => student.id, { onDelete: 'cascade' })
    .notNull(),
  schoolId: uuid()
    .references(() => school.id, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classes.id, { onDelete: 'cascade' })
    .notNull(),
  sectionId: uuid()
    .references(() => section.id, { onDelete: 'cascade' })
    .notNull(),
  feesId: uuid()
    .references(() => fees.id, { onDelete: 'cascade' })
    .notNull(),
  amountPaid: integer().notNull(),
  ...timeStamps,
});

/**
 * Define explicit Drizzle ORM relations between tables
 *
 * These relation definitions allow for type-safe queries using Drizzle ORM
 * and enable proper JOIN operations between tables.
 */

// School Relations
export const schoolRelations = relations(
  school,
  ({ one, many }: { one: any; many: any }) => ({
    // One school has many students
    students: many(student),

    // One school has many staff members
    staffMembers: many(staff),

    // One school has many classes
    classes: many(classes),

    // One school has many class sections (through classes)
    classSections: many(section),

    // One school has many attendance records
    studentAttendanceRecords: many(studentAttendence),

    staffAttendenceRecords: many(staffAttendence),

    // One school has many class subjects
    classSubjects: many(subject),

    // One school has many class-subject-teacher assignments
    classSubjectTeachers: many(subjectTeacher),

    // One school has many class fee structures
    classFees: many(fees),

    // One school has many due fee records
    dueFees: many(dues),

    // One school has many fee payment records
    feePayments: many(payment),
  }),
);

// Class Relations
export const classRelations = relations(
  classes,
  ({ one, many }: { one: any; many: any }) => ({
    // Many classes belong to one school
    school: one(school, {
      fields: [classes.schoolId],
      references: [school.id],
    }),

    // One class has many students
    students: many(student),

    // One class has many sections
    sections: many(section),

    // One class has many subjects
    subjects: many(subject),

    // One class has a fee structure
    fees: many(fees),

    // One class has many due fee records
    dueFees: many(dues),

    // One class has many fee payment records
    feePayments: many(payment),
  }),
);

// Student Relations
export const studentRelations = relations(
  student,
  ({ one, many }: { one: any; many: any }) => ({
    // Many students belong to one school
    school: one(school, {
      fields: [student.schoolId],
      references: [school.id],
    }),

    // Many students are assigned to one class
    class: one(classes, {
      fields: [student.classId],
      references: [classes.id],
    }),

    section: one(section, {
      fields: [student.sectionId],
      references: [section.id],
    }),

    // One student can be a class monitor for multiple sections
    monitoringSections: many(section, { relationName: 'classMonitor' }),

    // One student has many attendance records
    attendanceRecords: many(studentAttendence),

    // One student has many due fee records
    dueFees: many(dues),

    // One student has many fee payment records
    feePayments: many(payment),
  }),
);

// School Staff Relations
export const schoolStaffRelations = relations(
  staff,
  ({ one, many }: { one: any; many: any }) => ({
    // Many staff members belong to one school
    school: one(school, {
      fields: [staff.schoolId],
      references: [school.id],
    }),

    // One staff member can be a class teacher for multiple sections
    teachingSections: many(section, { relationName: 'classTeacher' }),

    staffAttendenceRecord: many(staffAttendence),

    // One staff member can teach multiple subjects
    teachingSubjects: many(subject, { relationName: 'subjectTeacher' }),

    // One staff member can have multiple subject assignments
    subjectTeacherAssignments: many(subjectTeacher),
  }),
);

// Class Section Relations
export const classSectionRelations = relations(
  section,
  ({ one, many }: { one: any; many: any }) => ({
    // Many sections belong to one school
    school: one(school, {
      fields: [section.schoolId],
      references: [school.id],
    }),

    // Many sections belong to one class
    class: one(classes, {
      fields: [section.classId],
      references: [classes.id],
    }),

    // Many sections have one class monitor (student)
    classMonitor: one(student, {
      fields: [section.classMonitorId],
      references: [student.id],
      relationName: 'classMonitor',
    }),

    // Many sections have one class teacher (staff)
    classTeacher: one(staff, {
      fields: [section.classTeacherId],
      references: [staff.id],
      relationName: 'classTeacher',
    }),

    // One section can have many section-specific subjects
    subjects: many(subject),

    // One section has many due fee records
    dueFees: many(dues),

    // One section has many fee payment records
    feePayments: many(payment),
  }),
);

// Attendance Relations
export const studentAttendanceRelations = relations(
  studentAttendence,
  ({ one }: { one: any }) => ({
    // Many attendance records belong to one school
    school: one(school, {
      fields: [studentAttendence.schoolId],
      references: [school.id],
    }),

    // Many attendance records belong to one student
    student: one(student, {
      fields: [studentAttendence.studentId],
      references: [student.id],
    }),
  }),
);

export const staffAttendanceRelations = relations(
  staffAttendence,
  ({ one }: { one: any }) => ({
    // Many attendance records belong to one school
    school: one(school, {
      fields: [staffAttendence.schoolId],
      references: [school.id],
    }),

    // Many attendance records belong to one student
    student: one(staff, {
      fields: [staffAttendence.staffId],
      references: [student.id],
    }),
  }),
);

// Class Subject Relations
export const classSubjectRelations = relations(
  subject,
  ({ one, many }: { one: any; many: any }) => ({
    // Many subjects belong to one school
    school: one(school, {
      fields: [subject.schoolId],
      references: [school.id],
    }),

    // Many subjects belong to one class
    class: one(classes, {
      fields: [subject.classId],
      references: [classes.id],
    }),

    // Many subjects may be specific to one section (optional)
    section: one(section, {
      fields: [subject.sectionId],
      references: [section.id],
    }),

    // Many subjects are taught by one teacher
    teacher: one(staff, {
      fields: [subject.teacherId],
      references: [staff.id],
      relationName: 'subjectTeacher',
    }),

    // One subject can have multiple teacher assignments
    teacherAssignments: many(subjectTeacher),
  }),
);

// Class Subject Teacher Relations (Junction Table)
export const classSubjectTeacherRelations = relations(
  subjectTeacher,
  ({ one }: { one: any }) => ({
    // Many assignments belong to one school
    school: one(school, {
      fields: [subjectTeacher.schoolId],
      references: [school.id],
    }),

    // Many assignments belong to one class
    class: one(classes, {
      fields: [subjectTeacher.classId],
      references: [classes.id],
    }),

    // Many assignments may be specific to one section (optional)
    section: one(section, {
      fields: [subjectTeacher.sectionId],
      references: [section.id],
    }),

    // Many assignments are for one subject
    subject: one(subject, {
      fields: [subjectTeacher.subjectId],
      references: [subject.id],
    }),

    // Many assignments are for one teacher
    teacher: one(staff, {
      fields: [subjectTeacher.teacherId],
      references: [staff.id],
    }),
  }),
);

// Class Fees Relations
export const classFeesRelations = relations(
  fees,
  ({ one, many }: { one: any; many: any }) => ({
    // Many fee structures belong to one school
    school: one(school, {
      fields: [fees.schoolId],
      references: [school.id],
    }),

    // Many fee structures belong to one class
    class: one(classes, {
      fields: [fees.classId],
      references: [classes.id],
    }),

    // One fee structure has many due fee records
    dueFees: many(dues),

    // One fee structure has many fee payment records
    feePayments: many(payment),
  }),
);

// Due Fees Relations
export const dueFeesRelations = relations(dues, ({ one }: { one: any }) => ({
  // Many due fee records belong to one student
  student: one(student, {
    fields: [dues.studentId],
    references: [student.id],
  }),

  // Many due fee records belong to one school
  school: one(school, {
    fields: [dues.schoolId],
    references: [school.id],
  }),

  // Many due fee records belong to one class
  class: one(classes, {
    fields: [dues.classId],
    references: [classes.id],
  }),

  // Many due fee records belong to one section
  section: one(section, {
    fields: [dues.sectionId],
    references: [section.id],
  }),

  // Many due fee records are based on one fee structure
  fees: one(fees, {
    fields: [dues.feesId],
    references: [fees.id],
  }),
}));

// Fees Payment Relations
export const feesPaymentRelations = relations(
  payment,
  ({ one }: { one: any }) => ({
    // Many payment records belong to one student
    student: one(student, {
      fields: [payment.studentId],
      references: [student.id],
    }),

    // Many payment records belong to one school
    school: one(school, {
      fields: [payment.schoolId],
      references: [school.id],
    }),

    // Many payment records belong to one class
    class: one(classes, {
      fields: [payment.classId],
      references: [classes.id],
    }),

    // Many payment records belong to one section
    section: one(section, {
      fields: [payment.sectionId],
      references: [section.id],
    }),

    // Many payment records are against one fee structure
    fees: one(fees, {
      fields: [payment.feesId],
      references: [fees.id],
    }),
  }),
);

// export type School = typeof school.$inferInsert;
