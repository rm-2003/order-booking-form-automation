import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Sheet, SheetContent } from '../../ui/sheet';
import { useEffect } from 'react';

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

interface NavProps {
  openNav: boolean;
  onCloseNav: () => void;
  navConfig: NavItem[];
  pathname: string;
  className?: string;
}

export function Nav({ openNav, onCloseNav, navConfig, pathname, className }: NavProps) {
  return (
    <div className="bg-white h-screen w-screen relative">
      <NavMobile openNav={openNav} onCloseNav={onCloseNav} navConfig={navConfig} pathname={pathname} />
      <NavDesktop navConfig={navConfig} pathname={pathname} className={className} />
    </div>
  );
}

export function NavMobile({ openNav, onCloseNav, navConfig, pathname }: Omit<NavProps, 'className'>) {
  useEffect(() => {
    if (openNav) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openNav]);

  const navigate = useNavigate();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 h-screen w-screen z-40 bg-black/50 transition-opacity lg:hidden',
          openNav ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onCloseNav}
      />

      {/* Side nav */}
      <nav
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 h-screen transform bg-white transition-transform duration-300 lg:hidden',
          openNav ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex pt-10 pb-5 items-center justify-between px-5 bg-white">
          <div className="flex items-center">
            <img src="/Logo/Mahinda_Logistics.png" alt="OBF Logo" width={32} height={32} />
          </div>
          {/* <button
            className="rounded-full p-1 hover:bg-grey-100"
            onClick={onCloseNav}
          >
            <X className="h-6 w-6" />
          </button> */}
        </div>

        <div className="px-5 py-4 bg-white h-[calc(100vh-4rem)] overflow-y-auto">
          {navConfig.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-3 rounded-md px-4 text-sm py-3 font-medium transition-colors',
                pathname === item.path
                  ? 'bg-[#D5233B] text-white font-semibold'
                  : 'text-gray-500 hover:bg-grey-100'
              )}
            >
              {item.icon}
              {item.title}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

export function NavDesktop({ navConfig, pathname, className }: Omit<NavProps, 'openNav' | 'onCloseNav'>) {
  const navigate = useNavigate();

  return (
    <nav className={cn('w-80 border-r bg-white', className)}>
      <div className="flex pt-10 pb-5 items-center px-5 bg-white">
        <img src="/Logo/Mahinda_Logistics.png" alt="OBF Logo" width={150} height={150} className='w-full h-fit object-contain' />
      </div>

      <div className="px-5 py-4">
        {navConfig.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={cn(
              'flex items-center gap-3 rounded-md px-4 text-sm py-3 font-medium transition-colors',
              pathname === item.path
                ? 'bg-[#D5233B] text-white font-semibold'
                : 'text-gray-500 hover:bg-grey-100'
            )}
          >
            {item.icon}
            {item.title}
          </a>
        ))}
      </div>
    </nav>
  );
} 