'use client';
import { useState } from 'react';
import { useCollection, setDocumentNonBlocking, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { ForumPost } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, HelpCircle, Send } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

type ForumPostWithId = ForumPost & { id: string };

export default function ForumManager() {
  const firestore = useFirestore();
  const forumPostsQuery = useMemoFirebase(() => collection(firestore, 'forum_posts'), [firestore]);
  const { data: posts, isLoading } = useCollection<ForumPost>(forumPostsQuery);
  const { toast } = useToast();
  const [answers, setAnswers] = useState<{[key: string]: string}>({});

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handlePublish = (post: ForumPostWithId) => {
    const postRef = doc(firestore, 'forum_posts', post.id);
    const answer = answers[post.id];
    setDocumentNonBlocking(postRef, { ...post, answer, isAnswered: true }, { merge: true });
    toast({
      title: 'Answer Published',
      description: `Your answer to "${post.question.substring(0, 30)}..." has been published.`,
    });
  };

  const unansweredPosts = posts?.filter(p => !p.isAnswered) || [];
  const answeredPosts = posts?.filter(p => p.isAnswered) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forum Management</CardTitle>
        <CardDescription>Review and answer questions from the community.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><HelpCircle className='text-primary' />Awaiting Answers</h3>
          {isLoading && <div className='space-y-2'>{[...Array(2)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>}
          {unansweredPosts.length > 0 ? (
            <div className="space-y-4">
              {unansweredPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <p className="text-muted-foreground">From: {post.authorName}</p>
                    <CardTitle className="text-lg">{post.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Write your answer here..."
                      value={answers[post.id] || ''}
                      onChange={(e) => handleAnswerChange(post.id, e.target.value)}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handlePublish(post)} disabled={!answers[post.id]}>
                      <Send className="mr-2 h-4 w-4" /> Publish Answer
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            !isLoading && <p className="text-center text-muted-foreground py-8">No unanswered questions.</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><CheckCircle className='text-green-500' />Answered Questions</h3>
           {isLoading && <div className='space-y-2'>{[...Array(1)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>}
          {answeredPosts.length > 0 ? (
            <div className="space-y-4">
              {answeredPosts.map((post) => (
                <Card key={post.id} className='bg-secondary/50'>
                  <CardHeader>
                    <p className="text-muted-foreground">From: {post.authorName}</p>
                    <CardTitle className="text-base font-normal">{post.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="border-l-2 border-primary pl-4">{post.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            !isLoading && <p className="text-center text-muted-foreground py-8">No questions have been answered yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
