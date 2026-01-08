
'use client';
import { useState } from 'react';
import { useCollection, updateDocumentNonBlocking, deleteDocumentNonBlocking, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, arrayUnion, serverTimestamp, arrayRemove, query, orderBy } from 'firebase/firestore';
import type { ForumPost, ForumReply } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Pencil, Save, X, MessageSquare } from 'lucide-react';
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


export default function ForumManager() {
  const firestore = useFirestore();
  const forumPostsQuery = useMemoFirebase(() => query(collection(firestore, 'forum_posts'), orderBy('timestamp', 'desc')), [firestore]);
  const { data: posts, isLoading } = useCollection<ForumPost>(forumPostsQuery);
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
    
    // Atomically remove the old reply and add the updated one
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forum Management</CardTitle>
        <CardDescription>Review and moderate questions and replies from the community forum.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && [...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        
        {posts?.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className='bg-muted/30'>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">From: {post.authorName}</p>
                  <CardTitle className="text-lg mt-1">{post.question}</CardTitle>
                </div>
                <div className="flex items-center flex-shrink-0">
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
                             <p className="font-semibold text-sm">{reply.authorName}</p>
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
