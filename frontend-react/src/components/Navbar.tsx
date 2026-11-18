import { House, FileText, Database, SignOut } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { API_URL } from "../config/api";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Call backend logout endpoint
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // Clear local storage and state
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
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
          className={`nav-link flex items-center gap-1 ${
            location.pathname === "/" ? "active" : ""
          }`}
        >
          <House size={18} weight="bold" />
          Dashboard
        </a>
        <a 
          href="/obf" 
          className={`nav-link flex items-center gap-1 ${
            location.pathname === "/obf" || location.pathname.startsWith("/obf/") ? "active" : ""
          }`}
        >
          <FileText size={18} weight="bold" />
          OBF
        </a>
        <a 
          href="/masters" 
          className={`nav-link flex items-center gap-1 ${
            location.pathname === "/masters" ? "active" : ""
          }`}
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