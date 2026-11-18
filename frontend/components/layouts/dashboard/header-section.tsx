'use client';

import { cn } from '@/lib/utils';

type HeaderSectionProps = {
  leftArea?: React.ReactNode;
  rightArea?: React.ReactNode;
  className?: string;
};

export function HeaderSection({
  leftArea,
  rightArea,
  className,
}: HeaderSectionProps) {
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full bg-background/50 backdrop-blur px-5 py-2",
      className
    )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {leftArea}
          </div>
          <div className="flex text-gray-500 items-center">
            {rightArea}
          </div>
        </div>
    </header>
  );
} 