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
          password: student.password,
          classId: student.classId,
          sectionId: student.sectionId,
        });
      return response;
    } catch (Err) {
      throw Err;
    }
  };
}
