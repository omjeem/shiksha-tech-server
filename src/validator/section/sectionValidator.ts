import { z } from "zod"

export class SectionValidator {
    static createSection = () => {
        return z.object({
            body: z.object({
                sectionName: z.string(),
                classId: z.string().uuid(),
                totalStudent: z.number().optional(),
                classMonitorId: z.string().uuid().optional(),
                classTeacherId: z.string().uuid().optional(),
            }),
        })
    }

    static getAllSections = () => {
        return z.object({
            body: z.object({}).strict(),
            params: z.object({
                classId: z.string().uuid()
            }).strict(),
            query: z.object({}).strict()
        })
    }
}