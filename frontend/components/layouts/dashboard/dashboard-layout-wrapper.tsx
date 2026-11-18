'use client';

import { DashboardLayout } from './dashboard-layout';

export function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 