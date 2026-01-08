'use client';
import { useState, useEffect, Fragment } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { placeholderImages } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, HelpCircle, Pencil, Trash2, Reply, ChevronsLeft, ChevronsRight } from "lucide-react";
import ForumClient from "@/components/forum/forum-client";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc, serverTimestamp, arrayUnion, query, orderBy } from "firebase/firestore";
import type { ForumPost, ForumReply } from "@/lib/schemas";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type UserPost = { id: string; secret: string; authorName: string };

const POSTS_PER_PAGE = 10;

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

function ReplyForm({ post, userPost, onReplied }: { post: ForumPost & {id: string}, userPost: UserPost, onReplied: () => void }) {
    const [replyText, setReplyText] = useState("");
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleReply = () => {
        if (!replyText.trim()) return;

        const postRef = doc(firestore, 'forum_posts', post.id);
        const newReply: Omit<ForumReply, 'id' | 'timestamp'> = {
            authorName: userPost.authorName,
            authorType: 'user',
            reply: replyText,
            timestamp: serverTimestamp(),
        };

        // We need to pass the secret to satisfy security rules
        updateDocumentNonBlocking(postRef, { 
            replies: arrayUnion(newReply),
            secret: userPost.secret 
        });
        
        toast({ title: "Reply posted!" });
        setReplyText("");
        onReplied();
    };

    return (
        <div className="ml-12 mt-4 space-y-2 border-t pt-4">
            <Textarea 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)} 
                placeholder="Write your reply..." 
                rows={3}
            />
            <Button onClick={handleReply} size="sm">
                <Reply className="mr-2 h-4 w-4" />
                Post Reply
            </Button>
        </div>
    );
}

export default function ForumPage() {
    const forumImage = placeholderImages.find(p => p.id === 'forum-bg');
    const firestore = useFirestore();
    const forumQuery = useMemoFirebase(() => query(collection(firestore, 'forum_posts'), orderBy('timestamp', 'desc')), [firestore]);
    const { data: forumPosts, isLoading } = useCollection<ForumPost>(forumQuery);
    const { toast } = useToast();
    
    const [userPosts, setUserPosts] = useState<UserPost[]>([]);
    const [_, setForceRender] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUserPosts(JSON.parse(localStorage.getItem('user_forum_posts') || '[]'));
        }
    }, [forumPosts]);

    const forceUpdate = () => setForceRender(c => c + 1);

    const handleDelete = (postId: string, secret: string) => {
        if (window.confirm("Are you sure you want to delete this question? This action is permanent.")) {
            const postRef = doc(firestore, 'forum_posts', postId);
            // "Delete" by updating the document to remove the secret, which security rules can validate.
            // This makes the action non-repeatable for the user.
            updateDocumentNonBlocking(postRef, { secret: null });
            removePostFromLocalStorage(postId);
            forceUpdate();
            toast({ title: "Question deleted.", variant: "destructive" });
        }
    }

    const getUserPost = (postId: string) => userPosts.find(p => p.id === postId);

    const visiblePosts = forumPosts?.filter(post => post.secret !== null);
    
    const totalPages = visiblePosts ? Math.ceil(visiblePosts.length / POSTS_PER_PAGE) : 0;
    const paginatedPosts = visiblePosts?.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    return (
        <div>
            <PageHeader
                title="Open Forum Q&A"
                subtitle="Ask your questions and learn from the community. Answers are provided by our admin team."
                image={forumImage}
            />
            <section className="py-16 md:py-24">
                <div className="container max-w-4xl space-y-12">
                    <ForumClient />

                    <div className="space-y-8">
                        {isLoading && [...Array(3)].map((_,i) => <Skeleton key={i} className="h-40 w-full" />)}
                        {paginatedPosts?.map((post) => {
                            const userPost = getUserPost(post.id);
                            return (
                                <Card key={post.id} className="shadow-md">
                                    <CardHeader className="flex-row gap-4 items-start">
                                        <Avatar>
                                            <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-grow">
                                            <CardTitle className="text-lg">Question from {post.authorName}</CardTitle>
                                            <CardDescription className="text-base">{post.question}</CardDescription>
                                        </div>
                                        {userPost?.secret && (
                                            <div className="flex">
                                                <EditPostDialog post={post} secret={userPost.secret} onUpdate={forceUpdate} />
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id, userPost.secret)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        )}
                                    </CardHeader>
                                    
                                    <CardContent>
                                        {post.replies?.length > 0 ? (
                                            <div className="ml-8 space-y-4">
                                                {post.replies.map((reply, index) => (
                                                    <div key={index} className={cn(
                                                        "flex gap-4 p-4 rounded-lg",
                                                        reply.authorType === 'admin' ? 'bg-primary/10 border-l-4 border-primary' : 'bg-secondary'
                                                    )}>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="text-xs">
                                                                {reply.authorType === 'admin' ? 'A' : reply.authorName.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-grow">
                                                            <p className="font-semibold text-sm">
                                                                {reply.authorType === 'admin' ? "Admin" : reply.authorName}
                                                            </p>
                                                            <p className="text-foreground/90">{reply.reply}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <CardFooter>
                                                <p className="text-sm text-muted-foreground flex items-center gap-2 ml-16">
                                                    <HelpCircle className="h-4 w-4"/>
                                                    Awaiting answer from admin
                                                </p>
                                            </CardFooter>
                                        )}
                                    </CardContent>

                                    {userPost && post.isAnswered && (
                                        <ReplyForm post={post} userPost={userPost} onReplied={forceUpdate} />
                                    )}
                                </Card>
                            )
                        })}
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
                </div>
            </section>
        </div>
    );
}
