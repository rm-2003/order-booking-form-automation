import { House, FileText, Database, Users, User } from "@phosphor-icons/react";

export const navConfig = [
  {
    title: "Dashboard",
    path: "/",
    icon: <House size={22} weight="duotone" className="" />,
  },
  {
    title: "Order Booking Forms",
    path: "/obf",
    icon: <FileText size={22} weight="duotone" className="" />,
  },
  {
    title: "Masters",
    path: "/masters",
    icon: <Database size={22} weight="duotone" className="" />,
  },
  {
    title: "Users",
    path: "/users",
    icon: <Users size={22} weight="duotone" className="" />,
  },
  // {
  //   title: "Profile",
  //   path: "/profile",
  //   icon: <User className="h-4 w-4" />,
  // },
]; 