import z from "zod";

export const signupSchema = z.object({
  name: z.string().min(5),
  email: z.email(),
  password: z.string().min(5),
});

export const signinSchema = signupSchema.omit({ name: true });

export const createCourseSchema = z.object({
  name: z.string().min(5),
  categoryId: z.string().min(5, { message: "Please select category" }),
  tagline: z.string().min(5),
  description: z.string().min(5),
  thumbnail: z
    .any()
    .refine((file) => file?.name, { message: "Thumbnail is required" }),
});

export const updateCourseSchema = createCourseSchema.partial({
  thumbnail: true,
});

export const mutateContentSchema = z
  .object({
    title: z.string().min(5),
    type: z.string().min(3, { message: "Type is required" }),
    youtubeId: z.string().optional(),
    text: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    const parseYoutubeId = z.string().min(4).safeParse(val.youtubeId);
    const parseText = z.string().min(4).safeParse(val.text);

    if (val.type === "video") {
      if (!parseYoutubeId.success) {
        ctx.addIssue({
          code: "custom",
          message: "Youtube ID is required",
          path: ["youtubeId"],
        });
      }
    }

    if (val.type === "text") {
      if (!parseText.success) {
        ctx.addIssue({
          code: "custom",
          message: "Text is required",
          path: ["text"],
        });
      }
    }
  });

export const mutateStudentSchema = z.object({
  name: z.string().min(5),
  email: z.email(),
  password: z.string().min(5),
  avatar: z
    .any()
    .refine((file) => file?.name, { message: "Avatar is required" }),
});

export const mutateUpdateStudentSchema = mutateStudentSchema.omit({
  password: true,
  avatar: true,
});

export const mutateStudentToCourseSchema = z.object({
  studentId: z.string().min(5),
});
