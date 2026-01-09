
'use client';
import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/data";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { TeamMember } from "@/lib/schemas";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutPage() {
  const aboutImage = placeholderImages.find(p => p.id === 'about-team');
  const firestore = useFirestore();
  const teamQuery = useMemoFirebase(() => query(collection(firestore, 'team_members'), orderBy('order', 'asc')), [firestore]);
  const { data: teamMembers, isLoading } = useCollection<TeamMember>(teamQuery);

  return (
    <div>
      <PageHeader
        title="About Us"
        subtitle="Meet the dedicated team behind Muslimahs Club, committed to empowering our community."
        image={aboutImage}
      />
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading && [...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-[128px] w-[128px] rounded-full mx-auto mb-4" />
                </CardContent>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardHeader>
              </Card>
            ))}
            {teamMembers?.map((member) => (
              <Card key={member.id} className="text-center group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col">
                <CardContent className="pt-8">
                  <div className="relative h-32 w-32 mx-auto">
                    <Image
                      src={member.imageUrl || `https://i.pinimg.com/736x/51/bd/ec/51bdec9c6b1b42e993d540ec4c418bc7.jpg`}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="rounded-full mx-auto border-4 border-background outline outline-4 outline-primary/10 group-hover:outline-primary/20 transition-all"
                      data-ai-hint="person portrait"
                    />
                  </div>
                </CardContent>
                <CardHeader className="pt-2">
                  <CardTitle className="font-headline text-2xl text-primary">{member.name}</CardTitle>
                  <p className="font-semibold text-muted-foreground">{member.title}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-foreground/70">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
