import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { events, placeholderImages } from "@/lib/data";
import { Calendar, Video, MapPin } from "lucide-react";

export default function EventsPage() {
    const eventsImage = placeholderImages.find(p => p.id === 'event');

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
                        {events.map((event) => (
                            <Card key={event.id} className="flex flex-col overflow-hidden group hover:shadow-xl transition-shadow">
                                <div className="relative h-56 w-full">
                                    <Image
                                        src={event.image}
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
                                        <span>{event.date}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <CardDescription>{event.description}</CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <Button>Register Now</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
