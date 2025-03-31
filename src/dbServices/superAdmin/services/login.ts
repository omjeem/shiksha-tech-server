import { eq } from "drizzle-orm";
import { db } from "../../../database/db";
import { school } from "../../../database/schema";

const adminLogin = async (email: string, password: string) => {
    try {
        const response = await db.query.school.findFirst({
            where: (eq(school.superAdminEmail, email), eq(school.superAdminPassword, password)),
        })
        return response;
    } catch (err: any) {
        console.log('Error while logging in', err);
        throw err;
    }
};

export default adminLogin