import { eq } from 'drizzle-orm';
import { db } from '../../database/db';
import { school } from '../../database/schema';

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
}
