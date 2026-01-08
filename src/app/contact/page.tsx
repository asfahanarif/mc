import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/components/contact/contact-form";
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
        <div className="container max-w-xl">
            <ContactForm />
        </div>
      </section>
    </div>
  );
}
