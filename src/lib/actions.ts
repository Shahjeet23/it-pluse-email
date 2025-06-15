
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
// IMPORTANT: Using hardcoded credentials is highly insecure. 
// Consider using environment variables for production.
// Example: process.env.SMTP_HOST, process.env.SMTP_PORT, etc.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com", // Using Gmail SMTP
  port: parseInt(process.env.SMTP_PORT || "587", 10), // Standard port for Gmail
  secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports (587 uses TLS)
  auth: {
    user: process.env.SMTP_USER || "jeetshah24041996@gmail.com", // Your Gmail address
    pass: process.env.SMTP_PASS || "wohw rdiv zmeh pkbf", // Your Gmail App Password or account password (less secure)
  },
  // If using Gmail, you might need to enable "Less secure app access" in your Google account settings,
  // or preferably, generate an "App Password".
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
      from: `"EnrollNow System" <${process.env.SMTP_USER || "jeetshah24041996@gmail.com"}>`, // Sender address (your Gmail)
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
    if (error instanceof Error && 'code' in error && (error as any).code === 'EAUTH') {
      errorMessage = "Error sending email: Authentication failed. Please check your email credentials and ensure 'Less secure app access' is enabled or use an App Password if using Gmail.";
    } else if (error instanceof Error && 'code' in error && (error as any).code === 'EENVELOPE') {
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
  return {
    message: "Form submitted successfully",
    success: true,
  };
}
