'use client';
import { useState } from 'react';
import { useCollection, updateDocumentNonBlocking, deleteDocumentNonBlocking, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, arrayUnion, serverTimestamp, arrayRemove, query, orderBy } from 'firebase/firestore';
import type { ForumPost, ForumReply } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Pencil, Save, X, MessageSquare, Lock, MessageCircle, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { v4 as uuidv4 } from 'uuid';
import { getAnswerSuggestion, type GetAnswerSuggestionInput } from '@/ai/flows/admin-assisted-q-and-a';

type ForumPostWithId = ForumPost & { id: string };

function EditContentDialog({
  title,
  description,
  initialValue,
  onSave
}: {
  title: string,
  description: string,
  initialValue: string,
  onSave: (newValue: string) => void
}) {
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSave(value);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
            <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Textarea value={value} onChange={(e) => setValue(e.target.value)} rows={6}/>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function AdminReplyForm({ postId, question, onReplied }: { postId: string, question: string, onReplied: () => void }) {
    const { toast } = useToast();
    const [isPending, setIsPending] = useState(false);
    const [isGettingSuggestion, setIsGettingSuggestion] = useState(false);
    const [replyText, setReplyText] = useState('');
    const firestore = useFirestore();

    const handleGetSuggestion = async () => {
        setIsGettingSuggestion(true);
        try {
            const input: GetAnswerSuggestionInput = { question };
            const result = await getAnswerSuggestion(input);
            setReplyText(result.suggestedAnswer);
        } catch (error) {
            console.error('Error getting AI suggestion:', error);
            toast({ title: 'Error', description: 'Could not get an AI suggestion.', variant: 'destructive' });
        } finally {
            setIsGettingSuggestion(false);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!replyText.trim()) {
            toast({ title: 'Please provide a reply.', variant: 'destructive' });
            return;
        }

        setIsPending(true);

        const postRef = doc(firestore, 'forum_posts', postId);
        const newReply: ForumReply = {
            id: uuidv4(),
            authorName: 'Official',
            reply: replyText,
            timestamp: new Date(),
            isAdminReply: true,
        };

        updateDocumentNonBlocking(postRef, {
            replies: arrayUnion(newReply)
        });
        
        toast({ title: 'Reply posted as Official!' });
        setReplyText('');
        onReplied();
        setIsPending(false);
    }

    return (
        <Card className="bg-primary/5 mt-4">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="text-base font-headline flex items-center justify-between">
                        <span>Reply as Official</span>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleGetSuggestion}
                            disabled={isGettingSuggestion}
                        >
                            {isGettingSuggestion ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Get AI Suggestion
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your official answer..." 
                        required 
                        rows={4} />
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageCircle className="mr-2 h-4 w-4" />}
                        Submit Reply
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}


export default function ForumManager() {
  const firestore = useFirestore();
  const forumPostsQuery = useMemoFirebase(() => query(collection(firestore, 'forum_posts'), orderBy('timestamp', 'desc')), [firestore]);
  const { data: posts, isLoading, refetch } = useCollection<ForumPost>(forumPostsQuery);
  const { toast } = useToast();

  const handleDeletePost = (post: ForumPostWithId) => {
    if (window.confirm(`Are you sure you want to delete the question from ${post.authorName}? This will delete all replies and is permanent.`)) {
        const postRef = doc(firestore, 'forum_posts', post.id);
        deleteDocumentNonBlocking(postRef);
        toast({
            title: 'Post Deleted',
            description: 'The question has been permanently removed.',
            variant: 'destructive',
        })
    }
  }

  const handleEditQuestion = (post: ForumPostWithId, newQuestion: string) => {
      const postRef = doc(firestore, 'forum_posts', post.id);
      updateDocumentNonBlocking(postRef, { question: newQuestion });
      toast({ title: "Question updated successfully." });
  }

  const handleEditReply = (post: ForumPostWithId, originalReply: ForumReply, newReplyText: string) => {
    const postRef = doc(firestore, 'forum_posts', post.id);
    const updatedReply = { ...originalReply, reply: newReplyText };
    
    updateDocumentNonBlocking(postRef, {
        replies: arrayRemove(originalReply)
    }).then(() => {
        updateDocumentNonBlocking(postRef, {
            replies: arrayUnion(updatedReply)
        });
    });

    toast({ title: "Reply updated successfully." });
  }

  const handleDeleteReply = (post: ForumPostWithId, reply: ForumReply) => {
     if (window.confirm(`Are you sure you want to delete this reply from ${reply.authorName}? This is permanent.`)) {
        const postRef = doc(firestore, 'forum_posts', post.id);
        updateDocumentNonBlocking(postRef, {
            replies: arrayRemove(reply)
        });
        toast({
            title: 'Reply Deleted',
            variant: 'destructive'
        })
     }
  }

  const handleToggleCloseThread = (post: ForumPostWithId) => {
    const postRef = doc(firestore, 'forum_posts', post.id);
    const newStatus = !post.isClosed;
    updateDocumentNonBlocking(postRef, { isClosed: newStatus });
    toast({
      title: newStatus ? 'Thread Closed' : 'Thread Re-opened',
      description: newStatus ? 'Users can no longer reply to this thread.' : 'Users can now reply to this thread again.',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forum Management</CardTitle>
        <CardDescription>Review and moderate questions and replies from the community forum.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && [...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        
        {posts?.map((post) => (
          <Card key={post.id} className={cn("overflow-hidden", post.isClosed && "bg-muted/40 border-dashed")}>
            <CardHeader className='bg-muted/30'>
              <div className="flex justify-between items-start">
                <div>
                  <div className='flex items-center gap-2'>
                    <p className="text-sm text-muted-foreground">From: {post.authorName}</p>
                    {post.isClosed && <Badge variant="destructive"><Lock className="h-3 w-3 mr-1"/>Closed</Badge>}
                  </div>
                  <CardTitle className="text-lg mt-1">{post.question}</CardTitle>
                </div>
                <div className="flex items-center flex-shrink-0">
                    <Button variant="outline" size="sm" className='mr-2' onClick={() => handleToggleCloseThread(post)}>
                        <Lock className='h-4 w-4 mr-2' />
                        {post.isClosed ? 'Re-open' : 'Close'} Thread
                    </Button>
                    <EditContentDialog 
                        title="Edit Question"
                        description="Modify the original question text below."
                        initialValue={post.question}
                        onSave={(newValue) => handleEditQuestion(post, newValue)}
                    />
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeletePost(post)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className='p-4'>
              {post.replies?.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Replies ({post.replies.length})</h4>
                  {post.replies.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)).map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {reply.authorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow p-3 rounded-lg bg-secondary/50">
                        <div className='flex justify-between items-center'>
                             <div className='flex items-center gap-2'>
                                <p className="font-semibold text-sm">{reply.authorName}</p>
                                {reply.isAdminReply && (
                                    <Badge variant="secondary" className="gap-1 pl-2 pr-2.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                                        Official
                                    </Badge>
                                )}
                             </div>
                             <div className="flex items-center">
                                <EditContentDialog 
                                    title="Edit Reply"
                                    description={`Modifying reply from ${reply.authorName}.`}
                                    initialValue={reply.reply}
                                    onSave={(newValue) => handleEditReply(post, reply, newValue)}
                                />
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteReply(post, reply)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-foreground/90 mt-1">{reply.reply}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No replies yet.</p>
              )}
               {!post.isClosed && <AdminReplyForm postId={post.id} question={post.question} onReplied={() => refetch()} />}
            </CardContent>
          </Card>
        ))}

        {!isLoading && posts?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">No questions yet</h3>
                <p>When users ask questions, they will appear here for moderation.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
