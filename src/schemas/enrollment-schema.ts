import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_RESUME_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];


export const enrollmentSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100),
  age: z.coerce.number().int().min(18, { message: "You must be at least 18 years old." }).max(30, { message: "You must be at most 30 years old." }),
  qualification: z.string().min(2, { message: "Qualification is required." }).max(150),
  email: z.string().email({ message: "Invalid email address." }).max(100),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).max(15).regex(/^\+?[0-9\s-()]+$/, { message: "Invalid phone number format." }),
  resume: z.any()
    .refine((file) => file instanceof File && file.size > 0 ? file.size <= MAX_FILE_SIZE : true, `Max resume size is 5MB.`)
    .refine(
      (file) => file instanceof File && file.size > 0 ? ACCEPTED_RESUME_TYPES.includes(file.type) : true,
      "Only .pdf, .doc, and .docx formats are supported for resumes."
    ).optional(),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;
