import { z } from 'zod';
import { SchoolBoard_Enum } from '../../utils/interfaces';

class SchoolValidator {
  static createSchool = () => {
    return z.object({
      body: z.object({
        schoolName: z.string().min(2),
        address: z.string().min(5),
        websiteLink: z.string().url(),
        contactNumber: z.string().min(10).max(15),
        contactEmail: z.string().email(),
        superAdminName: z.string().min(2),
        superAdminPassword: z.string().min(6),
        superAdminEmail: z.string().email(),
        superAdminContact: z.string().min(10).max(15),
        board: z
          .enum([...(Object.values(SchoolBoard_Enum) as [string, ...string[]])])
          .optional(),
        otherBoard: z.string().min(2).max(255).optional(),
      }),
    });
  };
}

export default SchoolValidator;
