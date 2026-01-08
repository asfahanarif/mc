import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { teamMembers, placeholderImages } from "@/lib/data";

export default function AboutPage() {
  const aboutImage = placeholderImages.find(p => p.id === 'about-team');

  return (
    <div>
      <PageHeader
        title="About Us"
        subtitle="Meet the dedicated team behind MuslimahSphere, committed to empowering our community."
        image={aboutImage}
      />
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={100}
                    height={100}
                    className="rounded-full mx-auto mb-4 border-4 border-primary/20"
                    data-ai-hint="person portrait"
                  />
                </CardContent>
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary">{member.name}</CardTitle>
                  <p className="text-muted-foreground">{member.role}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
