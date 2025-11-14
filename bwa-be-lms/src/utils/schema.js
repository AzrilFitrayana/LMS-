import z from "zod";

export const signupSchema = z.object({
  name: z.string().min(5),
  email: z.email(),
  password: z.string().min(5),
});

export const signinSchema = signupSchema.omit({ name: true });

export const mutateCourseSchema = z.object({
  name: z.string().min(5),
  categoryId: z.string(),
  tagline: z.string().min(5),
  description: z.string().min(5),
});
