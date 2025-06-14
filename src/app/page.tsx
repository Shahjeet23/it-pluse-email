import { VideoPlayer } from '@/components/video-player';
import { EnrollmentForm } from '@/components/enrollment-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function HomePage() {
  const programDetails = [
    "Qualification – Graduate any",
    "Age Requirement – 18 to 30",
    "Online Examination: 1- After Exam Qualified, 2- Interview Session, 3- Training Letter",
    "Training Session – Three Month Campus training in Bangalore (per month provided Stipend)",
    "Salary After Training – Gross CTC Rs 4.4 LPA",
    "Campus + On-The-Job Training",
    "Free Android Tablet on Joining",
    "Start earning Salary from Month Five of your Training"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 md:px-8 font-body">
      <main className="container mx-auto max-w-3xl flex flex-col items-center space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tight">
            Young Banker Program
          </h1>
          <p className="text-xl text-muted-foreground font-headline">
            with <span className="font-bold text-primary/90">IT PLUS, BHARUCH</span>
          </p>
          <p className="text-lg text-foreground/80 max-w-xl mx-auto">
            Kickstart your dynamic career in the banking sector. Apply today for our comprehensive training program and secure your future.
          </p>
        </header>
        
        {/* Placeholder video URL. Replace with actual marketing video. */}
        <VideoPlayer videoSrc="https://www.youtube.com/embed/BuResXv05sA" title="Young Banker Program Introduction" />

        <Card className="w-full shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-center text-primary">Program Highlights</CardTitle>
            <CardDescription className="text-center text-muted-foreground">Discover the benefits of joining our Young Banker Program.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {programDetails.map((detail, index) => (
                <li key={index} className="flex items-start space-x-2 p-2 rounded-md hover:bg-primary/5 transition-colors">
                  <CheckCircle className="h-5 w-5 text-accent-foreground mr-1 mt-0.5 shrink-0" />
                  <span className="text-foreground/90">{detail}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <EnrollmentForm />

        <footer className="text-center py-10 mt-12 border-t border-border/50 w-full">
          <p className="font-headline text-2xl font-semibold text-primary">IT PLUS, BHARUCH</p>
          <p className="text-muted-foreground mt-1">
            For inquiries, contact us at: <a href="tel:7433876241" className="text-primary hover:underline font-semibold">7433876241</a>
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Please submit your resume and application using the form above.
          </p>
        </footer>
      </main>
    </div>
  );
}
