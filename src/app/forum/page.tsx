'use client';
import { PageHeader } from "@/components/shared/page-header";
import { placeholderImages } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, HelpCircle } from "lucide-react";
import ForumClient from "@/components/forum/forum-client";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { ForumPost } from "@/lib/schemas";
import { Skeleton } from "@/components/ui/skeleton";

export default function ForumPage() {
    const forumImage = placeholderImages.find(p => p.id === 'forum-bg');
    const firestore = useFirestore();
    const forumQuery = useMemoFirebase(() => collection(firestore, 'forum_posts'), [firestore]);
    const { data: forumPosts, isLoading } = useCollection<ForumPost>(forumQuery);

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
                        {forumPosts?.filter(p => p.isAnswered).map((post) => (
                            <Card key={post.id} className="shadow-md">
                                <CardHeader className="flex-row gap-4 items-start">
                                    <Avatar>
                                        <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">Question from {post.authorName}</CardTitle>
                                        <CardDescription className="text-base">{post.question}</CardDescription>
                                    </div>
                                </CardHeader>
                                {post.answer && (
                                    <CardContent className="ml-16 border-l-2 pl-6 py-4">
                                        <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                                            <CheckCircle className="h-5 w-5" /> Admin's Answer
                                        </h4>
                                        <p className="text-foreground/90">{post.answer}</p>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                         {forumPosts?.filter(p => !p.isAnswered).map((post) => (
                            <Card key={post.id} className="opacity-70">
                                <CardHeader className="flex-row gap-4 items-center">
                                    <Avatar>
                                        <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">Question from {post.authorName}</CardTitle>
                                        <CardDescription>{post.question}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardFooter>
                                     <p className="text-sm text-muted-foreground flex items-center gap-2 ml-16">
                                        <HelpCircle className="h-4 w-4"/>
                                        Awaiting answer from admin
                                    </p>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
