import { eq, sql } from 'drizzle-orm';
import { db } from '../../database/db';
import { classes, school, student } from '../../database/schema';

export class ClassDBServices {
  static createClass = async (classData: any, schoolId: any) => {
    const { className, totalSection, totalStudent } = classData;
    try {
      const response: any = await db
        .insert(classes)
        .values({
          className,
          schoolId,
        })
        .returning({
          id: classes.id,
          className: classes.className,
        });
      response[0].sections = [];
      return response;
    } catch (err) {
      console.log('Error while creating class', err);
      throw err;
    }
  };

  static getALLCLasses = async (schoolId: any) => {
    try {
      const classStudentCounts = await db
        .select({
          classId: student.classId,
          count: sql<number>`count(*)`.as('count'),
        })
        .from(student)
        .where(eq(student.schoolId, schoolId))
        .groupBy(student.classId);

      const sectionStudentCounts = await db
        .select({
          sectionId: student.sectionId,
          count: sql<number>`count(*)`.as('count'),
        })
        .from(student)
        .where(eq(student.schoolId, schoolId))
        .groupBy(student.sectionId);

      const classData = await db.query.classes.findMany({
        where: (classes, { eq }) => eq(classes.schoolId, schoolId),
        columns: {
          id: true,
          className: true,
        },
        with: {
          sections: {
            columns: {
              id: true,
              sectionName: true,
              created_at: true,
            },
          },
        },
      });

      const data = classData.map((c: any) => ({
        ...c,
        totalStudent:
          parseInt(String(classStudentCounts.find((cs) => cs.classId === c.id)?.count || 0)),
        sections: c.sections.map((s: any) => ({
          ...s,
          totalStudent:
            parseInt(String(sectionStudentCounts.find((ss) => ss.sectionId === s.id)?.count ||
              0)),
        })),
      }));

      return data;
    } catch (err) {
      console.log('Error while getting all classes', err);
      throw err;
    }
  };

  static isClassExists = async (classId: string | undefined) => {
    try {
      if (!classId) throw 'CLass Id Not Found';
      const response = await db
        .select()
        .from(classes)
        .where(eq(classes.id, classId));

      if (response.length === 0) {
        throw 'Class does not exist';
      }
      return true;
    } catch (Err) {
      throw Err;
    }
  };
}
