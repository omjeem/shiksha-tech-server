import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export enum SchoolBoard {
  CBSE = 'CBSE',
  ICSE = 'ICSE',
  STATE = 'STATE',
  IB = 'IB',
}

enum Attendence {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LEAVE = 'LEAVE',
}

enum SchoolStaffRole {
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  MANAGER = 'MANAGER',
  LIBRARIAN = 'LIBRARIAN',
  PEON = 'PEON',
  DRIVER = 'DRIVER',
  SECURITY = 'SECURITY',
  CLEANER = 'CLEANER',
  GATEKEEPER = 'GATEKEEPER',
  GARDENER = 'GARDENER',
  COOK = 'COOK',
  HELPER = 'HELPER',
}

enum ClassName {
  PLAYGROUP = 'PLAYGROUP',
  NURSERY = 'NURSERY',
  LKG = 'LKG',
  UKG = 'UKG',
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
  SIX = 'SIX',
  SEVEN = 'SEVEN',
  EIGHT = 'EIGHT',
  NINE = 'NINE',
  TEN = 'TEN',
  ELEVEN = 'ELEVEN',
  TWELVE = 'TWELVE',
}

export const classNameEnum = pgEnum(
  'className',
  Object.values(ClassName) as [string, ...string[]],
);

export const schoolBoardEnum = pgEnum(
  'role',
  Object.values(SchoolBoard) as [string, ...string[]],
);

export const attendenceEnum = pgEnum(
  'attendence',
  Object.values(Attendence) as [string, ...string[]],
);

export const schoolStaffRoleEnum = pgEnum(
  'schoolStaffRole',
  Object.values(SchoolStaffRole) as [string, ...string[]],
);

export const schoolTable = pgTable('school', {
  id: serial(),
  schoolId: uuid().primaryKey(),
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
  createdAt: date().default(Date.now().toString()),
  updatedAt: date().default(Date.now().toString()),
  isDeleted: boolean().default(false),
  isVerified: boolean().default(false),
  board: schoolBoardEnum().notNull(),
  otherBoard: varchar({ length: 255 }),
});

export const studentTable = pgTable('student', {
  id: serial(),
  studentId: uuid().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  schoolId: uuid()
    .references(() => schoolTable.id, { onDelete: 'cascade' })
    .notNull(),
  classId: integer(),
  createdAt: date().default(Date.now().toString()),
  updatedAt: date().default(Date.now().toString()),
  isDeleted: boolean().default(false),
  admissionClass: integer().notNull(),
  admissionSection: varchar({ length: 5 }).notNull(),
  admissionYear: integer().notNull(),
});

