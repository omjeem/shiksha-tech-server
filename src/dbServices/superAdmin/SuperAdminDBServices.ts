import { and, eq } from 'drizzle-orm';
import { db } from '../../database/db';
import { school } from '../../database/schema';
import { CustomError, throwError } from '../../config/error';
import { ErrorTypes } from '../../utils/errorEnums';

export class SuperAdminDBServices {
  static adminLogin = async (email: string, password: string) => {
    const user = await db.query.school.findFirst({
      where: and(
        eq(school.superAdminEmail, email),
        eq(school.superAdminPassword, password),
      ),
    });
    if (!user) return throwError(ErrorTypes.INVALID_CREDENTIALS)
    if (!user.isVerified) return throwError(ErrorTypes.SCHOOL_UNVERIFIED)
    return user.id;
  };
}
