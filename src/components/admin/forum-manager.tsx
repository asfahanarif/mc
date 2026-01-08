
'use client';
import { useState } from 'react';
import { useCollection, updateDocumentNonBlocking, deleteDocumentNonBlocking, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, arrayUnion, serverTimestamp, arrayRemove, query, orderBy } from 'firebase/firestore';
import type { ForumPost, ForumReply } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Trash2, Bot, Loader2, MessageSquare } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getAnswerSuggestion } from '@/ai/flows/admin-assisted-q-and-a';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';

type ForumPostWithId = ForumPost & { id: string };

function AdminReplyForm({ post, onReplied }: { post: ForumPostWithId, onReplied: () => void }) {
    const [replyText, setReplyText] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleGetAiSuggestion = async (question: string) => {
        setIsAiLoading(true);
        try {
            const result = await getAnswerSuggestion({ question });
            setReplyText(result.suggestedAnswer);
        } catch(e) {
            toast({ title: 'AI Suggestion Failed', description: 'Could not generate an AI suggestion.', variant: 'destructive' });
        } finally {
            setIsAiLoading(false);
        }
    };
    
    const handleReply = () => {
        if (!replyText.trim()) return;

        const postRef = doc(firestore, 'forum_posts', post.id);
        const newReply: Omit<ForumReply, 'id' | 'timestamp'> = {
            authorName: 'Admin',
            authorType: 'admin',
            reply: replyText,
            timestamp: serverTimestamp(),
        };

        updateDocumentNonBlocking(postRef, {
            replies: arrayUnion(newReply),
            isAnswered: true
        });
        
        toast({ title: "Reply published!" });
        setReplyText("");
        onReplied();
    };

    return (
        <div className="mt-4 border-t pt-4">
            <Textarea
              placeholder="Write your answer or reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
            />
            <div className="mt-2 flex justify-between">
                <div className='flex gap-2'>
                    <Button onClick={handleReply} disabled={!replyText}>
                      <Send className="mr-2 h-4 w-4" /> Publish Reply
                    </Button>
                    <Button variant="outline" onClick={() => handleGetAiSuggestion(post.question)} disabled={isAiLoading}>
                       {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                        AI Suggestion
                    </Button>
                </div>
            </div>
        </div>
    );
}


export default function ForumManager() {
  const firestore = useFirestore();
  const forumPostsQuery = useMemoFirebase(() => query(collection(firestore, 'forum_posts'), orderBy('timestamp', 'desc')), [firestore]);
  const { data: posts, isLoading } = useCollection<ForumPost>(forumPostsQuery);
  const { toast } = useToast();
  const [_, forceUpdate] = useState(0);

  const handleDeletePost = (post: ForumPostWithId) => {
    if (window.confirm(`Are you sure you want to delete the question from ${post.authorName}? This is permanent.`)) {
        const postRef = doc(firestore, 'forum_posts', post.id);
        deleteDocumentNonBlocking(postRef);
        toast({
            title: 'Post Deleted',
            description: 'The question has been permanently removed.',
            variant: 'destructive',
        })
    }
  }

  const handleDeleteReply = (post: ForumPostWithId, reply: ForumReply) => {
     if (window.confirm(`Are you sure you want to delete this reply? This is permanent.`)) {
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

  const sortedPosts = posts?.sort((a,b) => (a.isAnswered ? 1 : -1) - (b.isAnswered ? 1 : -1) || (b.timestamp?.seconds ?? 0) - (a.timestamp?.seconds ?? 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forum Management</CardTitle>
        <CardDescription>Review questions and manage conversation threads from the community.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        
        {sortedPosts?.map((post) => (
          <Card key={post.id} className={cn(!post.isAnswered && "border-2 border-primary/50")}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">From: {post.authorName}</p>
                  <CardTitle className="text-lg mt-1">{post.question}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeletePost(post)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {post.replies?.length > 0 && (
                <div className="space-y-4">
                  {post.replies.map((reply, index) => (
                    <div key={reply.id || index} className="flex gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {reply.authorType === 'admin' ? 'A' : reply.authorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                          "flex-grow p-3 rounded-lg",
                          reply.authorType === 'admin' ? 'bg-primary/10' : 'bg-secondary'
                      )}>
                        <div className='flex justify-between items-center'>
                             <p className="font-semibold text-sm">{reply.authorType === 'admin' ? 'Admin' : reply.authorName}</p>
                             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteReply(post, reply)}>
                                <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                        </div>
                        <p className="text-foreground/90 mt-1">{reply.reply}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <AdminReplyForm post={post} onReplied={() => forceUpdate(c => c + 1)} />
            </CardContent>
          </Card>
        ))}

        {!isLoading && posts?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">No questions yet</h3>
                <p>When users ask questions, they will appear here.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
