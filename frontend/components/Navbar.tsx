"use client";

import { House, FileText, Database, SignOut } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Call backend logout endpoint
        await fetch('http://localhost:4000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // Clear local storage and state
      logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };
  
  return (
    <nav className="bg-card border-b border-border h-16 flex items-center px-5">
      <div className="flex-shrink-0 flex items-center">
        <span className="text-xl font-bold text-primary">OBF Automation</span>
      </div>
      <div className="sm:ml-6 sm:flex sm:space-x-8 flex-grow">
        <a 
          href="/" 
          className={cn(
            "nav-link flex items-center gap-1",
            pathname === "/" && "active"
          )}
        >
          <House size={18} weight="bold" />
          Dashboard
        </a>
        <a 
          href="/obf" 
          className={cn(
            "nav-link flex items-center gap-1",
            pathname === "/obf" || pathname.startsWith("/obf/") && "active"
          )}
        >
          <FileText size={18} weight="bold" />
          OBF
        </a>
        <a 
          href="/masters" 
          className={cn(
            "nav-link flex items-center gap-1",
            pathname === "/masters" && "active"
          )}
        >
          <Database size={18} weight="bold" />
          Masters
        </a>
      </div>
      <div className="ml-auto">
        <button
          onClick={handleLogout}
          className="nav-link flex items-center gap-1 text-red-500 hover:text-red-600"
        >
          <SignOut size={18} weight="bold" />
          Logout
        </button>
      </div>
    </nav>
  );
} 