import { and, eq } from 'drizzle-orm';
import { db } from '../../database/db';
import { classes, section } from '../../database/schema';
import { handleUniqueConstraintError } from '../../config/errors';

export class SectionDBServices {
  static createSection = async (sectionBody: any, schoolId: string) => {
    try {
      const {
        sectionName,
        classId,
        totalStudent,
        classMonitorId,
        classTeacherId,
      } = sectionBody;

      const isClassExists = await db.query.classes.findFirst({
        where: eq(classes.id, classId),
      });
      if (!isClassExists) {
        throw 'Class does not exist';
      }
      const data = await db
        .insert(section)
        .values({
          sectionName,
          classId,
          totalStudent,
          classMonitorId,
          classTeacherId,
          schoolId,
        })
        .returning({
          id: section.id,
          sectionName: section.sectionName,
          classId: section.classId,
          totalStudent: section.totalStudent,
          classMonitorId: section.classMonitorId,
          classTeacherId: section.classTeacherId,
        });
      return data;
    } catch (err: any) {
      if (err.code === '23505') {
        handleUniqueConstraintError(err, {
          sectionName: 'Section name already exists.',
        });
      }
      throw err;
    }
  };

  static getAllSections = async (schoolId: any, classId: any) => {
    try {
      const response = await db
        .select({
          id: section.id,
          sectionName: section.sectionName,
          classId: section.classId,
          totalStudent: section.totalStudent,
          classMonitorId: section.classMonitorId,
          classTeacherId: section.classTeacherId,
        })
        .from(section)
        .where(
          and(eq(section.schoolId, schoolId), eq(section.classId, classId)),
        );
      return response;
    } catch (err) {
      console.log('Error while getting all sections', err);
      throw err;
    }
  };

  static isSectionExists = async (sectionId: string | undefined) => {
    try {
      if (!sectionId) throw 'Section Id Not Found';
      const response = await db
        .select()
        .from(section)
        .where(eq(section.id, sectionId));

      if (response.length === 0) {
        throw 'Section not exist';
      }
      return true;
    } catch (Err) {
      throw Err;
    }
  };
}
