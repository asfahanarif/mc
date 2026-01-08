"use client";

import { useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ForumPost } from "@/lib/types";
import { getAnswerSuggestion } from "@/ai/flows/admin-assisted-q-and-a";

function QuestionForm() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(() => {
            // In a real app, this would be a server action to save the question
            toast({
                title: "Question Submitted!",
                description: "Your question has been sent to the admin team for review.",
            });
            (e.target as HTMLFormElement).reset();
        });
    }

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="font-headline">Ask a Question</CardTitle>
                    <CardDescription>Your question will be reviewed and answered by an admin.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input id="name" name="name" placeholder="Aisha B." required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="question">Your Question</Label>
                        <Textarea id="question" name="question" placeholder="What is the ruling on..." required />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Submit Question
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

function AdminPanel({ unansweredQuestions }: { unansweredQuestions: ForumPost[] }) {
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState<string | null>(null);
    const [suggestion, setSuggestion] = useState<{[key: string]: string}>({});

    const handleGetSuggestion = async (question: ForumPost) => {
        setIsGenerating(question.id);
        try {
            const result = await getAnswerSuggestion({ question: question.question });
            setSuggestion(prev => ({...prev, [question.id]: result.suggestedAnswer}));
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Could not generate suggestion.", variant: "destructive" });
        } finally {
            setIsGenerating(null);
        }
    }
    
    const handlePublish = (questionId: string) => {
        // In a real app, this would be a server action to update the data in a database/Google Sheet.
        toast({ title: "Published!", description: "The answer is now live on the site."});
    }

    return (
        <Card className="border-primary border-2 mt-12">
            <CardHeader>
                <CardTitle className="font-headline text-primary">Admin Panel</CardTitle>
                <CardDescription>Answer questions and use AI to get suggestions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {unansweredQuestions.map((q) => (
                    <Card key={q.id}>
                        <CardHeader>
                            <CardTitle className="text-base">{q.question}</CardTitle>
                            <CardDescription>From: {q.author}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGetSuggestion(q)}
                                disabled={!!isGenerating}
                            >
                                {isGenerating === q.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
                                Get AI Answer Suggestion
                            </Button>
                            <Textarea 
                                placeholder="Edit and publish the answer here..." 
                                value={suggestion[q.id] || ''}
                                onChange={(e) => setSuggestion(prev => ({...prev, [q.id]: e.target.value}))}
                                rows={5}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => handlePublish(q.id)}>Publish Answer</Button>
                        </CardFooter>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}


function ForumClientContent({ allQuestions }: { allQuestions: ForumPost[] }) {
    const searchParams = useSearchParams();
    const isAdmin = searchParams.get('admin') === 'true';

    return (
        <>
            <QuestionForm />
            {isAdmin && <AdminPanel unansweredQuestions={allQuestions.filter(p => !p.isAnswered)} />}
        </>
    )
}

export default function ForumClient({ allQuestions }: { allQuestions: ForumPost[] }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ForumClientContent allQuestions={allQuestions} />
        </Suspense>
    )
}
