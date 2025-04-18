import { eq } from 'drizzle-orm';
import { handleUniqueConstraintError } from '../../config/errors';
import { db } from '../../database/db';
import { student } from '../../database/schema';
import { SchoolDBServices } from '../school/SchoolDBServices';

export class StudentDBServices {
  static createStudent = async (schoolId: string, studentData: any) => {
    try {
      const {
        srNo,
        name,
        rollNo,
        email,
        password,
        classId,
        sectionId,
        admissionClass,
        admissionSection,
        admissionDate,
      } = studentData;

      const response = await db
        .insert(student)
        .values({
          schoolId,
          srNo,
          name,
          rollNo,
          email,
          password,
          classId,
          sectionId,
          admissionClass,
          admissionSection,
          admissionDate,
        })
        .returning({
          id: student.id,
          srNo: student.srNo,
          name: student.name,
          rollNo: student.rollNo,
          email: student.email,
          classId: student.classId,
          sectionId: student.sectionId,
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

  static getAllStudents = async (schoolId: string) => {
    try {
      const response = await db
        .select({
          id: student.id,
          srNo: student.srNo,
          name: student.name,
          rollNo: student.rollNo,
          email: student.email,
          classId: student.classId,
          sectionId: student.sectionId,
        })
        .from(student)
        .limit(10)
        .where(eq(student.schoolId, schoolId));
      return response;
    } catch (Err) {
      throw Err;
    }
  };
}
