'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, useFirestore, useFirebase } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export default function ForumClient({ allQuestions }: { allQuestions: any[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const firestore = useFirestore();
  const { user, isUserLoading } = useFirebase();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be signed in to ask a question.',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const question = formData.get('question') as string;
    // Use the signed-in user's name or a default
    const authorName = user.displayName || user.email || 'Anonymous';


    startTransition(() => {
      const postsCollection = collection(firestore, 'forum_posts');
      addDocumentNonBlocking(postsCollection, {
        authorName,
        question,
        answer: null,
        isAnswered: false,
        timestamp: serverTimestamp(),
      });
      
      toast({
        title: 'Question Submitted!',
        description: 'Your question has been sent to the admin team for review.',
      });
      (e.target as HTMLFormElement).reset();
    });
  };

  if (isUserLoading) {
    return null; // Or a loading skeleton
  }

  if (!user) {
    return (
        <Alert>
            <AlertTitle className="font-headline">Sign In to Participate</AlertTitle>
            <AlertDescription>
                To ask a question in the forum, you need to be signed in. Please{' '}
                <Link href="/admin" className="font-bold text-primary hover:underline">
                    sign in via the admin panel
                </Link>
                .
            </AlertDescription>
        </Alert>
    )
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="font-headline">Ask a Question</CardTitle>
          <CardDescription>Your question will be reviewed and answered by an admin. You are asking as: <span className='font-bold'>{user.displayName || user.email}</span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Your Question</Label>
            <Textarea id="question" name="question" placeholder="What is the ruling on..." required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Submit Question
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
