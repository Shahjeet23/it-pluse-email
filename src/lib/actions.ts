"use server";

import { redirect } from 'next/navigation';
import { enrollmentSchema } from '@/schemas/enrollment-schema';

export type FormState = {
  message: string;
  errors?: {
    name?: string[];
    age?: string[];
    qualification?: string[];
    email?: string[];
    phone?: string[];
    resume?: string[];
    _form?: string[];
  };
  success: boolean;
};

export async function submitEnrollmentForm(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const rawFormData = {
    name: formData.get('name'),
    age: formData.get('age'),
    qualification: formData.get('qualification'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    resume: formData.get('resume') instanceof File && (formData.get('resume') as File).size > 0 ? formData.get('resume') : undefined,
  };

  const validatedFields = enrollmentSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid form data. Please check the fields.",
      success: false,
    };
  }

  const data = validatedFields.data;

  try {
    // Simulate email sending
    console.log("Form data to be emailed:", data);
    
    const recipientEmail = "hr@itplusbharuch.com"; // Placeholder for IT PLUS, BHARUCH contact
    console.log(`Simulating email to ${recipientEmail} with data:`, JSON.stringify(data, (key, value) => key === 'resume' && value instanceof File ? {name: value.name, size: value.size, type: value.type} : value, 2));

    if (data.resume) {
      // In a real application, you would handle the file:
      // 1. Upload to a cloud storage (e.g., Firebase Storage, AWS S3)
      // 2. Get the URL and include it in the email or database record
      // 3. Or, if small enough and your email service supports it, attach directly (less common for web apps)
      console.log(`Resume received: ${data.resume.name}, size: ${data.resume.size} bytes, type: ${data.resume.type}`);
    } else {
      console.log("No resume submitted or resume is empty.");
    }

    // If all operations are successful, redirect to thank you page
    // Note: redirect needs to be called outside of try/catch or be the last thing in try if no other errors are expected.
    // For Server Actions, it's usually better to return a success state and let the client handle redirect, or redirect directly.
  } catch (error) {
    console.error("Error processing form submission:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
      success: false,
      errors: { _form: ["Submission failed due to a server error."] }
    };
  }
  
  redirect('/thank-you');
  // The redirect call above will prevent this from being reached if successful.
  // This is primarily for type-safety or if redirect was conditional.
  // return {
  //   message: "Form submitted successfully!",
  //   success: true,
  // };
}
