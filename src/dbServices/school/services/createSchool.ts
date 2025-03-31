import { PostgresError } from 'postgres';
import { db } from '../../../database/db';
import { school } from '../../../database/schema';

async function createSchool(schoolData: any) {
  try {
    const { schoolName, address, websiteLink, contactNumber, contactEmail, superAdminName, superAdminPassword, superAdminEmail, superAdminContact, board } = schoolData;
    const response = await db.insert(school).values({
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
    }).execute();
    return response;
  } catch (err : any) {
    console.log('Error while creating school', err);
    throw err;
  }
}

export default createSchool;
