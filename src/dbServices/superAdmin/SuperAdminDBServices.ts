import { and, eq } from 'drizzle-orm';
import { db } from '../../database/db';
import { school } from '../../database/schema';

export class SuperAdminDBServices {
  static adminLogin = async (email: string, password: string) => {
    try {
      const response = await db.query.school.findFirst({
        where: and
          (
            eq(school.superAdminEmail, email),
            eq(school.superAdminPassword, password)        
        ),
      })
      return response;
    } catch (err: any) {
      console.log('Error while logging in', err);
      throw err;
    }
  };
}
