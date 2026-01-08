
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
import type { ForumReply } from '@/lib/schemas';

// Helper to generate a simple random token
const generateSecret = () => Math.random().toString(36).substring(2);

export default function ForumClient({ onNewPost }: { onNewPost: () => void }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const firestore = useFirestore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const question = formData.get('question') as string;
    const authorName = formData.get('authorName') as string || 'Anonymous';
    
    if (!question.trim() || !authorName.trim()) {
        toast({ title: 'Please fill out all fields.', variant: 'destructive' });
        return;
    }

    const secret = generateSecret();

    startTransition(async () => {
      const postsCollection = collection(firestore, 'forum_posts');
      try {
        const docRef = await addDocumentNonBlocking(postsCollection, {
          authorName,
          question,
          replies: [] as ForumReply[],
          isAnswered: false,
          timestamp: serverTimestamp(),
          secret,
        });

        if (docRef) {
          // Store the post ID and secret in local storage
          const userPosts = JSON.parse(localStorage.getItem('user_forum_posts') || '[]');
          userPosts.push({ id: docRef.id, secret, authorName });
          localStorage.setItem('user_forum_posts', JSON.stringify(userPosts));
          onNewPost();
        }
        
        toast({
          title: 'Question Submitted!',
          description: 'Your question has been sent to the admin team for review.',
        });
        (e.target as HTMLFormElement).reset();

      } catch (error) {
         toast({
          title: 'Error',
          description: 'Could not submit your question. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="font-headline">Ask a Question</CardTitle>
          <CardDescription>Your question will be reviewed and answered by an admin. You'll be able to edit or delete it from this browser.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="authorName">Your Name</Label>
            <Input id="authorName" name="authorName" placeholder="e.g., Aisha B." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="question">Your Question</Label>
            <Textarea id="question" name="question" placeholder="What is the ruling on..." required rows={4} />
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
