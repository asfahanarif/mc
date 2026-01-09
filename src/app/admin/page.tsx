
'use client';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid, Calendar, Users, MessageSquareQuote, MessageSquare, Mail } from 'lucide-react';
import Link from 'next/link';

function AdminDashboard() {
  const sections = [
    { title: 'Events', href: '/admin/events', icon: Calendar },
    { title: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    { title: 'Team Members', href: '/admin/team', icon: Users },
    { title: 'Forum Q&A', href: '/admin/forum', icon: MessageSquare },
    { title: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome! Here you can manage the content for your website.
      </p>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map(section => (
          <Link href={section.href} key={section.href}>
            <Card className="hover:shadow-lg hover:border-primary transition-all">
              <CardHeader className="flex-row items-center gap-4">
                <section.icon className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>{section.title}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AdminPageRouter() {
  return (
      <AdminDashboard />
  )
}
