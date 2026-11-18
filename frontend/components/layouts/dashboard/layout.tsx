'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { NavMobile, NavDesktop } from '@/components/layouts/dashboard/nav';
import { MainSection } from './main-section';
import { HeaderSection } from './header-section';
import Searchbar from '@/components/searchbar';
import { AccountPopover } from '@/components/account-popover';
import { NotificationsPopover } from '@/components/notifications-popover';
import { navConfig } from './nav-config';

type DashboardLayoutProps = {
  children: React.ReactNode;
  layoutQuery?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

export function DashboardLayout({
  children,
  layoutQuery = 'lg',
}: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const pathname = usePathname();

  const renderHeader = () => {
    return (
      <HeaderSection
        leftArea={
          <>
            <button
              onClick={() => setOpen(true)}
              className="mr-1 ml-[-0.25rem] lg:hidden"
            >
              {/* <Menu className="h-6 w-6" /> */}
              <div className='flex flex-col justify-between items-center gap-1'>
                <div className='w-4 h-[3px] bg-gray-300 rounded-full' />
                <div className='w-4 h-[3px] bg-gray-500 rounded-full ml-2' />
                <div className='w-4 h-[3px] bg-gray-700 rounded-full' />
              </div>
            </button>
            <NavMobile 
              openNav={open} 
              onCloseNav={() => setOpen(false)} 
              navConfig={navConfig}
              pathname={pathname}
            />
          </>
        }
        rightArea={
          <div className="flex items-center gap-3">
            <Searchbar />
            <NotificationsPopover />
            <AccountPopover />
          </div>
        }
      />
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
        <NavDesktop 
          className="hidden lg:block" 
          navConfig={navConfig}
          pathname={pathname}
        />
      <div className="w-full">
        {renderHeader()}
        <MainSection>{children}</MainSection>
      </div>
    </div>
  );
} 