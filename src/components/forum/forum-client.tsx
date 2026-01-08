'use client';
import { useState, useTransition, Fragment } from 'react';
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp, arrayUnion, query, orderBy } from 'firebase/firestore';
import type { ForumPost, ForumReply } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send, MessageCircle, ChevronsLeft, ChevronsRight, MessageSquare, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';


const POSTS_PER_PAGE = 5;

function PostQuestionForm({ onNewPost }: { onNewPost: () => void }) {
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

    startTransition(async () => {
      const postsCollection = collection(firestore, 'forum_posts');
      try {
        await addDocumentNonBlocking(postsCollection, {
          authorName,
          question,
          replies: [] as ForumReply[],
          timestamp: serverTimestamp(),
          isClosed: false,
        });
        
        toast({
          title: 'Question Submitted!',
          description: 'Your question has been posted to the forum.',
        });
        (e.target as HTMLFormElement).reset();
        onNewPost();

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
          <CardDescription>Your question will be visible to the entire community. Anyone can reply.</CardDescription>
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
            Post to Forum
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}


function ReplyForm({ postId, onReplied }: { postId: string, onReplied: () => void }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const firestore = useFirestore();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const reply = formData.get('reply') as string;
        const authorName = formData.get('authorName') as string || 'Anonymous';

        if (!reply.trim() || !authorName.trim()) {
            toast({ title: 'Please provide your name and a reply.', variant: 'destructive' });
            return;
        }

        startTransition(() => {
            const postRef = doc(firestore, 'forum_posts', postId);
            const newReply: ForumReply = {
                id: uuidv4(),
                authorName,
                reply,
                timestamp: new Date(),
                isAdminReply: false,
            };
            updateDocumentNonBlocking(postRef, {
                replies: arrayUnion(newReply)
            });
            toast({ title: 'Reply posted!' });
            (e.target as HTMLFormElement).reset();
            onReplied();
        });
    }

    return (
        <Card className="bg-muted/30 mt-6">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="text-lg font-headline">Write a Reply</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor={`reply-name-${postId}`}>Your Name</Label>
                        <Input id={`reply-name-${postId}`} name="authorName" placeholder="e.g., Fatima Z." required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`reply-text-${postId}`}>Your Reply</Label>
                        <Textarea id={`reply-text-${postId}`} name="reply" placeholder="Share your thoughts..." required rows={3} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageCircle className="mr-2 h-4 w-4" />}
                        Submit Reply
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}


export default function ForumClient() {
    const firestore = useFirestore();
    const forumQuery = useMemoFirebase(() => query(collection(firestore, 'forum_posts'), orderBy('timestamp', 'desc')), [firestore]);
    const { data: forumPosts, isLoading, error, refetch } = useCollection<ForumPost>(forumQuery);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = forumPosts ? Math.ceil(forumPosts.length / POSTS_PER_PAGE) : 0;
    const paginatedPosts = forumPosts?.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    return (
        <>
            <PostQuestionForm onNewPost={refetch} />

            <div className="space-y-8 mt-12">
                {isLoading && [...Array(3)].map((_,i) => <Skeleton key={i} className="h-60 w-full" />)}
                
                {error && <p className="text-destructive text-center">Could not load forum posts. Please try again later.</p>}

                {paginatedPosts?.map((post) => (
                    <Card key={post.id} className={cn("shadow-md", post.isClosed && "bg-muted/20")}>
                        <CardHeader>
                            <div className="flex gap-4 items-start">
                                <Avatar>
                                    <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <CardTitle className="text-lg font-headline">Question from {post.authorName}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {post.timestamp?.toDate().toLocaleDateString()}
                                    </p>
                                </div>
                                {post.isClosed && (
                                    <Badge variant="destructive" className="gap-1">
                                        <Lock className="h-3 w-3" />
                                        Closed
                                    </Badge>
                                )}
                            </div>
                            <p className="text-foreground/90 pt-4 text-base">{post.question}</p>
                        </CardHeader>
                        
                        <CardContent>
                            {post.replies?.length > 0 && (
                                <div className="ml-8 mt-4 space-y-4 border-l-2 pl-8">
                                    {post.replies.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)).map((reply) => (
                                        <div key={reply.id} className="flex gap-4">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs">
                                                    {reply.authorName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-grow">
                                                <div className='flex items-center gap-2'>
                                                    <p className="font-semibold text-sm">{reply.authorName}</p>
                                                    {reply.isAdminReply && <Badge variant="secondary">Official</Badge>}
                                                </div>
                                                <p className="text-foreground/80">{reply.reply}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {post.isClosed ? (
                                <div className="mt-6 text-center text-sm text-muted-foreground p-4 bg-muted/30 rounded-md">
                                    This thread has been closed by an administrator. No new replies can be added.
                                </div>
                            ) : (
                                <ReplyForm postId={post.id} onReplied={refetch} />
                            )}
                        </CardContent>
                    </Card>
                ))}

                 {!isLoading && forumPosts?.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <MessageSquare className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No questions yet</h3>
                        <p>Be the first to ask a question and start a conversation!</p>
                    </div>
                 )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-12">
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </>
    );
}

// Add this to your project if it's not already there.
// `npm install uuid` and `npm install @types/uuid -D`
// For this environment, we'll assume it's available.
declare module 'uuid' {
    export function v4(): string;
}
