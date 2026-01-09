
'use client';

import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/shared/logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Users,
  MessageSquareQuote,
  LayoutGrid,
  LogOut,
  ChevronLeft,
  MessageSquare,
  Database,
  Loader2,
} from 'lucide-react';
import { useAuth, useFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { firebaseConfig } from '@/firebase/config';
import AuthPanel from '@/components/admin/auth-panel';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/forum', label: 'Forum', icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const { user, isUserLoading } = useFirebase();
  const pathname = usePathname();
  const firestoreUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/data`;

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthPanel />;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <div className="h-[20%]" />
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="!h-12 !w-12" />
            <h1 className="font-headline text-2xl">Admin</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    icon={item.icon}
                    tooltip={item.label}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
                <a href={firestoreUrl} target="_blank" rel="noopener noreferrer">
                    <SidebarMenuButton icon={Database}>Firestore</SidebarMenuButton>
                </a>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <Link href="/">
                    <SidebarMenuButton icon={ChevronLeft}>Back to Site</SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton icon={LogOut} onClick={() => auth.signOut()}>
                Sign Out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-8">
            <div className='flex justify-end md:hidden mb-4'>
                <SidebarTrigger />
            </div>
            {children}
        </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
