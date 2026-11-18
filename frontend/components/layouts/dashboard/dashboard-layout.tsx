'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navConfig } from './nav-config';
import { Nav } from './nav';
import { Header } from '@/components/layouts/dashboard/header';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [openNav, setOpenNav] = useState(false);
  const pathname = usePathname();

  const handleCloseNav = () => {
    setOpenNav(false);
  };

  return (
    <div className="flex h-screen max-h-screen overflow-y-auto">
      <Nav
        openNav={openNav}
        onCloseNav={handleCloseNav}
        navConfig={navConfig}
        pathname={pathname}
        className=""
      />
      <div className="overflow-y-scroll">
        <Header onOpenNav={() => setOpenNav(true)} />
        <main className="overflow-y-scroll scrollbar-custom bg-grey-100">
          <div className="container mx-auto p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 