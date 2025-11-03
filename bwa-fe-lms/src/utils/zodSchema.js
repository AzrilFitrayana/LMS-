import z from "zod";

export const signupSchema = z.object({
    name: z.string().min(5),
    email: z.email(),
    password: z.string().min(5)
})