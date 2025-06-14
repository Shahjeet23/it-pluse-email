"use server";

import { redirect } from 'next/navigation';
import { enrollmentSchema, type EnrollmentFormValues } from '@/schemas/enrollment-schema';
import nodemailer from 'nodemailer';

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

// Configure Nodemailer transporter
// IMPORTANT: Replace with your actual email service credentials and use environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com", // Your SMTP host
  port: parseInt(process.env.SMTP_PORT || "587", 10), // Your SMTP port
  secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "your-email@example.com", // Your email address
    pass: process.env.SMTP_PASS || "your-email-password", // Your email password
  },
});


async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

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

  const data: EnrollmentFormValues = validatedFields.data;

  try {
    const recipientEmail = "hr@itplusbharuch.com"; 
    const subject = `New Young Banker Program Application - ${data.name}`;
    
    let htmlBody = `
      <h1>New Enrollment Application</h1>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Age:</strong> ${data.age}</p>
      <p><strong>Qualification:</strong> ${data.qualification}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
    `;

    if (data.resume) {
      htmlBody += `<p><strong>Resume:</strong> Attached</p>`;
    } else {
      htmlBody += `<p><strong>Resume:</strong> Not provided</p>`;
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"EnrollNow System" <${process.env.SMTP_USER || "noreply@example.com"}>`, // Sender address
      to: recipientEmail, // List of receivers
      subject: subject, // Subject line
      html: htmlBody, // HTML body
      replyTo: data.email, // Set applicant's email as reply-to
    };

    if (data.resume instanceof File) {
      const resumeFile = data.resume as File;
      // Convert File stream to Buffer for nodemailer attachment
      const buffer = await streamToBuffer(resumeFile.stream());
      mailOptions.attachments = [
        {
          filename: resumeFile.name,
          content: buffer,
          contentType: resumeFile.type,
        },
      ];
      console.log(`Resume "${resumeFile.name}" prepared for attachment.`);
    }
    
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${recipientEmail} for applicant ${data.name}`);

  } catch (error) {
    console.error("Error processing form submission or sending email:", error);
    // Differentiate between nodemailer errors and other errors if needed
    let errorMessage = "An unexpected error occurred. Please try again.";
    if (error instanceof Error && 'code' in error && error.code === 'EENVELOPE') { // Example Nodemailer error check
        errorMessage = "Error sending email: Invalid recipient or sender. Please contact support.";
    } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
    }

    return {
      message: errorMessage,
      success: false,
      errors: { _form: [errorMessage] }
    };
  }
  
  redirect('/thank-you');
}
