'use client';

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { Input } from "../components/ui/input";

// Define your global routes here
const ROUTES = [
  { label: "Dashboard", path: "/" },
  { label: "Order Booking Forms", path: "/obf" },
  { label: "Users", path: "/users" },
  { label: "Masters", path: "/masters" },
  { label: "Profile", path: "/profile" },
  // Add more routes as needed
];

export default function Searchbar() {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filteredRoutes = ROUTES.filter(route =>
    route.label.toLowerCase().includes(query.toLowerCase()) ||
    route.path.toLowerCase().includes(query.toLowerCase())
  );

  // Focus input when expanded
  const handleIconClick = () => {
    setExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSelect = (path: string) => {
    setExpanded(false);
    setQuery("");
    setShowDropdown(false);
    navigate(path);
  };

  return (
    <div className="relative max-w-md flex items-center">
      <button
        type="button"
        className={cn("absolute right-2 z-10 transition-all ease-in-out duration-300", expanded && " right-0 left-2 top-2.5")}
        onClick={handleIconClick}
        tabIndex={0}
        aria-label="Expand search"
      >
        <Search className="h-5 w-5 text-gray-500 flex" />
      </button>
      {expanded && (
        <>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search pages..."
            className="pl-8 pr-2 py-2 rounded-md bg-white border border-[#D5233B] w-48"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            onFocus={() => {
              setExpanded(true);
              if (query.length > 0) setShowDropdown(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowDropdown(false), 100);
              setTimeout(() => setExpanded(false), 120);
            }}
          />
          {showDropdown && (
            <div className="absolute left-0 mt-2 max-w-md top-10 w-64 bg-white border border-gray-200 rounded shadow-lg z-20">
              {filteredRoutes.length === 0 ? (
                <div className="p-2 text-gray-500 text-sm">No results</div>
              ) : (
                filteredRoutes.map(route => (
                  <button
                    key={route.path}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex justify-between"
                    onMouseDown={() => handleSelect(route.path)}
                  >
                    <span>{route.label}</span>
                    <span className="text-xs text-gray-400 ml-2">{route.path}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
} 