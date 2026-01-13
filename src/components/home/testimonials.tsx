
'use client';
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { Testimonial } from "@/lib/schemas";
import { Skeleton } from "../ui/skeleton";

export function TestimonialsCarousel() {
  const firestore = useFirestore();
  const testimonialsQuery = useMemoFirebase(() => query(collection(firestore, 'testimonials'), orderBy('order', 'asc')), [firestore]);
  const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsQuery);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="w-full max-w-4xl mx-auto"
    >
      <CarouselContent>
        {isLoading && [...Array(3)].map((_, i) => (
          <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
             <div className="p-1 h-full">
              <Card className="flex flex-col h-full shadow-lg">
                <CardContent className="flex flex-col items-center text-center p-6 flex-grow">
                  <Skeleton className="h-4 w-full mb-2" />
                   <Skeleton className="h-4 w-5/6 mb-4" />
                  <div className="flex items-center mt-auto">
                    <Skeleton className="h-10 w-10 rounded-full mr-4" />
                    <div className="text-left">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
        {testimonials?.map((testimonial) => (
          <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1 h-full">
              <Card className="flex flex-col h-full shadow-lg">
                <CardContent className="flex flex-col items-center text-center p-6 flex-grow">
                  <p className="italic text-foreground/80 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center mt-auto">
                    <Image
                        src={testimonial.imageUrl || 'https://i.pinimg.com/736x/51/bd/ec/51bdec9c6b1b42e993d540ec4c418bc7.jpg'}
                        alt={testimonial.authorName}
                        width={40}
                        height={40}
                        className="rounded-full mr-4"
                        data-ai-hint="person portrait"
                    />
                    <div>
                        <p className="font-semibold text-primary">{testimonial.authorName}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.authorTitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
