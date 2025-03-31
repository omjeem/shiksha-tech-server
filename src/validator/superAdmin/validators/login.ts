import { z } from "zod"

const loginValidator = () => {
    return z.object({
        body: z.object({
            email: z.string().email(),
            password: z.string().min(6)
        })
    })
}

export default loginValidator