
'use client';

import { usePathname } from 'next/navigation';
import Footer from './footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const isQuranPage = pathname === '/quran';

  if (isAdminPage || isQuranPage) {
    return null;
  }

  return <Footer />;
}
