import z, { string } from "zod"
import { ClassName_Enum } from "../../utils/interfaces"

export class ClassValidator {
    static createClass = () => {
        return z.object({
            body: z.object({
                className: z.enum([...Object.values(ClassName_Enum) as [string, ...string[]]]),
                totalSection: z.number(),
                totalStudent: z.number()
            }),
        })
    }

    static getALLClass = () => {
        return z.object({
            body: z.object({}).strict(),
            params: z.object({}).strict(),
            query: z.object({}).strict()
        })
    }
}