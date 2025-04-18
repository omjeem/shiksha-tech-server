import { eq } from 'drizzle-orm';
import { db } from '../../database/db';
import { school } from '../../database/schema';
import { handleUniqueConstraintError } from '../../config/errors';

export class SchoolDBServices {
  static createSchool = async (schoolData: any) => {
    try {
      const {
        schoolName,
        address,
        websiteLink,
        contactNumber,
        contactEmail,
        superAdminName,
        superAdminPassword,
        superAdminEmail,
        superAdminContact,
        board,
        totalClasses,
        totalStudents,
        totalTeachers,
        otherBoard,
      } = schoolData;

      const response = await db
        .insert(school)
        .values({
          schoolName,
          address,
          websiteLink,
          contactNumber,
          contactEmail,
          isVerified: true,
          superAdminName,
          superAdminPassword,
          superAdminEmail,
          superAdminContact,
          board,
          totalClasses,
          totalStudents,
          totalTeachers,
          otherBoard,
        })
        .execute();
      return response;
    } catch (err: any) {
      console.log('Error while creating school', err);
      if (err.code === '23505') {
        // Unique violation
        handleUniqueConstraintError(err, {
          websiteLink: 'Website link already in use.',
          contactNumber: 'Contact number already in use.',
          contactEmail: 'Contact email already in use.',
          superAdminEmail: 'Super admin email already in use.',
          superAdminContact: 'Super admin contact already in use.',
        });
      }
      throw err;
    }
  };

  static getDetails = async (schoolId: string) => {
    try {
      const response = await db
        .select({
          schoolName: school.schoolName,
          address: school.address,
          websiteLink: school.websiteLink,
          contactNumber: school.contactNumber,
          adminName: school.superAdminName,
          adminEmial: school.superAdminEmail,
          totalStudents: school.totalStudents,
          totalTeachers: school.totalTeachers,
          board: school.board,
          otherBoard: school.otherBoard,
          isVerified: school.isVerified,
        })
        .from(school)
        .where(eq(school.id, schoolId));
      return response;
    } catch (Err) {
      throw Err;
    }
  };

  static isSchoolExists = async (schoolId: string | undefined) => {
    try {
      if (!schoolId) throw 'School Id Not Found';
      const response = await db
        .select()
        .from(school)
        .where(eq(school.id, schoolId));

      if (response.length === 0) {
        throw 'School does not exist';
      }
      return true;
    } catch (Err) {
      throw Err;
    }
  };
}
