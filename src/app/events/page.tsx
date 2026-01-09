
'use client';
import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { placeholderImages } from "@/lib/data";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { Event } from "@/lib/schemas";
import { Calendar, Video, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsPage() {
    const eventsImage = placeholderImages.find(p => p.id === 'event');
    const firestore = useFirestore();
    const eventsQuery = useMemoFirebase(() => query(collection(firestore, 'events'), orderBy('order', 'asc')), [firestore]);
    const { data: events, isLoading } = useCollection<Event>(eventsQuery);

    return (
        <div>
            <PageHeader
                title="Community Events"
                subtitle="Join our online and onsite events to learn, grow, and connect with sisters from around the globe."
                image={eventsImage}
            />
            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoading && [...Array(3)].map((_, i) => (
                            <Card key={i}>
                                <Skeleton className="h-56 w-full" />
                                <CardHeader>
                                    <Skeleton className="h-6 w-24 mb-2" />
                                    <Skeleton className="h-7 w-4/5" />
                                    <Skeleton className="h-5 w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full mt-2" />
                                </CardContent>
                                <CardFooter>
                                    <Skeleton className="h-10 w-32" />
                                </CardFooter>
                            </Card>
                        ))}
                        {events?.map((event) => {
                            let registrationHref = "#";
                            if (event.registrationUrl) {
                                if (event.registrationUrl.startsWith("https://wa.me/")) {
                                    const message = `As-salamu alaykum! I would like to register for the event: "${event.title}". My name is:`;
                                    const url = new URL(event.registrationUrl);
                                    url.searchParams.set('text', message);
                                    registrationHref = url.toString();
                                } else {
                                    registrationHref = event.registrationUrl;
                                }
                            }

                            return (
                                <Card key={event.id} className="flex flex-col overflow-hidden group hover:shadow-xl transition-shadow">
                                    <div className="relative h-56 w-full">
                                        <Image
                                            src={event.imageUrl || `https://picsum.photos/seed/${event.id}/600/400`}
                                            alt={event.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            data-ai-hint="people seminar"
                                        />
                                    </div>
                                    <CardHeader>
                                        <Badge variant={event.type === 'Online' ? 'default' : 'secondary'} className="w-fit gap-1 mb-2">
                                            {event.type === 'Online' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                                            {event.type}
                                        </Badge>
                                        <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
                                        <div className="flex items-center text-muted-foreground text-sm gap-2 pt-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{event.schedule}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <CardDescription>{event.description}</CardDescription>
                                    </CardContent>
                                    <CardFooter>
                                        {event.registrationUrl && (
                                            <Button asChild>
                                                <a href={registrationHref} target="_blank" rel="noopener noreferrer">
                                                    Register Now!
                                                </a>
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
