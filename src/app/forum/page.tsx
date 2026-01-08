
'use client';
import { PageHeader } from "@/components/shared/page-header";
import { placeholderImages } from "@/lib/data";
import ForumClient from "@/components/forum/forum-client";

export default function ForumPage() {
    const forumImage = placeholderImages.find(p => p.id === 'forum-bg');

    return (
        <div>
            <PageHeader
                title="Open Forum Q&A"
                subtitle="Ask questions, share knowledge, and learn from the community. Anyone can ask and anyone can answer."
                image={forumImage}
            />
            <section className="py-16 md:py-24">
                <div className="container max-w-4xl space-y-12">
                   <ForumClient />
                </div>
            </section>
        </div>
    );
}
