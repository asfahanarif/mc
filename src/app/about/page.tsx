'use client';
import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/data";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { TeamMember } from "@/lib/schemas";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutPage() {
  const aboutImage = placeholderImages.find(p => p.id === 'about-team');
  const firestore = useFirestore();
  const teamQuery = useMemoFirebase(() => collection(firestore, 'team_members'), [firestore]);
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
                  <Skeleton className="h-[100px] w-[100px] rounded-full mx-auto mb-4" />
                </CardContent>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardHeader>
              </Card>
            ))}
            {teamMembers?.map((member) => (
              <Card key={member.id} className="text-center hover:shadow-xl transition-shadow flex flex-col">
                <CardHeader>
                  <div className="relative h-24 w-24 mx-auto">
                    <Image
                      src={member.imageUrl || `https://picsum.photos/seed/${member.id}/100/100`}
                      alt={member.name}
                      width={100}
                      height={100}
                      className="rounded-full mx-auto border-4 border-primary/20"
                      data-ai-hint="person portrait"
                    />
                  </div>
                  <CardTitle className="font-headline text-xl text-primary pt-2">{member.name}</CardTitle>
                  <p className="text-muted-foreground">{member.title}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-foreground/80">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
