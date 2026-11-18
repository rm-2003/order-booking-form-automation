'use client';

import { cn } from '@/lib/utils';

type MainSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function MainSection({
  children,
  className,
}: MainSectionProps) {
  return (
    <main className={cn(
      "flex-1 space-y-4 p-8 pt-6",
      className
    )}>
      {children}
    </main>
  );
} 