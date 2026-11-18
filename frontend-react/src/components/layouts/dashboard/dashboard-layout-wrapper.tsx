import { ReactNode } from 'react';
import { DashboardLayout } from './layout';

interface DashboardLayoutWrapperProps {
  children: ReactNode;
}

export function DashboardLayoutWrapper({ children }: DashboardLayoutWrapperProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 