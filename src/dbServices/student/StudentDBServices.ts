import { and, asc, desc, eq } from 'drizzle-orm';
import { handleUniqueConstraintError } from '../../config/errors';
import { db } from '../../database/db';
import { student } from '../../database/schema';
import { SchoolDBServices } from '../school/SchoolDBServices';

export class StudentDBServices {
  static createStudent = async (studentData: any) => {
    try {
      const response = await db.insert(student).values(studentData).returning({
        id: student.id,
        srNo: student.srNo,
        name: student.name,
        rollNo: student.rollNo,
        address: student.address,
        gender: student.gender,
        dob: student.dob,
        email: student.email,
        classId: student.classId,
        sectionId: student.sectionId,
        fatherName: student.fatherName,
        fatherContact: student.fatherContact,
        fatherEmail: student.fatherEmail,
        motherName: student.motherName,
        motherContact: student.motherContact,
        motherEmail: student.motherEmail
      });
      return response;
    } catch (Err: any) {
      if (Err.code === '23505') {
        handleUniqueConstraintError(Err, {
          srNo: 'Sr no Already exists.',
          email: 'Email Already exists.',
        });
      }
      throw Err;
    }
  };

  static getAllSrAndEmail = async (schoolId: string, classId: string) => {
    try {
      const response = await db
        .select({
          srNo: student.srNo,
          email: student.email,
        })
        .from(student)
        .where(eq(student.schoolId, schoolId));
      return response;
    } catch (Err) {
      throw Err;
    }
  };

  static getAllStudents = async (schoolId: string, page: number = 1) => {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;

      // const response = await db
      //   .select({
      //     id: student.id,
      //     srNo: student.srNo,
      //     name: student.name,
      //     rollNo: student.rollNo,
      //     email: student.email,
      //     classId: student.classId,
      //     sectionId: student.sectionId,
      //   })
      //   .from(student)
      //   .where(eq(student.schoolId, schoolId))
      //   .orderBy(student.srNo)
      //   .limit(limit)
      //   .offset(offset);

      const response = await db.query.student.findMany({
        where: (eq(student.schoolId, schoolId)),
        orderBy: (student) => [asc(student.srNo)],
        limit,
        offset,
        columns: {
          id: true,
          srNo: true,
          name: true,
          rollNo: true,
          email: true,
        },
        with: {
          class: {
            columns: {
              id: true,
              className: true
            }
          },
          section: {
            columns: {
              id: true,
              sectionName: true
            }
          }
        }
      });



      return response;
    } catch (err) {
      throw err;
    }
  };


  static lastSrNo = async (schoolId: string) => {
    try {
      const response = await db
        .select({ srNo: student.srNo })
        .from(student)
        .where(eq(student.schoolId, schoolId))
        .orderBy(desc(student.srNo))
        .limit(1)

      return response
    } catch (error) {
      throw error
    }
  }
}
