import { ChartBar, FileText, Users, Gear, Table } from '@phosphor-icons/react'

export type NavConfig = {
  title: string;
  path: string;
  icon: React.ReactNode;
}[];

export const navConfig: NavConfig = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <ChartBar weight="duotone" className="h-5 w-5" />,
  },
  {
    title: 'OBF',
    path: '/obf',
    icon: <FileText weight="duotone" className="h-5 w-5" />,
  },
  {
    title: 'Masters',
    path: '/masters',
    icon: <Table weight="duotone" className="h-5 w-5" />,
  },
  {
    title: 'Users',
    path: '/users',
    icon: <Users weight="duotone" className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <Gear weight="duotone" className="h-5 w-5" />,
  },
]; 