'use client';

import { usePathname } from 'next/navigation';
import { DashboardLayout } from './dashboard/layout';

export function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  // Check if children contain the not-found marker
  const isNotFoundPage =
    Array.isArray(children)
      ? children.some(
          (child: any) => child?.props?.['data-not-found'] !== undefined
        )
      : (children as any)?.props?.['data-not-found'] !== undefined;

  if (isLoginPage || isNotFoundPage) {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
} 