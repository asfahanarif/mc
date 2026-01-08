'use client';

import { useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

export default function ForumClient({ allQuestions }: { allQuestions: any[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const firestore = useFirestore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const question = formData.get('question') as string;
    const authorName = formData.get('authorName') as string || 'Anonymous';


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

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="font-headline">Ask a Question</CardTitle>
          <CardDescription>Your question will be reviewed and answered by an admin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="authorName">Your Name</Label>
            <Input id="authorName" name="authorName" placeholder="e.g., Aisha B." required />
          </div>
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
