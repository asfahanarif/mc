import { PageHeader } from "@/components/shared/page-header";
import { forumPosts, placeholderImages } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, HelpCircle } from "lucide-react";
import ForumClient from "@/components/forum/forum-client";

export default function ForumPage() {
    const forumImage = placeholderImages.find(p => p.id === 'forum-bg');

    return (
        <div>
            <PageHeader
                title="Open Forum Q&amp;A"
                subtitle="Ask your questions and learn from the community. Answers are provided by our admin team."
                image={forumImage}
            />
            <section className="py-16 md:py-24">
                <div className="container max-w-4xl space-y-12">
                    <ForumClient allQuestions={forumPosts} />

                    <div className="space-y-8">
                        {forumPosts.filter(p => p.isAnswered).map((post) => (
                            <Card key={post.id} className="shadow-md">
                                <CardHeader className="flex-row gap-4 items-start">
                                    <Avatar>
                                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">Question from {post.author}</CardTitle>
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
                         {forumPosts.filter(p => !p.isAnswered).map((post) => (
                            <Card key={post.id} className="opacity-70">
                                <CardHeader className="flex-row gap-4 items-center">
                                    <Avatar>
                                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">Question from {post.author}</CardTitle>
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
