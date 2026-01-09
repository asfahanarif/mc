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
} from 'lucide-react';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';

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
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <div className="h-[30%]" />
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
