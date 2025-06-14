"use client";

import React, { useActionState, useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enrollmentSchema, type EnrollmentFormValues } from '@/schemas/enrollment-schema';
import { submitEnrollmentForm, type FormState } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Though not explicitly requested, qualification could be a textarea. Sticking to input for now.
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { User, CalendarDays, GraduationCap, Mail, Phone, FileText, Loader2 } from 'lucide-react';

const initialFormState: FormState = {
  message: '',
  success: false,
};

export function EnrollmentForm() {
  const [state, formAction] = useActionState(submitEnrollmentForm, initialFormState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      name: '',
      age: undefined, // Or provide a default like 18
      qualification: '',
      email: '',
      phone: '',
      resume: undefined,
    },
    mode: 'onChange', // Real-time validation
  });

  const { formState: { isSubmitting, isValid } } = form;


  useEffect(() => {
    if (state?.message && !state.success && state.errors) {
       Object.entries(state.errors).forEach(([key, value]) => {
        if (key !== "_form" && value) {
          form.setError(key as keyof EnrollmentFormValues, { type: 'server', message: value.join(', ') });
        }
      });
      toast({
        title: "Submission Error",
        description: state.message || "Please correct the errors and try again.",
        variant: "destructive",
      });
    }
    // Success is handled by redirect in server action, so no client-side toast for success needed if redirect occurs.
    // If not redirecting from server action, you'd handle success toast here.
  }, [state, toast, form]);
  
  const onSubmit = (data: EnrollmentFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    formAction(formData);
  };


  return (
    <Card className="w-full max-w-2xl shadow-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center">Apply Now</CardTitle>
        <CardDescription className="text-center">
          Fill out the form below to apply for the Young Banker Program.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form ref={formRef} action={formAction} onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4" />Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} aria-invalid={!!form.formState.errors.name} aria-describedby="name-error" />
                  </FormControl>
                  <FormMessage id="name-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4" />Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter your age (18-30)" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} aria-invalid={!!form.formState.errors.age} aria-describedby="age-error" />
                  </FormControl>
                  <FormMessage id="age-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4" />Qualification</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., B.Com, B.Sc IT, Any Graduate" {...field} aria-invalid={!!form.formState.errors.qualification} aria-describedby="qualification-error" />
                  </FormControl>
                  <FormMessage id="qualification-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4" />Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} aria-invalid={!!form.formState.errors.email} aria-describedby="email-error" />
                  </FormControl>
                  <FormMessage id="email-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4" />Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter your contact number" {...field} aria-invalid={!!form.formState.errors.phone} aria-describedby="phone-error" />
                  </FormControl>
                  <FormMessage id="phone-error" />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="resume"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><FileText className="mr-2 h-4 w-4" />Upload Resume (Optional)</FormLabel>
                  <FormControl>
                     <Input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)} 
                        onBlur={onBlur}
                        name={name}
                        ref={ref}
                        className="pt-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        aria-invalid={!!form.formState.errors.resume} 
                        aria-describedby="resume-error"
                      />
                  </FormControl>
                  <FormMessage id="resume-error" />
                </FormItem>
              )}
            />
            {state?.errors?._form && <FormMessage>{state.errors._form.join(', ')}</FormMessage>}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button type="submit" disabled={isSubmitting || !isValid} className="w-full md:w-1/2 bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-105">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Application
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
