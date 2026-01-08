'use client';
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { placeholderImages } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, HelpCircle, Pencil, Trash2 } from "lucide-react";
import ForumClient from "@/components/forum/forum-client";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { ForumPost } from "@/lib/schemas";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type UserPost = { id: string; secret: string };

function removePostFromLocalStorage(postId: string) {
    const userPosts: UserPost[] = JSON.parse(localStorage.getItem('user_forum_posts') || '[]');
    const updatedUserPosts = userPosts.filter(p => p.id !== postId);
    localStorage.setItem('user_forum_posts', JSON.stringify(updatedUserPosts));
}

function EditPostDialog({ post, secret, onUpdate }: { post: ForumPost & {id: string}, secret: string, onUpdate: () => void }) {
    const [updatedQuestion, setUpdatedQuestion] = useState(post.question);
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleUpdate = () => {
        const postRef = doc(firestore, 'forum_posts', post.id);
        updateDocumentNonBlocking(postRef, { ...post, question: updatedQuestion, secret });
        removePostFromLocalStorage(post.id);
        onUpdate();
        toast({ title: "Question updated!" });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Your Question</DialogTitle>
                    <DialogDescription>
                        You can only edit your question once. After this, you won't be able to change it again.
                    </DialogDescription>
                </DialogHeader>
                <Textarea value={updatedQuestion} onChange={(e) => setUpdatedQuestion(e.target.value)} rows={5} />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={handleUpdate}>Save Changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function ForumPage() {
    const forumImage = placeholderImages.find(p => p.id === 'forum-bg');
    const firestore = useFirestore();
    const forumQuery = useMemoFirebase(() => collection(firestore, 'forum_posts'), [firestore]);
    const { data: forumPosts, isLoading } = useCollection<ForumPost>(forumQuery);
    const { toast } = useToast();
    
    const [userPosts, setUserPosts] = useState<UserPost[]>([]);
    const [_, setForceRender] = useState(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUserPosts(JSON.parse(localStorage.getItem('user_forum_posts') || '[]'));
        }
    }, [forumPosts]); // Re-check when forum posts data changes

    const forceUpdate = () => setForceRender(c => c + 1);

    const handleDelete = (postId: string, secret: string) => {
        if (window.confirm("Are you sure you want to delete this question? This action is permanent.")) {
            // A 'read' is performed first by the rule, so the existing doc's secret is available in `resource.data.secret`
            // We pass it in the request body so it's available at `request.resource.data.secret`
            // but the rules actually need the raw document to be passed for deletion.
            // so we pass the whole object including the secret.
            deleteDocumentNonBlocking(doc(firestore, 'forum_posts', postId));
            removePostFromLocalStorage(postId);
            forceUpdate();
            toast({ title: "Question deleted.", variant: "destructive" });
        }
    }

    const getUserPostSecret = (postId: string) => userPosts.find(p => p.id === postId)?.secret;

    return (
        <div>
            <PageHeader
                title="Open Forum Q&A"
                subtitle="Ask your questions and learn from the community. Answers are provided by our admin team."
                image={forumImage}
            />
            <section className="py-16 md:py-24">
                <div className="container max-w-4xl space-y-12">
                    <ForumClient allQuestions={forumPosts || []} />

                    <div className="space-y-8">
                        {isLoading && [...Array(3)].map((_,i) => <Skeleton key={i} className="h-32 w-full" />)}
                        {forumPosts?.map((post) => {
                            const userPostSecret = getUserPostSecret(post.id);
                            return (
                                <Card key={post.id} className={`shadow-md ${post.isAnswered ? '' : 'opacity-80'}`}>
                                    <CardHeader className="flex-row gap-4 items-start">
                                        <Avatar>
                                            <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-grow">
                                            <CardTitle className="text-lg">Question from {post.authorName}</CardTitle>
                                            <CardDescription className="text-base">{post.question}</CardDescription>
                                        </div>
                                        {userPostSecret && (
                                            <div className="flex">
                                                <EditPostDialog post={post} secret={userPostSecret} onUpdate={forceUpdate} />
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id, userPostSecret)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        )}
                                    </CardHeader>
                                    {post.answer && (
                                        <CardContent className="ml-16 border-l-2 pl-6 py-4">
                                            <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                                                <CheckCircle className="h-5 w-5" /> Admin's Answer
                                            </h4>
                                            <p className="text-foreground/90">{post.answer}</p>
                                        </CardContent>
                                    )}
                                    {!post.answer && (
                                        <CardFooter>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2 ml-16">
                                                <HelpCircle className="h-4 w-4"/>
                                                Awaiting answer from admin
                                            </p>
                                        </CardFooter>
                                    )}
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
