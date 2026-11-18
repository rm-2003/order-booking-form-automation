'use client';

import { Menu } from 'lucide-react';

interface HeaderProps {
  onOpenNav: () => void;
}

export function Header({ onOpenNav }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white">
      <div className="flex h-full items-center justify-between px-4">
        <button
          className="rounded-full p-1 hover:bg-grey-100 lg:hidden"
          onClick={onOpenNav}
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-4">
          {/* Add your header actions here (e.g., user menu, notifications) */}
        </div>
      </div>
    </header>
  );
}