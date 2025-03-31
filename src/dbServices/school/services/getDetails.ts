import { Request, Response } from "express";
import { db } from "../../../database/db";
import { school } from "../../../database/schema";
import { eq } from "drizzle-orm";

const getDetails = async (schoolId: string) => {
    try {
        const response = await db.select({
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
        }).from(school).where(eq(school.id, schoolId));
        return response;
    } catch (Err) {
        throw Err;
    }
}

export default getDetails;