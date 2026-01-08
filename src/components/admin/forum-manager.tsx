'use client';
import { useState } from 'react';
import { useCollection, setDocumentNonBlocking, deleteDocumentNonBlocking, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { ForumPost } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, HelpCircle, Send, Trash2, Edit, Bot, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getAnswerSuggestion } from '@/ai/flows/admin-assisted-q-and-a';

type ForumPostWithId = ForumPost & { id: string };

export default function ForumManager() {
  const firestore = useFirestore();
  const forumPostsQuery = useMemoFirebase(() => collection(firestore, 'forum_posts'), [firestore]);
  const { data: posts, isLoading } = useCollection<ForumPost>(forumPostsQuery);
  const { toast } = useToast();

  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<{[key: string]: boolean}>({});

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };
  
  const handleGetAiSuggestion = async (id: string, question: string) => {
    setIsAiLoading(prev => ({...prev, [id]: true}));
    try {
        const result = await getAnswerSuggestion({ question });
        handleAnswerChange(id, result.suggestedAnswer);
    } catch(e) {
        toast({ title: 'AI Suggestion Failed', description: 'Could not generate an AI suggestion.', variant: 'destructive' });
    } finally {
        setIsAiLoading(prev => ({...prev, [id]: false}));
    }
  };

  const handleSave = (post: ForumPostWithId) => {
    const postRef = doc(firestore, 'forum_posts', post.id);
    const answer = answers[post.id] ?? post.answer; // Use new answer if available
    setDocumentNonBlocking(postRef, { ...post, answer, isAnswered: true }, { merge: true });
    toast({
      title: 'Answer Published',
      description: `Your answer to "${post.question.substring(0, 30)}..." has been saved.`,
    });
    setEditingPostId(null);
  };
  
  const handleDelete = (post: ForumPostWithId) => {
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
  
  const startEditing = (post: ForumPostWithId) => {
    setEditingPostId(post.id);
    if(post.answer) {
        handleAnswerChange(post.id, post.answer);
    }
  }

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
                  <CardFooter className='flex justify-between'>
                    <div className='flex gap-2'>
                        <Button onClick={() => handleSave(post)} disabled={!answers[post.id]}>
                          <Send className="mr-2 h-4 w-4" /> Publish Answer
                        </Button>
                        <Button variant="outline" onClick={() => handleGetAiSuggestion(post.id, post.question)} disabled={isAiLoading[post.id]}>
                           {isAiLoading[post.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                            AI Suggestion
                        </Button>
                    </div>
                     <Button variant="ghost" size="icon" onClick={() => handleDelete(post)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
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
                    {editingPostId === post.id ? (
                       <Textarea
                          value={answers[post.id] || ''}
                          onChange={(e) => handleAnswerChange(post.id, e.target.value)}
                        />
                    ) : (
                        <p className="border-l-2 border-primary pl-4">{post.answer}</p>
                    )}
                  </CardContent>
                  <CardFooter className='flex justify-between'>
                     {editingPostId === post.id ? (
                        <div className='flex gap-2'>
                            <Button onClick={() => handleSave(post)}>Save Changes</Button>
                            <Button variant="outline" onClick={() => handleGetAiSuggestion(post.id, post.question)} disabled={isAiLoading[post.id]}>
                                {isAiLoading[post.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                                AI Suggestion
                            </Button>
                            <Button variant="ghost" onClick={() => setEditingPostId(null)}>Cancel</Button>
                        </div>
                     ) : (
                        <Button variant="ghost" onClick={() => startEditing(post)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Answer
                        </Button>
                     )}
                     <Button variant="ghost" size="icon" onClick={() => handleDelete(post)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                     </Button>
                  </CardFooter>
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
