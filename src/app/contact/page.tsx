
import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { SocialCards } from "@/components/contact/social-cards";
import { placeholderImages } from "@/lib/data";
import { NewsletterForm } from "@/components/home/newsletter-form";

export default function ContactPage() {
  const contactImage = placeholderImages.find(p => p.id === 'contact-us');

  return (
    <div>
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out with any questions, suggestions, or just to say salam!"
        image={contactImage}
      />
      <section className="py-16 md:py-24">
        <div className="container space-y-16">
          <div className="max-w-4xl mx-auto">
            <SocialCards />
          </div>
          <div className="max-w-xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>
      <section className="w-full py-16 md:py-24 bg-primary/10">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-headline font-bold tracking-tighter md:text-4xl/tight text-primary">
              Subscribe to Our Newsletter
            </h2>
            <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Stay updated with our latest news, events, and articles.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
