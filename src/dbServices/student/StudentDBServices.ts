import { and, desc, eq } from 'drizzle-orm';
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
