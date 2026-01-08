import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/data";
import { Heart } from "lucide-react";

export default function DonatePage() {
    const donateImage = placeholderImages.find(p => p.id === 'donate-hero');

    return (
        <div>
            <PageHeader
                title="Support Our Mission"
                subtitle="Your contribution helps us continue to provide valuable resources and a supportive community for Muslim women worldwide."
                image={donateImage}
            />
            <section className="py-16 md:py-24">
                <div className="container max-w-2xl">
                    <Card className="text-center shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-3xl text-primary">Donate to Muslimahs Club</CardTitle>
                            <CardDescription className="text-lg">Sadaqah Jariyah (Continuous Charity)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-lg text-foreground/80">
                            <p>
                                The Messenger of Allah (ﷺ) said, "When a man dies, his deeds come to an end except for three things: Sadaqah Jariyah (ceaseless charity); a knowledge which is beneficial, or a virtuous descendant who prays for him (for the deceased)." [Muslim]
                            </p>
                            <p>
                                By donating, you are helping us build a legacy of knowledge and sisterhood. Your support is invaluable.
                            </p>
                            <Button asChild size="lg" className="mt-4 group transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105">
                                <a href="https://www.paypal.com" target="_blank" rel="noopener noreferrer">
                                    <Heart className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-125 group-hover:fill-red-500 text-red-500" /> Donate Now via PayPal
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
