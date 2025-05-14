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
  StudentGender_Enum,
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

export const studentGenderEnum = pgEnum(
  'studentGenderEnum',
  Object.values(StudentGender_Enum) as [string, ...string[]],
);

const timeStamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
};

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

export const classes = pgTable(
  'classes',
  {
    id: uuid().primaryKey().defaultRandom(),
    serial: serial(),
    schoolId: uuid()
      .references(() => school.id, { onDelete: 'cascade' })
      .notNull(),
    className: classNameEnum('className').notNull(),
    totalSection: integer().notNull().default(0),
    totalStudent: integer().notNull().default(0),
    ...timeStamps,
  },
  (table) => [unique('unique_class').on(table.className, table.schoolId)],
);

export const student = pgTable(
  'student',
  {
    id: uuid().primaryKey().defaultRandom(),
    serial: serial(),
    srNo: integer().notNull(),
    name: varchar({ length: 255 }),
    rollNo: integer(),
    address: varchar({ length: 255 }),
    gender: studentGenderEnum().notNull(),
    dob: date(),
    email: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    schoolId: uuid()
      .references(() => school.id, { onDelete: 'cascade' })
      .notNull(),
    classId: uuid()
      .references(() => classes.id)
      .notNull(),
    sectionId: uuid()
      .references(() => section.id)
      .notNull(),
    isDeleted: boolean().default(false),
    admissionClass: varchar({ length: 5 }),
    admissionSection: varchar({ length: 5 }),
    admissionDate: date(),
    fatherName: varchar({ length: 255 }),
    fatherContact: varchar({ length: 15 }),
    fatherEmail: varchar({ length: 255 }),
    motherName: varchar({ length: 255 }),
    motherContact: varchar({ length: 15 }),
    motherEmail: varchar({ length: 255 }),
    ...timeStamps,
  },
  (table) => [
    check('srNo_check', sql`${table.srNo} > 0`),
    unique('srNo_unique').on(table.srNo, table.schoolId),
    unique('email_unique').on(table.email, table.schoolId),
  ],
);

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
  (table) => [unique('unique_section').on(table.sectionName, table.classId)],
);

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

export const schoolRelations = relations(
  school,
  ({ one, many }: { one: any; many: any }) => ({
    students: many(student),

    staffMembers: many(staff),

    classes: many(classes),

    classSections: many(section),

    studentAttendanceRecords: many(studentAttendence),

    staffAttendenceRecords: many(staffAttendence),

    classSubjects: many(subject),

    classSubjectTeachers: many(subjectTeacher),

    classFees: many(fees),

    dueFees: many(dues),

    feePayments: many(payment),
  }),
);

export const classRelations = relations(
  classes,
  ({ one, many }: { one: any; many: any }) => ({
    school: one(school, {
      fields: [classes.schoolId],
      references: [school.id],
    }),

    students: many(student),

    sections: many(section),

    subjects: many(subject),

    fees: many(fees),

    dueFees: many(dues),

    feePayments: many(payment),
  }),
);

export const studentRelations = relations(
  student,
  ({ one, many }: { one: any; many: any }) => ({
    school: one(school, {
      fields: [student.schoolId],
      references: [school.id],
    }),

    class: one(classes, {
      fields: [student.classId],
      references: [classes.id],
    }),

    section: one(section, {
      fields: [student.sectionId],
      references: [section.id],
    }),

    monitoringSections: many(section, { relationName: 'classMonitor' }),

    attendanceRecords: many(studentAttendence),

    dueFees: many(dues),

    feePayments: many(payment),
  }),
);

export const schoolStaffRelations = relations(
  staff,
  ({ one, many }: { one: any; many: any }) => ({
    school: one(school, {
      fields: [staff.schoolId],
      references: [school.id],
    }),

    teachingSections: many(section, { relationName: 'classTeacher' }),

    staffAttendenceRecord: many(staffAttendence),

    teachingSubjects: many(subject, { relationName: 'subjectTeacher' }),

    subjectTeacherAssignments: many(subjectTeacher),
  }),
);

