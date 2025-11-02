import z from "zod";

export const exampleSchema = z.object({
    name: z.string().min(3)
});

export const signupSchema = z.object({
    name: z.string().min(5),
    email: z.email(),
    password: z.string().min(5)
})