export const schoolStaffTable = pgTable('schoolStaff', {
  id: serial(),
  staffId: uuid().notNull(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  schoolId: uuid()
    .references(() => schoolTable.schoolId, { onDelete: 'cascade' })
    .notNull(),
  role: schoolStaffRoleEnum().notNull(),
  joiningDate: date().notNull(),
  salary: integer().notNull(),
  createdAt: date().default(Date.now().toString()),
  updatedAt: date().default(Date.now().toString()),
  isDeleted: boolean().default(false),
});

export const attendenceTable = pgTable('attendence', {
  id: serial(),
  attendenceId: uuid().primaryKey(),
  studentId: integer()
    .references(() => studentTable.studentId, { onDelete: 'cascade' })
    .notNull(),
  schoolId: uuid()
    .references(() => schoolTable.schoolId, { onDelete: 'cascade' })
    .notNull(),
  date: date().notNull(),
  status: attendenceEnum().notNull(),
});

export const classTable = pgTable('class', {
  id: serial(),
  classId: uuid().primaryKey(),
  schoolId: uuid()
    .references(() => schoolTable.schoolId, { onDelete: 'cascade' })
    .notNull(),
  clasName: classNameEnum().notNull(),
  totalSection: integer().notNull(),
  totalStudent: integer().notNull(),
});

export const classSectionTable = pgTable('classSection', {
  id: serial(),
  classSectionId: uuid().primaryKey(),
  schoolId: uuid()
    .references(() => schoolTable.schoolId, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classTable.classId, { onDelete: 'cascade' })
    .notNull(),
  createdAt: date().default(Date.now().toString()),
  sectionName: varchar({ length: 5 }).notNull(),
  totalStudent: integer().notNull(),
  classMonitorId: uuid()
    .references(() => studentTable.studentId)
    .notNull(),
  classTeacherId: uuid()
    .references(() => schoolStaffTable.staffId)
    .notNull(),
});

export const classSubjectTable = pgTable('classSubject', {
  id: serial(),
  classSubjectId: uuid().primaryKey(),
  schoolId: uuid()
    .references(() => schoolTable.schoolId, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classTable.classId, { onDelete: 'cascade' })
    .notNull(),
  subjectName: varchar({ length: 255 }).notNull(),
  subjectCode: varchar({ length: 10 }).notNull(),
  teacherId: uuid()
    .references(() => schoolStaffTable.staffId)
    .notNull(),
});

export const classSubjectTeacherTable = pgTable('classSubjectTeacher', {
  id: serial(),
  classSubjectTeacherId: uuid().primaryKey(),
  schoolId: uuid()
    .references(() => schoolTable.schoolId, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classTable.classId, { onDelete: 'cascade' })
    .notNull(),
  subjectId: uuid()
    .references(() => classSubjectTable.classSubjectId, { onDelete: 'cascade' })
    .notNull(),
  teacherId: uuid()
    .references(() => schoolStaffTable.staffId, { onDelete: 'cascade' })
    .notNull(),
  createdAt: date().default(Date.now().toString()),
});

export const classFeesTable = pgTable('fees', {
  id: serial(),
  feesId: uuid().primaryKey(),
  schoolId: uuid()
    .references(() => schoolTable.schoolId, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classTable.classId, { onDelete: 'cascade' })
    .notNull(),
  createdAt: date().default(Date.now().toString()),
  updatedAt: date().default(Date.now().toString()),
  tutionFees: integer().default(0),
  admissionFees: integer().default(0),
  examinationFees: integer().default(0),
  sportsFees: integer().default(0),
  libraryFees: integer().default(0),
  computerFees: integer().default(0),
  transportFees: integer().default(0),
});

export const dueFeesTable = pgTable('dueFees', {
  id: serial(),
  dueFeesId: uuid().primaryKey(),
  createdAt: date().default(Date.now().toString()),
  updatedAt: date().default(Date.now().toString()),
  studentId: uuid()
    .references(() => studentTable.studentId, { onDelete: 'cascade' })
    .notNull(),
  schoolId: uuid()
    .references(() => schoolTable.schoolId, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classTable.classId, { onDelete: 'cascade' })
    .notNull(),
  sectionId: uuid()
    .references(() => classSectionTable.classSectionId, { onDelete: 'cascade' })
    .notNull(),
  feesId: uuid()
    .references(() => classFeesTable.feesId, { onDelete: 'cascade' })
    .notNull(),
  amountLeft: integer().notNull(),
});

export const feesPaymentTable = pgTable('feesPayment', {
  id: serial(),
  feesPaymentId: uuid().primaryKey(),
  createdAt: date().default(Date.now().toString()),
  updatedAt: date().default(Date.now().toString()),
  studentId: uuid()
    .references(() => studentTable.studentId, { onDelete: 'cascade' })
    .notNull(),
  schoolId: uuid()
    .references(() => schoolTable.schoolId, { onDelete: 'cascade' })
    .notNull(),
  classId: uuid()
    .references(() => classTable.classId, { onDelete: 'cascade' })
    .notNull(),
  sectionId: uuid()
    .references(() => classSectionTable.classSectionId, { onDelete: 'cascade' })
    .notNull(),
  feesId: uuid()
    .references(() => classFeesTable.feesId, { onDelete: 'cascade' })
    .notNull(),
  amountPaid: integer().notNull(),
});
