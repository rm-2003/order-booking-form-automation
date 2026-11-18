'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { userService } from '../services/api';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

const ROLES = [
  'Salesperson',
  'BSH',
  'Pricing',
  'BUSH',
  'Business Finance',
  'BUH',
  'CFO',
  'MD & CEO',
];

interface UserDetails {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [originalRole, setOriginalRole] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUserDetails(data.user);
        setRole(data.user.role);
        setOriginalRole(data.user.role);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchUserDetails();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleSave = async () => {
    if (!userDetails || role === originalRole) return;
    setSaving(true);
    try {
      await userService.update(userDetails.id, { role });
      setOriginalRole(role);
      setUserDetails({ ...userDetails, role });
      toast.success('Role updated successfully');
    } catch (error) {
      toast.error('Failed to update role');
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center">
          <Image src="/Loading/newpreeload.gif" unoptimized alt="Loading..." width={150} height={150} priority />
          <div className="mt-4 text-lg text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">User not found</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="mx-auto shadow-md max-w-md w-full p-6 flex flex-col items-center">
        <Avatar className="h-20 w-20 mb-4">
          {/* Uncomment if you have a picture: <AvatarImage src={userDetails.picture} alt={userDetails.name} /> */}
          <AvatarFallback className="text-2xl">{userDetails.name[0]}</AvatarFallback>
        </Avatar>
        <div className="text-xl font-semibold mb-1">{userDetails.name}</div>
        <div className="text-muted-foreground text-sm mb-6">{userDetails.email}</div>
        <div className="w-full mb-4">
          <Label className="mb-1 block">Role</Label>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="w-full px-4 py-2 border rounded bg-white text-left flex justify-between items-center hover:bg-gray-50"
                type="button"
              >
                {role || <span className="text-gray-400">Select role</span>}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
              <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
                {ROLES.map((r) => (
                  <DropdownMenuRadioItem key={r} value={r}>{r}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {role !== originalRole && (
          <button
            className="w-full px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 mb-2"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        )}
        <button
          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 mt-auto"
          onClick={() => window.history.back()}
        >
          Back
        </button>
      </Card>
    </div>
  );
} 