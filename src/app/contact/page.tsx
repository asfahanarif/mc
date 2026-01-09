
import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { SocialCards } from "@/components/contact/social-cards";
import { placeholderImages } from "@/lib/data";

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
          <div className="max-w-xl mx-auto">
            <ContactForm />
          </div>
          <div className="max-w-4xl mx-auto">
            <SocialCards />
          </div>
        </div>
      </section>
    </div>
  );
}
