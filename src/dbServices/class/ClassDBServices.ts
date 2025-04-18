import { eq } from 'drizzle-orm';
import { db } from '../../database/db';
import { classes } from '../../database/schema';

export class ClassDBServices {
  static createClass = async (classData: any, schoolId: any) => {
    const { className, totalSection, totalStudent } = classData;
    try {
      const response = await db
        .insert(classes)
        .values({
          className,
          totalSection,
          totalStudent,
          schoolId,
        })
        .returning({
          id: classes.id,
          className: classes.className,
          schoolId: classes.schoolId,
          totalSection: classes.totalSection,
          totalStudent: classes.totalStudent,
        });
      return response;
    } catch (err) {
      console.log('Error while creating class', err);
      throw err;
    }
  };

  static getALLCLasses = (schoolId: any) => {
    try {
      const response = db
        .select({
          id: classes.id,
          className: classes.className,
          totalSection: classes.totalSection,
          totalStudent: classes.totalStudent,
        })
        .from(classes)
        .where(eq(classes.schoolId, schoolId));
      return response;
    } catch (err) {
      console.log('Error while getting all classes', err);
      throw err;
    }
  };
}
