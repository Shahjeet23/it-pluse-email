import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-body">
      <Card className="w-full max-w-md shadow-xl text-center rounded-lg overflow-hidden">
        <CardHeader className="bg-background p-8">
          <div className="mx-auto bg-accent rounded-full p-4 w-fit shadow-md">
            <CheckCircle2 className="h-16 w-16 text-accent-foreground" />
          </div>
          <CardTitle className="font-headline text-4xl mt-6 text-primary">Thank You!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Your application has been submitted successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <p className="text-muted-foreground">
            We have received your information and will get back to you shortly if your profile matches our requirements.
          </p>
          <p className="font-semibold text-foreground">
            Best Regards, <br/> <span className="font-headline">IT PLUS, BHARUCH</span>
          </p>
          <Button asChild variant="default" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-transform transform hover:scale-105">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
