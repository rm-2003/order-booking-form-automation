import { useState } from 'react';
import { useLocation } from 'react-router-dom';
// import { Menu } from 'lucide-react';
import { NavMobile, NavDesktop } from './nav';
import { MainSection } from './main-section';
import { HeaderSection } from './header-section';
import Searchbar from '../../searchbar';
import { AccountPopover } from '../../account-popover';
import { NotificationsPopover } from '../../notifications-popover';
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
  const location = useLocation();

  const renderHeader = () => {
    return (
      <HeaderSection
        leftArea={
          <>
            <button
              onClick={() => setOpen(true)}
              className="mr-1 ml-[-0.25rem] lg:hidden"
            >
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
              pathname={location.pathname}
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
    <div className="min-h-screen bg-background flex w-screen">
        <NavDesktop 
          className="hidden lg:block" 
          navConfig={navConfig}
          pathname={location.pathname}
        />
      <div className="w-screen h-full">
        {renderHeader()}
        <MainSection>{children}</MainSection>
      </div>
    </div>
  );
} 