export const classSectionRelations = relations(
  section,
  ({ one, many }: { one: any; many: any }) => ({
    school: one(school, {
      fields: [section.schoolId],
      references: [school.id],
    }),

    class: one(classes, {
      fields: [section.classId],
      references: [classes.id],
    }),

    classMonitor: one(student, {
      fields: [section.classMonitorId],
      references: [student.id],
      relationName: 'classMonitor',
    }),

    classTeacher: one(staff, {
      fields: [section.classTeacherId],
      references: [staff.id],
      relationName: 'classTeacher',
    }),

    subjects: many(subject),

    dueFees: many(dues),

    feePayments: many(payment),
  }),
);

export const studentAttendanceRelations = relations(
  studentAttendence,
  ({ one }: { one: any }) => ({
    school: one(school, {
      fields: [studentAttendence.schoolId],
      references: [school.id],
    }),

    student: one(student, {
      fields: [studentAttendence.studentId],
      references: [student.id],
    }),
  }),
);

export const staffAttendanceRelations = relations(
  staffAttendence,
  ({ one }: { one: any }) => ({
    school: one(school, {
      fields: [staffAttendence.schoolId],
      references: [school.id],
    }),

    student: one(staff, {
      fields: [staffAttendence.staffId],
      references: [student.id],
    }),
  }),
);

export const classSubjectRelations = relations(
  subject,
  ({ one, many }: { one: any; many: any }) => ({
    school: one(school, {
      fields: [subject.schoolId],
      references: [school.id],
    }),

    class: one(classes, {
      fields: [subject.classId],
      references: [classes.id],
    }),

    section: one(section, {
      fields: [subject.sectionId],
      references: [section.id],
    }),

    teacher: one(staff, {
      fields: [subject.teacherId],
      references: [staff.id],
      relationName: 'subjectTeacher',
    }),

    teacherAssignments: many(subjectTeacher),
  }),
);

export const classSubjectTeacherRelations = relations(
  subjectTeacher,
  ({ one }: { one: any }) => ({
    school: one(school, {
      fields: [subjectTeacher.schoolId],
      references: [school.id],
    }),

    class: one(classes, {
      fields: [subjectTeacher.classId],
      references: [classes.id],
    }),

    section: one(section, {
      fields: [subjectTeacher.sectionId],
      references: [section.id],
    }),

    subject: one(subject, {
      fields: [subjectTeacher.subjectId],
      references: [subject.id],
    }),

    teacher: one(staff, {
      fields: [subjectTeacher.teacherId],
      references: [staff.id],
    }),
  }),
);

export const classFeesRelations = relations(
  fees,
  ({ one, many }: { one: any; many: any }) => ({
    school: one(school, {
      fields: [fees.schoolId],
      references: [school.id],
    }),

    class: one(classes, {
      fields: [fees.classId],
      references: [classes.id],
    }),

    dueFees: many(dues),

    feePayments: many(payment),
  }),
);

export const dueFeesRelations = relations(dues, ({ one }: { one: any }) => ({
  student: one(student, {
    fields: [dues.studentId],
    references: [student.id],
  }),

  school: one(school, {
    fields: [dues.schoolId],
    references: [school.id],
  }),

  class: one(classes, {
    fields: [dues.classId],
    references: [classes.id],
  }),

  section: one(section, {
    fields: [dues.sectionId],
    references: [section.id],
  }),

  fees: one(fees, {
    fields: [dues.feesId],
    references: [fees.id],
  }),
}));

export const feesPaymentRelations = relations(
  payment,
  ({ one }: { one: any }) => ({
    student: one(student, {
      fields: [payment.studentId],
      references: [student.id],
    }),

    school: one(school, {
      fields: [payment.schoolId],
      references: [school.id],
    }),

    class: one(classes, {
      fields: [payment.classId],
      references: [classes.id],
    }),

    section: one(section, {
      fields: [payment.sectionId],
      references: [section.id],
    }),

    fees: one(fees, {
      fields: [payment.feesId],
      references: [fees.id],
    }),
  }),
);
