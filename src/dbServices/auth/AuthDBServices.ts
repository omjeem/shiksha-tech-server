import dbServices from '..';
import { AuthBodyType } from '../../config/zodTypes';

export class Auth {
  static login = async (body: AuthBodyType) => {
    try {
      const { email, password, schoolId, role } = body;
      const response: any = await dbServices.SuperAdminDBServices.adminLogin(
        email,
        password,
      );
      console.log('Response is ', response);
      if (!response) {
        throw 'Invalid Credential';
      }
      return response;
    } catch (err: any) {
      console.log('Error ', err);
      throw err;
    }
  };
}
